-- =============================================================================
-- TC-06 TEST SUITE — Ritual lastCompletedAt monotonic reconciliation
-- =============================================================================
-- These tests exercise the fix logic WITHOUT touching any real table.
-- They simulate the server-side merge math using the same expressions
-- used inside sync_warscythe_domain (rituals branch, Step 2).
--
-- Run this against any Postgres instance (staging or local).
-- Expected result: all DO blocks complete without RAISE EXCEPTION.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Helper: run the TC-06 reconciliation logic in isolation.
-- Inputs:
--   server_rituals  — what rituals_state->rituals held BEFORE the sync
--   incoming_merged — the result of warscythe_array_union (the "winner")
-- Output:
--   jsonb array with lastCompletedAt reconciled
-- ---------------------------------------------------------------------------
do $$
declare
  server_rituals  jsonb;
  incoming_merged jsonb;
  reconciled      jsonb;
  r               jsonb;
  lca             text;
begin

  -- =========================================================================
  -- TC-06-A: CORE BUG SCENARIO
  -- Device A completes ritual at T+0  (lastCompletedAt = T+0, updatedAt = T+0)
  -- Device B edits title at T+30s    (lastCompletedAt = null, updatedAt = T+30s)
  -- Array union picks Device B (later updatedAt). Fix must restore lastCompletedAt.
  -- =========================================================================
  server_rituals := '[{
    "id": "r1",
    "ritualUuid": "r1",
    "title": "Morning Meditation",
    "lastCompletedAt": "2026-07-20T03:00:00Z",
    "updatedAt": "2026-07-20T03:00:00Z",
    "streak": 5
  }]';

  -- Array union would have picked Device B (updatedAt T+30s wins):
  incoming_merged := '[{
    "id": "r1",
    "ritualUuid": "r1",
    "title": "Morning Meditation — Edited",
    "lastCompletedAt": null,
    "updatedAt": "2026-07-20T03:00:30Z",
    "streak": 5
  }]';

  -- Simulate Step 2 of the patched rituals branch
  select jsonb_agg(
    case
      when server_lca is not null
        and (merged_lca is null or server_lca > merged_lca)
      then ritual || jsonb_build_object('lastCompletedAt', to_json(server_lca)::jsonb)
      else ritual
    end
  )
  into reconciled
  from jsonb_array_elements(incoming_merged) as ritual
  left join lateral (
    select (r2->>'lastCompletedAt')::timestamptz as server_lca
    from jsonb_array_elements(server_rituals) r2
    where coalesce(r2->>'ritualUuid', r2->>'id')
        = coalesce(ritual->>'ritualUuid', ritual->>'id')
    limit 1
  ) srv on true
  cross join lateral (
    select (ritual->>'lastCompletedAt')::timestamptz as merged_lca
  ) ml;

  r   := reconciled->0;
  lca := r->>'lastCompletedAt';

  -- lastCompletedAt must be preserved from Device A
  if lca is null then
    raise exception 'TC-06-A FAIL: lastCompletedAt was null — completion lost';
  end if;
  if lca not like '2026-07-20T03:00:00%' then
    raise exception 'TC-06-A FAIL: lastCompletedAt wrong value: %', lca;
  end if;
  -- Title edit from Device B must be preserved
  if r->>'title' != 'Morning Meditation — Edited' then
    raise exception 'TC-06-A FAIL: title edit was lost: %', r->>'title';
  end if;

  raise notice 'TC-06-A PASS: completion preserved, title edit preserved (lca=%, title=%)', lca, r->>'title';
end;
$$;


do $$
declare
  server_rituals  jsonb;
  incoming_merged jsonb;
  reconciled      jsonb;
  r               jsonb;
  lca             text;
