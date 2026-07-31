-- Run after 20260731_authoritative_levelup_leaderboard.sql.
-- Rolls back all fixtures.
begin;

do $$
declare
  test_id uuid := gen_random_uuid();
  monday date := date_trunc('week', now() at time zone 'utc')::date;
  calculated_score integer;
begin
  insert into auth.users (
    id, email, encrypted_password, created_at, updated_at,
    confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, aud, role
  ) values (
    test_id, 'leaderboard-authority@test.warscythe',
    crypt('test1234', gen_salt('bf')), now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    'authenticated', 'authenticated'
  );

  insert into public.profiles (id, state, statistics_state, updated_at)
  values (
    test_id,
    '{}'::jsonb,
    jsonb_build_object(
      'migrationBaseCompletions', 0,
      'migrationBaseXp', 0,
      'migrationBaseCoins', 0,
      'migrationBaseBossKills', 0,
      'migrationBaseLevel', 1,
      'level', 1
    ),
    now()
  );

  insert into public.progression_events (
    event_uuid, user_id, event_type, source_uuid, xp_awarded, coins_awarded,
    occurred_at, device_uuid, device_sequence, metadata
  ) values
    (gen_random_uuid(), test_id, 'operation_completed', gen_random_uuid()::text,
      999999, 0, now(), gen_random_uuid(), 1,
      '{"effort":"Low","countsForProgression":true}'::jsonb),
    (gen_random_uuid(), test_id, 'ritual_completed', gen_random_uuid()::text,
      999999, 0, now(), gen_random_uuid(), 2,
      '{"effort":"High"}'::jsonb);

  select sum(public.warscythe_leaderboard_event_score(event_type, metadata, null))
  into calculated_score
  from public.progression_events
  where user_id = test_id
    and (occurred_at at time zone 'utc')::date between monday and monday + 6;

  assert calculated_score = 300,
    'Leaderboard used client-supplied XP instead of deterministic score';

  assert not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'leaderboard_snapshots'
      and policyname = 'leaderboard_upsert_own'
  ), 'Client leaderboard mutation policy still exists';

  raise notice 'LEADERBOARD AUTHORITY PASS: 1 Low Operation + 1 High Ritual = 300, even with forged xp_awarded.';
end $$;

rollback;
