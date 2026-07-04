-- Create user_entitlements table to store premium / ad-free status
CREATE TABLE IF NOT EXISTS public.user_entitlements (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_ad_free BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own entitlement
DROP POLICY IF EXISTS "Users can view own entitlement" ON public.user_entitlements;
CREATE POLICY "Users can view own entitlement" ON public.user_entitlements
    FOR SELECT USING (auth.uid() = user_id);

-- NOTE: The service_role key (used by Edge Functions) BYPASSES RLS entirely,
-- so no write policy is needed for it. Previously a policy `USING (true) WITH
-- CHECK (true)` existed here with no role restriction, which meant it applied to
-- EVERY role (anon + authenticated). That let any signed-in user write their own
-- entitlement and grant themselves free ad-free/premium via the public anon key.
-- We drop it. Writes now happen ONLY through the razorpay-webhook (service_role).
DROP POLICY IF EXISTS "Service role can manage entitlements" ON public.user_entitlements;
-- (intentionally no INSERT/UPDATE/DELETE policy for anon/authenticated => deny)

-- Create user_unlocks table to store purchased cosmetics (Scythes / Themes)
CREATE TABLE IF NOT EXISTS public.user_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('scythe', 'theme')),
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, item_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_unlocks ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own unlocks
DROP POLICY IF EXISTS "Users can view own unlocks" ON public.user_unlocks;
CREATE POLICY "Users can view own unlocks" ON public.user_unlocks
    FOR SELECT USING (auth.uid() = user_id);

-- Same fix as entitlements: the previous world-open write policy let any signed-in
-- user insert rows into user_unlocks and unlock every paid cosmetic for free.
-- service_role (the webhook) bypasses RLS, so unlocks are still written on real
-- purchases. Regular users get read-only access to their own unlocks.
DROP POLICY IF EXISTS "Service role can manage unlocks" ON public.user_unlocks;
-- (intentionally no INSERT/UPDATE/DELETE policy for anon/authenticated => deny)

-- ═══════════════ SUPABASE STORAGE SETUP ═══════════════
-- 1. Create a public bucket for cosmetic and offline assets (maps, crests, dragons, fairies)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cosmetics', 'cosmetics', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public SELECT (read) access to the cosmetics bucket
DROP POLICY IF EXISTS "Allow Public Access" ON storage.objects;
CREATE POLICY "Allow Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'cosmetics');

-- 3. Uploads are NOT allowed from the app. Previously any authenticated user could
-- upload arbitrary files (any type/size) into this PUBLIC bucket via the anon key —
-- an abuse/hosting/cost vector. The app only READS cosmetics; assets are uploaded by
-- the developer through the Supabase dashboard or a service_role script (both bypass
-- RLS), so no authenticated INSERT policy is required.
DROP POLICY IF EXISTS "Allow Authenticated Uploads" ON storage.objects;
-- (intentionally no INSERT/UPDATE/DELETE policy on the cosmetics bucket => deny)