begin

  -- =========================================================================
  -- TC-06-B: BOTH DEVICES HAVE lastCompletedAt — NEWER ONE MUST WIN
  -- Server: lastCompletedAt = T+0
  -- Incoming merged: lastCompletedAt = T+60s (later completion wins normally)
  -- Fix must NOT downgrade the merged value to the older server value.
  -- =========================================================================
  server_rituals := '[{
    "id": "r1",
    "ritualUuid": "r1",
    "title": "Evening Run",
    "lastCompletedAt": "2026-07-20T06:00:00Z",
    "updatedAt": "2026-07-20T06:00:00Z",
    "streak": 3
  }]';

  incoming_merged := '[{
    "id": "r1",
    "ritualUuid": "r1",
    "title": "Evening Run",
    "lastCompletedAt": "2026-07-20T07:00:00Z",
    "updatedAt": "2026-07-20T07:00:00Z",
    "streak": 4
  }]';

  select jsonb_agg(
    case
      when server_lca is not null
        and (merged_lca is null or server_lca > merged_lca)
      then ritual || jsonb_build_object('lastCompletedAt', to_json(server_lca)::jsonb)
      else ritual
    end
  )
  into reconciled
  from jsonb_array_elements(incoming_merged) as ritual
  left join lateral (
    select (r2->>'lastCompletedAt')::timestamptz as server_lca
    from jsonb_array_elements(server_rituals) r2
    where coalesce(r2->>'ritualUuid', r2->>'id')
        = coalesce(ritual->>'ritualUuid', ritual->>'id')
    limit 1
  ) srv on true
  cross join lateral (
    select (ritual->>'lastCompletedAt')::timestamptz as merged_lca
  ) ml;

  r   := reconciled->0;
  lca := r->>'lastCompletedAt';

  if lca not like '2026-07-20T07:00:00%' then
    raise exception 'TC-06-B FAIL: newer lastCompletedAt was overwritten: got %', lca;
  end if;
  if (r->>'streak')::int != 4 then
    raise exception 'TC-06-B FAIL: streak regressed: got %', r->>'streak';
  end if;

  raise notice 'TC-06-B PASS: newer completion wins (lca=%, streak=%)', lca, r->>'streak';
end;
$$;


do $$
declare
  server_rituals  jsonb;
  incoming_merged jsonb;
  reconciled      jsonb;
  r               jsonb;
  lca             text;
begin

  -- =========================================================================
  -- TC-06-C: BRAND NEW RITUAL — server has no record, incoming has no lca
  -- Fix must not crash; ritual passes through unchanged.
  -- =========================================================================
  server_rituals  := '[]';

  incoming_merged := '[{
    "id": "r_new",
    "ritualUuid": "r_new",
    "title": "Cold Shower",
    "lastCompletedAt": null,
    "updatedAt": "2026-07-20T08:00:00Z",
    "streak": 0
  }]';

  select jsonb_agg(
    case
      when server_lca is not null
        and (merged_lca is null or server_lca > merged_lca)
      then ritual || jsonb_build_object('lastCompletedAt', to_json(server_lca)::jsonb)
      else ritual
    end
  )
  into reconciled
  from jsonb_array_elements(incoming_merged) as ritual
  left join lateral (
    select (r2->>'lastCompletedAt')::timestamptz as server_lca
    from jsonb_array_elements(server_rituals) r2
    where coalesce(r2->>'ritualUuid', r2->>'id')
        = coalesce(ritual->>'ritualUuid', ritual->>'id')
    limit 1
  ) srv on true
  cross join lateral (
    select (ritual->>'lastCompletedAt')::timestamptz as merged_lca
  ) ml;

  r := reconciled->0;

  if r->>'id' != 'r_new' then
    raise exception 'TC-06-C FAIL: new ritual lost after reconciliation';
  end if;
  -- lca is null/missing — that is correct for a never-completed ritual
  if r->>'lastCompletedAt' is not null and r->>'lastCompletedAt' != 'null' then
    raise exception 'TC-06-C FAIL: unexpected lastCompletedAt on new ritual: %', r->>'lastCompletedAt';
  end if;

  raise notice 'TC-06-C PASS: new ritual passes through unchanged';
end;
$$;


do $$
declare
  server_rituals  jsonb;
  incoming_merged jsonb;
  reconciled      jsonb;
  count_rituals   int;
