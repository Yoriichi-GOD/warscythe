#!/usr/bin/env node
/**
 * WARSCYTHE SYNC V2 — JavaScript Integration Test Runner
 * 
 * Runs against a STAGING Supabase project.
 * Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as env vars.
 * 
 * Usage:
 *   SUPABASE_URL=https://YOUR_STAGING_PROJECT.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
 *   node run_tests.mjs
 * 
 * WARNING: This creates and deletes test users. Use STAGING only.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
  process.exit(1);
}

// Service role client — bypasses RLS for setup/teardown
const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
});

// ─── Test utilities ─────────────────────────────────────────
let passed = 0;
let failed = 0;
let issues = [];

function assert(condition, message, fix = null) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    if (fix) console.error(`  💡 FIX:  ${fix}`);
    failed++;
    issues.push({ message, fix });
  } else {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  }
}

async function createTestUser(email) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: 'TestPass123!',
    email_confirm: true
  });
  if (error) throw error;
  return data.user;
}

async function deleteTestUser(id) {
  await admin.from('progression_events').delete().eq('user_id', id);
  await admin.from('profiles').delete().eq('id', id);
  await admin.auth.admin.deleteUser(id);
}

async function signInAsUser(email) {
  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink', email
  });
  if (error) throw error;
  // Use service client impersonation for RPC calls
  const userClient = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: { 'X-Supabase-Auth': data.properties?.action_link ?? '' }
    }
  });
  return userClient;
}

function uuid() {
  return crypto.randomUUID();
}

// ─── TC-01: Malformed state migration ────────────────────────
async function tc01_malformedState() {
  console.log('\n📋 TC-01: Malformed / partially-corrupt state JSONB blob');
  const email = `tc01_${Date.now()}@test.warscythe.dev`;
  let user;
  try {
    user = await createTestUser(email);
    
    // Insert corrupt state directly
    await admin.from('profiles').upsert({
      id: user.id,
      state: {
        tasks: null,           // null where array expected
        completedTasks: 'bad', // string where array expected
        xp: 42,
        level: null
      },
      updated_at: new Date().toISOString()
    });

    // Run the migration backfill (idempotent SQL function call via RPC or direct SQL)
    const { error: migErr } = await admin.rpc('sync_warscythe_domain', {
      p_domain: 'operations',
      p_payload: { tasks: [], completedTasks: [], abandonedTasks: [] }
    });

    // Fetch resulting domain state
    const { data: profile } = await admin.from('profiles')
      .select('operations_state, statistics_state')
      .eq('id', user.id)
      .single();

    assert(
      Array.isArray(profile?.operations_state?.tasks),
      'After sync, operations_state.tasks should be an array',
      'The sync_warscythe_domain RPC always initializes missing keys to safe defaults via coalesce in the migration backfill'
    );

  } catch (err) {
    console.error('  💥 ERROR:', err.message);
    failed++;
    issues.push({ message: 'TC-01 threw an exception: ' + err.message });
  } finally {
    if (user) await deleteTestUser(user.id);
  }
}

// ─── TC-02: NULL state (brand-new user) ──────────────────────
async function tc02_nullState() {
  console.log('\n📋 TC-02: NULL state column (brand-new user who never onboarded)');
  const email = `tc02_${Date.now()}@test.warscythe.dev`;
  let user;
  try {
    user = await createTestUser(email);
    
    // Profile row created by trigger with null state — simulate it
    await admin.from('profiles').upsert({
      id: user.id,
      state: null,
      updated_at: new Date().toISOString()
    });

    const { data: profile } = await admin.from('profiles')
      .select('operations_state, statistics_state, sync_v2_migrated_at')
      .eq('id', user.id)
      .single();

    // Domain columns should be {} (default), not null
    assert(
      profile?.operations_state !== null,
      'operations_state should default to {} even when state is NULL',
      'Column default is set to {}::jsonb NOT NULL in migration — this should be fine'
    );

    // Now test syncing from a null-state user (first sync)
    const { data: syncResult, error: syncErr } = await admin.rpc('sync_warscythe_domain', {
      p_domain: 'operations',
      p_payload: { tasks: [{ id: 'task-1', taskUuid: 'task-1', title: 'First Task', updatedAt: new Date().toISOString() }], completedTasks: [], abandonedTasks: [] }
    });

    assert(!syncErr, `First sync for null-state user should not error — got: ${syncErr?.message}`,
      'Ensure sync_warscythe_domain handles empty profile via INSERT ON CONFLICT DO NOTHING at line 190-192');
    assert(
      Array.isArray(syncResult?.tasks) && syncResult.tasks.length === 1,
      'First sync should write the task to the domain column',
    );

  } catch (err) {
    console.error('  💥 ERROR:', err.message);
    failed++;
    issues.push({ message: 'TC-02 threw: ' + err.message });
  } finally {
    if (user) await deleteTestUser(user.id);
  }
}

// ─── TC-03: Migration idempotency ────────────────────────────
async function tc03_idempotency() {
  console.log('\n📋 TC-03: Migration idempotency — run sync twice, no data corruption');
  const email = `tc03_${Date.now()}@test.warscythe.dev`;
  let user;
  try {
    user = await createTestUser(email);
    
    const taskId = uuid();
    const payload = {
      tasks: [{ id: taskId, taskUuid: taskId, title: 'Idempotency Task', updatedAt: new Date().toISOString() }],
      completedTasks: [], abandonedTasks: []
    };

    // First sync
    await admin.rpc('sync_warscythe_domain', { p_domain: 'operations', p_payload: payload });
    const { data: first } = await admin.from('profiles').select('operations_state').eq('id', user.id).single();

    // Second sync with same payload
    await admin.rpc('sync_warscythe_domain', { p_domain: 'operations', p_payload: payload });
    const { data: second } = await admin.from('profiles').select('operations_state').eq('id', user.id).single();

    const firstCount = first?.operations_state?.tasks?.length ?? 0;
    const secondCount = second?.operations_state?.tasks?.length ?? 0;

    assert(secondCount === firstCount,
      `Second sync should not duplicate tasks (${firstCount} → ${secondCount})`,
      'warscythe_array_union() deduplicates by taskUuid/id — should be idempotent'
    );

  } catch (err) {
    console.error('  💥 ERROR:', err.message);
    failed++;
    issues.push({ message: 'TC-03 threw: ' + err.message });
  } finally {
    if (user) await deleteTestUser(user.id);
  }
}

// ─── TC-05: Race condition — same Operation UUID from 2 devices ──
async function tc05_raceCondition() {
  console.log('\n📋 TC-05: Race condition — same Operation UUID completed by 2 devices');
  const email = `tc05_${Date.now()}@test.warscythe.dev`;
  let user;
  try {
    user = await createTestUser(email);
    await admin.from('profiles').upsert({ id: user.id, state: {}, updated_at: new Date().toISOString() });

    const sharedOpUuid = uuid();
    const eventA = { eventUuid: uuid(), eventType: 'operation_completed', sourceUuid: sharedOpUuid, xpAwarded: 100, coinsAwarded: 50, occurredAt: new Date().toISOString(), deviceUuid: uuid(), deviceSequence: 1, metadata: {} };
    const eventB = { ...eventA, eventUuid: uuid(), deviceUuid: uuid(), deviceSequence: 1 }; // same sourceUuid!

    // Simulate "both devices call record_warscythe_progression_event simultaneously"
    const [resA, resB] = await Promise.all([
      admin.rpc('record_warscythe_progression_event', { p_event: eventA }),
      admin.rpc('record_warscythe_progression_event', { p_event: eventB }),
    ]);

    // Check how many events were recorded
    const { count } = await admin.from('progression_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('source_uuid', sharedOpUuid);

    assert(count === 1,
      `Race condition: exactly 1 event for source_uuid should exist, got ${count}`,
      'unique(user_id, event_type, source_uuid) constraint + ON CONFLICT DO NOTHING prevents double-counting'
    );

    // Check that stats reflect only 1 completion
    const { data: profile } = await admin.from('profiles').select('statistics_state').eq('id', user.id).single();
    const totalXp = profile?.statistics_state?.xp ?? 0;

    assert(totalXp === 100,
      `XP should be 100 (not 200) even with concurrent submit. Got: ${totalXp}`,
      'Server aggregates from progression_events table (deduped) not from client claims'
    );

  } catch (err) {
    console.error('  💥 ERROR:', err.message);
    failed++;
    issues.push({ message: 'TC-05 threw: ' + err.message });
  } finally {
    if (user) await deleteTestUser(user.id);
  }
}

// ─── TC-08: Timeout retry idempotency ────────────────────────
async function tc08_timeoutRetry() {
  console.log('\n📋 TC-08: Timeout retry — same eventUuid submitted twice, XP not doubled');
  const email = `tc08_${Date.now()}@test.warscythe.dev`;
  let user;
  try {
    user = await createTestUser(email);
    await admin.from('profiles').upsert({ id: user.id, state: {}, updated_at: new Date().toISOString() });

    const sameEventUuid = uuid();
    const event = { eventUuid: sameEventUuid, eventType: 'operation_completed', sourceUuid: uuid(), xpAwarded: 150, coinsAwarded: 75, occurredAt: new Date().toISOString(), deviceUuid: uuid(), deviceSequence: 1, metadata: {} };

    // First call (client sends, server processes)
    const { data: r1 } = await admin.rpc('record_warscythe_progression_event', { p_event: event });

    // Second call (client retry with same eventUuid — server already processed it)
    const { data: r2 } = await admin.rpc('record_warscythe_progression_event', { p_event: event });

    assert(r1?.accepted === true, 'First call should be accepted');
    assert(r2?.accepted === false, 'Retry with same eventUuid should NOT be accepted (already processed)');

    const xpAfterRetry = r2?.statistics?.xp ?? 0;
    assert(xpAfterRetry === 150, `XP after retry should still be 150, not 300. Got: ${xpAfterRetry}`,
      'record_warscythe_progression_event uses ON CONFLICT DO NOTHING on event_uuid PK'
    );

  } catch (err) {
    console.error('  💥 ERROR:', err.message);
    failed++;
    issues.push({ message: 'TC-08 threw: ' + err.message });
  } finally {
    if (user) await deleteTestUser(user.id);
  }
}

// ─── TC-10: Fourth Key / Level boundary ──────────────────────
async function tc10_fourthKey() {
  console.log('\n📋 TC-10: Fourth Key — two devices at 5th completion boundary');
  const email = `tc10_${Date.now()}@test.warscythe.dev`;
  let user;
  try {
    user = await createTestUser(email);
    
    // Profile at 4 completions (just below Level 2)
    await admin.from('profiles').upsert({
      id: user.id, state: {},
      statistics_state: {
        migrationBaseCompletions: 4,
        migrationBaseXp: 400,
        migrationBaseCoins: 200,
        migrationBaseBossKills: 0,
        migrationBaseLevel: 1,
        xp: 400, level: 1, totalCompletions: 4
      },
      updated_at: new Date().toISOString()
    });

    // Device A completes task A (5th completion → should trigger level 2)
    const eventA = { eventUuid: uuid(), eventType: 'operation_completed', sourceUuid: uuid(), xpAwarded: 100, coinsAwarded: 50, occurredAt: new Date().toISOString(), deviceUuid: uuid(), deviceSequence: 1, metadata: { countsForProgression: true } };

    // Device B completes task B (also reaching 5th from their local count)
    const eventB = { eventUuid: uuid(), eventType: 'operation_completed', sourceUuid: uuid(), xpAwarded: 100, coinsAwarded: 50, occurredAt: new Date(Date.now() + 50).toISOString(), deviceUuid: uuid(), deviceSequence: 1, metadata: { countsForProgression: true } };

    await Promise.all([
      admin.rpc('record_warscythe_progression_event', { p_event: eventA }),
      admin.rpc('record_warscythe_progression_event', { p_event: eventB }),
    ]);

    const { data: profile } = await admin.from('profiles').select('statistics_state').eq('id', user.id).single();
    const stats = profile?.statistics_state;

    // 4 base + 2 event = 6 total → level 2
    assert(stats?.level === 2, `Level should be 2 (floor((4+2)/5)+1 = 2). Got: ${stats?.level}`,
      'Server derives level from progression_events aggregate + migrationBase, never trusts client level'
    );
    assert(stats?.currentLevelProgress === 1, `Progress should be 1 into level 2 (6%5=1). Got: ${stats?.currentLevelProgress}`);

    const eventCount = await admin.from('progression_events').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    assert(eventCount.count === 2, `Should have exactly 2 distinct events, got ${eventCount.count}`);

  } catch (err) {
    console.error('  💥 ERROR:', err.message);
    failed++;
    issues.push({ message: 'TC-10 threw: ' + err.message });
  } finally {
    if (user) await deleteTestUser(user.id);
  }
}

// ─── TC-12: Rapid-fire completions ───────────────────────────
async function tc12_rapidFire() {
  console.log('\n📋 TC-12: Rapid-fire — 10 completions in <1 second, no XP double-counting');
  const email = `tc12_${Date.now()}@test.warscythe.dev`;
  let user;
  try {
    user = await createTestUser(email);
    await admin.from('profiles').upsert({ id: user.id, state: {}, statistics_state: {}, updated_at: new Date().toISOString() });

    const events = Array.from({ length: 10 }, (_, i) => ({
      eventUuid: uuid(),
      eventType: 'operation_completed',
      sourceUuid: uuid(),
      xpAwarded: 100,
      coinsAwarded: 50,
      occurredAt: new Date(Date.now() + i).toISOString(),
      deviceUuid: uuid(),
      deviceSequence: i + 1,
      metadata: {}
    }));

    // Fire all 10 concurrently (simulating rapid-fire under debounce)
    const t0 = Date.now();
    await Promise.all(events.map(e => admin.rpc('record_warscythe_progression_event', { p_event: e })));
    const elapsed = Date.now() - t0;

    // Now retry all 10 (client retries after timeout)
    await Promise.all(events.map(e => admin.rpc('record_warscythe_progression_event', { p_event: e })));

    const { count } = await admin.from('progression_events').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    const { data: profile } = await admin.from('profiles').select('statistics_state').eq('id', user.id).single();

    assert(count === 10, `Should have exactly 10 events after retry, got ${count}`);
    assert(profile?.statistics_state?.xp === 1000, `XP should be 1000 (10×100), got ${profile?.statistics_state?.xp}`,
      'ON CONFLICT DO NOTHING on event_uuid PK prevents XP double-counting'
    );

    console.log(`  ⏱️  10 concurrent RPC calls completed in ${elapsed}ms`);

  } catch (err) {
    console.error('  💥 ERROR:', err.message);
    failed++;
    issues.push({ message: 'TC-12 threw: ' + err.message });
  } finally {
    if (user) await deleteTestUser(user.id);
  }
}

// ─── Main runner ─────────────────────────────────────────────
async function main() {
  console.log('═'.repeat(60));
  console.log('  WARSCYTHE SYNC V2 — INTEGRATION TEST SUITE');
  console.log(`  Target: ${SUPABASE_URL}`);
  console.log('═'.repeat(60));

  await tc01_malformedState();
  await tc02_nullState();
  await tc03_idempotency();
  await tc05_raceCondition();
  await tc08_timeoutRetry();
  await tc10_fourthKey();
  await tc12_rapidFire();

  console.log('\n' + '═'.repeat(60));
  console.log(`  RESULTS: ${passed} passed / ${failed} failed`);
  console.log('═'.repeat(60));

  if (issues.length > 0) {
    console.log('\n🔧 ISSUES FOUND:');
    issues.forEach((issue, i) => {
      console.log(`  ${i+1}. ${issue.message}`);
      if (issue.fix) console.log(`     Fix: ${issue.fix}`);
    });
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('💥 Fatal error in test runner:', err);
  process.exit(1);
});
