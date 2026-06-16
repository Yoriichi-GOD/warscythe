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

    // 1. Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // 2. Validate token and get user info
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: authError?.message || 'Unauthorized user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Parse input arguments (item_id, item_type)
    const { item_id, item_type } = await req.json()
    if (!item_id || !item_type) {
      return new Response(JSON.stringify({ error: 'Missing item_id or item_type parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Determine prices in paise (1 INR = 100 paise)
    let amount = 0 // in paise
    if (item_type === 'scythe') {
      amount = 5000 // ₹50
    } else if (item_type === 'theme') {
      amount = 20000 // ₹200
    } else {
      return new Response(JSON.stringify({ error: 'Invalid item type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. Fetch Razorpay keys
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Configuration Error: Razorpay credentials missing.')
      return new Response(JSON.stringify({ error: 'Server payment credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 5. Create Order via Razorpay API
    const orderBody = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_cosmetic_${Date.now()}`,
      notes: {
        user_id: user.id,
        item_id: item_id,
        item_type: item_type
      }
    }

    const authString = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(orderBody)
    })

    const orderData = await response.json()
    if (!response.ok) {
      console.error('Razorpay Order Error:', orderData)
      return new Response(JSON.stringify({ error: orderData.error?.description || 'Failed to create order at Razorpay' }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ order_id: orderData.id, amount: orderData.amount }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err: any) {
    console.error('Exception in create-order edge function:', err)
    return new Response(JSON.stringify({ error: err.message || 'An unexpected error occurred' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
