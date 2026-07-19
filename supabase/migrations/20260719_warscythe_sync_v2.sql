-- WARSCYTHE SYNC V2
-- Idempotent, backward-compatible migration. The legacy profiles.state column
-- remains available during rollout and can be used for rollback.

begin;

alter table public.profiles add column if not exists operations_state jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists fitness_state jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists rituals_state jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists inventory_state jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists statistics_state jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists settings_state jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists sync_v2_migrated_at timestamptz;

-- Populate only empty domain columns. Re-running this migration never replaces
-- domain data that has already been written by a Sync V2 client.
update public.profiles
set
  operations_state = case when operations_state = '{}'::jsonb then jsonb_build_object(
    'tasks', coalesce(state->'tasks', '[]'::jsonb),
    'completedTasks', coalesce(state->'completedTasks', '[]'::jsonb),
    'abandonedTasks', coalesce(state->'abandonedTasks', '[]'::jsonb),
    'notes', coalesce(state->'notes', '""'::jsonb)
  ) else operations_state end,
  fitness_state = case when fitness_state = '{}'::jsonb then jsonb_build_object(
    'gymLog', coalesce(state->'gymLog', '[]'::jsonb),
    'activeWorkout', coalesce(state->'activeWorkout', 'null'::jsonb),
    'customGymWorkouts', coalesce(state->'customGymWorkouts', '[]'::jsonb)
  ) else fitness_state end,
  rituals_state = case when rituals_state = '{}'::jsonb then jsonb_build_object(
    'rituals', coalesce(state->'rituals', '[]'::jsonb),
    'dailyLog', coalesce(state->'dailyLog', '{}'::jsonb)
  ) else rituals_state end,
  inventory_state = case when inventory_state = '{}'::jsonb then jsonb_build_object(
    'collectedArtifacts', coalesce(state->'collectedArtifacts', '[]'::jsonb),
    'unlockedLore', coalesce(state->'unlockedLore', '{}'::jsonb),
    'unlockedScythes', coalesce(state->'unlockedScythes', '[]'::jsonb),
    'unlockedThemes', coalesce(state->'unlockedThemes', '[]'::jsonb),
    'unlockedTitles', coalesce(state->'unlockedTitles', '[]'::jsonb),
    'rescuedFairies', coalesce(state->'rescuedFairies', '{}'::jsonb)
  ) else inventory_state end,
  statistics_state = case when statistics_state = '{}'::jsonb then jsonb_build_object(
    'xp', coalesce(state->'xp', '0'::jsonb),
    'level', coalesce(state->'level', '1'::jsonb),
    'streakCount', coalesce(state->'streakCount', '0'::jsonb),
    'coins', coalesce(state->'coins', '0'::jsonb),
    'bossKills', coalesce(state->'bossKills', '0'::jsonb),
    'dailyPoints', coalesce(state->'dailyPoints', '0'::jsonb),
    'executionScore', coalesce(state->'executionScore', '0'::jsonb),
    'totalCompletions', coalesce(state->'totalCompletions', '0'::jsonb),
    'currentLevelProgress', coalesce(state->'currentLevelProgress', '0'::jsonb),
    'scytheLevel', coalesce(state->'scytheLevel', '"DORMANT"'::jsonb),
    'weeklyPoints', coalesce(state->'weeklyPoints', '0'::jsonb)
  ) else statistics_state end,
  settings_state = case when settings_state = '{}'::jsonb then
    coalesce(state, '{}'::jsonb)
      - 'tasks' - 'completedTasks' - 'abandonedTasks' - 'notes'
      - 'gymLog' - 'activeWorkout' - 'customGymWorkouts'
      - 'rituals' - 'dailyLog'
      - 'collectedArtifacts' - 'unlockedLore' - 'unlockedScythes'
      - 'unlockedThemes' - 'unlockedTitles' - 'rescuedFairies'
      - 'xp' - 'level' - 'streakCount' - 'coins' - 'bossKills'
      - 'dailyPoints' - 'executionScore' - 'totalCompletions'
      - 'currentLevelProgress' - 'scytheLevel' - 'weeklyPoints'
    else settings_state end,
  sync_v2_migrated_at = coalesce(sync_v2_migrated_at, now())
where state is not null;

