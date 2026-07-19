-- ============================================================
-- WARSCYTHE SYNC V2 — STAGING TEST SUITE
-- Phase 1/2: Schema & Migration Edge Cases
-- Run against a STAGING Supabase project only.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- TEST SETUP: Insert synthetic test profiles
-- ─────────────────────────────────────────────────────────────

-- NOTE: Replace these UUIDs with real auth.users rows in your staging project.
-- You can create them via the Supabase Auth dashboard or via signUp() in JS.
-- These tests assume the migration (20260719_warscythe_sync_v2.sql) has NOT
-- yet been applied on the staging DB (so we can test migration behavior).

-- ─────────────────────────────────────────────────────────────
-- TC-01: Malformed / partially-corrupt state JSONB blob
-- Expected: migration completes without crash; missing keys get
--           safe defaults via COALESCE; no data dropped silently.
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  test_id uuid := gen_random_uuid();
  ops jsonb;
BEGIN
  -- Insert a profile with a corrupt state: some keys are null, one is
  -- the wrong type (a scalar where an array is expected).
  INSERT INTO auth.users (id, email, encrypted_password, created_at, updated_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, aud, role)
  VALUES (test_id, 'tc01_corrupt@test.warscythe', crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.profiles (id, state, updated_at)
  VALUES (
    test_id,
    jsonb_build_object(
      'tasks',          null,          -- null where array expected
      'completedTasks', '"not-array"', -- scalar string where array expected
      'xp',             42,
      'level',          null           -- null where integer expected
    ),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET state = EXCLUDED.state;

  -- Now run the migration update block manually (simulating the migration):
  UPDATE public.profiles SET
    operations_state = CASE WHEN operations_state = '{}'::jsonb THEN jsonb_build_object(
      'tasks',          coalesce(state->'tasks', '[]'::jsonb),
      'completedTasks', coalesce(state->'completedTasks', '[]'::jsonb),
      'abandonedTasks', coalesce(state->'abandonedTasks', '[]'::jsonb),
      'notes',          coalesce(state->'notes', '""'::jsonb)
    ) ELSE operations_state END,
    statistics_state = CASE WHEN statistics_state = '{}'::jsonb THEN jsonb_build_object(
      'xp',    coalesce(state->'xp', '0'::jsonb),
      'level', coalesce(state->'level', '1'::jsonb)
    ) ELSE statistics_state END,
    sync_v2_migrated_at = coalesce(sync_v2_migrated_at, now())
  WHERE id = test_id AND state IS NOT NULL;

  SELECT operations_state INTO ops FROM public.profiles WHERE id = test_id;

  ASSERT jsonb_typeof(ops->'tasks') = 'array',
    'TC-01 FAIL: corrupt null tasks should become [] array — got: ' || ops::text;
  ASSERT jsonb_typeof(ops->'completedTasks') = 'array',
    'TC-01 FAIL: scalar completedTasks should become [] — got: ' || ops::text;

  RAISE NOTICE 'TC-01 PASS: Malformed state migrated safely. operations_state.tasks=%', ops->'tasks';

  -- Cleanup
  DELETE FROM public.profiles WHERE id = test_id;
  DELETE FROM auth.users WHERE id = test_id;
END $$;


-- ─────────────────────────────────────────────────────────────
-- TC-02: Empty / NULL state column (brand-new user)
-- Expected: migration skips the UPDATE (WHERE state IS NOT NULL),
--           domain columns remain '{}', no crash.
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  test_id uuid := gen_random_uuid();
  ops jsonb;
  stats jsonb;
BEGIN
  INSERT INTO auth.users (id, email, encrypted_password, created_at, updated_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, aud, role)
  VALUES (test_id, 'tc02_newuser@test.warscythe', crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
  ON CONFLICT DO NOTHING;

  -- Insert with NULL state (brand new user who never onboarded)
  INSERT INTO public.profiles (id, state, updated_at)
  VALUES (test_id, NULL, now())
  ON CONFLICT (id) DO UPDATE SET state = NULL;

  -- Run migration update — WHERE state IS NOT NULL should skip this row
  UPDATE public.profiles SET
    operations_state = CASE WHEN operations_state = '{}'::jsonb THEN jsonb_build_object(
      'tasks', coalesce(state->'tasks', '[]'::jsonb)
    ) ELSE operations_state END
  WHERE id = test_id AND state IS NOT NULL;

  SELECT operations_state, statistics_state INTO ops, stats
  FROM public.profiles WHERE id = test_id;

  ASSERT ops = '{}'::jsonb,
    'TC-02 FAIL: null-state user should have empty operations_state — got: ' || ops::text;
  ASSERT stats = '{}'::jsonb,
    'TC-02 FAIL: null-state user should have empty statistics_state — got: ' || stats::text;

  RAISE NOTICE 'TC-02 PASS: NULL state user safely skipped by migration.';

  DELETE FROM public.profiles WHERE id = test_id;
  DELETE FROM auth.users WHERE id = test_id;
END $$;


-- ─────────────────────────────────────────────────────────────
-- TC-03: Idempotency — run migration twice
-- Expected: second run does NOT overwrite domain columns that
--           already have data (the CASE WHEN col = '{}' guard).
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  test_id uuid := gen_random_uuid();
  ops_first jsonb;
  ops_second jsonb;
BEGIN
  INSERT INTO auth.users (id, email, encrypted_password, created_at, updated_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, aud, role)
  VALUES (test_id, 'tc03_idem@test.warscythe', crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.profiles (id, state, updated_at)
  VALUES (test_id, jsonb_build_object('tasks', jsonb_build_array(jsonb_build_object('id','task-1','title','Alpha Task'))), now())
  ON CONFLICT (id) DO UPDATE SET state = EXCLUDED.state;

  -- First migration pass
  UPDATE public.profiles SET
    operations_state = CASE WHEN operations_state = '{}'::jsonb THEN jsonb_build_object(
      'tasks', coalesce(state->'tasks', '[]'::jsonb)
    ) ELSE operations_state END
  WHERE id = test_id AND state IS NOT NULL;

  SELECT operations_state INTO ops_first FROM public.profiles WHERE id = test_id;

  -- Second migration pass (idempotency test)
  UPDATE public.profiles SET
    operations_state = CASE WHEN operations_state = '{}'::jsonb THEN jsonb_build_object(
      'tasks', coalesce(state->'tasks', '[]'::jsonb)
    ) ELSE operations_state END
  WHERE id = test_id AND state IS NOT NULL;

  SELECT operations_state INTO ops_second FROM public.profiles WHERE id = test_id;

  ASSERT ops_first = ops_second,
    'TC-03 FAIL: Second migration run changed domain data! Before=' || ops_first::text || ' After=' || ops_second::text;

  RAISE NOTICE 'TC-03 PASS: Migration is idempotent. ops_first=ops_second=%', ops_first;

  DELETE FROM public.profiles WHERE id = test_id;
  DELETE FROM auth.users WHERE id = test_id;
END $$;


-- ─────────────────────────────────────────────────────────────
-- TC-04: Dual-write transition — client writes old state column
--        AFTER domain columns have been populated by migration.
-- Expected: The sync_warscythe_domain() RPC always wins for its
--           own domain. Legacy writes to state do NOT stomp domain cols.
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  test_id uuid := gen_random_uuid();
  v2_task_id text := 'task-v2-uuid';
  legacy_task_id text := 'task-legacy-uuid';
  ops_result jsonb;
  task_count integer;
BEGIN
  INSERT INTO auth.users (id, email, encrypted_password, created_at, updated_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, aud, role)
  VALUES (test_id, 'tc04_dual@test.warscythe', crypt('test1234', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', 'authenticated', 'authenticated')
  ON CONFLICT DO NOTHING;

  -- Setup: profile migrated, operations_state has one V2 task
  INSERT INTO public.profiles (id, state, operations_state, updated_at)
  VALUES (
    test_id,
    jsonb_build_object('tasks', '[]'::jsonb),
    jsonb_build_object('tasks', jsonb_build_array(
      jsonb_build_object('id', v2_task_id, 'title', 'V2 Task', 'updatedAt', now()::text)
    )),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    state = EXCLUDED.state,
    operations_state = EXCLUDED.operations_state;

  -- Simulate legacy client writing to state column (overwrites with only legacy task)
  UPDATE public.profiles SET
    state = jsonb_build_object('tasks', jsonb_build_array(
      jsonb_build_object('id', legacy_task_id, 'title', 'Legacy Task')
    )),
    updated_at = now()
  WHERE id = test_id;

  -- Verify: operations_state must still contain V2 task (domain col is independent)
  SELECT operations_state INTO ops_result FROM public.profiles WHERE id = test_id;

  SELECT jsonb_array_length(ops_result->'tasks') INTO task_count;

  ASSERT task_count = 1,
    'TC-04 FAIL: operations_state tasks count should be 1 — got: ' || task_count::text;
  ASSERT (ops_result->'tasks'->0->>'id') = v2_task_id,
    'TC-04 FAIL: operations_state task should be V2 task — got: ' || ops_result::text;

  RAISE NOTICE 'TC-04 PASS: Legacy state write did not corrupt domain columns.';

  DELETE FROM public.profiles WHERE id = test_id;
  DELETE FROM auth.users WHERE id = test_id;
END $$;
