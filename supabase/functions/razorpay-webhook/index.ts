import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
}

// HMAC-SHA256 Verification using standard Web Crypto API
async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const bodyData = encoder.encode(body)
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, bodyData)
  
  // Convert signature to Hex string
  const hashArray = Array.from(new Uint8Array(signatureBuffer))
  const calculatedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return calculatedSignature === signature
}

serve(async (req) => {
  // Handle CORS Preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')

    // 1. Verify webhook signature if secret is configured
    if (webhookSecret) {
      if (!signature) {
        console.error('Signature verification failed: Missing x-razorpay-signature header')
        return new Response(JSON.stringify({ error: 'Missing signature header' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      const isValid = await verifySignature(rawBody, signature, webhookSecret)
      if (!isValid) {
        console.error('Signature verification failed: Calculated signature does not match header')
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    } else {
      console.warn('Webhook signature check skipped because RAZORPAY_WEBHOOK_SECRET is not set.')
    }

    // 2. Parse event payload
    const eventData = JSON.parse(rawBody)
    const eventType = eventData.event
    console.log(`Processing Razorpay Webhook Event: ${eventType}`)

    // 3. Extract user ID and determine entitlement state
    let userId: string | null = null
    let isAdFree = false
    let shouldUpdate = false

    const subscription = eventData.payload?.subscription?.entity
    const payment = eventData.payload?.payment?.entity

    // Try to find the user_id from subscription notes or payment notes
    userId = subscription?.notes?.user_id || payment?.notes?.user_id || null
    const itemId = subscription?.notes?.item_id || payment?.notes?.item_id || null
    const itemType = subscription?.notes?.item_type || payment?.notes?.item_type || null

    if (eventType === 'subscription.charged' || eventType === 'subscription.activated') {
      isAdFree = true
      shouldUpdate = true
    } else if (eventType === 'subscription.cancelled' || eventType === 'subscription.halted') {
      isAdFree = false
      shouldUpdate = true
    } else if (eventType === 'payment.captured') {
      if (itemId && itemType) {
        // This is a shop/cosmetic order purchase!
        shouldUpdate = false
      } else {
        // Fallback for ad-free raw payments
        isAdFree = true
        shouldUpdate = true
      }
    }

    if (userId && (shouldUpdate || (eventType === 'payment.captured' && itemId && itemType))) {
      // 4. Initialize Supabase Client with service role to bypass RLS
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
      const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      
      if (!supabaseServiceRole) {
        console.error('Configuration Error: SUPABASE_SERVICE_ROLE_KEY is missing.')
        return new Response(JSON.stringify({ error: 'Service role key not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole)

      if (eventType === 'payment.captured' && itemId && itemType) {
        // 5A. Insert into user_unlocks
        const { error: unlockError } = await supabaseAdmin
          .from('user_unlocks')
          .upsert({
            user_id: userId,
            item_id: itemId,
            item_type: itemType,
            purchased_at: new Date().toISOString()
          }, { onConflict: 'user_id,item_id' })

        if (unlockError) {
          console.error(`Database Error inserting unlock for user ${userId}:`, unlockError.message)
          return new Response(JSON.stringify({ error: 'Database update failed' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        console.log(`Success: Unlocked ${itemType} '${itemId}' for user ${userId}`)
      } else if (shouldUpdate) {
        // 5B. Update user entitlements in database
        const { error: upsertError } = await supabaseAdmin
          .from('user_entitlements')
          .upsert({
            user_id: userId,
            is_ad_free: isAdFree,
            updated_at: new Date().toISOString()
          })

        if (upsertError) {
          console.error(`Database Error updating entitlement for user ${userId}:`, upsertError.message)
          return new Response(JSON.stringify({ error: 'Database update failed' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        console.log(`Success: Entitlement set is_ad_free = ${isAdFree} for user ${userId}`)
      }
    } else if (!userId && (shouldUpdate || (eventType === 'payment.captured' && itemId && itemType))) {
      console.warn(`User ID not found in Razorpay payload for event ${eventType}`)
    } else {
      console.log(`Event ${eventType} received but no action required`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    console.error('Exception in razorpay-webhook edge function:', err)
    return new Response(JSON.stringify({ error: err.message || 'Server error processing webhook' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