create or replace function public.warscythe_array_union(
  existing_items jsonb,
  incoming_items jsonb,
  identity_keys text[],
  timestamp_keys text[]
) returns jsonb
language plpgsql
immutable
as $$
declare
  result jsonb := coalesce(existing_items, '[]'::jsonb);
  item jsonb;
  candidate jsonb;
  identity text;
  candidate_identity text;
  incoming_time timestamptz;
  candidate_time timestamptz;
  replacement_index integer;
  idx integer;
  key text;
  found_match boolean;
begin
  if jsonb_typeof(result) <> 'array' then result := '[]'::jsonb; end if;
  if jsonb_typeof(coalesce(incoming_items, '[]'::jsonb)) <> 'array' then return result; end if;

  for item in select value from jsonb_array_elements(incoming_items)
  loop
    identity := null;
    foreach key in array identity_keys loop
      identity := coalesce(identity, nullif(item->>key, ''));
    end loop;
    identity := coalesce(identity, md5(item::text));
    replacement_index := null;
    found_match := false;
    incoming_time := null;
    foreach key in array timestamp_keys loop
      begin
        incoming_time := coalesce(incoming_time, nullif(item->>key, '')::timestamptz);
      exception when others then null;
      end;
    end loop;

    idx := 0;
    for candidate in select value from jsonb_array_elements(result)
    loop
      candidate_identity := null;
      foreach key in array identity_keys loop
        candidate_identity := coalesce(candidate_identity, nullif(candidate->>key, ''));
      end loop;
      candidate_identity := coalesce(candidate_identity, md5(candidate::text));
      if candidate_identity = identity then
        found_match := true;
        candidate_time := null;
        foreach key in array timestamp_keys loop
          begin
            candidate_time := coalesce(candidate_time, nullif(candidate->>key, '')::timestamptz);
          exception when others then null;
          end;
        end loop;
        if coalesce(incoming_time, '-infinity') > coalesce(candidate_time, '-infinity') then
          replacement_index := idx;
        end if;
        exit;
      end if;
      idx := idx + 1;
    end loop;

    if not found_match then
      result := result || jsonb_build_array(item);
    elsif replacement_index is not null then
      result := jsonb_set(result, array[replacement_index::text], item, false);
    end if;
  end loop;
  return result;
end;
$$;

create or replace function public.warscythe_scalar_array_union(
  existing_items jsonb,
  incoming_items jsonb
) returns jsonb
language sql
immutable
as $$
  select coalesce(jsonb_agg(value order by value::text), '[]'::jsonb)
  from (
    select distinct value
    from jsonb_array_elements(
      case
        when jsonb_typeof(coalesce(existing_items, '[]'::jsonb)) = 'array'
          then coalesce(existing_items, '[]'::jsonb)
        else '[]'::jsonb
      end
      ||
      case
        when jsonb_typeof(coalesce(incoming_items, '[]'::jsonb)) = 'array'
          then coalesce(incoming_items, '[]'::jsonb)
        else '[]'::jsonb
      end
    )
  ) values_to_union;
$$;

