#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  POSTGRES_URL,
  STAGING_PROJECT_REF,
  PRODUCTION_PROJECT_REF = 'yrxchjontmgkjaazrybh',
  EVIDENCE_PATH = 'scratch/final_validation/sync-v2-evidence.json',
} = process.env;

const required = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  POSTGRES_URL,
  STAGING_PROJECT_REF,
};
for (const [name, value] of Object.entries(required)) {
  if (!value) throw new Error(`Missing required environment variable ${name}`);
}
const targetHost = new URL(SUPABASE_URL).host;
if (
  STAGING_PROJECT_REF === PRODUCTION_PROJECT_REF
  || SUPABASE_URL.includes(PRODUCTION_PROJECT_REF)
  || !SUPABASE_URL.includes(STAGING_PROJECT_REF)
) {
  throw new Error('ISOLATION FAILURE: refusing to target the production or mismatched Supabase project');
}

console.log(`Target endpoint: ${SUPABASE_URL}`);
console.log(`Production endpoint: https://${PRODUCTION_PROJECT_REF}.supabase.co`);
console.log(`Isolation verified: ${STAGING_PROJECT_REF} != ${PRODUCTION_PROJECT_REF}`);

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const db = new pg.Client({
  connectionString: POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});
await db.connect();

const runId = `yc-validation-${Date.now()}`;
const password = `Yc-${crypto.randomUUID()}-Aa1!`;
const users = [];
const results = [];
const timings = [];
const migrationPath = path.resolve('supabase/migrations/20260719_warscythe_sync_v2.sql');

const id = () => crypto.randomUUID();
const iso = offsetMs => new Date(Date.now() + offsetMs).toISOString();
const canonical = value => JSON.stringify(value, Object.keys(value || {}).sort());

function record(testId, phase, expected, observed, result, evidence, severity = 'P1') {
  results.push({
    testId,
    phase,
    expected,
    observed,
    result,
    evidence,
    severity,
    reproducible: true,
    timestamp: new Date().toISOString(),
  });
  console.log(`${result.padEnd(7)} ${testId}: ${observed}`);
}

async function createUser(label) {
  const email = `${runId}-${label}@example.invalid`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { validationRun: runId },
  });
  if (error) throw error;
  users.push({ id: data.user.id, email });
  return { id: data.user.id, email };
}

async function authenticatedClient(email) {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return client;
}

