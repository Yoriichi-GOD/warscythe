import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS Preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 1. Initialize Supabase client with the user's JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // 2. Validate token and get authenticated user info
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: authError?.message || 'Unauthorized user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Fetch Razorpay keys from server environment
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Configuration Error: Razorpay environment secrets are not configured.')
      return new Response(JSON.stringify({ error: 'Server payment credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. Send request to Razorpay to generate a Subscription ID
    const planId = Deno.env.get('RAZORPAY_PLAN_ID') ?? 'plan_T2IFi1FXInud5L'
    const subscriptionBody = {
      plan_id: planId,
      total_count: 120, // 120 cycles (10 years) to represent a long-term active subscription
      quantity: 1,
      customer_notify: 1, // Razorpay notifies customer via email/SMS
      notes: {
        user_id: user.id
      }
    }

    // Basic Auth string encoding
    const authString = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
    const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(subscriptionBody)
    })

    const subscriptionData = await response.json()
    if (!response.ok) {
      console.error('Razorpay API Error:', subscriptionData)
      return new Response(JSON.stringify({ error: subscriptionData.error?.description || 'Failed to create subscription at Razorpay' }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ subscription_id: subscriptionData.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err: any) {
    console.error('Exception inside create-subscription edge function:', err)
    return new Response(JSON.stringify({ error: err.message || 'An unexpected error occurred' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