create or replace function public.sync_warscythe_domain(
  p_domain text,
  p_payload jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  current_value jsonb;
  merged jsonb;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  if p_domain not in ('operations','fitness','rituals','inventory','settings') then
    raise exception 'Unsupported Warscythe sync domain: %', p_domain;
  end if;

  insert into public.profiles (id, state, updated_at)
  values (uid, '{}'::jsonb, now())
  on conflict (id) do nothing;

  execute format('select %I from public.profiles where id = $1 for update', p_domain || '_state')
  into current_value using uid;
  current_value := coalesce(current_value, '{}'::jsonb);

  if p_domain = 'operations' then
    merged := current_value || (p_payload - 'tasks' - 'completedTasks' - 'abandonedTasks');
    merged := jsonb_set(merged, '{tasks}', public.warscythe_array_union(current_value->'tasks', p_payload->'tasks', array['taskUuid','id'], array['updatedAt','lastProgressUpdate','createdAt']), true);
    merged := jsonb_set(merged, '{completedTasks}', public.warscythe_array_union(current_value->'completedTasks', p_payload->'completedTasks', array['taskUuid','id'], array['completedAt','updatedAt']), true);
    merged := jsonb_set(merged, '{abandonedTasks}', public.warscythe_array_union(current_value->'abandonedTasks', p_payload->'abandonedTasks', array['taskUuid','id'], array['abandonedAt','updatedAt']), true);
    -- A completed/abandoned task may not remain active.
    merged := jsonb_set(merged, '{tasks}', coalesce((
      select jsonb_agg(t)
      from jsonb_array_elements(merged->'tasks') t
      where coalesce(t->>'taskUuid', t->>'id') not in (
        select coalesce(x->>'taskUuid', x->>'id') from jsonb_array_elements((merged->'completedTasks') || (merged->'abandonedTasks')) x
      )
    ), '[]'::jsonb), true);
  elsif p_domain = 'fitness' then
    merged := current_value || (p_payload - 'gymLog');
    merged := jsonb_set(merged, '{gymLog}', public.warscythe_array_union(current_value->'gymLog', p_payload->'gymLog', array['eventUuid','id'], array['completedAt','date','updatedAt']), true);
  elsif p_domain = 'rituals' then
    merged := current_value || (p_payload - 'rituals');
    merged := jsonb_set(merged, '{rituals}', public.warscythe_array_union(current_value->'rituals', p_payload->'rituals', array['ritualUuid','id'], array['lastCompletedAt','updatedAt']), true);
    merged := jsonb_set(merged, '{completionEvents}', public.warscythe_array_union(current_value->'completionEvents', p_payload->'completionEvents', array['id','eventUuid'], array['occurredAt','createdAt']), true);
    merged := jsonb_set(merged, '{dailyLog}', coalesce(current_value->'dailyLog','{}'::jsonb) || coalesce(p_payload->'dailyLog','{}'::jsonb), true);
  elsif p_domain = 'inventory' then
    merged := current_value || (p_payload - 'collectedArtifacts');
    merged := jsonb_set(merged, '{collectedArtifacts}', public.warscythe_array_union(current_value->'collectedArtifacts', p_payload->'collectedArtifacts', array['rewardEventId','eventUuid','id','name'], array['date','createdAt']), true);
    merged := jsonb_set(merged, '{unlockedScythes}', public.warscythe_scalar_array_union(current_value->'unlockedScythes', p_payload->'unlockedScythes'), true);
    merged := jsonb_set(merged, '{unlockedThemes}', public.warscythe_scalar_array_union(current_value->'unlockedThemes', p_payload->'unlockedThemes'), true);
    merged := jsonb_set(merged, '{unlockedTitles}', public.warscythe_scalar_array_union(current_value->'unlockedTitles', p_payload->'unlockedTitles'), true);
    merged := jsonb_set(merged, '{unlockedLore}', coalesce(current_value->'unlockedLore','{}'::jsonb) || coalesce(p_payload->'unlockedLore','{}'::jsonb), true);
    merged := jsonb_set(merged, '{rescuedFairies}', coalesce(current_value->'rescuedFairies','{}'::jsonb) || coalesce(p_payload->'rescuedFairies','{}'::jsonb), true);
  else
    -- Preferences and tutorial flags intentionally use last-write-wins.
    if coalesce((p_payload->>'updatedAt')::timestamptz, 'epoch'::timestamptz)
      >= coalesce((current_value->>'updatedAt')::timestamptz, 'epoch'::timestamptz) then
      merged := current_value || p_payload;
    else
      merged := current_value;
    end if;
  end if;

  execute format(
    'update public.profiles set %I = $1, sync_v2_migrated_at = coalesce(sync_v2_migrated_at, now()), updated_at = now() where id = $2',
    p_domain || '_state'
  ) using merged, uid;
  return merged;
end;
$$;

revoke all on function public.sync_warscythe_domain(text, jsonb) from public, anon;
grant execute on function public.sync_warscythe_domain(text, jsonb) to authenticated;

create table if not exists public.progression_events (
  event_uuid uuid primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in ('operation_completed','ritual_completed','workout_archived')),
  source_uuid text not null,
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  coins_awarded integer not null default 0 check (coins_awarded >= 0),
  occurred_at timestamptz not null,
  device_uuid uuid not null,
  device_sequence bigint not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, event_type, source_uuid)
);

alter table public.progression_events enable row level security;
drop policy if exists progression_events_select_own on public.progression_events;
create policy progression_events_select_own on public.progression_events for select to authenticated using (auth.uid() = user_id);

