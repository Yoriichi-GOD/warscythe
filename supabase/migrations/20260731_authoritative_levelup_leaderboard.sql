begin;

-- Leaderboard competition score is deliberately deterministic. Reward rarity,
-- client animation state, and client-supplied xp_awarded cannot change it.
create or replace function public.warscythe_leaderboard_event_score(
  p_event_type text,
  p_metadata jsonb,
  p_legion_xp integer default null
)
returns integer
language sql
immutable
set search_path = public
as $$
  select case
    when p_event_type = 'legion_subtask_completed'
      then greatest(0, coalesce(p_legion_xp, 0))
    when p_event_type in ('operation_completed', 'ritual_completed')
      then case lower(coalesce(p_metadata->>'effort', 'medium'))
        when 'low' then 100
        when 'high' then 200
        when 'boss' then 500
        else 150
      end
    else 0
  end;
$$;

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
  event_type_value text := p_event->>'eventType';
  source_uuid_value text := p_event->>'sourceUuid';
  event_xp integer := greatest(0,coalesce((p_event->>'xpAwarded')::integer,0));
  legion_xp integer := null;
  leaderboard_week date;
  leaderboard_xp integer;
  leaderboard_operations integer;
  leaderboard_streak integer;
begin
  if uid is null then raise exception 'Authentication required'; end if;

  if event_type_value = 'legion_subtask_completed' then
    select ls.xp_value
      into legion_xp
    from public.legion_subtasks ls
    where ls.id = source_uuid_value::uuid
      and ls.completion_status in ('completed', 'covered')
      and coalesce(ls.completed_by, ls.assigned_to) = uid;

    if legion_xp is null then
      raise exception 'Legion subtask reward is not authoritative';
    end if;
    event_xp := greatest(0, legion_xp);
  end if;

  insert into public.progression_events (
    event_uuid,user_id,event_type,source_uuid,xp_awarded,coins_awarded,
    occurred_at,device_uuid,device_sequence,metadata
  ) values (
    (p_event->>'eventUuid')::uuid, uid, event_type_value,
    source_uuid_value, event_xp,
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

  leaderboard_week := date_trunc('week', now() at time zone 'utc')::date;
  select
    coalesce(sum(public.warscythe_leaderboard_event_score(
      pe.event_type,
      pe.metadata,
      case when pe.event_type = 'legion_subtask_completed' then pe.xp_awarded else null end
    )), 0),
    count(*) filter (
      where pe.event_type = 'operation_completed'
        and coalesce((pe.metadata->>'countsForProgression')::boolean, true)
    ),
    count(distinct (pe.occurred_at at time zone 'utc')::date)
  into leaderboard_xp, leaderboard_operations, leaderboard_streak
  from public.progression_events pe
  where pe.user_id = uid
    and (pe.occurred_at at time zone 'utc')::date >= leaderboard_week
    and (pe.occurred_at at time zone 'utc')::date < leaderboard_week + 7;

  insert into public.leaderboard_snapshots (
    user_id, week_start, weekly_xp, streak_days, operations_completed
  ) values (
    uid, leaderboard_week, leaderboard_xp, leaderboard_streak, leaderboard_operations
  )
  on conflict (user_id, week_start) do update set
    weekly_xp = excluded.weekly_xp,
    streak_days = excluded.streak_days,
    operations_completed = excluded.operations_completed;

  return jsonb_build_object('accepted',rows_inserted > 0,'statistics',stats);
end;
$$;

-- Authenticated clients may read the board, but only the security-definer
-- progression RPC can create or modify a snapshot.
drop policy if exists leaderboard_upsert_own on public.leaderboard_snapshots;
revoke insert, update, delete on public.leaderboard_snapshots from authenticated;

revoke all on function public.warscythe_leaderboard_event_score(text,jsonb,integer) from public, anon, authenticated;
revoke all on function public.record_warscythe_progression_event(jsonb) from public, anon;
grant execute on function public.record_warscythe_progression_event(jsonb) to authenticated;

-- Rebuild the current UTC week once so existing rows immediately become
-- authoritative instead of retaining their last client-supplied values.
update public.leaderboard_snapshots
set weekly_xp = 0, streak_days = 0, operations_completed = 0
where week_start = date_trunc('week', now() at time zone 'utc')::date;

with scored as (
  select
    pe.user_id,
    date_trunc('week', now() at time zone 'utc')::date as week_start,
    coalesce(sum(public.warscythe_leaderboard_event_score(
      pe.event_type,
      pe.metadata,
      case when pe.event_type = 'legion_subtask_completed' then pe.xp_awarded else null end
    )), 0)::integer as weekly_xp,
    count(distinct (pe.occurred_at at time zone 'utc')::date)::integer as streak_days,
    count(*) filter (
      where pe.event_type = 'operation_completed'
        and coalesce((pe.metadata->>'countsForProgression')::boolean, true)
    )::integer as operations_completed
  from public.progression_events pe
  where (pe.occurred_at at time zone 'utc')::date
    between date_trunc('week', now() at time zone 'utc')::date
        and date_trunc('week', now() at time zone 'utc')::date + 6
  group by pe.user_id
)
insert into public.leaderboard_snapshots (
  user_id, week_start, weekly_xp, streak_days, operations_completed
)
select user_id, week_start, weekly_xp, streak_days, operations_completed
from scored
on conflict (user_id, week_start) do update set
  weekly_xp = excluded.weekly_xp,
  streak_days = excluded.streak_days,
  operations_completed = excluded.operations_completed;

commit;
