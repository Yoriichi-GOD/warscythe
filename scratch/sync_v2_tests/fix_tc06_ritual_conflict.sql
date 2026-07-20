-- =============================================================================
-- TC-06 PATCH — Ritual lastCompletedAt monotonic reconciliation
-- =============================================================================
-- Bug: warscythe_array_union picks the entire ritual object whose timestamp
-- key (lastCompletedAt, then updatedAt) is most recent. If Device B edits
-- a ritual title (updatedAt = T+30s, lastCompletedAt = null) while Device A
-- completed the ritual (lastCompletedAt = T+0s, updatedAt = T+0s), Device B
-- wins the union and lastCompletedAt is silently nulled. Completion lost.
--
-- Fix: After the array union, scan the merged rituals array. For each ritual,
-- compare its lastCompletedAt to the pre-merge server value for the same
-- ritualUuid/id. If the server value is more recent (or the merged value is
-- null), restore the server lastCompletedAt. This makes lastCompletedAt a
-- monotonically increasing field independent of updatedAt.
--
-- Scope: ONLY the rituals branch of sync_warscythe_domain is changed.
-- All other domains are byte-for-byte identical to the original migration.
-- No schema changes. No new tables. Safe CREATE OR REPLACE.
-- Idempotent — safe to apply multiple times.
-- =============================================================================

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
  reconciled_rituals jsonb;
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
    -- Step 1: identical to original
    merged := current_value || (p_payload - 'rituals');
    merged := jsonb_set(merged, '{rituals}', public.warscythe_array_union(current_value->'rituals', p_payload->'rituals', array['ritualUuid','id'], array['lastCompletedAt','updatedAt']), true);

    -- Step 2: TC-06 FIX — lastCompletedAt monotonic reconciliation
    -- After the array union, for each ritual compare its lastCompletedAt
    -- against the pre-merge server value. If the server held a more recent
    -- (or non-null) lastCompletedAt, restore it onto the winner item.
    -- This preserves title/effort edits from Device B while keeping the
    -- completion timestamp from Device A.
    select jsonb_agg(
      case
        when server_lca is not null
          and (merged_lca is null or server_lca > merged_lca)
        then ritual || jsonb_build_object('lastCompletedAt', to_json(server_lca)::jsonb)
        else ritual
      end
    )
    into reconciled_rituals
    from jsonb_array_elements(coalesce(merged->'rituals', '[]'::jsonb)) as ritual
    left join lateral (
      select (r->>'lastCompletedAt')::timestamptz as server_lca
      from jsonb_array_elements(coalesce(current_value->'rituals', '[]'::jsonb)) r
      where coalesce(r->>'ritualUuid', r->>'id')
          = coalesce(ritual->>'ritualUuid', ritual->>'id')
      limit 1
    ) srv on true
    cross join lateral (
      select (ritual->>'lastCompletedAt')::timestamptz as merged_lca
    ) ml;

    merged := jsonb_set(merged, '{rituals}', coalesce(reconciled_rituals, '[]'::jsonb), true);

    -- Step 3: completionEvents and dailyLog unchanged
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