create or replace function public.record_warscythe_progression_event(p_event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  rows_inserted integer := 0;
  stats jsonb;
  operation_count integer;
  total_xp integer;
  total_coins integer;
  boss_count integer;
  derived_level integer;
begin
  if uid is null then raise exception 'Authentication required'; end if;
  insert into public.progression_events (
    event_uuid,user_id,event_type,source_uuid,xp_awarded,coins_awarded,
    occurred_at,device_uuid,device_sequence,metadata
  ) values (
    (p_event->>'eventUuid')::uuid, uid, p_event->>'eventType',
    p_event->>'sourceUuid', greatest(0,coalesce((p_event->>'xpAwarded')::integer,0)),
    greatest(0,coalesce((p_event->>'coinsAwarded')::integer,0)),
    (p_event->>'occurredAt')::timestamptz, (p_event->>'deviceUuid')::uuid,
    (p_event->>'deviceSequence')::bigint, coalesce(p_event->'metadata','{}'::jsonb)
  ) on conflict do nothing;
  get diagnostics rows_inserted = row_count;

  select
    count(*) filter (
      where event_type = 'operation_completed'
        and coalesce((metadata->>'countsForProgression')::boolean, true)
    ),
    coalesce(sum(xp_awarded),0),
    coalesce(sum(coins_awarded),0),
    count(*) filter (
      where event_type = 'operation_completed'
        and coalesce((metadata->>'countsForProgression')::boolean, true)
        and coalesce((metadata->>'isBoss')::boolean,false)
    )
  into operation_count,total_xp,total_coins,boss_count
  from public.progression_events where user_id = uid;

  -- Preserve migrated historical totals while making all post-migration rewards
  -- event-derived and idempotent.
  select statistics_state into stats from public.profiles where id = uid for update;
  derived_level := greatest(
    coalesce((stats->>'migrationBaseLevel')::integer,1),
    floor((coalesce((stats->>'migrationBaseCompletions')::integer,0) + operation_count) / 5.0)::integer + 1
  );
  stats := coalesce(stats,'{}'::jsonb) || jsonb_build_object(
    'xp', greatest(coalesce((stats->>'migrationBaseXp')::integer,0) + total_xp, coalesce((stats->>'xp')::integer,0)),
    'coins', greatest(coalesce((stats->>'migrationBaseCoins')::integer,0) + total_coins, coalesce((stats->>'coins')::integer,0)),
    'totalCompletions', greatest(coalesce((stats->>'migrationBaseCompletions')::integer,0) + operation_count, coalesce((stats->>'totalCompletions')::integer,0)),
    'bossKills', greatest(coalesce((stats->>'migrationBaseBossKills')::integer,0) + boss_count, coalesce((stats->>'bossKills')::integer,0)),
    'level', derived_level,
    'currentLevelProgress', (coalesce((stats->>'migrationBaseCompletions')::integer,0) + operation_count) % 5,
    'keysIssued', coalesce((stats->>'migrationBaseCompletions')::integer,0) + operation_count,
    'updatedAt', now()
  );
  update public.profiles set statistics_state = stats, updated_at = now() where id = uid;
  return jsonb_build_object('accepted',rows_inserted > 0,'statistics',stats);
end;
$$;

revoke all on function public.record_warscythe_progression_event(jsonb) from public, anon;
grant execute on function public.record_warscythe_progression_event(jsonb) to authenticated;

-- Freeze historical totals as the migration base exactly once.
update public.profiles
set statistics_state = statistics_state || jsonb_build_object(
  'migrationBaseXp', coalesce(statistics_state->'migrationBaseXp', statistics_state->'xp', '0'::jsonb),
  'migrationBaseCoins', coalesce(statistics_state->'migrationBaseCoins', statistics_state->'coins', '0'::jsonb),
  'migrationBaseCompletions', coalesce(statistics_state->'migrationBaseCompletions', statistics_state->'totalCompletions', '0'::jsonb),
  'migrationBaseBossKills', coalesce(statistics_state->'migrationBaseBossKills', statistics_state->'bossKills', '0'::jsonb),
  'migrationBaseLevel', coalesce(statistics_state->'migrationBaseLevel', statistics_state->'level', '1'::jsonb)
);

commit;

-- DRY RUN / VERIFICATION (read-only)
-- select id,
--   jsonb_array_length(coalesce(operations_state->'tasks','[]'::jsonb)) active_tasks,
--   jsonb_array_length(coalesce(operations_state->'completedTasks','[]'::jsonb)) completed_tasks,
--   (statistics_state->>'xp')::integer xp,
--   sync_v2_migrated_at
-- from public.profiles order by sync_v2_migrated_at desc nulls last;
--
-- ROLLBACK PLAN
-- 1. Point clients back to profiles.state.
-- 2. Keep the six domain columns intact for forensic comparison.
-- 3. Only after verification, optionally drop the RPCs/table/columns in a later migration.
