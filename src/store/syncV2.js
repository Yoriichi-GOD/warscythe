import { supabase } from '../lib/supabase';

const DEVICE_KEY = 'warscythe-sync-v2-device-id';
const SEQUENCE_KEY = 'warscythe-sync-v2-sequence';

const uuid = () => (
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
);

export const getDeviceUuid = () => {
  let value = localStorage.getItem(DEVICE_KEY);
  if (!value) {
    value = uuid();
    localStorage.setItem(DEVICE_KEY, value);
  }
  return value;
};

export const nextDeviceSequence = () => {
  const next = Number(localStorage.getItem(SEQUENCE_KEY) || 0) + 1;
  localStorage.setItem(SEQUENCE_KEY, String(next));
  return next;
};

const withTaskMetadata = task => {
  if (!task) return task;
  return {
    ...task,
    taskUuid: task.taskUuid || task.id,
    deviceUuid: task.deviceUuid || getDeviceUuid(),
    deviceSequence: task.deviceSequence || 0,
    createdAt: task.createdAt || task.dateCreated || new Date().toISOString(),
    syncStatus: task.syncStatus || 'pending',
  };
};

const withArtifactMetadata = artifact => ({
  ...artifact,
  rewardEventId: artifact.rewardEventId || artifact.eventUuid || `${artifact.name || 'artifact'}:${artifact.date || 'legacy'}`,
  deviceUuid: artifact.deviceUuid || getDeviceUuid(),
  deviceSequence: artifact.deviceSequence || 0,
  syncStatus: artifact.syncStatus || 'pending',
});

export const DOMAIN_KEYS = {
  operations: ['tasks', 'completedTasks', 'abandonedTasks', 'notes'],
  fitness: ['gymLog', 'activeWorkout', 'customGymWorkouts'],
  rituals: ['rituals', 'dailyLog', 'ritualCompletionEvents'],
  inventory: [
    'collectedArtifacts', 'unlockedLore', 'unlockedScythes', 'unlockedThemes',
    'unlockedTitles', 'rescuedFairies',
  ],
  statistics: [
    'xp', 'level', 'streakCount', 'coins', 'bossKills', 'dailyPoints',
    'executionScore', 'totalCompletions', 'currentLevelProgress',
    'scytheLevel', 'weeklyPoints',
  ],
  settings: [
    'currentTitle', 'consecutiveLow', 'activeScytheSkin', 'activeTheme',
    'downloadedRegions', 'scytheMigrationDone', 'hasCompletedTutorial',
    'tutorialStep', 'firstTaskCompleted', 'lastActiveDate', 'lastResetDate',
    'soundscapeEnabled', 'soundscapeVolume', 'onboardingProgress',
    'onboardingActive', 'pendingGuardianProgress', 'referralSource',
    'hasSeenMapGuide', 'hasSeenLedgerGuide', 'hasSeenForgeGuide',
    'hasSeenRitualsGuide', 'hasSeenFitnessPeek',
  ],
};

export const getDomainsForFields = fields => {
  const requested = new Set();
  for (const field of fields || []) {
    for (const [domain, keys] of Object.entries(DOMAIN_KEYS)) {
      if (domain !== 'statistics' && keys.includes(field)) requested.add(domain);
    }
  }
  return [...requested];
};

const pick = (state, keys) => Object.fromEntries(
  keys.filter(key => state[key] !== undefined).map(key => [key, state[key]])
);

export const createDomainPayloads = state => ({
  operations: {
    ...pick(state, DOMAIN_KEYS.operations),
    tasks: (state.tasks || []).map(withTaskMetadata),
    completedTasks: (state.completedTasks || []).map(withTaskMetadata),
    abandonedTasks: (state.abandonedTasks || []).map(withTaskMetadata),
  },
  fitness: pick(state, DOMAIN_KEYS.fitness),
  rituals: {
    ...pick(state, DOMAIN_KEYS.rituals),
    rituals: (state.rituals || []).map(item => ({
      ...item,
      ritualUuid: item.ritualUuid || item.id,
    })),
    completionEvents: state.ritualCompletionEvents || [],
  },
  inventory: {
    ...pick(state, DOMAIN_KEYS.inventory),
    collectedArtifacts: (state.collectedArtifacts || []).map(withArtifactMetadata),
  },
  settings: {
    ...pick(state, DOMAIN_KEYS.settings),
    updatedAt: new Date().toISOString(),
    deviceUuid: getDeviceUuid(),
  },
});

export const combineDomainState = profile => {
  const domains = [
    profile?.operations_state,
    profile?.fitness_state,
    profile?.rituals_state,
    profile?.inventory_state,
    profile?.statistics_state,
    profile?.settings_state,
  ].filter(value => value && typeof value === 'object');
  if (domains.length === 0) return profile?.state || null;
  return Object.assign({}, profile?.state || {}, ...domains);
};

export const syncDomain = async (domain, payload) => {
  const { data, error } = await supabase.rpc('sync_warscythe_domain', {
    p_domain: domain,
    p_payload: payload,
  });
  if (error) throw error;
  return data;
};

export const recordProgressionEvents = async events => {
  let latestStatistics = null;
  const confirmed = [];
  for (const event of events || []) {
    const { data, error } = await supabase.rpc('record_warscythe_progression_event', {
      p_event: event,
    });
    if (error) throw error;
    confirmed.push(event.eventUuid);
    latestStatistics = data?.statistics || latestStatistics;
  }
  return { confirmed, statistics: latestStatistics };
};

export const createProgressionEvent = ({
  eventType,
  sourceUuid,
  xpAwarded = 0,
  coinsAwarded = 0,
  metadata = {},
}) => ({
  eventUuid: uuid(),
  eventType,
  sourceUuid,
  xpAwarded,
  coinsAwarded,
  occurredAt: new Date().toISOString(),
  deviceUuid: getDeviceUuid(),
  deviceSequence: nextDeviceSequence(),
  metadata,
  syncStatus: 'pending',
});

export const isSyncV2Unavailable = error => (
  error?.code === 'PGRST202'
  || error?.code === '42703'
  || error?.message?.includes('sync_warscythe_domain')
  || error?.message?.includes('operations_state')
);