async function resetProfile(userId, state = {}) {
  const { error } = await admin.from('profiles').upsert({
    id: userId,
    state,
    operations_state: {},
    fitness_state: {},
    rituals_state: {},
    inventory_state: {},
    statistics_state: {},
    settings_state: {},
    sync_v2_migrated_at: null,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

async function profile(userId) {
  const { data, error } = await admin
    .from('profiles')
    .select('state,operations_state,fitness_state,rituals_state,inventory_state,statistics_state,settings_state,sync_v2_migrated_at')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

function event({
  eventUuid = id(),
  sourceUuid = id(),
  eventType = 'operation_completed',
  xpAwarded = 100,
  coinsAwarded = 15,
  deviceUuid = id(),
  deviceSequence = 1,
  metadata = { countsForProgression: true },
  occurredAt = iso(0),
} = {}) {
  return {
    eventUuid,
    sourceUuid,
    eventType,
    xpAwarded,
    coinsAwarded,
    deviceUuid,
    deviceSequence,
    metadata,
    occurredAt,
  };
}

async function rpc(client, name, args) {
  const { data, error } = await client.rpc(name, args);
  return { data, error };
}

async function tc01() {
  const u = await createUser('tc01');
  await resetProfile(u.id, {
    tasks: null,
    completedTasks: 'corrupt',
    abandonedTasks: [{ id: 'valid-abandoned', updatedAt: iso(-1000) }],
    rituals: { wrong: true },
    gymLog: 12,
    collectedArtifacts: [{ id: 'valid-artifact' }],
    xp: 42,
    unexpectedLegacyKey: 'preserve-me',
  });
  await db.query(
    `update public.profiles set
      operations_state='{}', fitness_state='{}', rituals_state='{}',
      inventory_state='{}', statistics_state='{}', settings_state='{}',
      sync_v2_migrated_at=null where id=$1`,
    [u.id],
  );
  let migrationError = null;
  try {
    await db.query(fs.readFileSync(migrationPath, 'utf8'));
  } catch (error) {
    migrationError = error.message;
  }
  const p = await profile(u.id);
  const validShape =
    Array.isArray(p.operations_state?.tasks)
    && Array.isArray(p.operations_state?.completedTasks)
    && Array.isArray(p.operations_state?.abandonedTasks)
    && Array.isArray(p.fitness_state?.gymLog)
    && Array.isArray(p.rituals_state?.rituals)
    && Array.isArray(p.inventory_state?.collectedArtifacts)
    && p.settings_state?.unexpectedLegacyKey === 'preserve-me';
  record(
    'TC-01',
    'Phase 1-2 schema/migration',
    'Migration completes, normalizes malformed domain shapes, preserves valid and unrelated data',
    migrationError || `normalized=${validShape}`,
    !migrationError && validShape ? 'PASS' : 'FAIL',
    { profile: p, migrationError },
    'P0',
  );
}

async function tc02() {
  const u = await createUser('tc02');
  await admin.from('profiles').delete().eq('id', u.id);
  const client = await authenticatedClient(u.email);
  const r = await rpc(client, 'sync_warscythe_domain', {
    p_domain: 'operations',
    p_payload: {
      tasks: [{ id: 'first-task', taskUuid: 'first-task', updatedAt: iso(0) }],
      completedTasks: [],
      abandonedTasks: [],
    },
  });
  const p = r.error ? null : await profile(u.id);
  const pass = !r.error && p?.operations_state?.tasks?.length === 1;
  record(
    'TC-02',
    'Phase 1-2 schema/migration',
    'An authenticated user with no profile row gets a safe first-sync profile',
    r.error?.message || `tasks=${p.operations_state.tasks.length}`,
    pass ? 'PASS' : 'FAIL',
    { rpcError: r.error, profile: p },
    'P0',
  );
}

async function tc03() {
  const u = await createUser('tc03');
  await resetProfile(u.id, {
    tasks: [{ id: 'legacy' }],
    xp: 5,
  });
  await db.query(
    `update public.profiles set operations_state=$2, statistics_state=$3 where id=$1`,
    [u.id, { tasks: [{ id: 'v2', updatedAt: iso(0) }] }, { xp: 999, level: 3 }],
  );
  const before = await profile(u.id);
  let error = null;
  try {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await db.query(sql);
    await db.query(sql);
  } catch (caught) {
    error = caught.message;
  }
  const after = await profile(u.id);
  const unchanged =
    canonical(before.operations_state) === canonical(after.operations_state)
    && after.statistics_state.xp === 999
    && after.statistics_state.migrationBaseXp === 999;
  record(
    'TC-03',
    'Phase 1-2 schema/migration',
    'Migration can run repeatedly without replacing populated domains or duplicating data',
    error || `populatedDomainsPreserved=${unchanged}`,
    !error && unchanged ? 'PASS' : 'FAIL',
    { before, after, error },
    'P0',
  );
}

async function tc04() {
  const u = await createUser('tc04');
  await resetProfile(u.id, { notes: 'legacy-initial', currentTitle: 'Recruit' });
  const client = await authenticatedClient(u.email);
  await rpc(client, 'sync_warscythe_domain', {
    p_domain: 'operations',
    p_payload: { tasks: [], completedTasks: [], abandonedTasks: [], notes: 'v2-authoritative' },
  });
  await admin.from('profiles').update({
    state: { notes: 'legacy-overwrite', currentTitle: 'Legacy title' },
  }).eq('id', u.id);
  const p = await profile(u.id);
  const pass = p.operations_state.notes === 'v2-authoritative' && p.state.notes === 'legacy-overwrite';
  record(
    'TC-04',
    'Phase 1-2 schema/migration',
    'V2 domains remain authoritative; legacy state remains stale and cannot overwrite domains',
    `v2=${p.operations_state.notes}; legacy=${p.state.notes}`,
    pass ? 'PASS' : 'FAIL',
    {
      profile: p,
      userImpact: 'Legacy clients read stale state; V2 clients overlay domain columns on legacy state.',
    },
    'P1',
  );
}

async function tc05() {
  const u = await createUser('tc05');
  await resetProfile(u.id);
  const a = await authenticatedClient(u.email);
  const b = await authenticatedClient(u.email);
  const sourceUuid = id();
  const ea = event({ sourceUuid, deviceUuid: id() });
  const eb = event({ sourceUuid, deviceUuid: id(), eventUuid: id() });
  const [ra, rb] = await Promise.all([
    rpc(a, 'record_warscythe_progression_event', { p_event: ea }),
    rpc(b, 'record_warscythe_progression_event', { p_event: eb }),
  ]);
  const rows = await db.query(
    'select event_uuid,xp_awarded,coins_awarded from public.progression_events where user_id=$1 and source_uuid=$2',
    [u.id, sourceUuid],
  );
  const p = await profile(u.id);
  const pass =
    !ra.error && !rb.error
    && rows.rowCount === 1
    && p.statistics_state.totalCompletions === 1
    && p.statistics_state.xp === 100;
  record(
    'TC-05',
    'Phase 3 merge/synchronization',
    'Two independent clients completing one Operation UUID create one event and one reward',
    `rows=${rows.rowCount}; completions=${p.statistics_state.totalCompletions}; xp=${p.statistics_state.xp}`,
    pass ? 'PASS' : 'FAIL',
    { responses: [ra, rb], rows: rows.rows, statistics: p.statistics_state },
    'P0',
  );
}

async function tc06() {
  const u = await createUser('tc06');
  await resetProfile(u.id);
  const a = await authenticatedClient(u.email);
  const b = await authenticatedClient(u.email);
  const ritualUuid = id();
  const base = {
    id: ritualUuid,
    ritualUuid,
    title: 'Original',
    updatedAt: iso(-2000),
    lastCompletedAt: null,
  };
  await rpc(a, 'sync_warscythe_domain', {
    p_domain: 'rituals',
    p_payload: { rituals: [base], completionEvents: [], dailyLog: {} },
  });
  const completed = {
    ...base,
    lastCompletedAt: iso(-1000),
    updatedAt: iso(-2000),
  };
  const edited = {
    ...base,
    title: 'Preserved metadata edit',
    updatedAt: iso(0),
  };
  await Promise.all([
    rpc(a, 'sync_warscythe_domain', {
      p_domain: 'rituals',
      p_payload: {
        rituals: [completed],
        completionEvents: [{ id: id(), ritualUuid, occurredAt: completed.lastCompletedAt }],
        dailyLog: { '2026-07-20': { completed: 1 } },
      },
    }),
    rpc(b, 'sync_warscythe_domain', {
      p_domain: 'rituals',
      p_payload: { rituals: [edited], completionEvents: [], dailyLog: {} },
    }),
  ]);
  const p = await profile(u.id);
  const ritual = p.rituals_state.rituals?.find(item => item.ritualUuid === ritualUuid);
  const pass = ritual?.title === edited.title && ritual?.lastCompletedAt === completed.lastCompletedAt;
  record(
    'TC-06',
    'Phase 3 merge/synchronization',
    'Concurrent completion and metadata edit preserve both independent fields',
    `title=${ritual?.title}; lastCompletedAt=${ritual?.lastCompletedAt}`,
    pass ? 'PASS' : 'FAIL',
    { ritual, domain: p.rituals_state },
    'P0',
  );
}

async function tc07() {
  const u = await createUser('tc07');
  await resetProfile(u.id);
  const a = await authenticatedClient(u.email);
  const b = await authenticatedClient(u.email);
  let allPass = true;
  for (const size of [100, 500, 2000]) {
    const payload = {
      tasks: Array.from({ length: size }, (_, index) => ({
        id: `active-${size}-${index}`,
        taskUuid: `active-${size}-${index}`,
        title: `Active ${index}`,
        updatedAt: iso(index),
      })),
      completedTasks: Array.from({ length: size }, (_, index) => ({
        id: `done-${size}-${index}`,
        taskUuid: `done-${size}-${index}`,
        title: `Done ${index}`,
        completedAt: iso(index),
      })),
      abandonedTasks: [],
    };
    const bytes = Buffer.byteLength(JSON.stringify(payload));
    const started = performance.now();
    const [large, concurrent] = await Promise.all([
      rpc(a, 'sync_warscythe_domain', { p_domain: 'operations', p_payload: payload }),
      rpc(b, 'sync_warscythe_domain', {
        p_domain: 'settings',
        p_payload: { updatedAt: iso(size + 5000), soundscapeVolume: size % 100 },
      }),
    ]);
    const durationMs = performance.now() - started;
    const p = await profile(u.id);
    const integrity =
      p.operations_state.tasks?.length >= size
      && p.operations_state.completedTasks?.length >= size;
    const pass = !large.error && !concurrent.error && integrity;
    allPass &&= pass;
    timings.push({
      testId: 'TC-07',
      size,
      payloadBytes: bytes,
      durationMs,
      integrity,
      rpcError: large.error?.message || concurrent.error?.message || null,
    });
  }
  record(
    'TC-07',
    'Phase 3 merge/synchronization',
    '100+100, 500+500, and 2,000+2,000 queues complete with measured timing and integrity',
    timings.filter(item => item.testId === 'TC-07')
      .map(item => `${item.size}:${Math.round(item.durationMs)}ms/${item.payloadBytes}B/${item.integrity}`)
      .join(', '),
    allPass ? 'PASS' : 'FAIL',
    timings.filter(item => item.testId === 'TC-07'),
    'P1',
  );
}

async function tc08() {
  const u = await createUser('tc08');
  await resetProfile(u.id);
  const client = await authenticatedClient(u.email);
  const e = event();
  const first = await rpc(client, 'record_warscythe_progression_event', { p_event: e });
  const retry = await rpc(client, 'record_warscythe_progression_event', { p_event: e });
  const p = await profile(u.id);
  const rows = await db.query(
    'select count(*)::int as count from public.progression_events where user_id=$1',
    [u.id],
  );
  const pass =
    !first.error && !retry.error
    && first.data?.accepted === true
    && retry.data?.accepted === false
    && rows.rows[0].count === 1
    && p.statistics_state.xp === 100;
  record(
    'TC-08',
    'Phase 3 merge/synchronization',
    'Retry after a lost response is idempotent and returns canonical statistics',
    `accepted=${first.data?.accepted}/${retry.data?.accepted}; rows=${rows.rows[0].count}; xp=${p.statistics_state.xp}`,
    pass ? 'PASS' : 'FAIL',
    { first, retry, statistics: p.statistics_state },
    'P0',
  );
}

async function tc09() {
  const u = await createUser('tc09');
  await resetProfile(u.id);
  const a = await authenticatedClient(u.email);
  const b = await authenticatedClient(u.email);
  const calls = [
    rpc(a, 'sync_warscythe_domain', {
      p_domain: 'operations',
      p_payload: { tasks: [{ id: 'op', taskUuid: 'op', updatedAt: iso(0) }], completedTasks: [], abandonedTasks: [] },
    }),
    rpc(b, 'sync_warscythe_domain', {
      p_domain: 'fitness',
      p_payload: { gymLog: [{ id: 'gym', eventUuid: 'gym', completedAt: iso(0) }] },
    }),
    rpc(a, 'sync_warscythe_domain', {
      p_domain: 'rituals',
      p_payload: { rituals: [{ id: 'ritual', ritualUuid: 'ritual', updatedAt: iso(0) }], completionEvents: [] },
    }),
    rpc(b, 'sync_warscythe_domain', {
      p_domain: 'inventory',
      p_payload: { collectedArtifacts: [{ id: 'artifact', name: 'Artifact', createdAt: iso(0) }] },
    }),
    rpc(a, 'sync_warscythe_domain', {
      p_domain: 'settings',
      p_payload: { updatedAt: iso(0), soundscapeEnabled: true },
    }),
  ];
  const responses = await Promise.all(calls);
  const p = await profile(u.id);
  const pass =
    responses.every(response => !response.error)
    && p.operations_state.tasks?.length === 1
    && p.fitness_state.gymLog?.length === 1
    && p.rituals_state.rituals?.length === 1
    && p.inventory_state.collectedArtifacts?.length === 1
    && p.settings_state.soundscapeEnabled === true;
  record(
    'TC-09',
    'Phase 3 merge/synchronization',
    'Concurrent domain sync preserves all domains without cross-domain overwrite',
    `allDomainsPresent=${pass}`,
    pass ? 'PASS' : 'FAIL',
    {
      responses,
      profile: p,
      lockModel: 'The RPC locks the profile row. PostgreSQL row locks are not column/domain locks.',
    },
    'P0',
  );
}

async function tc10() {
  const thresholds = [4, 9, 14];
  const evidence = [];
  let pass = true;
  for (const base of thresholds) {
    const u = await createUser(`tc10-${base}`);
    await resetProfile(u.id);
    await admin.from('profiles').update({
      statistics_state: {
        migrationBaseCompletions: base,
        migrationBaseXp: base * 100,
        migrationBaseCoins: base * 15,
        migrationBaseBossKills: 0,
        migrationBaseLevel: Math.floor(base / 5) + 1,
        xp: base * 100,
        coins: base * 15,
        totalCompletions: base,
        level: Math.floor(base / 5) + 1,
      },
    }).eq('id', u.id);
    const a = await authenticatedClient(u.email);
    const b = await authenticatedClient(u.email);
    const responses = await Promise.all([
      rpc(a, 'record_warscythe_progression_event', { p_event: event({ deviceUuid: id() }) }),
      rpc(b, 'record_warscythe_progression_event', { p_event: event({ deviceUuid: id() }) }),
    ]);
    const p = await profile(u.id);
    const expectedTotal = base + 2;
    const expectedLevel = Math.floor(expectedTotal / 5) + 1;
    const row = {
      base,
      expectedTotal,
      actualTotal: p.statistics_state.totalCompletions,
      expectedLevel,
      actualLevel: p.statistics_state.level,
      currentLevelProgress: p.statistics_state.currentLevelProgress,
      errors: responses.map(response => response.error?.message || null),
    };
    row.pass =
      row.errors.every(error => !error)
      && row.actualTotal === expectedTotal
      && row.actualLevel === expectedLevel;
    pass &&= row.pass;
    evidence.push(row);
  }
  record(
    'TC-10',
    'Phase 4 server-derived progression',
    'Concurrent events across multiple boundaries produce exact canonical totals and one boundary crossing',
    evidence.map(row => `${row.base}->${row.actualTotal}/L${row.actualLevel}`).join(', '),
    pass ? 'PASS' : 'FAIL',
    evidence,
    'P0',
  );
}

async function tc11() {
  const u = await createUser('tc11');
  await resetProfile(u.id);
  await admin.from('profiles').update({
    statistics_state: {
      migrationBaseCompletions: 4,
      migrationBaseXp: 400,
      migrationBaseCoins: 60,
      migrationBaseBossKills: 0,
      migrationBaseLevel: 1,
      xp: 999999,
      coins: 999999,
      totalCompletions: 999,
      level: 99,
    },
  }).eq('id', u.id);
  const client = await authenticatedClient(u.email);
  const response = await rpc(client, 'record_warscythe_progression_event', {
    p_event: event({ xpAwarded: 100, coinsAwarded: 15 }),
  });
  const p = await profile(u.id);
  const expected = { xp: 500, coins: 75, totalCompletions: 5, level: 2 };
  const pass =
    !response.error
    && p.statistics_state.xp === expected.xp
    && p.statistics_state.coins === expected.coins
    && p.statistics_state.totalCompletions === expected.totalCompletions
    && p.statistics_state.level === expected.level;
  record(
    'TC-11',
    'Phase 4 server-derived progression',
    'Canonical server state rolls back an inflated optimistic preview',
    `xp=${p.statistics_state.xp}; coins=${p.statistics_state.coins}; completions=${p.statistics_state.totalCompletions}; level=${p.statistics_state.level}`,
    pass ? 'PASS' : 'FAIL',
    { expected, response, statistics: p.statistics_state },
    'P0',
  );
}

async function tc12() {
  const u = await createUser('tc12');
  await resetProfile(u.id);
  const a = await authenticatedClient(u.email);
  const validSource = id();
  await rpc(a, 'sync_warscythe_domain', {
    p_domain: 'operations',
    p_payload: {
      tasks: [],
      completedTasks: [{
        id: validSource,
        taskUuid: validSource,
        completedAt: iso(0),
        effort: 'Medium',
      }],
      abandonedTasks: [],
    },
  });
  const unique = Array.from({ length: 10 }, (_, index) => event({
    sourceUuid: index === 0 ? validSource : id(),
    deviceSequence: index + 1,
  }));
  const retries = unique.slice(0, 3).map(item => ({ ...item }));
  const invalid = [
    event({ sourceUuid: 'missing-task-reference', xpAwarded: 999999, coinsAwarded: 999999 }),
    { ...event(), eventUuid: 'not-a-uuid' },
    { ...event(), deviceUuid: 'not-a-uuid' },
  ];
  const started = performance.now();
  const responses = await Promise.all(
    [...unique, ...retries, ...invalid]
      .map(item => rpc(a, 'record_warscythe_progression_event', { p_event: item })),
  );
  const durationMs = performance.now() - started;
  const rows = await db.query(
    'select source_uuid,xp_awarded,coins_awarded from public.progression_events where user_id=$1',
    [u.id],
  );
  const invalidAccepted = rows.rows.some(row => row.source_uuid === 'missing-task-reference');
  const duplicateRows = rows.rows.length - new Set(rows.rows.map(row => row.source_uuid)).size;
  const pass =
    durationMs < 1000
    && duplicateRows === 0
    && !invalidAccepted
    && responses.filter(response => response.error).length >= 3;
  record(
    'TC-12',
    'Phase 4 server-derived progression',
    'Rapid valid events and retries are deterministic; invalid references and malformed UUIDs grant nothing',
    `duration=${Math.round(durationMs)}ms; rows=${rows.rowCount}; duplicateRows=${duplicateRows}; invalidAccepted=${invalidAccepted}; errors=${responses.filter(r => r.error).length}`,
    pass ? 'PASS' : 'FAIL',
    { durationMs, rows: rows.rows, responses },
    'P0',
  );
}

async function additionalCases() {
  const u = await createUser('additional');
  await resetProfile(u.id);
  const a = await authenticatedClient(u.email);
  const b = await authenticatedClient(u.email);
  const taskUuid = id();

  await rpc(a, 'sync_warscythe_domain', {
    p_domain: 'operations',
    p_payload: {
      tasks: [{ id: taskUuid, taskUuid, title: 'Before deletion', updatedAt: iso(-1000) }],
      completedTasks: [],
      abandonedTasks: [],
    },
  });
  await Promise.all([
    rpc(a, 'sync_warscythe_domain', {
      p_domain: 'operations',
      p_payload: { tasks: [], completedTasks: [], abandonedTasks: [] },
    }),
    rpc(b, 'sync_warscythe_domain', {
      p_domain: 'operations',
      p_payload: {
        tasks: [{ id: taskUuid, taskUuid, title: 'Concurrent edit', updatedAt: iso(0) }],
        completedTasks: [],
        abandonedTasks: [],
      },
    }),
  ]);
  const p = await profile(u.id);
  const deletionWon = !p.operations_state.tasks?.some(item => item.taskUuid === taskUuid);
  record(
    'TC-ADDL-DELETE-EDIT',
    'Phase 3 merge/synchronization',
    'Deletion versus edit follows a documented deterministic strategy',
    `deletionWon=${deletionWon}; tombstonesPresent=${Boolean(p.operations_state.tombstones)}`,
    deletionWon ? 'PASS' : 'FAIL',
    {
      operations: p.operations_state,
      note: 'No deletion tombstones are present, so an empty incoming array cannot express deletion.',
    },
    'P1',
  );

  const malformedCases = [
    event({ sourceUuid: '', xpAwarded: 100 }),
    { ...event(), occurredAt: 'not-a-date' },
    { ...event(), eventType: 'invalid_event' },
    { ...event(), deviceSequence: 'not-a-number' },
  ];
  const malformedResponses = [];
  for (const malformed of malformedCases) {
    malformedResponses.push(await rpc(a, 'record_warscythe_progression_event', { p_event: malformed }));
  }
  const malformedPass = malformedResponses.every(response => response.error);
  record(
    'TC-ADDL-MALFORMED',
    'Phase 4 server-derived progression',
    'Malformed progression events fail deterministically and grant nothing',
    `rejected=${malformedResponses.filter(response => response.error).length}/${malformedResponses.length}`,
    malformedPass ? 'PASS' : 'FAIL',
    malformedResponses,
    'P0',
  );
}

let fatal = null;
try {
  await tc01();
  await tc02();
  await tc03();
  await tc04();
  await tc05();
  await tc06();
  await tc07();
  await tc08();
  await tc09();
  await tc10();
  await tc11();
  await tc12();
  await additionalCases();
} catch (error) {
  fatal = { message: error.message, stack: error.stack };
  console.error(`FATAL: ${error.message}`);
} finally {
  for (const user of users.reverse()) {
    try {
      await admin.from('progression_events').delete().eq('user_id', user.id);
      await admin.from('profiles').delete().eq('id', user.id);
      await admin.auth.admin.deleteUser(user.id);
    } catch (error) {
      console.error(`Teardown failed for ${user.id}: ${error.message}`);
    }
  }
  await db.end();
}

const summary = {
  runId,
  target: {
    endpoint: SUPABASE_URL,
    projectRef: STAGING_PROJECT_REF,
    productionProjectRef: PRODUCTION_PROJECT_REF,
    isolated: STAGING_PROJECT_REF !== PRODUCTION_PROJECT_REF,
  },
  counts: {
    passed: results.filter(item => item.result === 'PASS').length,
    failed: results.filter(item => item.result === 'FAIL').length,
    blocked: results.filter(item => item.result === 'BLOCKED').length,
    total: results.length,
  },
  results,
  timings,
  fatal,
};

fs.writeFileSync(path.resolve(EVIDENCE_PATH), JSON.stringify(summary, null, 2));
console.log(`Evidence: ${path.resolve(EVIDENCE_PATH)}`);
console.log(JSON.stringify(summary.counts));
if (fatal) process.exitCode = 2;
else if (summary.counts.failed > 0) process.exitCode = 1;
