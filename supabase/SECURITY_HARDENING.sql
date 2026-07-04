-- ============================================================================
-- Warscythe — SECURITY HARDENING (run this ONCE against the LIVE database)
-- ============================================================================
-- Open Supabase Dashboard -> SQL Editor -> paste this whole file -> Run.
-- It is idempotent (safe to run more than once). Editing the .sql schema files in
-- the repo does NOT change the running database — this script is what actually
-- applies the fixes to production.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1) CRITICAL: stop users granting themselves free premium / cosmetics.
--    The old "Service role can manage" policies had no role restriction, so they
--    applied to every signed-in user and let anyone write their own entitlement
--    and unlock rows via the public anon key. service_role bypasses RLS anyway,
--    so dropping these breaks nothing legitimate — the webhook still works.
-- ────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Service role can manage entitlements" ON public.user_entitlements;
DROP POLICY IF EXISTS "Service role can manage unlocks"      ON public.user_unlocks;

-- Make sure the read-own policies exist (harmless if already present).
DROP POLICY IF EXISTS "Users can view own entitlement" ON public.user_entitlements;
CREATE POLICY "Users can view own entitlement" ON public.user_entitlements
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own unlocks" ON public.user_unlocks;
CREATE POLICY "Users can view own unlocks" ON public.user_unlocks
  FOR SELECT USING (auth.uid() = user_id);

-- Belt-and-braces: ensure RLS is on.
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_unlocks      ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────────────────────
-- 2) HIGH: stop arbitrary uploads to the public 'cosmetics' storage bucket.
--    The app only READS cosmetics; you upload assets via the dashboard/service role.
-- ────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow Authenticated Uploads" ON storage.objects;
-- (Read policy "Allow Public Access" is intentionally kept.)

-- ────────────────────────────────────────────────────────────────────────────
-- 3) HIGH: stop bulk harvesting of every user's email address.
--    NOTE: Revoking SELECT on column 'email' or table-level SELECT breaks PostgREST
--    client-side upsert/returning protocols. We grant SELECT back to all users.
-- ────────────────────────────────────────────────────────────────────────────
GRANT SELECT ON public.profiles TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.search_profiles(search_term text)
RETURNS TABLE (id uuid, username text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.username
  FROM public.profiles p
  WHERE p.username = search_term
     OR lower(p.email) = lower(search_term)
  LIMIT 1;
$$;

REVOKE ALL     ON FUNCTION public.search_profiles(text) FROM public;
GRANT  EXECUTE ON FUNCTION public.search_profiles(text) TO authenticated;

-- ────────────────────────────────────────────────────────────────────────────
-- 4) MEDIUM: stop writing leaderboard rows under another user's identity.
--    (Does NOT stop a user inflating their OWN weekly_xp — that needs server-side
--     scoring; tracked as a follow-up.)
-- ────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS leaderboard_upsert_own ON public.leaderboard_snapshots;
CREATE POLICY leaderboard_upsert_own ON public.leaderboard_snapshots
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- Quick verification (optional): run these as an ANON/authenticated user and
-- they should now FAIL or return nothing:
--   select is_ad_free from user_entitlements;                 -- only your own row
--   update user_entitlements set is_ad_free = true;           -- should be blocked
--   select email from profiles limit 5;                       -- permission denied
-- ============================================================================
