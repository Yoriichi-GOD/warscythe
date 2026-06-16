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
CREATE POLICY "Users can view own entitlement" ON public.user_entitlements
    FOR SELECT USING (auth.uid() = user_id);

-- Allow service role (like Edge Functions) to perform all operations
CREATE POLICY "Service role can manage entitlements" ON public.user_entitlements
    USING (true) WITH CHECK (true);

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
CREATE POLICY "Users can view own unlocks" ON public.user_unlocks
    FOR SELECT USING (auth.uid() = user_id);

-- Allow service role (like Edge Functions) to perform all operations
CREATE POLICY "Service role can manage unlocks" ON public.user_unlocks
    USING (true) WITH CHECK (true);