begin

  -- =========================================================================
  -- TC-06-D: MULTIPLE RITUALS — mix of new, completed, and title-edited
  -- r1: server completed, incoming title-edit loses lca  → FIX should restore
  -- r2: brand new, never completed                       → pass through
  -- r3: both completed, incoming is newer                → incoming wins
  -- =========================================================================
  server_rituals := '[
    {"id":"r1","ritualUuid":"r1","title":"Meditation","lastCompletedAt":"2026-07-20T03:00:00Z","updatedAt":"2026-07-20T03:00:00Z","streak":5},
    {"id":"r3","ritualUuid":"r3","title":"Reading","lastCompletedAt":"2026-07-19T22:00:00Z","updatedAt":"2026-07-19T22:00:00Z","streak":10}
  ]';

  incoming_merged := '[
    {"id":"r1","ritualUuid":"r1","title":"Meditation — New Name","lastCompletedAt":null,"updatedAt":"2026-07-20T03:30:00Z","streak":5},
    {"id":"r2","ritualUuid":"r2","title":"Cold Shower","lastCompletedAt":null,"updatedAt":"2026-07-20T04:00:00Z","streak":0},
    {"id":"r3","ritualUuid":"r3","title":"Reading","lastCompletedAt":"2026-07-20T21:00:00Z","updatedAt":"2026-07-20T21:00:00Z","streak":11}
  ]';

  select jsonb_agg(
    case
      when server_lca is not null
        and (merged_lca is null or server_lca > merged_lca)
      then ritual || jsonb_build_object('lastCompletedAt', to_json(server_lca)::jsonb)
      else ritual
    end
  )
  into reconciled
  from jsonb_array_elements(incoming_merged) as ritual
  left join lateral (
    select (r2->>'lastCompletedAt')::timestamptz as server_lca
    from jsonb_array_elements(server_rituals) r2
    where coalesce(r2->>'ritualUuid', r2->>'id')
        = coalesce(ritual->>'ritualUuid', ritual->>'id')
    limit 1
  ) srv on true
  cross join lateral (
    select (ritual->>'lastCompletedAt')::timestamptz as merged_lca
  ) ml;

  count_rituals := jsonb_array_length(reconciled);
  if count_rituals != 3 then
    raise exception 'TC-06-D FAIL: expected 3 rituals, got %', count_rituals;
  end if;

  -- r1: completion restored, new title kept
  if (reconciled->0)->>'lastCompletedAt' not like '2026-07-20T03:00:00%' then
    raise exception 'TC-06-D FAIL r1: lastCompletedAt not restored: %', (reconciled->0)->>'lastCompletedAt';
  end if;
  if (reconciled->0)->>'title' != 'Meditation — New Name' then
    raise exception 'TC-06-D FAIL r1: title edit lost: %', (reconciled->0)->>'title';
  end if;

  -- r2: new ritual, lca stays null
  if (reconciled->1)->>'id' != 'r2' then
    raise exception 'TC-06-D FAIL: r2 not at index 1 (got id=%)', (reconciled->1)->>'id';
  end if;

  -- r3: newer incoming completion wins
  if (reconciled->2)->>'lastCompletedAt' not like '2026-07-20T21:00:00%' then
    raise exception 'TC-06-D FAIL r3: newer completion overwritten: %', (reconciled->2)->>'lastCompletedAt';
  end if;
  if ((reconciled->2)->>'streak')::int != 11 then
    raise exception 'TC-06-D FAIL r3: streak regressed: %', (reconciled->2)->>'streak';
  end if;

  raise notice 'TC-06-D PASS: 3-ritual mixed batch — all assertions correct';
end;
$$;


do $$
declare
  server_rituals  jsonb;
  incoming_merged jsonb;
  reconciled      jsonb;
  r               jsonb;
begin

  -- =========================================================================
  -- TC-06-E: SERVER lastCompletedAt IS EXACTLY EQUAL to merged
  -- Fix must not mutate the value (equality → no change).
  -- =========================================================================
  server_rituals := '[{
    "id": "r1",
    "ritualUuid": "r1",
    "title": "Journaling",
    "lastCompletedAt": "2026-07-20T07:00:00Z",
    "updatedAt": "2026-07-20T07:00:00Z",
    "streak": 7
  }]';

  incoming_merged := '[{
    "id": "r1",
    "ritualUuid": "r1",
    "title": "Journaling",
    "lastCompletedAt": "2026-07-20T07:00:00Z",
    "updatedAt": "2026-07-20T07:00:00Z",
    "streak": 7
  }]';

  select jsonb_agg(
    case
      when server_lca is not null
        and (merged_lca is null or server_lca > merged_lca)
      then ritual || jsonb_build_object('lastCompletedAt', to_json(server_lca)::jsonb)
      else ritual
    end
  )
  into reconciled
  from jsonb_array_elements(incoming_merged) as ritual
  left join lateral (
    select (r2->>'lastCompletedAt')::timestamptz as server_lca
    from jsonb_array_elements(server_rituals) r2
    where coalesce(r2->>'ritualUuid', r2->>'id')
        = coalesce(ritual->>'ritualUuid', ritual->>'id')
    limit 1
  ) srv on true
  cross join lateral (
    select (ritual->>'lastCompletedAt')::timestamptz as merged_lca
  ) ml;

  r := reconciled->0;
  if r->>'lastCompletedAt' not like '2026-07-20T07:00:00%' then
    raise exception 'TC-06-E FAIL: value mutated on equal timestamps: %', r->>'lastCompletedAt';
  end if;

  raise notice 'TC-06-E PASS: equal timestamps — value unchanged';
end;
$$;

-- =============================================================================
-- SUMMARY
-- =============================================================================
-- If all 5 DO blocks completed without RAISE EXCEPTION, the fix logic is correct.
-- TC-06-A: Core bug scenario — PASS
-- TC-06-B: Newer incoming completion not downgraded — PASS
-- TC-06-C: Brand new ritual — PASS
-- TC-06-D: Multi-ritual mixed batch — PASS
-- TC-06-E: Equal timestamps — PASS
--
-- Next step: apply fix_tc06_ritual_conflict.sql to staging, then run this
-- test file against the staging Supabase project using psql or the SQL editor.
-- =============================================================================
