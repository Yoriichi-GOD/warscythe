import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { ph } from '../lib/ph';
import { triggerHaptics, scheduleStreakAlert, scheduleRitualReminders, cancelRitualReminders, scheduleOperationReminders, cancelOperationReminders } from '../utils/nativeTriggers';
import { Capacitor } from '@capacitor/core';
import { getAssetUrl, BUNDLE_CONFIG } from '../utils/assetResolver';
import {
  REGIONS, TITLES, BASE_ARTIFACTS,
  EFFORT_MULT, TASKS_PER_LEVEL, MAX_TASKS, POINTS_BASE
} from './constants';
import { REGIONAL_CHRONICLES } from './regionalLore';
import { applyArtifactLore } from '../data/artifactLore';
import {
  combineDomainState,
  createDomainPayloads,
  createProgressionEvent,
  getDomainsForFields,
  getDeviceUuid,
  isSyncV2Unavailable,
  nextDeviceSequence,
  recordProgressionEvents,
  syncDomain,
} from './syncV2';
import { deriveDailyScytheLevel } from './scytheProgression';
import {
  deriveOfflineLevelUpCeremonies,
  uniqueRegionalProgressionEvents,
} from './progressionProjection';

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
export const localDateKey = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const todayKey = () => localDateKey();
const getDailyScytheProgress = (state, additions = {}) => {
  const today = todayKey();
  const completedOperations = (state.completedTasks || []).filter(task =>
    !task.isTutorialTask
    && task.category !== 'LEGION'
    && !task.isLegionTask
    && localDateKey(task.completedAt) === today
  ).length + (additions.operations || 0);

  const ritualKeys = new Set(
    (state.ritualCompletionEvents || [])
      .filter(event => event.date === today || localDateKey(event.occurredAt) === today)
      .map(event => event.ritualUuid || event.eventUuid || event.id)
  );
  const completedRituals = ritualKeys.size + (additions.rituals || 0);
  const totalActions = completedOperations + completedRituals;

  return {
    level: deriveDailyScytheLevel({ operations: completedOperations, rituals: completedRituals }),
    completedOperations,
    completedRituals,
    totalActions,
  };
};
const getWeekStart = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diff));
  return localDateKey(mon);
};

const getProgressionTitle = level => (
  level <= TITLES.length
    ? TITLES[level - 1]
    : `${TITLES[TITLES.length - 1]} ${level - TITLES.length + 1}`
);

const buildLevelUpPatch = (current, ceremonies, { provisional = false } = {}) => {
  const celebrated = new Set(current.celebratedProgressionEventUuids || []);
  const additions = (ceremonies || []).filter(ceremony => {
    if (!ceremony?.eventUuid || celebrated.has(ceremony.eventUuid)) return false;
    celebrated.add(ceremony.eventUuid);
    return true;
  });
  if (additions.length === 0) return {};

  let unlockedTitles = [...(current.unlockedTitles || ['Recruit'])];
  let rescuedFairies = { ...(current.rescuedFairies || {}) };
  let currentTitle = current.currentTitle;

  const normalized = additions.map(ceremony => {
    const newTitle = getProgressionTitle(ceremony.newLevel);
    const previousTitle = getProgressionTitle(ceremony.previousLevel);
    if (!unlockedTitles.includes(newTitle)) unlockedTitles.push(newTitle);
    if (currentTitle === previousTitle || currentTitle === 'Recruit') currentTitle = newTitle;
    if (!rescuedFairies[ceremony.previousLevel - 1]) {
      rescuedFairies[ceremony.previousLevel - 1] = {
        date: new Date().toISOString(),
        taskTitle: ceremony.taskTitle,
        taskCategory: ceremony.taskCategory,
      };
    }
    return { ...ceremony, newTitle, provisional };
  });

  const hasActiveCeremony = !!current.pendingLevelUp || !!current.pendingVictoryScreen;
  const queue = [...(current.queuedLevelUpCeremonies || []), ...normalized];
  const active = hasActiveCeremony ? null : queue.shift();

  return {
    level: Math.max(Number(current.level) || 1, ...normalized.map(item => item.newLevel)),
    currentTitle,
    unlockedTitles,
    rescuedFairies,
    celebratedProgressionEventUuids: Array.from(celebrated).slice(-100),
    queuedLevelUpCeremonies: queue,
    ...(active ? {
      pendingLevelUp: {
        eventUuid: active.eventUuid,
        regionIdx: active.newLevel - 1,
        newLevel: active.newLevel,
        newTitle: active.newTitle,
        provisional: active.provisional,
      },
      pendingVictoryScreen: {
        eventUuid: active.eventUuid,
        regionIdx: active.previousLevel - 1,
        mapIndex: ((active.previousLevel - 1) % 10) + 1,
        taskTitle: active.taskTitle,
        provisional: active.provisional,
      },
    } : {}),
  };
};

const getRedirectUrl = () => {
  if (Capacitor.isNativePlatform()) {
    return 'warscythe://login-callback';
  }
  return window.location.origin;
};

let isSyncingFromServer = false;
let hasFetchedInitialState = false;
let lastState = null;
const domainSyncQueues = new Map();
let socialFetchPromise = null;
let leaderboardEventWritesDisabled = false;
const SOCIAL_CACHE_TTL_MS = 60_000;
const socialFetchedAt = {
  friends: 0,
  leaderboard: 0,
  legion: 0
};

const enqueueDomainSync = (domain, operation) => {
  const previous = domainSyncQueues.get(domain) || Promise.resolve();
  const queued = previous
    .catch(() => undefined)
    .then(operation);

  domainSyncQueues.set(domain, queued);
  const release = () => {
    if (domainSyncQueues.get(domain) === queued) {
      domainSyncQueues.delete(domain);
    }
  };
  queued.then(release, release);
  return queued;
};

const normalizeTask = (task) => {
  if (!task) return task;
  return {
    ...task,
    microSteps: task.microSteps ?? [],
    priority: task.priority ?? 'none',
    progress: task.progress ?? 0
  };
};

const mergeArraysById = (arrA = [], arrB = [], idKey = 'id', timeKey = 'updatedAt') => {
  const map = new Map();
  const parseDate = (d) => (d ? new Date(d).getTime() : 0);

  (arrA || []).forEach(item => {
    if (item && item[idKey]) {
      map.set(item[idKey], item);
    }
  });

  (arrB || []).forEach(item => {
    if (item && item[idKey]) {
      const existing = map.get(item[idKey]);
      if (existing) {
        const timeA = parseDate(existing[timeKey]);
        const timeB = parseDate(item[timeKey]);
        if (timeB > timeA) {
          map.set(item[idKey], item);
        }
      } else {
        map.set(item[idKey], item);
      }
    }
  });

  return Array.from(map.values());
};

const mergeState = (local, saved) => {
  if (!saved) return local;

  const parseDate = (d) => (d ? new Date(d).getTime() : 0);

  // Array Merging
  const completedTasks = mergeArraysById(local.completedTasks || [], saved.completedTasks || [], 'id', 'completedAt').map(normalizeTask);
  const abandonedTasks = mergeArraysById(local.abandonedTasks || [], saved.abandonedTasks || [], 'id', 'abandonedAt')
    .map(normalizeTask)
    .filter(at => !completedTasks.some(ct => ct.id === at.id));
  const tasks = mergeArraysById(local.tasks || [], saved.tasks || [], 'id', 'lastProgressUpdate')
    .filter(t => !completedTasks.some(ct => ct.id === t.id) && !abandonedTasks.some(at => at.id === t.id))
    .map(normalizeTask);
  const rituals = mergeArraysById(local.rituals || [], saved.rituals || [], 'id', 'updatedAt');
  const ritualCompletionEvents = mergeArraysById(
    (local.ritualCompletionEvents || []).map(event => ({
      ...event,
      id: event.id || `${event.ritualUuid}:${event.date || event.occurredAt?.slice(0, 10)}`,
    })),
    (saved.ritualCompletionEvents || saved.completionEvents || []).map(event => ({
      ...event,
      id: event.id || `${event.ritualUuid}:${event.date || event.occurredAt?.slice(0, 10)}`,
    })),
    'id',
    'occurredAt'
  );
  const gymLog = mergeArraysById(local.gymLog || [], saved.gymLog || [], 'id', 'date');
  const normalizeArtifact = artifact => ({
    ...applyArtifactLore(artifact),
    rewardEventId: artifact.rewardEventId || artifact.eventUuid || `${artifact.name || 'artifact'}:${artifact.date || 'legacy'}`,
  });
  const collectedArtifacts = mergeArraysById(
    (local.collectedArtifacts || []).map(normalizeArtifact),
    (saved.collectedArtifacts || []).map(normalizeArtifact),
    'rewardEventId',
    'date'
  );

  // Primatives / Metrics
  const xp = Math.max(local.xp || 0, saved.xp || 0);
  const level = Math.max(local.level || 1, saved.level || 1);
  const streakCount = Math.max(local.streakCount || 0, saved.streakCount || 0);
  const coins = Math.max(local.coins || 0, saved.coins || 0);
  const bossKills = Math.max(local.bossKills || 0, saved.bossKills || 0);
  const dailyPoints = Math.max(local.dailyPoints || 0, saved.dailyPoints || 0);
  const executionScore = Math.max(local.executionScore || 0, saved.executionScore || 0);
  const totalCompletions = Math.max(local.totalCompletions || 0, saved.totalCompletions || 0);
  const currentLevelProgress = Math.max(local.currentLevelProgress || 0, saved.currentLevelProgress || 0);

  // Notes
  const notes = local.notes !== saved.notes
    ? ((local.notes || '').length >= (saved.notes || '').length ? local.notes : saved.notes)
    : local.notes;

  // Unlocked Scythes (Union)
  const unlockedScythes = Array.from(new Set([
    ...(local.unlockedScythes || ['neophyte']),
    ...(saved.unlockedScythes || ['neophyte'])
  ]));

  // Unlocked Themes (Union)
  const unlockedThemes = Array.from(new Set([
    ...(local.unlockedThemes || ['default']),
    ...(saved.unlockedThemes || ['default'])
  ]));

  const activeScytheSkin = (local.activeScytheSkin && local.activeScytheSkin !== 'default')
    ? local.activeScytheSkin
    : (saved.activeScytheSkin || 'default');

  const activeTheme = (local.activeTheme && local.activeTheme !== 'default')
    ? local.activeTheme
    : (saved.activeTheme || 'default');

  const isMobileApp = typeof window !== 'undefined' && window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform();
  const downloadedRegions = isMobileApp
    ? Array.from(new Set([
      ...(local.downloadedRegions || []),
      ...(saved.downloadedRegions || [])
    ]))
    : [2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Daily Log
  const dailyLog = { ...(local.dailyLog || {}) };
  Object.entries(saved.dailyLog || {}).forEach(([date, savedVal]) => {
    const localVal = dailyLog[date];
    // Handle both legacy number format and current object format
    if (savedVal && typeof savedVal === 'object') {
      if (!localVal || typeof localVal !== 'object') {
        dailyLog[date] = savedVal;
      } else {
        dailyLog[date] = {
          completed: Math.max(localVal.completed || 0, savedVal.completed || 0),
          weight: Math.max(localVal.weight || 0, savedVal.weight || 0)
        };
      }
    } else if (typeof savedVal === 'number') {
      if (!localVal) dailyLog[date] = savedVal;
    }
  });

  // Unlocked Lore
  const unlockedLore = { ...(local.unlockedLore || {}) };
  if (saved.unlockedLore && typeof saved.unlockedLore === 'object') {
    Object.entries(saved.unlockedLore).forEach(([region, serverFrags]) => {
      const localFrags = unlockedLore[region] || [];
      if (serverFrags && typeof serverFrags.length === 'number') {
        if (serverFrags.length > localFrags.length) {
          unlockedLore[region] = serverFrags;
        }
      }
    });
  }

  // Active Workout
  let activeWorkout = local.activeWorkout;
  if (saved.activeWorkout && typeof saved.activeWorkout === 'object') {
    if (!activeWorkout) {
      activeWorkout = saved.activeWorkout;
    } else {
      const timeLocal = parseDate(activeWorkout.date);
      const timeServer = parseDate(saved.activeWorkout.date);
      if (timeServer > timeLocal) {
        activeWorkout = saved.activeWorkout;
      }
    }
  }

  // Scythe Level
  const scytheLevels = ["DORMANT", "AWAKENED", "HARDENED", "REFINED", "ASCENDED", "PLATINUM"];
  const levelLocal = scytheLevels.indexOf(local.scytheLevel || "DORMANT");
  const levelServer = scytheLevels.indexOf(saved.scytheLevel || "DORMANT");
  let scytheLevel;
  if (parseDate(local.lastResetDate) > parseDate(saved.lastResetDate)) {
    scytheLevel = local.scytheLevel || "DORMANT";
  } else if (parseDate(saved.lastResetDate) > parseDate(local.lastResetDate)) {
    scytheLevel = saved.scytheLevel || "DORMANT";
  } else {
    scytheLevel = scytheLevels[Math.max(levelLocal, levelServer)];
  }

  // Simple Flags
  const scytheMigrationDone = !!(local.scytheMigrationDone || saved.scytheMigrationDone);
  const hasCompletedTutorial = !!(
    local.hasCompletedTutorial ||
    saved.hasCompletedTutorial ||
    (local.completedTasks && local.completedTasks.length > 0) ||
    (saved.completedTasks && saved.completedTasks.length > 0) ||
    (local.totalCompletions && local.totalCompletions > 0) ||
    (saved.totalCompletions && saved.totalCompletions > 0) ||
    (local.level && local.level > 1) ||
    (saved.level && saved.level > 1) ||
    local.firstTaskCompleted ||
    saved.firstTaskCompleted
  );
  const tutorialStep = hasCompletedTutorial ? 'completed' : (local.tutorialStep || saved.tutorialStep || 'task_creation');
  const firstTaskCompleted = !!(local.firstTaskCompleted || saved.firstTaskCompleted);
  const hasSeenMapGuide = !!(local.hasSeenMapGuide || saved.hasSeenMapGuide);
  const hasSeenLedgerGuide = !!(local.hasSeenLedgerGuide || saved.hasSeenLedgerGuide);
  const hasSeenForgeGuide = !!(local.hasSeenForgeGuide || saved.hasSeenForgeGuide);
  const hasSeenRitualsGuide = !!(local.hasSeenRitualsGuide || saved.hasSeenRitualsGuide);
  const hasSeenFitnessPeek = !!(local.hasSeenFitnessPeek || saved.hasSeenFitnessPeek);
  const onboardingProgress = Math.max(local.onboardingProgress || 0, saved.onboardingProgress || 0);
  const onboardingActive = saved.onboardingActive !== undefined 
    ? saved.onboardingActive 
    : (local.onboardingActive !== undefined ? local.onboardingActive : (onboardingProgress < 10));
  const unlockedTitles = Array.from(new Set([...(local.unlockedTitles || ['Recruit']), ...(saved.unlockedTitles || ['Recruit'])]));
  const pendingGuardianProgress = local.pendingGuardianProgress !== undefined ? (local.pendingGuardianProgress || saved.pendingGuardianProgress) : (saved.pendingGuardianProgress || null);
  const lastActiveDate = parseDate(local.lastActiveDate) >= parseDate(saved.lastActiveDate)
    ? local.lastActiveDate
    : saved.lastActiveDate;
  const lastResetDate = parseDate(local.lastResetDate) >= parseDate(saved.lastResetDate)
    ? local.lastResetDate
    : saved.lastResetDate;

  // Rescued Fairies
  const rescuedFairies = { ...(local.rescuedFairies || {}) };
  Object.entries(saved.rescuedFairies || {}).forEach(([region, data]) => {
    if (!rescuedFairies[region]) {
      rescuedFairies[region] = data;
    }
  });

  return {
    tasks,
    rituals,
    ritualCompletionEvents,
    completedTasks,
    abandonedTasks,
    gymLog,
    collectedArtifacts,
    xp,
    level,
    streakCount,
    coins,
    bossKills,
    dailyPoints,
    executionScore,
    totalCompletions,
    currentLevelProgress,
    notes,
    unlockedScythes,
    unlockedThemes,
    activeScytheSkin,
    activeTheme,
    downloadedRegions,
    dailyLog,
    unlockedLore,
    activeWorkout,
    scytheLevel,
    scytheMigrationDone,
    hasCompletedTutorial,
    tutorialStep,
    firstTaskCompleted,
    hasSeenMapGuide,
    hasSeenLedgerGuide,
    hasSeenForgeGuide,
    hasSeenRitualsGuide,
    hasSeenFitnessPeek,
    onboardingProgress,
    onboardingActive,
    unlockedTitles,
    pendingGuardianProgress,
    lastActiveDate,
    lastResetDate,
    rescuedFairies,
    soundscapeEnabled: saved.soundscapeEnabled !== undefined ? saved.soundscapeEnabled : (local.soundscapeEnabled !== undefined ? local.soundscapeEnabled : false),
    soundscapeVolume: saved.soundscapeVolume !== undefined ? saved.soundscapeVolume : (local.soundscapeVolume !== undefined ? local.soundscapeVolume : 70)
  };
};

const getProceduralRegion = (idx) => {
  if (idx < REGIONS.length) return REGIONS[idx];
  const prefixes = ['Shadow', 'Iron', 'Storm', 'Void', 'Crimson', 'Eternal', 'Dark', 'Ancient', 'Lost', 'Burning'];
  const suffixes = ['Reach', 'Wastes', 'Sanctum', 'Dominion', 'Frontier', 'Depths', 'Crown', 'Spire', 'Gate', 'Throne'];
  const icons = ['🌑', '⚔️', '🔱', '💀', '🌋', '🏴', '🗡️', '🛡️', '⚡', '👁️'];
  const p = prefixes[idx % prefixes.length];
  const s = suffixes[Math.floor(idx / prefixes.length) % suffixes.length];
  return {
    name: `${p} ${s}`,
    icon: icons[idx % icons.length],
    desc: `An uncharted territory beyond the known maps. Level ${idx + 1} awaits.`
  };
};

export const getLore = (regionIdx) => {
  if (regionIdx < REGIONAL_CHRONICLES.length) return REGIONAL_CHRONICLES[regionIdx];
  const r = getProceduralRegion(regionIdx);
  return Array.from({ length: 10 }, (_, i) => {
    const templates = [
      `The ${r.name} reveals its ${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} secret.`,
      `Step ${i + 1}: Another fragment of ${r.name} falls into place.`,
      `The path through ${r.name} grows clearer with each conquest.`,
      `Fragment ${i + 1} glows — ${r.name} acknowledges your persistence.`,
      `A voice whispers from ${r.name}: "You are ${(i + 1) * 10}% worthy."`,
    ];
    return templates[i % templates.length];
  });
};

const rollReward = (isBoss = false) => {
  const r = Math.random();
  let rarity, bonusPts;
  if (isBoss) {
    if (r < 0.25) { rarity = 'mythic'; bonusPts = 500 + Math.floor(Math.random() * 300); }
    else { rarity = 'epic'; bonusPts = 300 + Math.floor(Math.random() * 200); }
  } else {
    if (r < 0.01) { rarity = 'mythic'; bonusPts = 500 + Math.floor(Math.random() * 300); }
    else if (r < 0.05) { rarity = 'epic'; bonusPts = 300 + Math.floor(Math.random() * 200); }
    else if (r < 0.15) { rarity = 'rare'; bonusPts = 150 + Math.floor(Math.random() * 100); }
    else if (r < 0.40) { rarity = 'uncommon'; bonusPts = 75 + Math.floor(Math.random() * 75); }
    else { rarity = 'common'; bonusPts = 25 + Math.floor(Math.random() * 50); }
  }
  const baseArtifact = BASE_ARTIFACTS[Math.floor(Math.random() * BASE_ARTIFACTS.length)];
  const artifact = { ...baseArtifact, rarity };
  return { rarity, artifact, bonusPts };
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

let storeSet = null;

export const useWarscytheStore = create(
  persist(
    (set, get) => {
      storeSet = set;
      return {
      tasks: [],
      rituals: [],
      completedTasks: [],
      abandonedTasks: [],
      executionScore: 0,
      dailyLog: {},
      notes: '',
      level: 1,
      totalCompletions: 0,
      currentLevelProgress: 0,
      collectedArtifacts: [],
      unlockedLore: {},
      currentTitle: 'Recruit',
      pendingReward: null,
      pendingTitleUnlock: null,
      pendingLevelUp: null,
      activeBossFlash: null,
      consecutiveLow: 0,
      closerDismissed: false,
      isFocusMode: false,
      focusedTaskId: null,
      streakCount: 0,
      xp: 0,
      scytheLevel: "DORMANT",
      lastActiveDate: null,
      bossKills: 0,
      unlockedScythes: ['neophyte'],
      unlockedThemes: ['default'],
      activeScytheSkin: 'default',
      activeTheme: 'default',
      downloadedRegions: (typeof window !== 'undefined' && window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) ? [] : ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'cosmic_harvester', 'hellfire_reaper', 'soul_eater_prime', 'abyssal_leviathan', 'ares_devastator', 'shadow_blade', 'golden_harvester', 'cinder_reaper', 'frost_cleaver', 'storm_caller', 'shiva', 'lava', 'legion_core', 'deity_hermes', 'deity_apollo', 'deity_ares', 'deity_hercules', 'deity_zeus', 'artifacts_all', 'nodes_all'],
      scytheMigrationDone: false,
      coins: 0,
      gymLog: [],
      activeWorkout: null,
      ritualCompletionEvents: [],
      pendingProgressionEvents: [],
      confirmedProgressionLevel: 1,
      confirmedProgressionCompletions: 0,
      confirmedProgressionInitialized: false,
      celebratedProgressionEventUuids: [],
      queuedLevelUpCeremonies: [],
      isNetworkConnected: typeof navigator === 'undefined' ? true : navigator.onLine,
      hasCompletedTutorial: false,
      tutorialStep: 'task_creation',
      firstTaskCompleted: false,
      hasSeenMapGuide: false,
      hasSeenLedgerGuide: false,
      hasSeenForgeGuide: false,
      hasSeenRitualsGuide: false,
      hasSeenFitnessPeek: false,
      onboardingProgress: 0,
      onboardingActive: true,
      unlockedTitles: ['Recruit'],
      pendingGuardianProgress: null,
      postGuardianTutorial: null,
      dailyPoints: 0,
      lastResetDate: null,
      syncStatus: 'synced',
      hasPendingChanges: false,
      isMerging: false,
      storeHydrated: false,
      authResolved: false,
      profileResolved: false,
      user: null,
      isAdFree: false,
      showResetPasswordModal: false,
      rescuedFairies: {},
      pendingVictoryScreen: null,
      receivedProphecies: [],
      soundscapeEnabled: false,
      soundscapeVolume: 70,
      friendships: [],
      leaderboard: [],
      leaderboardEvents: [],
      activeLegion: null,
      legionMembers: [],
      legionOperations: [],
      legionSubtasks: [],
      legionEvents: [],
      username: null,
      referralSource: null,
      showInfoModal: false,
      infoSectionId: null,
      infoFeatureId: null,
      showVideoModal: false,
      videoKey: null,
      guideBannerDismissed: typeof window !== 'undefined' && localStorage.getItem('warscythe_guide_banner_dismissed') === 'true',

      openVideoModal: (key) => set({
        showVideoModal: true,
        videoKey: key
      }),
      closeVideoModal: () => set({
        showVideoModal: false,
        videoKey: null
      }),
      dismissGuideBanner: () => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('warscythe_guide_banner_dismissed', 'true');
        }
        set({ guideBannerDismissed: true });
      },
      equipTitle: (title) => {
        set({ currentTitle: title });
      },
      unlockTitle: (title) => {
        set(state => {
          const unlockedTitles = Array.from(new Set([...state.unlockedTitles, title]));
          return { unlockedTitles };
        });
      },
      setOnboardingProgress: (val) => {
        set({ onboardingProgress: val });
      },
      setOnboardingActive: (val) => {
        set({ onboardingActive: val });
      },
      clearPendingGuardian: () => {
        set({ pendingGuardianProgress: null });
      },
      setPostGuardianTutorial: (val) => set({ postGuardianTutorial: val }),
      clearPostGuardianTutorial: () => set({ postGuardianTutorial: null }),
      incrementOnboarding: () => {
        set(state => {
          const newProgress = state.onboardingProgress + 1;
          const unlockedTitles = [...state.unlockedTitles];
          
          if (newProgress === 5 && !unlockedTitles.includes("Curious Explorer")) {
            unlockedTitles.push("Curious Explorer");
          }
          if (newProgress === 10 && !unlockedTitles.includes("Seasoned Wanderer")) {
            unlockedTitles.push("Seasoned Wanderer");
          }
          
          const onboardingActive = newProgress < 10;
          const hasCompletedTutorial = newProgress >= 10 ? true : state.hasCompletedTutorial;
          const tutorialStep = newProgress >= 10 ? 'completed' : state.tutorialStep;
          
          return {
            onboardingProgress: newProgress,
            onboardingActive,
            unlockedTitles,
            hasCompletedTutorial,
            tutorialStep
          };
        });
      },

      openInfoModal: (sectionId, featureId = null) => set({
        showInfoModal: true,
        infoSectionId: sectionId,
        infoFeatureId: featureId
      }),
      closeInfoModal: () => set({
        showInfoModal: false,
        infoSectionId: null,
        infoFeatureId: null
      }),
      setInfoFeatureId: (featureId) => set({
        infoFeatureId: featureId
      }),

      // Auth & Sync
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        set({ user: data.user, authResolved: true, profileResolved: false });
        ph.identify(data.user.id, { email });
        ph.capture('warscythe_sign_in');

        // Load state from profiles
        await get().fetchUserState(data.user.id);
      },

      signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getRedirectUrl()
          }
        });
        if (error) throw error;

        // If email confirmation is enabled, session is null, so we DO NOT log them in.
        // If email confirmation is disabled, session is populated, so we log them in.
        if (data.session) {
          set({ user: data.user, authResolved: true, profileResolved: false });
          ph.identify(data.user.id, { email });
          await get().fetchUserState(data.user.id);
        }
        ph.capture('warscythe_sign_up');
      },

      sendPasswordResetEmail: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: getRedirectUrl()
        });
        if (error) throw error;
      },

      updatePassword: async (newPassword) => {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (error) throw error;
      },

      sendPhoneOtp: async (phone) => {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phone
        });
        if (error) throw error;
      },

      verifyPhoneOtp: async (phone, token) => {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: phone,
          token: token,
          type: 'sms'
        });
        if (error) throw error;
        if (data.user) {
          set({ user: data.user, authResolved: true, profileResolved: false });
          ph.identify(data.user.id, { phone });
          ph.capture('warscythe_otp_sign_in');
          await get().fetchUserState(data.user.id);
        }
      },

      signInWithProvider: async (provider) => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: getRedirectUrl()
          }
        });
        if (error) throw error;
      },

      deleteAccount: async () => {
        const u = get().user?.id;
        if (!u) return;

        try {
          const { error } = await supabase.rpc('delete_user_account');
          if (error) console.error('RPC delete account failed:', error.message);
        } catch (err) {
          console.error('RPC delete account exception:', err);
        }

        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.warn('Supabase signOut failed during account deletion:', err);
        }

        get().clearClientState();
        ph.capture('warscythe_delete_account');
      },

      clearClientState: () => {
        set({
          user: null,
          isAdFree: false,
          tasks: [],
          rituals: [],
          completedTasks: [],
          abandonedTasks: [],
          executionScore: 0,
          dailyLog: {},
          notes: '',
          level: 1,
          totalCompletions: 0,
          currentLevelProgress: 0,
          collectedArtifacts: [],
          unlockedLore: {},
          currentTitle: 'Recruit',
          pendingReward: null,
          pendingTitleUnlock: null,
          pendingLevelUp: null,
          activeBossFlash: null,
          consecutiveLow: 0,
          closerDismissed: false,
          isFocusMode: false,
          focusedTaskId: null,
          streakCount: 0,
          xp: 0,
          scytheLevel: "DORMANT",
          lastActiveDate: null,
          bossKills: 0,
          unlockedScythes: ['neophyte'],
          unlockedThemes: ['default'],
          activeScytheSkin: 'default',
          activeTheme: 'default',
          downloadedRegions: (typeof window !== 'undefined' && window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) ? [] : ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'cosmic_harvester', 'hellfire_reaper', 'soul_eater_prime', 'abyssal_leviathan', 'ares_devastator', 'shadow_blade', 'golden_harvester', 'cinder_reaper', 'frost_cleaver', 'storm_caller', 'shiva', 'lava', 'legion_core', 'deity_hermes', 'deity_apollo', 'deity_ares', 'deity_hercules', 'deity_zeus', 'artifacts_all', 'nodes_all'],
          scytheMigrationDone: false,
          coins: 0,
          gymLog: [],
          activeWorkout: null,
          ritualCompletionEvents: [],
          pendingProgressionEvents: [],
          confirmedProgressionLevel: 1,
          confirmedProgressionCompletions: 0,
          confirmedProgressionInitialized: false,
          celebratedProgressionEventUuids: [],
          queuedLevelUpCeremonies: [],
          isNetworkConnected: typeof navigator === 'undefined' ? true : navigator.onLine,
          hasCompletedTutorial: false,
          tutorialStep: 'task_creation',
          firstTaskCompleted: false,
          hasSeenMapGuide: false,
          hasSeenLedgerGuide: false,
          hasSeenForgeGuide: false,
          hasSeenRitualsGuide: false,
          hasSeenFitnessPeek: false,
          dailyPoints: 0,
          lastResetDate: null,
          syncStatus: 'synced',
          hasPendingChanges: false,
          isMerging: false,
          showVideoModal: false,
          videoKey: null,
          rescuedFairies: {},
          pendingVictoryScreen: null,
          receivedProphecies: [],
        });
      },

      signOut: async () => {
        supabase.auth.signOut().catch((err) => {
          console.warn('Supabase signOut failed in background, cleared local state anyway:', err);
        });
        get().clearClientState();
        ph.capture('warscythe_sign_out');
      },

      checkEntitlement: async () => {
        const u = get().user?.id;
        if (!u) return;
        try {
          const { data, error } = await supabase
            .from('user_entitlements')
            .select('is_ad_free')
            .eq('user_id', u)
            .maybeSingle();
          if (!error && data) {
            set({ isAdFree: !!data.is_ad_free });
          } else {
            set({ isAdFree: false });
          }
        } catch (err) {
          console.warn('checkEntitlement failed:', err);
        }
      },

      initiateSubscription: async () => {
        const u = get().user;
        if (!u) {
          throw new Error('Please sign in or link your operative profile to continue.');
        }

        // 1. Call edge function to create subscription
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const session = (await supabase.auth.getSession()).data.session;
        const jwt = session?.access_token;
        if (!jwt) {
          throw new Error('Please sign in or link your operative profile to continue.');
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/create-subscription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
            'apikey': supabaseAnonKey
          }
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Premium upgrade failed with status ${response.status}`);
        }

        const data = await response.json();

        const subscription_id = data?.subscription_id;
        if (!subscription_id) {
          throw new Error('Invalid response from upgrade service.');
        }

        // 2. Load Razorpay script
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error('Failed to load payment portal script. Please check your internet connection.');
        }

        // 3. Open Razorpay checkout
        return new Promise((resolve, reject) => {
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SXn65yEl8EFyrc',
            subscription_id: subscription_id,
            name: 'Warscythe',
            description: 'Warscythe Ad-Free Subscription',
            image: '/command-core.png',
            theme: {
              color: '#ecc880'
            },
            prefill: {
              email: u.email || ''
            },
            handler: async function (res) {
              console.log('Payment Successful:', res);
              await get().checkEntitlement();
              resolve(res);
            },
            modal: {
              ondismiss: function () {
                reject(new Error('Payment window closed.'));
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        });
      },

      fetchUserState: async (userId) => {
        console.log(`[SYNC TRACE] fetchUserState started for user: ${userId}`);
        if (get().isMerging) {
          console.log(`[SYNC TRACE] fetchUserState aborted: isMerging is already true`);
          return;
        }
        set({ isMerging: true, profileResolved: false });
        try {
          isSyncingFromServer = true;
          
          let session = null;
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

          // Dynamically parse project ref from supabaseUrl
          let projectRef = 'yrxchjontmgkjaazrybh';
          if (supabaseUrl) {
            const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
            if (match) {
              projectRef = match[1];
            }
          }
          const storageKey = `sb-${projectRef}-auth-token`;
          const rawSession = localStorage.getItem(storageKey);

          if (rawSession) {
            try {
              const parsed = JSON.parse(rawSession);
              const now = Math.floor(Date.now() / 1000);
              if (parsed.expires_at > now) {
                session = parsed; // valid, use directly — skip the hanging getSession() call
                console.log('[LOAD TRACE] Using valid session parsed directly from localStorage');
              }
            } catch (e) {
              console.error('[AUTH] Failed to parse stored session:', e);
            }
          }

          // Fallback: if localStorage read failed or session looks expired, 
          // still try the real getSession() but under an 8s timeout race
          if (!session) {
            console.log('[LOAD TRACE] No valid session in localStorage, falling back to getSession...');
            const getSessionTimeout = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('getSession timed out')), 8000)
            );
            try {
              const result = await Promise.race([supabase.auth.getSession(), getSessionTimeout]);
              session = result?.data?.session ?? null;
            } catch (e) {
              console.error('[AUTH] getSession fallback failed or timed out:', e);
            }
          }

          const jwt = session?.access_token;
          if (!jwt) {
            throw new Error('No valid session token available');
          }

          console.log('[LOAD TRACE] fetchUserState: about to call profiles API directly...');
          
          // Direct fetch to bypass client-side library hangs/locks
          const fetchPromise = (async () => {
            const profileColumns = [
              'state',
              'username',
              'operations_state',
              'fitness_state',
              'rituals_state',
              'inventory_state',
              'statistics_state',
              'settings_state',
            ].join(',');
            let response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=${profileColumns}`, {
              method: 'GET',
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${jwt}`
              }
            });
            // A client can be deployed before the database migration reaches a
            // particular environment. Fall back to the legacy blob without
            // locking the user out of Warscythe.
            if (!response.ok && response.status === 400) {
              response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=state,username`, {
                method: 'GET',
                headers: {
                  'apikey': supabaseAnonKey,
                  'Authorization': `Bearer ${jwt}`
                }
              });
            }
            if (!response.ok) {
              const errBody = await response.text();
              throw new Error(`PostgREST error ${response.status}: ${errBody}`);
            }
            const arr = await response.json();
            if (arr.length === 0) {
              return { data: null, error: { code: 'PGRST116', message: 'Profile not found' } };
            }
            return { data: arr[0], error: null };
          })();

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Fetch request timed out after 8 seconds')), 8000)
          );

          const { data, error } = await Promise.race([
            fetchPromise,
            timeoutPromise
          ]);

          console.log('[LOAD TRACE] fetchUserState: call returned', { data, error });

          if (error) {
            // If no profile row exists, create one with the current store state
            if (error.code === 'PGRST116') {
              console.log(`[SYNC TRACE] fetchUserState: no profile found. Creating a new one...`);
              isSyncingFromServer = false;
              await get().saveUserState(userId);
            } else {
              console.error('Error fetching user state:', error.message);
            }
          } else if (data && (data.state || data.operations_state)) {
            console.log(`[SYNC TRACE] fetchUserState: profile state found. Merging...`);
            const saved = combineDomainState(data);
            const merged = mergeState(get(), saved);
            const serverLevel = Number(data.statistics_state?.level ?? saved?.level ?? merged.level) || 1;
            const serverCompletions = Number(
              data.statistics_state?.totalCompletions
              ?? saved?.totalCompletions
              ?? merged.totalCompletions
            ) || 0;
            set({
              ...merged,
              confirmedProgressionLevel: serverLevel,
              confirmedProgressionCompletions: serverCompletions,
              confirmedProgressionInitialized: true,
              username: data.username || null,
              syncStatus: 'synced',
              hasPendingChanges: false
            });
            if (get().isNetworkConnected === false) {
              get().promotePendingOfflineLevelUps();
            }
            
            console.log(`[SYNC TRACE] fetchUserState: querying user_entitlements...`);
            // Fetch entitlements to update isAdFree via direct fetch
            try {
              const entRes = await fetch(`${supabaseUrl}/rest/v1/user_entitlements?user_id=eq.${userId}&select=is_ad_free`, {
                method: 'GET',
                headers: {
                  'apikey': supabaseAnonKey,
                  'Authorization': `Bearer ${jwt}`
                }
              });
              const entArr = entRes.ok ? await entRes.json() : [];
              const entData = entArr.length > 0 ? entArr[0] : null;
              if (entData) {
                set({ isAdFree: !!entData.is_ad_free });
              } else {
                set({ isAdFree: false });
              }
            } catch (entErr) {
              console.warn('Failed to fetch user entitlements:', entErr);
            }

            console.log(`[SYNC TRACE] fetchUserState: querying user_unlocks...`);
            // Fetch unlocks from user_unlocks via direct fetch
            try {
              const unlocksRes = await fetch(`${supabaseUrl}/rest/v1/user_unlocks?user_id=eq.${userId}&select=item_id,item_type`, {
                method: 'GET',
                headers: {
                  'apikey': supabaseAnonKey,
                  'Authorization': `Bearer ${jwt}`
                }
              });
              const unlocksData = unlocksRes.ok ? await unlocksRes.json() : [];
              if (unlocksData && unlocksData.length > 0) {
                const dbScythes = unlocksData.filter(u => u.item_type === 'scythe').map(u => u.item_id);
                const dbThemes = unlocksData.filter(u => u.item_type === 'theme').map(u => u.item_id);

                set(state => ({
                  unlockedScythes: Array.from(new Set([...(state.unlockedScythes || ['neophyte']), ...dbScythes])),
                  unlockedThemes: Array.from(new Set([...(state.unlockedThemes || ['default']), ...dbThemes]))
                }));
              }
            } catch (unlocksErr) {
              console.warn('Failed to fetch user unlocks:', unlocksErr);
            }

            // Sync unlocked titles based on level if missing
            set(state => {
              const currentLvl = state.level || 1;
              const lvlTitles = [];
              for (let i = 1; i <= currentLvl; i++) {
                const titleForLvl = i <= TITLES.length ? TITLES[i - 1] : TITLES[TITLES.length - 1] + ' ' + (i - TITLES.length + 1);
                lvlTitles.push(titleForLvl);
              }
              const unlockedTitles = Array.from(new Set([...state.unlockedTitles, ...lvlTitles]));
              return { unlockedTitles };
            });

            // A successful hydration is read-only. The normal debounced sync will
            // persist the next genuine local mutation instead of echoing the entire
            // profile payload back on every login.
          } else {
            console.log(`[SYNC TRACE] fetchUserState: profile row exists but state is empty or null.`);
          }
        } catch (err) {
          console.error(`[SYNC TRACE] fetchUserState exception caught:`, err);
        } finally {
          isSyncingFromServer = false;
          set({ isMerging: false, profileResolved: true });
          console.log(`[SYNC TRACE] fetchUserState completed and isMerging reset to false.`);
        }
      },

      setupUsername: async (username) => {
        const u = get().user?.id;
        if (!u) return;

        const { data, error: checkErr } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .maybeSingle();

        if (data) {
          throw new Error('This Username is already taken.');
        }

        const { error: updateErr } = await supabase
          .from('profiles')
          .update({ username })
          .eq('id', u);

        if (updateErr) throw updateErr;

        set({ username });
      },

      saveUserState: async (userId, requestedDomains = null) => {
        if (import.meta.env.DEV && localStorage.getItem('warscythe_test_realm_active') === 'true') {
          set({ syncStatus: 'realm', hasPendingChanges: false });
          return;
        }
        const domains = requestedDomains?.length
          ? [...new Set(requestedDomains)]
          : ['operations', 'fitness', 'rituals', 'inventory', 'settings'];
        console.log(`[SYNC TRACE] saveUserState CALLED at ${performance.now().toFixed(1)}ms — domains=${domains.join(',')} — caller stack:`, new Error().stack);
        const u = userId || get().user?.id;
        if (!u) {
          console.error('[Warscythe Sync Debug] saveUserState returned early: no user ID');
          return;
        }

        if (!hasFetchedInitialState && !isSyncingFromServer) {
          console.warn('[SYNC] Blocked saveUserState - initial load not completed');
          return;
        }

        // Each domain has its own single-flight queue. Unrelated domains can
        // upload concurrently without blocking or overwriting one another.
        const watchdogTimeout = setTimeout(() => {
          if (useWarscytheStore.getState().syncStatus === 'pending') {
            console.error('[Warscythe Sync Debug] Watchdog triggered: forcing syncStatus to failed.');
            useWarscytheStore.setState({ syncStatus: 'failed' });
          }
        }, 10000); // 10 second safety watchdog

        // 3. Sync V2 domain merge with a legacy fallback during migration rollout.
        const performUpsert = async (retryOn401 = true) => {
          const state = get();
          const allDomainPayloads = createDomainPayloads(state);
          const domainPayloads = Object.fromEntries(
            Object.entries(allDomainPayloads).filter(([domain]) => domains.includes(domain))
          );
          const statisticsPayload = Object.fromEntries([
            'xp', 'level', 'streakCount', 'coins', 'bossKills', 'dailyPoints',
            'executionScore', 'totalCompletions', 'currentLevelProgress',
            'scytheLevel', 'weeklyPoints',
          ].map(key => [key, state[key]]));
          const legacyPayload = Object.assign(
            {},
            allDomainPayloads.operations,
            allDomainPayloads.fitness,
            allDomainPayloads.rituals,
            allDomainPayloads.inventory,
            allDomainPayloads.settings,
            statisticsPayload,
          );

          const syncPromise = (async () => {
            try {
              let authoritativeStatistics = null;
              const pendingEvents = state.pendingProgressionEvents || [];
              if (pendingEvents.length > 0) {
                const progression = await enqueueDomainSync(
                  'progression',
                  () => recordProgressionEvents(pendingEvents)
                );
                authoritativeStatistics = progression.statistics;
                const confirmedLevelUps = [];
                let comparisonLevel = state.confirmedProgressionInitialized
                  ? Number(state.confirmedProgressionLevel) || 1
                  : Number(state.level) || 1;
                for (const result of progression.results || []) {
                  const resultLevel = Number(result.statistics?.level) || comparisonLevel;
                  if (
                    result.accepted
                    && result.event?.eventType === 'operation_completed'
                    && result.event?.metadata?.countsForProgression !== false
                    && resultLevel > comparisonLevel
                  ) {
                    confirmedLevelUps.push({
                      previousLevel: comparisonLevel,
                      newLevel: resultLevel,
                      event: result.event,
                    });
                  }
                  comparisonLevel = Math.max(comparisonLevel, resultLevel);
                }

                set(current => {
                  const remainingEvents = (current.pendingProgressionEvents || [])
                    .filter(event => !progression.confirmed.includes(event.eventUuid));
                  const celebrated = new Set(current.celebratedProgressionEventUuids || []);
                  const hasCelebratedRemainingEvent = uniqueRegionalProgressionEvents(remainingEvents)
                    .some(event => celebrated.has(event.eventUuid));
                  const authoritativeLevel = Number(authoritativeStatistics?.level);
                  const authoritativeCompletions = Number(authoritativeStatistics?.totalCompletions);
                  const next = {
                    pendingProgressionEvents: remainingEvents,
                    ...(authoritativeStatistics || {}),
                    confirmedProgressionLevel: Number.isFinite(authoritativeLevel)
                      ? authoritativeLevel
                      : current.confirmedProgressionLevel,
                    confirmedProgressionCompletions: Number.isFinite(authoritativeCompletions)
                      ? authoritativeCompletions
                      : current.confirmedProgressionCompletions,
                    confirmedProgressionInitialized: !!authoritativeStatistics
                      || current.confirmedProgressionInitialized,
                    ...(hasCelebratedRemainingEvent ? {
                      level: Math.max(authoritativeLevel || 1, Number(current.level) || 1),
                      totalCompletions: Math.max(
                        authoritativeCompletions || 0,
                        Number(current.totalCompletions) || 0
                      ),
                      currentLevelProgress: current.currentLevelProgress,
                    } : {}),
                  };

                  if (confirmedLevelUps.length === 0) return next;
                  return {
                    ...next,
                    ...buildLevelUpPatch(
                      current,
                      confirmedLevelUps.map(({ previousLevel, newLevel, event }) => ({
                        eventUuid: event.eventUuid,
                        previousLevel,
                        newLevel,
                        taskTitle: event.metadata?.taskTitle || 'A conquered Operation',
                        taskCategory: event.metadata?.taskCategory || 'General',
                      }))
                    ),
                  };
                });

                for (const confirmedLevelUp of confirmedLevelUps) {
                  get().recordWeeklyEvent(
                    'empress_liberated',
                    `Liberated the regional Empress at Level ${confirmedLevelUp.newLevel}`
                  );
                  ph.capture('level_up_confirmed', {
                    previous_level: confirmedLevelUp.previousLevel,
                    new_level: confirmedLevelUp.newLevel,
                  });
                }
              }

              await Promise.all(
                Object.entries(domainPayloads).map(([domain, payload]) => (
                  enqueueDomainSync(domain, () => syncDomain(domain, payload))
                ))
              );
              return { error: null, mode: 'v2' };
            } catch (error) {
              if (!isSyncV2Unavailable(error)) throw error;
              console.warn('[SYNC V2] Migration is not installed in this environment; using the legacy profile blob.');
              const { error: legacyError } = await supabase.from('profiles').upsert({
                id: u,
                state: legacyPayload,
                updated_at: new Date().toISOString(),
              });
              return { error: legacyError, mode: 'legacy' };
            }
          })();

          // 8 second timeout promise
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Sync request timed out after 8 seconds')), 8000);
          });

          const { error } = await Promise.race([syncPromise, timeoutPromise]);

          if (error) {
            // Check for 401 Unauthorized / stale token error
            const is401 = error.status === 401 || error.code === '401' || error.message?.includes('JWT') || error.message?.includes('expired');
            if (is401 && retryOn401) {
              console.warn('[Warscythe Sync Debug] Stale token (401) detected. Forcing manual session refresh...');
              const { error: refreshError } = await supabase.auth.refreshSession();
              if (!refreshError) {
                console.log('[Warscythe Sync Debug] Session refreshed successfully. Retrying upsert...');
                return await performUpsert(false); // Retry exactly once
              } else {
                console.error('[Warscythe Sync Debug] Session refresh failed:', refreshError.message);
              }
            }
            throw error;
          }
        };

        console.error('[Warscythe Sync Debug] saveUserState started for user:', u);
        set({ syncStatus: 'pending' });

        try {
          await performUpsert(true);
          clearTimeout(watchdogTimeout);
          console.error('[Warscythe Sync Debug] Save query successful!');
          set({ syncStatus: 'synced', hasPendingChanges: false });
        } catch (err) {
          clearTimeout(watchdogTimeout);
          console.error('[Warscythe Sync Debug] Exception/failure during upsert execution:', err.message || err);
          set({ syncStatus: 'failed' });
          get().promotePendingOfflineLevelUps();
        }
      },

      forceSync: async () => {
        const u = get().user?.id;
        if (!u) return;

        if (!hasFetchedInitialState) {
          console.warn('[SYNC] Blocked forceSync - initial load not completed');
          return;
        }

        set({ syncStatus: 'pending' });
        try {
          if (saveTimeout) {
            clearTimeout(saveTimeout);
            saveTimeout = null;
          }
          await get().saveUserState(u);
        } catch (err) {
          console.error("Force sync failed:", err);
          set({ syncStatus: 'failed' });
        }
      },

      // Actions
      addTask: (title, category, effort, deadline, priority = 'none', subTasks = []) => {
        if (deadline) {
          const now = new Date();
          const target = new Date(deadline);
          const diffMs = target - now;
          const diffDays = diffMs / (1000 * 60 * 60 * 24);

          if (!Number.isFinite(target.getTime()) || diffMs <= 0) {
            return "The deadline must be later than the current time.";
          }
          if (effort === 'Medium' && diffDays < 3) {
            return "Medium effort tasks must have a minimum limit of 3 days.";
          }
          if (effort === 'High' && diffDays < 7) {
            return "High effort tasks must have a minimum limit of 7 days.";
          }
          if (effort === 'Boss' && diffDays < 14) {
            return "Boss Raid tasks must have a minimum limit of 14 days (2 weeks).";
          }
        }

        const microSteps = (subTasks || []).map(label => ({
          id: genId(),
          label,
          checked: false
        }));

        const newTask = {
          id: genId(),
          taskUuid: null,
          title,
          category,
          effort,
          deadline,
          priority,
          progress: 0,
          createdAt: new Date().toISOString(),
          completedAt: null,
          stalledAt: null,
          notes: '',
          microSteps,
          lastProgressUpdate: new Date().toISOString(),
          isTutorialTask: !get().firstTaskCompleted,
          deviceUuid: getDeviceUuid(),
          deviceSequence: nextDeviceSequence(),
          syncStatus: 'pending',
        };
        newTask.taskUuid = newTask.id;

        set(state => {
          const updates = { tasks: [...state.tasks, newTask] };
          if (state.tutorialStep === 'task_modal_open' || state.tutorialStep === 'task_creation') {
            updates.tutorialStep = 'click_task';
          }
          return updates;
        });
        get().recordExecutionActivity('operation_initiated');
        scheduleOperationReminders(newTask);
        return true;
      },

      addRitual: (title, frequency, effort, targetTime = null) => {
        const newRitual = {
          id: genId(),
          ritualUuid: null,
          title,
          frequency, // 'daily' | 'weekly'
          effort,    // 'Low' | 'Medium' | 'High' | 'Boss'
          streak: 0,
          bestStreak: 0,
          lastCompletedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          targetTime,
          notes: '',
          lastNotifiedInterval: null,
          deviceUuid: getDeviceUuid(),
          deviceSequence: nextDeviceSequence(),
          syncStatus: 'pending',
        };
        newRitual.ritualUuid = newRitual.id;
        set(state => ({
          rituals: [...(state.rituals || []), newRitual]
        }));
        if (targetTime) {
          scheduleRitualReminders(newRitual);
        }
        return true;
      },

      updateRitual: (id, updates) => {
        const currentRitual = (get().rituals || []).find(r => r.id === id);
        if (!currentRitual) return false;

        cancelRitualReminders(id);
        const updatedRitual = {
          ...currentRitual,
          ...updates,
          id: currentRitual.id,
          ritualUuid: currentRitual.ritualUuid || currentRitual.id,
          updatedAt: new Date().toISOString(),
          deviceUuid: getDeviceUuid(),
          deviceSequence: nextDeviceSequence(),
          syncStatus: 'pending',
        };

        set(state => ({
          rituals: (state.rituals || []).map(r => r.id === id ? updatedRitual : r)
        }));

        if (updatedRitual.targetTime) {
          scheduleRitualReminders(updatedRitual);
        }
        return true;
      },

      deleteRitual: (id) => {
        cancelRitualReminders(id);
        set(state => ({
          rituals: (state.rituals || []).filter(r => r.id !== id)
        }));
      },

      updateProgress: (id, prog) => {
        set(state => {
          const tasks = state.tasks.map(t => {
            if (t.id === id) {
              const oldProgress = t.progress;
              const newProgress = Math.min(100, Math.max(0, prog));
              let stalledAt = t.stalledAt;

              if (newProgress >= 80 && newProgress < 95) {
                if (oldProgress < 80 || !stalledAt) stalledAt = new Date().toISOString();
              } else {
                stalledAt = null;
              }

              return {
                ...t,
                progress: newProgress,
                stalledAt,
                lastProgressUpdate: new Date().toISOString()
              };
            }
            return t;
          });
          return { tasks };
        });
        get().recordExecutionActivity('operation_recalculated');
      },

      completeTask: (id) => {
        get().recordExecutionActivity('operation_completed');
        const state = get();
        const taskIdx = state.tasks.findIndex(t => t.id === id);
        if (taskIdx === -1) return;

        const task = { ...state.tasks[taskIdx] };
        cancelOperationReminders(id);
        // Capture stall state BEFORE setting progress to 100
        const wasStalled = task.progress >= 80 && task.progress < 95 && !!task.stalledAt;
        task.progress = 100;
        task.completedAt = new Date().toISOString();

        const isStalled = wasStalled;
        const consecutiveLow = task.effort === 'Low' ? state.consecutiveLow + 1 : 0;
        const isFarming = consecutiveLow >= 3;

        const mult = EFFORT_MULT[task.effort] || 1;
        let basePts = Math.round(POINTS_BASE * mult);
        const isBoss = task.effort === 'Boss';
        let reward;
        if (!state.firstTaskCompleted) {
          const baseArtifact = BASE_ARTIFACTS.find(a => a.id === 'tome' || a.id === 'skull') || BASE_ARTIFACTS[0];
          reward = {
            rarity: 'epic',
            artifact: { ...baseArtifact, rarity: 'epic' },
            bonusPts: 300
          };
        } else {
          reward = rollReward(isBoss);
        }

        if (isFarming) {
          basePts = Math.floor(basePts / 4);
          reward.bonusPts = Math.floor(reward.bonusPts / 4);
        }
        if (isStalled && !isFarming) {
          basePts *= 2;
          reward.bonusPts *= 2;
        }

        const totalPts = basePts + reward.bonusPts;
        const newXP = state.xp + totalPts;

        // Determine if this is a tutorial task BEFORE using it below
        const isTutorialTask = !!task.isTutorialTask || !state.firstTaskCompleted;
        const countsForRegionalProgress = !isTutorialTask && task.category !== 'LEGION' && !task.isLegionTask;
        task.isTutorialTask = isTutorialTask;
        task.taskUuid = task.taskUuid || task.id;
        task.deviceUuid = task.deviceUuid || getDeviceUuid();
        task.deviceSequence = task.deviceSequence || nextDeviceSequence();
        task.syncStatus = 'pending';
        const artifact = applyArtifactLore(reward.artifact);

        // Daily Points and Daily-based Scythe Level Reset
        const dailyPoints = countsForRegionalProgress ? state.dailyPoints + totalPts : state.dailyPoints;
        const newScytheLevel = getDailyScytheProgress(
          state,
          countsForRegionalProgress ? { operations: 1 } : {}
        ).level;

        // Digital Coins Award
        const coinReward = Math.round(basePts * 0.15) + Math.round(reward.bonusPts * 0.15);
        const newCoins = state.coins + coinReward;
        const progressionEvent = createProgressionEvent({
          eventType: 'operation_completed',
          sourceUuid: task.taskUuid,
          xpAwarded: totalPts,
          coinsAwarded: coinReward,
          metadata: {
            isBoss,
            countsForProgression: countsForRegionalProgress,
            effort: task.effort,
            regionAtCompletion: state.level,
            taskTitle: task.title,
            taskCategory: task.category || 'General',
          },
        });
        task.eventUuid = progressionEvent.eventUuid;

        const today = todayKey();
        const dailyLog = { ...state.dailyLog };
        if (!dailyLog[today]) dailyLog[today] = { completed: 0, weight: 0 };
        dailyLog[today].completed++;
        dailyLog[today].weight = (dailyLog[today].weight || 0) + mult;

        const newTotalCompletions = countsForRegionalProgress ? state.totalCompletions + 1 : state.totalCompletions;
        const finalLevelProgress = newTotalCompletions % TASKS_PER_LEVEL;

        const keyElements = ['fire', 'water', 'earth', 'wind', 'spirit'];
        const keyIndex = (newTotalCompletions - 1) % TASKS_PER_LEVEL;
        const keyElement = countsForRegionalProgress ? keyElements[keyIndex % keyElements.length] : null;

        let unlockedTitles = [...(state.unlockedTitles || ['Recruit'])];

        // Lore unlock
        const regionIdx = state.level - 1;
        const loreArr = getLore(regionIdx);
        const fragIdx = finalLevelProgress === 0 ? TASKS_PER_LEVEL - 1 : finalLevelProgress - 1;
        const fragment = !countsForRegionalProgress
          ? "Tactical tutorial completed successfully. Ashwood gateway threat evaluated."
          : loreArr[Math.min(Math.max(0, fragIdx), loreArr.length - 1)];

        const unlockedLore = { ...state.unlockedLore };
        if (countsForRegionalProgress) {
          if (!unlockedLore[regionIdx]) unlockedLore[regionIdx] = [];
          if (unlockedLore[regionIdx].length < 10 && fragment && !unlockedLore[regionIdx].includes(fragment)) {
            unlockedLore[regionIdx].push(fragment);
          }
        }

        // Onboarding auto progression logic
        let onboardingProgress = state.onboardingProgress;
        let onboardingActive = state.onboardingActive;
        let hasCompletedTutorial = state.hasCompletedTutorial;
        let tutorialStep = state.tutorialStep;
        let pendingGuardianProgress = state.pendingGuardianProgress;
        let pendingTitleUnlock = state.pendingTitleUnlock;
        
        if (onboardingActive && countsForRegionalProgress) {
          onboardingProgress += 1;
          pendingGuardianProgress = onboardingProgress;
          if (onboardingProgress === 5 && !unlockedTitles.includes("Curious Explorer")) {
            unlockedTitles.push("Curious Explorer");
            pendingTitleUnlock = {
              title: "Curious Explorer",
              milestone: 5,
              description: "Awarded for liberating your first region and opening the road beyond."
            };
          }
          if (onboardingProgress === 10 && !unlockedTitles.includes("Seasoned Wanderer")) {
            unlockedTitles.push("Seasoned Wanderer");
            pendingTitleUnlock = {
              title: "Seasoned Wanderer",
              milestone: 10,
              description: "Awarded for completing the guided campaign and opening the road to every realm."
            };
          }
          if (onboardingProgress >= 10) {
            onboardingActive = false;
            hasCompletedTutorial = true;
            tutorialStep = 'completed';
          }
        }

        set({
          tasks: state.tasks.filter(t => t.id !== id),
          completedTasks: [task, ...state.completedTasks],
          executionScore: state.executionScore + totalPts,
          activeBossFlash: isBoss ? 'victory' : state.activeBossFlash,
          dailyLog,
          xp: newXP,
          dailyPoints,
          coins: newCoins,
          scytheLevel: newScytheLevel,
          totalCompletions: newTotalCompletions,
          currentLevelProgress: countsForRegionalProgress ? finalLevelProgress : state.currentLevelProgress,
          level: state.level,
          currentTitle: state.currentTitle,
          unlockedTitles,
          onboardingProgress,
          onboardingActive,
          hasCompletedTutorial,
          tutorialStep,
          pendingGuardianProgress,
          pendingTitleUnlock,
          consecutiveLow,
          collectedArtifacts: [...state.collectedArtifacts, {
            ...artifact,
            rarity: reward.rarity,
            date: new Date().toISOString(),
            rewardEventId: progressionEvent.eventUuid,
            deviceUuid: getDeviceUuid(),
            deviceSequence: progressionEvent.deviceSequence,
            syncStatus: 'pending',
            context: isTutorialTask
              ? "Forged during your Tactical Onboarding. Your journey has begun."
              : `Forged on Day ${state.streakCount} of the Quest.`,
            effortContext: isTutorialTask
              ? "Initial Command execution completed successfully."
              : `Claimed during a ${task.effort || 'Moderate'} Resistance Strike.`
          }],
          unlockedLore,
          pendingReward: {
            reward: { ...reward, artifact },
            basePts,
            totalPts,
            fragment: artifact.hook || artifact.lore || fragment,
            taskTitle: task.title,
            keyElement
          },
          pendingProgressionEvents: [...(state.pendingProgressionEvents || []), progressionEvent],
          closerDismissed: false,
          lastActiveDate: today,
          bossKills: state.bossKills + (isBoss ? 1 : 0),
          rescuedFairies: state.rescuedFairies,
          firstTaskCompleted: true
        });

        if (get().isNetworkConnected === false || (typeof navigator !== 'undefined' && !navigator.onLine)) {
          get().promotePendingOfflineLevelUps();
        }

        if (isBoss) {
          get().recordWeeklyEvent('boss_raid_completed', `Conquered a legendary Boss Raid task`);
          // Trigger interstitial ad when boss is defeated
          import('../utils/adManager')
            .then(({ AdManager }) => AdManager.showInterstitial())
            .catch(err => console.error('AdMob Interstitial failed:', err));
        } else {
          get().recordWeeklyEvent('task_completed', `Conquered a ${task.effort || 'Medium'} Resistance task`);
        }
        if (newScytheLevel !== state.scytheLevel && newScytheLevel !== "DORMANT") {
          get().recordWeeklyEvent('scythe_evolved', `Evolved Scythe to the ${newScytheLevel} tier`);
        }

        ph.capture('operation_conquered', {
          category: task.category,
          pts: totalPts,
          level_up: false
        });

        triggerHaptics(task.effort === 'Boss' ? 'HEAVY' : 'MEDIUM');
        scheduleStreakAlert(18);
      },

      completeRitual: (id) => {
        const state = get();
        const rituals = state.rituals || [];
        const ritIdx = rituals.findIndex(r => r.id === id);
        if (ritIdx === -1) return;

        const ritual = { ...rituals[ritIdx] };
        const today = todayKey();

        // Prevent completing multiple times a day for daily rituals
        const isCompletedToday = ritual.lastCompletedAt && localDateKey(ritual.lastCompletedAt) === today;
        if (isCompletedToday) return;
        get().recordExecutionActivity('ritual_completed');

        cancelRitualReminders(id);
        ritual.lastCompletedAt = new Date().toISOString();
        ritual.updatedAt = ritual.lastCompletedAt;
        ritual.deviceUuid = getDeviceUuid();
        ritual.deviceSequence = nextDeviceSequence();
        const newStreak = (ritual.streak || 0) + 1;
        ritual.streak = newStreak;
        ritual.bestStreak = Math.max(ritual.bestStreak || 0, newStreak);

        const mult = EFFORT_MULT[ritual.effort] || 1;
        let basePts = Math.round(POINTS_BASE * mult);
        const reward = rollReward(ritual.effort === 'Boss');
        const artifact = applyArtifactLore(reward.artifact);

        const totalPts = basePts + reward.bonusPts;
        const newXP = state.xp + totalPts;

        // Daily Points and Daily-based Scythe Level Reset
        const dailyPoints = state.dailyPoints + totalPts;
        const newScytheLevel = getDailyScytheProgress(state, { rituals: 1 }).level;

        // Digital Coins Award
        const coinReward = Math.round(basePts * 0.15) + Math.round(reward.bonusPts * 0.15);
        const newCoins = state.coins + coinReward;
        const progressionEvent = createProgressionEvent({
          eventType: 'ritual_completed',
          sourceUuid: `${ritual.ritualUuid || ritual.id}:${today}`,
          xpAwarded: totalPts,
          coinsAwarded: coinReward,
          metadata: { effort: ritual.effort, ritualUuid: ritual.ritualUuid || ritual.id },
        });
        const ritualCompletionEvent = {
          id: `${ritual.ritualUuid || ritual.id}:${today}`,
          eventUuid: progressionEvent.eventUuid,
          ritualUuid: ritual.ritualUuid || ritual.id,
          ritualTitle: ritual.title,
          ritualCreatedAt: ritual.createdAt,
          frequency: ritual.frequency,
          date: today,
          occurredAt: progressionEvent.occurredAt,
          deviceUuid: progressionEvent.deviceUuid,
          deviceSequence: progressionEvent.deviceSequence,
          syncStatus: 'pending',
        };
        ritual.syncStatus = 'pending';

        const dailyLog = { ...state.dailyLog };
        if (!dailyLog[today]) dailyLog[today] = { completed: 0, weight: 0 };
        dailyLog[today].completed++;
        dailyLog[today].weight = (dailyLog[today].weight || 0) + mult;

        const updatedRituals = rituals.map(r => r.id === id ? ritual : r);

        set({
          rituals: updatedRituals,
          executionScore: state.executionScore + totalPts,
          activeBossFlash: ritual.effort === 'Boss' ? 'victory' : state.activeBossFlash,
          dailyLog,
          xp: newXP,
          dailyPoints,
          coins: newCoins,
          scytheLevel: newScytheLevel,
          collectedArtifacts: [...state.collectedArtifacts, {
            ...artifact,
            rarity: reward.rarity,
            date: new Date().toISOString(),
            rewardEventId: progressionEvent.eventUuid,
            deviceUuid: progressionEvent.deviceUuid,
            deviceSequence: progressionEvent.deviceSequence,
            syncStatus: 'pending',
            context: `Forged on Day ${state.streakCount} of the Quest.`,
            effortContext: `Claimed during a Daily Ritual Strike.`
          }],
          ritualCompletionEvents: [...(state.ritualCompletionEvents || []), ritualCompletionEvent],
          pendingProgressionEvents: [...(state.pendingProgressionEvents || []), progressionEvent],
          pendingReward: {
            reward: { ...reward, artifact },
            basePts,
            totalPts,
            fragment: artifact.hook || artifact.lore,
            taskTitle: ritual.title,
            keyElement: null
          },
          pendingLevelUp: null,
          pendingVictoryScreen: null,
          closerDismissed: false,
          lastActiveDate: today
        });

        ph.capture('ritual_conquered', {
          effort: ritual.effort,
          pts: totalPts,
          level_up: false
        });

        triggerHaptics(ritual.effort === 'Boss' ? 'HEAVY' : 'MEDIUM');
        scheduleStreakAlert(18);
      },

      refreshDailyState: () => {
        const today = todayKey();
        const state = get();
        if (state.lastResetDate === today) return false;
        const nowDay = new Date(`${today}T00:00:00`);

        // Reset missed daily rituals
        const yesterday = new Date(nowDay);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = localDateKey(yesterday);

        const updatedRituals = (state.rituals || []).map(r => {
          const updated = { ...r, lastNotifiedInterval: null };
          if (r.frequency === 'daily') {
            const lastCompDate = r.lastCompletedAt ? localDateKey(r.lastCompletedAt) : null;
            if (lastCompDate !== yesterdayStr && lastCompDate !== today) {
              updated.streak = 0;
            }
          }
          return updated;
        });

        set({
          dailyPoints: 0,
          scytheLevel: "DORMANT",
          rituals: updatedRituals,
          lastResetDate: today
        });
        return true;
      },

      recordExecutionActivity: (activityType = 'execution') => {
        get().refreshDailyState();
        const today = todayKey();
        const state = get();
        if (state.lastActiveDate === today) return false;

        const last = state.lastActiveDate
          ? new Date(`${state.lastActiveDate.slice(0, 10)}T00:00:00`)
          : null;
        const nowDay = new Date(`${today}T00:00:00`);
        const diffDays = last ? Math.round((nowDay - last) / 86400000) : null;
        const streakCount = diffDays === 1 ? (state.streakCount || 0) + 1 : 1;

        set({
          streakCount,
          lastActiveDate: today,
          lastExecutionActivity: activityType
        });
        return true;
      },

      // Backward-compatible alias for older callers. This is intentionally an
      // execution event now; opening the app must never call it.
      updateStreak: () => get().recordExecutionActivity('execution'),

      abandonTask: (id) => {
        cancelOperationReminders(id);
        set(state => {
          const task = state.tasks.find(t => t.id === id);
          if (!task) return state;
          return {
            tasks: state.tasks.filter(t => t.id !== id),
            abandonedTasks: [{ ...task, abandonedAt: new Date().toISOString() }, ...state.abandonedTasks],
            closerDismissed: false
          };
        });
      },

      setNotes: (notes) => set({ notes }),
      dismissCloser: () => set({ closerDismissed: true }),
      clearPendingReward: () => set({ pendingReward: null }),
      clearPendingTitleUnlock: () => set({ pendingTitleUnlock: null }),
      setNetworkConnected: connected => {
        set({ isNetworkConnected: !!connected });
        if (!connected) get().promotePendingOfflineLevelUps();
      },
      promotePendingOfflineLevelUps: () => {
        const state = get();
        const regionalEvents = uniqueRegionalProgressionEvents(state.pendingProgressionEvents);
        if (regionalEvents.length === 0) return false;

        const initialized = state.confirmedProgressionInitialized === true;
        const baseCompletions = initialized
          ? Number(state.confirmedProgressionCompletions) || 0
          : Math.max(0, (Number(state.totalCompletions) || 0) - regionalEvents.length);
        const baseLevel = initialized
          ? Number(state.confirmedProgressionLevel) || 1
          : Number(state.level) || Math.floor(baseCompletions / TASKS_PER_LEVEL) + 1;
        const { ceremonies } = deriveOfflineLevelUpCeremonies({
          events: regionalEvents,
          confirmedCompletions: baseCompletions,
          confirmedLevel: baseLevel,
          tasksPerLevel: TASKS_PER_LEVEL,
        });

        set(current => ({
          ...buildLevelUpPatch(current, ceremonies, { provisional: true }),
          confirmedProgressionLevel: initialized ? current.confirmedProgressionLevel : baseLevel,
          confirmedProgressionCompletions: initialized
            ? current.confirmedProgressionCompletions
            : baseCompletions,
          confirmedProgressionInitialized: true,
        }));
        return ceremonies.length > 0;
      },
      clearPendingLevelUp: () => set(current => {
        const queue = [...(current.queuedLevelUpCeremonies || [])];
        const next = queue.shift();
        if (!next) {
          return { pendingLevelUp: null, queuedLevelUpCeremonies: queue };
        }
        return {
          queuedLevelUpCeremonies: queue,
          pendingLevelUp: {
            eventUuid: next.eventUuid,
            regionIdx: next.newLevel - 1,
            newLevel: next.newLevel,
            newTitle: next.newTitle,
            provisional: next.provisional,
          },
          pendingVictoryScreen: {
            eventUuid: next.eventUuid,
            regionIdx: next.previousLevel - 1,
            mapIndex: ((next.previousLevel - 1) % 10) + 1,
            taskTitle: next.taskTitle,
            provisional: next.provisional,
          },
        };
      }),
      clearPendingVictoryScreen: () => set({ pendingVictoryScreen: null }),
      addReceivedProphecy: (prophecy) => set(state => {
        const alreadyReceived = (state.receivedProphecies || []).some(p => p.text === prophecy.text);
        if (alreadyReceived) return {};
        return {
          receivedProphecies: [...(state.receivedProphecies || []), {
            text: prophecy.text,
            type: prophecy.type,
            date: new Date().toISOString()
          }],
          hasPendingChanges: true
        };
      }),
      triggerBossFlash: (type) => set({ activeBossFlash: type }),
      clearBossFlash: () => set({ activeBossFlash: null }),

      updateTaskNotes: (id, notes) => {
        set(state => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, notes } : t)
        }));
      },

      toggleMicroStep: (taskId, stepId) => {
        set(state => {
          const tasks = state.tasks.map(t => {
            if (t.id === taskId) {
              const updatedSteps = t.microSteps.map(s => s.id === stepId ? { ...s, checked: !s.checked } : s);
              const checkedCount = updatedSteps.filter(s => s.checked).length;
              const totalCount = updatedSteps.length;
              const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : t.progress;

              const oldProgress = t.progress;
              let stalledAt = t.stalledAt;
              if (progress >= 80 && progress < 95) {
                if (oldProgress < 80 || !stalledAt) stalledAt = new Date().toISOString();
              } else {
                stalledAt = null;
              }

              return {
                ...t,
                microSteps: updatedSteps,
                progress,
                stalledAt,
                lastProgressUpdate: new Date().toISOString()
              };
            }
            return t;
          });
          return { tasks };
        });
      },

      generateMicroSteps: (taskId) => {
        const state = get();
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return;

        const rem = 100 - task.progress;
        const count = rem <= 20 ? 3 : rem <= 50 ? 5 : 7;
        const sz = Math.round(rem / count);
        const verbs = {
          Work: ['Draft', 'Review', 'Refine', 'Polish', 'Test', 'Document', 'Finalize', 'Validate'],
          Study: ['Read', 'Summarize', 'Practice', 'Review', 'Quiz', 'Outline', 'Apply', 'Reflect'],
          Fitness: ['Warm up', 'Execute', 'Push through', 'Rest', 'Cool down', 'Stretch', 'Log', 'Recover'],
          Creative: ['Brainstorm', 'Sketch', 'Iterate', 'Refine', 'Polish', 'Review', 'Finalize', 'Present']
        };
        const v = verbs[task.category] || verbs.Work;

        let durationText = "5-10 min";
        if (task.deadline) {
          const diffMs = new Date(task.deadline) - new Date();
          if (diffMs > 0) {
            const msPerStep = diffMs / count;
            const hoursPerStep = msPerStep / (1000 * 60 * 60);
            if (hoursPerStep >= 24) {
              const days = Math.round(hoursPerStep / 24);
              durationText = `${days} day${days > 1 ? 's' : ''}`;
            } else if (hoursPerStep >= 1) {
              const hrs = Math.round(hoursPerStep);
              durationText = `${hrs} hr${hrs > 1 ? 's' : ''}`;
            } else {
              const mins = Math.max(5, Math.round(msPerStep / (1000 * 60)));
              durationText = `${mins} min`;
            }
          }
        }

        const microSteps = Array.from({ length: count }, (_, i) => ({
          id: genId(),
          label: `${v[i % v.length]}: ${task.progress + sz * i}% → ${Math.min(100, task.progress + sz * (i + 1))}% (${durationText})`,
          checked: false
        }));

        set(state => ({
          tasks: state.tasks.map(t => t.id === taskId ? { ...t, microSteps } : t)
        }));
      },

      toggleFocus: (taskId = null) => {
        set(state => ({
          isFocusMode: !state.isFocusMode,
          focusedTaskId: taskId || (state.tasks.length > 0 ? state.tasks[0].id : null)
        }));
      },

      addMicroStep: (taskId, label) => {
        set(state => ({
          tasks: state.tasks.map(t => {
            if (t.id === taskId) {
              const updatedSteps = [...t.microSteps, { id: genId(), label, checked: false }];
              const checkedCount = updatedSteps.filter(s => s.checked).length;
              const totalCount = updatedSteps.length;
              const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : t.progress;
              return { ...t, microSteps: updatedSteps, progress };
            }
            return t;
          })
        }));
      },

      deleteMicroStep: (taskId, stepId) => {
        set(state => ({
          tasks: state.tasks.map(t => {
            if (t.id === taskId) {
              const updatedSteps = t.microSteps.filter(s => s.id !== stepId);
              const checkedCount = updatedSteps.filter(s => s.checked).length;
              const totalCount = updatedSteps.length;
              const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : t.progress;
              return { ...t, microSteps: updatedSteps, progress };
            }
            return t;
          })
        }));
      },

      buyScythe: (scytheId, cost) => {
        const state = get();
        if (state.coins >= cost && !state.unlockedScythes.includes(scytheId)) {
          set({
            coins: state.coins - cost,
            unlockedScythes: [...state.unlockedScythes, scytheId]
          });

          return true;
        }
        return false;
      },

      equipScythe: (scytheId) => {
        set({ activeScytheSkin: scytheId });

      },

      applyTheme: (themeId) => {
        set({ activeTheme: themeId });
        document.body.className = '';
        if (themeId && themeId !== 'default') {
          document.body.classList.add(`theme-${themeId}`);
        }

      },

      setSoundscapeEnabled: (enabled) => {
        set({ soundscapeEnabled: enabled });

      },

      setSoundscapeVolume: (volume) => {
        set({ soundscapeVolume: volume });

      },

      buyCosmetic: async (itemId, itemType) => {
        const u = get().user;
        if (!u) {
          throw new Error('Please sign in or link your operative profile to continue.');
        }

        // 1. Call edge function to create order
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const session = (await supabase.auth.getSession()).data.session;
        const jwt = session?.access_token;
        if (!jwt) {
          throw new Error('Please sign in or link your operative profile to continue.');
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
            'apikey': supabaseAnonKey
          },
          body: JSON.stringify({ item_id: itemId, item_type: itemType })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Purchase creation failed with status ${response.status}`);
        }

        const data = await response.json();

        const order_id = data?.order_id;
        const amount = data?.amount;
        if (!order_id) {
          throw new Error('Invalid response from payment creation service.');
        }

        // 2. Load Razorpay script
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error('Failed to load payment portal script. Please check your internet connection.');
        }

        // 3. Open Razorpay checkout
        return new Promise((resolve, reject) => {
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SXn65yEl8EFyrc',
            amount: amount,
            currency: 'INR',
            order_id: order_id,
            name: 'Warscythe',
            description: `Acquire ${itemId} ${itemType}`,
            image: '/command-core.png',
            theme: {
              color: '#ecc880'
            },
            prefill: {
              email: u.email || ''
            },
            handler: async function (res) {
              console.log('Cosmetic Payment Successful:', res);
              await get().fetchUserState(u.id);
              resolve(res);
            },
            modal: {
              ondismiss: function () {
                reject(new Error('Payment window closed.'));
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        });
      },

      downloadRegionBundle: async (subItemId) => {
        try {
          const { findBundleItem, cacheBundle } = await import('../utils/assetCache');
          if (!findBundleItem(subItemId)) return;
          await cacheBundle(subItemId);

          set(state => {
            const downloaded = Array.from(new Set([...(state.downloadedRegions || []).map(String), String(subItemId)]));
            return {
              downloadedRegions: downloaded,
              hasPendingChanges: true
            };
          });


        } catch (err) {
          console.error(`Failed to download bundle for ${subItemId}:`, err);
          throw err;
        }
      },

      deleteRegionBundle: async (subItemId) => {
        try {
          const { findBundleItem, deleteCachedBundle } = await import('../utils/assetCache');
          if (!findBundleItem(subItemId)) return;
          await deleteCachedBundle(subItemId);

          set(state => {
            const downloaded = (state.downloadedRegions || []).map(String).filter(id => id !== String(subItemId));
            return {
              downloadedRegions: downloaded,
              hasPendingChanges: true
            };
          });


        } catch (err) {
          console.error(`Failed to delete bundle for ${subItemId}:`, err);
          throw err;
        }
      },

      startWorkout: (split) => {
        set({
          activeWorkout: {
            id: genId(),
            date: new Date().toISOString(),
            split: split || 'Default Split',
            movements: []
          }
        });
        get().recordExecutionActivity('fitness_session_started');
      },

      cancelWorkout: () => {
        set({ activeWorkout: null });
      },

      addMovement: (name) => {
        set(state => {
          if (!state.activeWorkout) return {};
          const newMovement = {
            id: genId(),
            name: name || 'Unnamed Movement',
            sets: []
          };
          return {
            activeWorkout: {
              ...state.activeWorkout,
              movements: [...state.activeWorkout.movements, newMovement]
            }
          };
        });
      },

      removeMovement: (movementId) => {
        set(state => {
          if (!state.activeWorkout) return {};
          return {
            activeWorkout: {
              ...state.activeWorkout,
              movements: state.activeWorkout.movements.filter(m => m.id !== movementId)
            }
          };
        });
      },

      addSetToMovement: (movementId, setDetail = {}) => {
        set(state => {
          if (!state.activeWorkout) return {};
          const movements = state.activeWorkout.movements.map(m => {
            if (m.id === movementId) {
              const newSet = {
                id: genId(),
                weight: Number(setDetail.weight) || 0,
                reps: Number(setDetail.reps) || 0,
                rpe: Number(setDetail.rpe) || 8,
                type: setDetail.type || 'working',
                completed: false
              };
              return {
                ...m,
                sets: [...m.sets, newSet]
              };
            }
            return m;
          });
          return {
            activeWorkout: {
              ...state.activeWorkout,
              movements
            }
          };
        });
      },

      updateSetInMovement: (movementId, setId, updates) => {
        set(state => {
          if (!state.activeWorkout) return {};
          const movements = state.activeWorkout.movements.map(m => {
            if (m.id === movementId) {
              const sets = m.sets.map(s => {
                if (s.id === setId) {
                  return {
                    ...s,
                    ...updates,
                    weight: updates.weight !== undefined ? Number(updates.weight) : s.weight,
                    reps: updates.reps !== undefined ? Number(updates.reps) : s.reps,
                    rpe: updates.rpe !== undefined ? Number(updates.rpe) : s.rpe
                  };
                }
                return s;
              });
              return { ...m, sets };
            }
            return m;
          });

          return {
            activeWorkout: {
              ...state.activeWorkout,
              movements
            }
          };
        });
      },

      deleteSetFromMovement: (movementId, setId) => {
        set(state => {
          if (!state.activeWorkout) return {};
          const movements = state.activeWorkout.movements.map(m => {
            if (m.id === movementId) {
              return {
                ...m,
                sets: m.sets.filter(s => s.id !== setId)
              };
            }
            return m;
          });
          return {
            activeWorkout: {
              ...state.activeWorkout,
              movements
            }
          };
        });
      },

      logWorkout: (workout) => {
        set(state => {
          const rawWorkout = workout || state.activeWorkout;
          if (!rawWorkout) return {};

          let finalWorkout = { ...rawWorkout };
          if (finalWorkout.movements) {
            finalWorkout.movements = finalWorkout.movements.map(m => ({
              ...m,
              sets: (m.sets || []).map(s => {
                if ((Number(s.weight) > 0 && Number(s.reps) > 0) || s.completed) {
                  return { ...s, completed: true };
                }
                return s;
              })
            }));
          }

          const newWorkout = {
            ...finalWorkout,
            id: genId(),
            eventUuid: generateUUID(),
            date: new Date().toISOString(),
            deviceUuid: getDeviceUuid(),
            deviceSequence: nextDeviceSequence(),
            syncStatus: 'pending',
          };
          const progressionEvent = createProgressionEvent({
            eventType: 'workout_archived',
            sourceUuid: newWorkout.eventUuid,
            metadata: { workoutId: newWorkout.id },
          });
          // Trigger interstitial ad at workout completion
          import('../utils/adManager')
            .then(({ AdManager }) => AdManager.showInterstitial())
            .catch(err => console.error('AdMob Interstitial failed:', err));

          return {
            gymLog: [newWorkout, ...(state.gymLog || [])],
            activeWorkout: null,
            pendingProgressionEvents: [...(state.pendingProgressionEvents || []), progressionEvent],
          };
        });
        get().recordExecutionActivity('fitness_session_archived');
      },

      updateActiveWorkoutNotes: (notes) => {
        set(state => {
          if (!state.activeWorkout) return {};
          return {
            activeWorkout: {
              ...state.activeWorkout,
              notes
            }
          };
        });
      },

      getTotalTonnage: () => {
        const gymLog = get().gymLog || [];
        return gymLog.reduce((total, workout) => {
          if (workout.movements) {
            return total + workout.movements.reduce((movTotal, mov) => {
              return movTotal + (mov.sets || []).reduce((setTotal, s) => {
                if (s.completed && s.type !== 'warmup') {
                  return setTotal + (Number(s.weight) || 0) * (Number(s.reps) || 0);
                }
                return setTotal;
              }, 0);
            }, 0);
          }
          if (workout.exercises) {
            return total + workout.exercises.reduce((exTotal, ex) => {
              return exTotal + (Number(ex.sets) || 0) * (Number(ex.reps) || 0) * (Number(ex.weight) || 0);
            }, 0);
          }
          return total;
        }, 0);
      },

      getDeityProgress: () => {
        const totalTonnage = get().getTotalTonnage();
        const DEITIES = [
          { id: 'hermes', name: 'Hermes', threshold: 0, nextThreshold: 10000, buff: '+5% Speed & Stamina', desc: 'The Messenger of the Gods. Agile, swift, tireless.' },
          { id: 'apollo', name: 'Apollo', threshold: 10000, nextThreshold: 50000, buff: '+10% Focus & Will', desc: 'The God of Light and Sun. Pure, radiant, focused.' },
          { id: 'ares', name: 'Ares', threshold: 50000, nextThreshold: 150000, buff: '+15% Peak Force', desc: 'The God of War. Unrelenting aggression, explosive power.' },
          { id: 'hercules', name: 'Hercules', threshold: 150000, nextThreshold: 400000, buff: '+20% Raw Strength', desc: 'The Champion of Olympia. Unbroken fortitude, infinite strength.' },
          { id: 'zeus', name: 'Zeus', threshold: 400000, nextThreshold: null, buff: '+25% Godlike Power', desc: 'The King of Olympus. Cosmic authority, supreme power.' }
        ];

        let activeDeityIndex = 0;
        for (let i = DEITIES.length - 1; i >= 0; i--) {
          if (totalTonnage >= DEITIES[i].threshold) {
            activeDeityIndex = i;
            break;
          }
        }

        const activeDeity = DEITIES[activeDeityIndex];
        const nextDeity = activeDeityIndex < DEITIES.length - 1 ? DEITIES[activeDeityIndex + 1] : null;

        let progressPercent = 100;
        if (nextDeity) {
          const range = nextDeity.threshold - activeDeity.threshold;
          const currentProgress = totalTonnage - activeDeity.threshold;
          progressPercent = Math.min(100, Math.max(0, (currentProgress / range) * 100));
        }

        return {
          totalTonnage,
          activeDeity,
          nextDeity,
          progressPercent,
          deities: DEITIES.map((d, index) => ({
            ...d,
            unlocked: totalTonnage >= d.threshold,
            isCurrent: index === activeDeityIndex
          }))
        };
      },

      setTutorialStep: (step) => {
        set({ tutorialStep: step });
        if (step === 'completed') {
          set({ hasCompletedTutorial: true });
        }
      },

      completeTutorial: () => {
        set({ hasCompletedTutorial: true, tutorialStep: 'completed' });
      },

      setHasSeenMapGuide: (val) => {
        set({ hasSeenMapGuide: val });
      },

      setHasSeenLedgerGuide: (val) => {
        set({ hasSeenLedgerGuide: val });
      },

      setHasSeenForgeGuide: (val) => {
        set({ hasSeenForgeGuide: val });
      },

      setHasSeenRitualsGuide: (val) => {
        set({ hasSeenRitualsGuide: val });
      },

      setHasSeenFitnessPeek: (val) => {
        set({ hasSeenFitnessPeek: val });
      },

      recalculateState: () => {
        set(state => {
          let newXP = 0;
          let bossKills = 0;

          (state.completedTasks || []).forEach(t => {
            const mult = EFFORT_MULT[t.effort] || 1;
            const basePts = Math.round(POINTS_BASE * mult);
            if (t.effort === 'Boss') bossKills++;
            const bonus = t.reward?.bonusPts || 50;
            newXP += (basePts + bonus);
          });

          const totalCompletions = (state.completedTasks || [])
            .filter(t => !t.isTutorialTask && t.category !== 'LEGION' && !t.isLegionTask)
            .length;
          const newLevel = Math.floor(totalCompletions / TASKS_PER_LEVEL) + 1;
          const finalLevelProgress = totalCompletions % TASKS_PER_LEVEL;

          const newScytheLevel = getDailyScytheProgress(state).level;

          return {
            xp: newXP,
            level: newLevel,
            totalCompletions,
            currentLevelProgress: finalLevelProgress,
            scytheLevel: newScytheLevel,
            bossKills
          };
        });
      },

      // Social & Legion Actions
      fetchSocialData: async (options = {}) => {
        const u = get().user?.id;
        if (!u) return;

        const section = typeof options === 'string' ? options : (options.section || 'all');
        // Existing mutation actions call this with no arguments and therefore
        // require an immediate authoritative refresh. Screen-driven reads pass a
        // section and use the TTL cache.
        const force = typeof options === 'object'
          && (options.force === true || Object.keys(options).length === 0);
        const requestedSections = section === 'all'
          ? ['friends', 'leaderboard', 'legion']
          : [section];
        const now = Date.now();
        const isFresh = requestedSections.every(key => now - socialFetchedAt[key] < SOCIAL_CACHE_TTL_MS);
        if (!force && isFresh) return;
        if (socialFetchPromise) return socialFetchPromise;

        socialFetchPromise = (async () => {
          try {
          const needsFriends = section === 'all' || section === 'friends' || section === 'leaderboard' || section === 'legion';
          const needsLeaderboard = section === 'all' || section === 'leaderboard';
          const needsLegion = section === 'all' || section === 'legion';
          let friendIds = [];
          let friendData = get().friendships || [];

          if (needsFriends) {
          const { data: friendData, error: friendErr } = await supabase
            .from('friendships')
            .select(`
              id,
              requester_id,
              receiver_id,
              status,
              requester:profiles!friendships_requester_id_fkey(id, username, state),
              receiver:profiles!friendships_receiver_id_fkey(id, username, state)
            `)
            .or(`requester_id.eq.${u},receiver_id.eq.${u}`);

          if (!friendErr && friendData) {
            set({ friendships: friendData });
            friendIds = friendData
              .filter(f => f.status === 'accepted')
              .map(f => f.requester_id === u ? f.receiver_id : f.requester_id);
            socialFetchedAt.friends = Date.now();
          }
          } else {
            friendIds = friendData
              .filter(f => f.status === 'accepted')
              .map(f => f.requester_id === u ? f.receiver_id : f.requester_id);
          }

          if (needsLeaderboard) {
          const weekStart = getWeekStart();
          const targetUserIds = [u, ...friendIds];
          const { data: leadData, error: leadErr } = await supabase
            .from('leaderboard_snapshots')
            .select(`
              id,
              user_id,
              week_start,
              weekly_xp,
              streak_days,
              operations_completed,
              profile:profiles(id, username, state)
            `)
            .eq('week_start', weekStart)
            .in('user_id', targetUserIds)
            .order('weekly_xp', { ascending: false });

          if (!leadErr && leadData) {
            set({ leaderboard: leadData });
          }

          const { data: eventData, error: eventErr } = await supabase
            .from('leaderboard_events')
            .select(`
              id,
              user_id,
              event_type,
              event_description,
              created_at,
              profile:profiles(id, username, state)
            `)
            .order('created_at', { ascending: false })
            .limit(10);

          if (!eventErr && eventData) {
            set({ leaderboardEvents: eventData });
          }
          socialFetchedAt.leaderboard = Date.now();
          }

          if (needsLegion) {
          const { data: memberRows, error: memberRowsErr } = await supabase
            .from('legion_members')
            .select('legion_id')
            .eq('user_id', u)
            .eq('status', 'active')
            .order('joined_at', { ascending: false })
            .limit(1);

          if (!memberRowsErr && memberRows && memberRows.length > 0) {
            const legionId = memberRows[0].legion_id;

            const { data: legionData } = await supabase
              .from('legions')
              .select('id,name,creator_id,owner_id,level,total_xp,created_at')
              .eq('id', legionId)
              .single();

            const { data: members } = await supabase
              .from('legion_members')
              .select(`
                id,
                legion_id,
                user_id,
                role,
                joined_at,
                profile:profiles(id, username, state)
              `)
              .eq('legion_id', legionId)
              .eq('status', 'active');

            const { data: ops } = await supabase
              .from('legion_operations')
              .select('id,legion_id,parent_task_id,status,deadline,created_at,locked_at,completed_at')
              .eq('legion_id', legionId)
              .order('created_at', { ascending: false })
              .limit(30);

            let subtasks = [];
            if (ops && ops.length > 0) {
              const opIds = ops.map(o => o.id);
              const { data: subData } = await supabase
                .from('legion_subtasks')
                .select(`
                  id,
                  legion_operation_id,
                  assigned_to,
                  task_id,
                  title,
                  deadline,
                  priority,
                  acceptance_status,
                  completion_status,
                  completed_by,
                  xp_value,
                  xp_awarded,
                  note,
                  restrained_at,
                  restrained_by,
                  assignee:profiles!legion_subtasks_assigned_to_fkey(id, username, state)
                `)
                .in('legion_operation_id', opIds);
              if (subData) subtasks = subData;
            }

            const { data: lEvents } = await supabase
              .from('legion_events')
              .select('id,legion_id,event_type,actor_id,target_id,metadata,created_at')
              .eq('legion_id', legionId)
              .order('created_at', { ascending: false })
              .limit(15);

            set({
              activeLegion: legionData,
              legionMembers: members || [],
              legionOperations: (ops || []).map(o => ({
                ...o,
                status: o.status ?? 'acceptance_open'
              })),
              legionSubtasks: (subtasks || []).map(s => ({
                ...s,
                acceptance_status: s.acceptance_status ?? 'pending',
                completion_status: s.completion_status ?? 'incomplete'
              })),
              legionEvents: lEvents || []
            });
          } else {
            set({
              activeLegion: null,
              legionMembers: [],
              legionOperations: [],
              legionSubtasks: [],
              legionEvents: []
            });
          }
          socialFetchedAt.legion = Date.now();
          }
          } catch (err) {
            console.error("fetchSocialData error:", err);
          } finally {
            socialFetchPromise = null;
          }
        })();

        return socialFetchPromise;
      },

      sendFriendRequest: async (identifier) => {
        const u = get().user?.id;
        if (!u) return;

        // Search via SECURITY DEFINER RPC so the email column is never exposed to the
        // client. Accepts an exact email or username and returns only { id, username }.
        const { data: matches, error: searchErr } = await supabase
          .rpc('search_profiles', { search_term: identifier });

        const targetProfile = Array.isArray(matches) ? matches[0] : matches;

        if (searchErr || !targetProfile) {
          throw new Error('User with this email or username not found.');
        }

        if (targetProfile.id === u) {
          throw new Error('You cannot add yourself as a friend.');
        }

        const { error: insertErr } = await supabase
          .from('friendships')
          .insert({
            requester_id: u,
            receiver_id: targetProfile.id,
            status: 'pending'
          });

        if (insertErr) {
          throw new Error('Friend request already sent or pending.');
        }

        await get().fetchSocialData();
      },

      acceptFriendRequest: async (requestId) => {
        const { error } = await supabase
          .from('friendships')
          .update({ status: 'accepted', updated_at: new Date().toISOString() })
          .eq('id', requestId);

        if (error) throw error;
        await get().fetchSocialData();
      },

      declineFriendRequest: async (requestId) => {
        const { error } = await supabase
          .from('friendships')
          .delete()
          .eq('id', requestId);

        if (error) throw error;
        await get().fetchSocialData();
      },

      removeFriend: async (friendshipId) => {
        const { error } = await supabase
          .from('friendships')
          .delete()
          .eq('id', friendshipId);

        if (error) throw error;
        await get().fetchSocialData();
      },

      createLegion: async (name) => {
        const u = get().user?.id;
        if (!u) return;

        const { data: legion, error: legionErr } = await supabase
          .from('legions')
          .insert({
            name,
            creator_id: u,
            owner_id: u,
            level: 1,
            total_xp: 0
          })
          .select()
          .single();

        if (legionErr) throw legionErr;

        const { error: memberErr } = await supabase
          .from('legion_members')
          .insert({
            legion_id: legion.id,
            user_id: u,
            role: 'creator',
            status: 'active'
          });

        if (memberErr) throw memberErr;

        await supabase.from('legion_events').insert({
          legion_id: legion.id,
          event_type: 'operation_started',
          actor_id: u,
          metadata: { message: `Legion ${name} was founded.` }
        });

        await get().fetchSocialData();
        get().recordExecutionActivity('legion_forged');
      },

      inviteLegionMember: async (legionId, friendId) => {
        const u = get().user?.id;
        if (!u) return;

        const { error } = await supabase
          .from('legion_members')
          .upsert({
            legion_id: legionId,
            user_id: friendId,
            role: 'member',
            status: 'active',
            joined_at: new Date().toISOString()
          }, { onConflict: 'legion_id,user_id' });

        if (error) throw error;

        await get().fetchSocialData();
      },

      initiateLegionOperation: async (legionId, parentTaskId, deadline, subtasksList) => {
        const u = get().user?.id;
        if (!u) return;

        const { data: op, error: opErr } = await supabase
          .from('legion_operations')
          .insert({
            legion_id: legionId,
            parent_task_id: parentTaskId || generateUUID(),
            status: 'acceptance_open',
            deadline
          })
          .select()
          .single();

        if (opErr) throw opErr;

        const subtasksToInsert = subtasksList.map(s => ({
          legion_operation_id: op.id,
          assigned_to: s.assignedTo,
          task_id: generateUUID(),
          acceptance_status: s.assignedTo === u ? 'accepted' : 'pending',
          completion_status: 'incomplete',
          xp_value: s.xpValue,
          title: s.title || 'Unnamed Objective',
          deadline: s.deadline || deadline,
          priority: s.priority || 'medium'
        }));

        const { error: subErr } = await supabase
          .from('legion_subtasks')
          .insert(subtasksToInsert);

        if (subErr) throw subErr;

        // Auto-add the creator's own assigned subtask to their personal tasks array
        const creatorSub = subtasksToInsert.find(s => s.assigned_to === u);
        if (creatorSub) {
          const newTask = {
            id: creatorSub.task_id,
            title: creatorSub.title,
            category: 'LEGION',
            effort: 'Medium',
            deadline: creatorSub.deadline,
            priority: creatorSub.priority,
            progress: 0,
            microSteps: [],
            notes: '',
            lastProgressUpdate: new Date().toISOString(),
            created_at: new Date().toISOString()
          };
          set(state => ({
            tasks: [...state.tasks, newTask]
          }));
        }

        await supabase.from('legion_events').insert({
          legion_id: legionId,
          event_type: 'operation_started',
          actor_id: u,
          metadata: { operation_id: op.id, parent_task_id: parentTaskId || op.parent_task_id }
        });

        await get().fetchSocialData();
        get().recordExecutionActivity('legion_operation_initiated');
      },

      respondToSubtask: async (subtaskId, acceptStatus) => {
        const u = get().user?.id;
        if (!u) return;

        const { error } = await supabase
          .from('legion_subtasks')
          .update({
            acceptance_status: acceptStatus
          })
          .eq('id', subtaskId);

        if (error) throw error;

        const { data: sub } = await supabase
          .from('legion_subtasks')
          .select('legion_operation_id, title, deadline, priority, task_id')
          .eq('id', subtaskId)
          .single();

        if (sub) {
          const { data: op } = await supabase
            .from('legion_operations')
            .select('legion_id')
            .eq('id', sub.legion_operation_id)
            .single();

          if (op) {
            await supabase.from('legion_events').insert({
              legion_id: op.legion_id,
              event_type: acceptStatus === 'accepted' ? 'subtask_accepted' : 'subtask_declined',
              actor_id: u
            });
          }

          // If accepted, also insert a personal task on the user's side
          if (acceptStatus === 'accepted') {
            const exists = get().tasks.some(t => t.id === sub.task_id);
            if (!exists) {
              const newTask = {
                id: sub.task_id,
                title: sub.title || 'Unnamed Objective',
                category: 'LEGION',
                effort: 'Medium',
                deadline: sub.deadline || new Date().toISOString(),
                priority: sub.priority || 'medium',
                progress: 0,
                microSteps: [],
                notes: '',
                lastProgressUpdate: new Date().toISOString(),
                created_at: new Date().toISOString()
              };
              set(state => ({
                tasks: [...state.tasks, newTask]
              }));
            }
          }
        }

        await get().fetchSocialData();
      },

      lockLegionOperation: async (operationId) => {
        const u = get().user?.id;
        if (!u) return;

        const { error } = await supabase
          .from('legion_operations')
          .update({
            status: 'active',
            locked_at: new Date().toISOString()
          })
          .eq('id', operationId);

        if (error) throw error;

        const { data: op } = await supabase
          .from('legion_operations')
          .select('legion_id')
          .eq('id', operationId)
          .single();

        if (op) {
          await supabase.from('legion_events').insert({
            legion_id: op.legion_id,
            event_type: 'operation_started',
            actor_id: u,
            metadata: { operation_id: operationId }
          });
        }

        await get().fetchSocialData();
      },

      restrainLegionMember: async (subtaskId) => {
        const u = get().user?.id;
        if (!u) return;

        const { error } = await supabase
          .from('legion_subtasks')
          .update({
            completion_status: 'restrained',
            restrained_at: new Date().toISOString(),
            restrained_by: u
          })
          .eq('id', subtaskId);

        if (error) throw error;

        const { data: sub } = await supabase
          .from('legion_subtasks')
          .select('legion_operation_id, assigned_to')
          .eq('id', subtaskId)
          .single();

        if (sub) {
          const { data: op } = await supabase
            .from('legion_operations')
            .select('legion_id')
            .eq('id', sub.legion_operation_id)
            .single();

          if (op) {
            await supabase.from('legion_events').insert({
              legion_id: op.legion_id,
              event_type: 'member_restrained',
              actor_id: u,
              target_id: sub.assigned_to,
              metadata: { subtask_id: subtaskId }
            });
          }
        }

        await get().fetchSocialData();
      },

      completeLegionSubtask: async (subtaskId, coverStatus = 'completed') => {
        const u = get().user?.id;
        if (!u) return;

        const { error } = await supabase
          .from('legion_subtasks')
          .update({
            completion_status: coverStatus,
            completed_by: u
          })
          .eq('id', subtaskId);

        if (error) throw error;

        const { data: sub } = await supabase
          .from('legion_subtasks')
          .select('legion_operation_id, assigned_to, xp_value')
          .eq('id', subtaskId)
          .single();

        if (sub) {
          const { data: op } = await supabase
            .from('legion_operations')
            .select('legion_id, parent_task_id')
            .eq('id', sub.legion_operation_id)
            .single();

          if (op) {
            await supabase.from('legion_events').insert({
              legion_id: op.legion_id,
              event_type: coverStatus === 'covered' ? 'subtask_covered' : 'subtask_completed',
              actor_id: u,
              target_id: coverStatus === 'covered' ? sub.assigned_to : null
            });

            const { data: siblings } = await supabase
              .from('legion_subtasks')
              .select('completion_status')
              .eq('legion_operation_id', sub.legion_operation_id);

            const allFinished = siblings.every(s =>
              s.completion_status === 'completed' ||
              s.completion_status === 'covered' ||
              s.completion_status === 'restrained'
            );

            if (allFinished) {
              await supabase
                .from('legion_operations')
                .update({
                  status: 'success',
                  completed_at: new Date().toISOString()
                })
                .eq('id', sub.legion_operation_id);

              await supabase.from('legion_events').insert({
                legion_id: op.legion_id,
                event_type: 'operation_success',
                actor_id: u,
                metadata: { operation_id: sub.legion_operation_id }
              });

              const { data: allSubs } = await supabase
                .from('legion_subtasks')
                .select('id, assigned_to, completed_by, completion_status, xp_value')
                .eq('legion_operation_id', sub.legion_operation_id);

              let cumulativeOperationXp = 0;
              for (const sItem of allSubs) {
                if (sItem.completion_status === 'completed' || sItem.completion_status === 'covered') {
                  const winner = sItem.completed_by || sItem.assigned_to;
                  cumulativeOperationXp += sItem.xp_value;

                  if (winner === u) {
                    const progressionEvent = createProgressionEvent({
                      eventType: 'legion_subtask_completed',
                      sourceUuid: sItem.id,
                      xpAwarded: sItem.xp_value,
                      coinsAwarded: 0,
                      metadata: {
                        legionOperationId: sub.legion_operation_id,
                        legionId: op.legion_id,
                        countsForProgression: false,
                      },
                    });
                    set(state => ({
                      executionScore: state.executionScore + sItem.xp_value,
                      xp: state.xp + sItem.xp_value,
                      pendingProgressionEvents: [
                        ...(state.pendingProgressionEvents || []),
                        progressionEvent,
                      ],
                    }));
                  }
                }
              }

              const { data: currentLegion } = await supabase
                .from('legions')
                .select('total_xp, level')
                .eq('id', op.legion_id)
                .single();

              if (currentLegion) {
                const nextXp = currentLegion.total_xp + cumulativeOperationXp;
                const nextLevel = Math.floor(nextXp / 1000) + 1;
                await supabase
                  .from('legions')
                  .update({
                    total_xp: nextXp,
                    level: nextLevel
                  })
                  .eq('id', op.legion_id);
              }
            }
          }
        }

        await get().fetchSocialData();
      },

      renameLegion: async (legionId, name) => {
        const u = get().user?.id;
        if (!u) return;

        const { error } = await supabase
          .from('legions')
          .update({ name })
          .eq('id', legionId)
          .eq('owner_id', u);

        if (error) throw error;
        await get().fetchSocialData();
      },

      leaveLegion: async (legionId) => {
        const u = get().user?.id;
        if (!u) return;

        const { error } = await supabase
          .from('legion_members')
          .update({ status: 'removed' })
          .eq('legion_id', legionId)
          .eq('user_id', u);

        if (error) throw error;
        await get().fetchSocialData();
      },

      disbandLegion: async (legionId) => {
        const u = get().user?.id;
        if (!u) return;

        const { error: memberErr } = await supabase
          .from('legion_members')
          .update({ status: 'removed' })
          .eq('legion_id', legionId);

        if (memberErr) throw memberErr;

        try {
          await supabase.from('legions').delete().eq('id', legionId);
        } catch (err) {
          console.warn('Disband delete legions failed (fallback active):', err);
        }

        await get().fetchSocialData();
      },

      kickLegionMember: async (legionId, userId) => {
        const u = get().user?.id;
        if (!u) return;

        const { error } = await supabase
          .from('legion_members')
          .update({ status: 'removed' })
          .eq('legion_id', legionId)
          .eq('user_id', userId);

        if (error) throw error;
        await get().fetchSocialData();
      },

      cancelLegionOperation: async (operationId) => {
        const u = get().user?.id;
        if (!u) return;

        const { error } = await supabase
          .from('legion_operations')
          .delete()
          .eq('id', operationId);

        if (error) throw error;
        await get().fetchSocialData();
      },

      removeOperationSubtask: async (subtaskId) => {
        const { error } = await supabase
          .from('legion_subtasks')
          .update({ acceptance_status: 'removed_pre_start' })
          .eq('id', subtaskId);

        if (error) throw error;
        await get().fetchSocialData();
      },

      reassignOperationSubtask: async (subtaskId, newAssigneeId) => {
        const u = get().user?.id;
        const { error } = await supabase
          .from('legion_subtasks')
          .update({
            assigned_to: newAssigneeId,
            acceptance_status: newAssigneeId === u ? 'accepted' : 'pending'
          })
          .eq('id', subtaskId);

        if (error) throw error;
        await get().fetchSocialData();
      },

      submitFailureNote: async (subtaskId, noteText) => {
        const { error } = await supabase
          .from('legion_subtasks')
          .update({
            note: noteText
          })
          .eq('id', subtaskId);

        if (error) throw error;
        await get().fetchSocialData();
      },

      recordWeeklyEvent: async (eventType, description) => {
        const u = get().user?.id;
        if (!u || leaderboardEventWritesDisabled) return;

        try {
          const { error } = await supabase
            .from('leaderboard_events')
            .insert({
              user_id: u,
              event_type: eventType,
              event_description: description
            });
          if (error) {
            const isPermanentPolicyFailure = error.code === '42501'
              || error.status === 401
              || error.status === 403;
            if (isPermanentPolicyFailure) {
              leaderboardEventWritesDisabled = true;
              console.warn('Leaderboard event writes disabled for this session because the server policy rejected them.');
              return;
            }
            throw error;
          }
        } catch (err) {
          console.error("recordWeeklyEvent error:", err);
        }
      },

      };
    },
    {
      name: 'Warscythe-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        console.log(`[SYNC TRACE] Store hydration started at ${performance.now().toFixed(1)}ms`);
        return (state, error) => {
          if (error) {
            console.log(`[SYNC TRACE] Store hydration failed at ${performance.now().toFixed(1)}ms:`, error);
          } else {
            console.log(`[SYNC TRACE] Store hydrated at ${performance.now().toFixed(1)}ms`);
          }
          if (storeSet) {
            console.log('[SYNC TRACE] Marking local store hydration attempt complete');
            storeSet({ isMerging: false, storeHydrated: true });
          }
        };
      },
      merge: (persistedState, currentState) => {
        const isMobile = typeof window !== 'undefined' && window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform();
        const merged = {
          ...currentState,
          ...persistedState,
          // Startup coordination is runtime-only. Never trust values persisted
          // by a previous browser session.
          storeHydrated: currentState.storeHydrated,
          authResolved: currentState.authResolved,
          profileResolved: currentState.profileResolved,
          downloadedRegions: isMobile
            ? (persistedState?.downloadedRegions || [])
            : [2, 3, 4, 5, 6, 7, 8, 9, 10]
        };
        if (merged.tasks) merged.tasks = merged.tasks.map(normalizeTask);
        if (merged.completedTasks) merged.completedTasks = merged.completedTasks.map(normalizeTask);
        if (merged.abandonedTasks) merged.abandonedTasks = merged.abandonedTasks.map(normalizeTask);
        return merged;
      }
    }
  )
);

// Auto-sync store state to Supabase on state change if user is logged in
let saveTimeout = null;
useWarscytheStore.subscribe((state) => {
  if (import.meta.env.DEV && localStorage.getItem('warscythe_test_realm_active') === 'true') {
    return;
  }
  if (!state.user?.id) {
    lastState = null;
    return;
  }

  // If initial server sync has not completed yet, keep lastState aligned and skip save
  if (!hasFetchedInitialState) {
    lastState = {
      tasks: state.tasks,
      rituals: state.rituals,
      completedTasks: state.completedTasks,
      abandonedTasks: state.abandonedTasks,
      xp: state.xp,
      level: state.level,
      streakCount: state.streakCount,
      notes: state.notes,
      executionScore: state.executionScore,
      collectedArtifacts: state.collectedArtifacts,
      gymLog: state.gymLog,
      activeWorkout: state.activeWorkout,
      activeScytheSkin: state.activeScytheSkin,
      activeTheme: state.activeTheme,
      unlockedScythes: state.unlockedScythes,
      unlockedThemes: state.unlockedThemes,
      downloadedRegions: state.downloadedRegions,
      coins: state.coins,
      soundscapeEnabled: state.soundscapeEnabled,
      soundscapeVolume: state.soundscapeVolume,
      isAdFree: state.isAdFree,
      referralSource: state.referralSource,
      tutorialStep: state.tutorialStep,
      hasCompletedTutorial: state.hasCompletedTutorial,
      scytheMigrationDone: state.scytheMigrationDone,
      bossKills: state.bossKills,
      customGymWorkouts: state.customGymWorkouts,
      weeklyPoints: state.weeklyPoints,
      lastActiveDate: state.lastActiveDate,
      lastResetDate: state.lastResetDate,
      firstTaskCompleted: state.firstTaskCompleted,
      scytheLevel: state.scytheLevel,
      dailyPoints: state.dailyPoints,
      rescuedFairies: state.rescuedFairies,
      hasSeenMapGuide: state.hasSeenMapGuide,
      hasSeenLedgerGuide: state.hasSeenLedgerGuide,
      hasSeenForgeGuide: state.hasSeenForgeGuide,
      hasSeenRitualsGuide: state.hasSeenRitualsGuide,
      hasSeenFitnessPeek: state.hasSeenFitnessPeek,
      currentTitle: state.currentTitle,
      unlockedTitles: state.unlockedTitles,
      onboardingProgress: state.onboardingProgress,
      onboardingActive: state.onboardingActive,
      pendingGuardianProgress: state.pendingGuardianProgress,
    };
    return;
  }

  // If currently pulling data from server, keep lastState aligned and skip save
  if (isSyncingFromServer) {
    lastState = {
      tasks: state.tasks,
      rituals: state.rituals,
      completedTasks: state.completedTasks,
      abandonedTasks: state.abandonedTasks,
      xp: state.xp,
      level: state.level,
      streakCount: state.streakCount,
      notes: state.notes,
      executionScore: state.executionScore,
      collectedArtifacts: state.collectedArtifacts,
      gymLog: state.gymLog,
      activeWorkout: state.activeWorkout,
      activeScytheSkin: state.activeScytheSkin,
      activeTheme: state.activeTheme,
      unlockedScythes: state.unlockedScythes,
      unlockedThemes: state.unlockedThemes,
      downloadedRegions: state.downloadedRegions,
      coins: state.coins,
      soundscapeEnabled: state.soundscapeEnabled,
      soundscapeVolume: state.soundscapeVolume,
      isAdFree: state.isAdFree,
      referralSource: state.referralSource,
      tutorialStep: state.tutorialStep,
      hasCompletedTutorial: state.hasCompletedTutorial,
      scytheMigrationDone: state.scytheMigrationDone,
      bossKills: state.bossKills,
      customGymWorkouts: state.customGymWorkouts,
      weeklyPoints: state.weeklyPoints,
      lastActiveDate: state.lastActiveDate,
      lastResetDate: state.lastResetDate,
      firstTaskCompleted: state.firstTaskCompleted,
      scytheLevel: state.scytheLevel,
      dailyPoints: state.dailyPoints,
      rescuedFairies: state.rescuedFairies,
      hasSeenMapGuide: state.hasSeenMapGuide,
      hasSeenLedgerGuide: state.hasSeenLedgerGuide,
      hasSeenForgeGuide: state.hasSeenForgeGuide,
      hasSeenRitualsGuide: state.hasSeenRitualsGuide,
      hasSeenFitnessPeek: state.hasSeenFitnessPeek,
      currentTitle: state.currentTitle,
      unlockedTitles: state.unlockedTitles,
      onboardingProgress: state.onboardingProgress,
      onboardingActive: state.onboardingActive,
      pendingGuardianProgress: state.pendingGuardianProgress,
    };
    return;
  }

  // Initialize lastState if it hasn't been set yet
  if (!lastState) {
    lastState = {
      tasks: state.tasks,
      rituals: state.rituals,
      completedTasks: state.completedTasks,
      abandonedTasks: state.abandonedTasks,
      xp: state.xp,
      level: state.level,
      streakCount: state.streakCount,
      notes: state.notes,
      executionScore: state.executionScore,
      collectedArtifacts: state.collectedArtifacts,
      gymLog: state.gymLog,
      activeWorkout: state.activeWorkout,
      activeScytheSkin: state.activeScytheSkin,
      activeTheme: state.activeTheme,
      unlockedScythes: state.unlockedScythes,
      unlockedThemes: state.unlockedThemes,
      downloadedRegions: state.downloadedRegions,
      coins: state.coins,
      soundscapeEnabled: state.soundscapeEnabled,
      soundscapeVolume: state.soundscapeVolume,
      isAdFree: state.isAdFree,
      referralSource: state.referralSource,
      tutorialStep: state.tutorialStep,
      hasCompletedTutorial: state.hasCompletedTutorial,
      scytheMigrationDone: state.scytheMigrationDone,
      bossKills: state.bossKills,
      customGymWorkouts: state.customGymWorkouts,
      weeklyPoints: state.weeklyPoints,
      lastActiveDate: state.lastActiveDate,
      lastResetDate: state.lastResetDate,
      firstTaskCompleted: state.firstTaskCompleted,
      scytheLevel: state.scytheLevel,
      dailyPoints: state.dailyPoints,
      rescuedFairies: state.rescuedFairies,
      hasSeenMapGuide: state.hasSeenMapGuide,
      hasSeenLedgerGuide: state.hasSeenLedgerGuide,
      hasSeenForgeGuide: state.hasSeenForgeGuide,
      hasSeenRitualsGuide: state.hasSeenRitualsGuide,
      hasSeenFitnessPeek: state.hasSeenFitnessPeek,
    };
    return;
  }

  // Check if relevant game progress state has changed
  const changedFields = [];
  if (state.tasks !== lastState.tasks) changedFields.push('tasks');
  if (state.rituals !== lastState.rituals) changedFields.push('rituals');
  if (state.completedTasks !== lastState.completedTasks) changedFields.push('completedTasks');
  if (state.abandonedTasks !== lastState.abandonedTasks) changedFields.push('abandonedTasks');
  if (state.xp !== lastState.xp) changedFields.push('xp');
  if (state.level !== lastState.level) changedFields.push('level');
  if (state.streakCount !== lastState.streakCount) changedFields.push('streakCount');
  if (state.notes !== lastState.notes) changedFields.push('notes');
  if (state.executionScore !== lastState.executionScore) changedFields.push('executionScore');
  if (state.collectedArtifacts !== lastState.collectedArtifacts) changedFields.push('collectedArtifacts');
  if (state.gymLog !== lastState.gymLog) changedFields.push('gymLog');
  if (state.activeWorkout !== lastState.activeWorkout) changedFields.push('activeWorkout');
  if (state.activeScytheSkin !== lastState.activeScytheSkin) changedFields.push('activeScytheSkin');
  if (state.activeTheme !== lastState.activeTheme) changedFields.push('activeTheme');
  if (state.unlockedScythes !== lastState.unlockedScythes) changedFields.push('unlockedScythes');
  if (state.unlockedThemes !== lastState.unlockedThemes) changedFields.push('unlockedThemes');
  if (state.downloadedRegions !== lastState.downloadedRegions) changedFields.push('downloadedRegions');
  if (state.coins !== lastState.coins) changedFields.push('coins');
  if (state.soundscapeEnabled !== lastState.soundscapeEnabled) changedFields.push('soundscapeEnabled');
  if (state.soundscapeVolume !== lastState.soundscapeVolume) changedFields.push('soundscapeVolume');
  if (state.isAdFree !== lastState.isAdFree) changedFields.push('isAdFree');
  if (state.referralSource !== lastState.referralSource) changedFields.push('referralSource');
  if (state.tutorialStep !== lastState.tutorialStep) changedFields.push('tutorialStep');
  if (state.hasCompletedTutorial !== lastState.hasCompletedTutorial) changedFields.push('hasCompletedTutorial');
  if (state.scytheMigrationDone !== lastState.scytheMigrationDone) changedFields.push('scytheMigrationDone');
  if (state.bossKills !== lastState.bossKills) changedFields.push('bossKills');
  if (state.customGymWorkouts !== lastState.customGymWorkouts) changedFields.push('customGymWorkouts');
  if (state.weeklyPoints !== lastState.weeklyPoints) changedFields.push('weeklyPoints');
  if (state.lastActiveDate !== lastState.lastActiveDate) changedFields.push('lastActiveDate');
  if (state.lastResetDate !== lastState.lastResetDate) changedFields.push('lastResetDate');
  if (state.firstTaskCompleted !== lastState.firstTaskCompleted) changedFields.push('firstTaskCompleted');
  if (state.scytheLevel !== lastState.scytheLevel) changedFields.push('scytheLevel');
  if (state.dailyPoints !== lastState.dailyPoints) changedFields.push('dailyPoints');
  if (state.rescuedFairies !== lastState.rescuedFairies) changedFields.push('rescuedFairies');
  if (state.currentTitle !== lastState.currentTitle) changedFields.push('currentTitle');
  if (state.unlockedTitles !== lastState.unlockedTitles) changedFields.push('unlockedTitles');
  if (state.onboardingProgress !== lastState.onboardingProgress) changedFields.push('onboardingProgress');
  if (state.onboardingActive !== lastState.onboardingActive) changedFields.push('onboardingActive');
  if (state.pendingGuardianProgress !== lastState.pendingGuardianProgress) changedFields.push('pendingGuardianProgress');
  if (state.hasSeenMapGuide !== lastState.hasSeenMapGuide) changedFields.push('hasSeenMapGuide');
  if (state.hasSeenLedgerGuide !== lastState.hasSeenLedgerGuide) changedFields.push('hasSeenLedgerGuide');
  if (state.hasSeenForgeGuide !== lastState.hasSeenForgeGuide) changedFields.push('hasSeenForgeGuide');
  if (state.hasSeenRitualsGuide !== lastState.hasSeenRitualsGuide) changedFields.push('hasSeenRitualsGuide');
  if (state.hasSeenFitnessPeek !== lastState.hasSeenFitnessPeek) changedFields.push('hasSeenFitnessPeek');

  const hasChanged = changedFields.length > 0;

  if (hasChanged) {
    console.log(`[SYNC TRACE] Subscriber fired at ${performance.now().toFixed(1)}ms for fields:`, changedFields);
    console.error('[Warscythe Sync Debug] State change detected in fields:', changedFields);
    
    // Update local snapshot immediately to prevent duplicate triggers
    lastState = {
      tasks: state.tasks,
      rituals: state.rituals,
      completedTasks: state.completedTasks,
      abandonedTasks: state.abandonedTasks,
      xp: state.xp,
      level: state.level,
      streakCount: state.streakCount,
      notes: state.notes,
      executionScore: state.executionScore,
      collectedArtifacts: state.collectedArtifacts,
      gymLog: state.gymLog,
      activeWorkout: state.activeWorkout,
      activeScytheSkin: state.activeScytheSkin,
      activeTheme: state.activeTheme,
      unlockedScythes: state.unlockedScythes,
      unlockedThemes: state.unlockedThemes,
      downloadedRegions: state.downloadedRegions,
      coins: state.coins,
      soundscapeEnabled: state.soundscapeEnabled,
      soundscapeVolume: state.soundscapeVolume,
      isAdFree: state.isAdFree,
      referralSource: state.referralSource,
      tutorialStep: state.tutorialStep,
      hasCompletedTutorial: state.hasCompletedTutorial,
      scytheMigrationDone: state.scytheMigrationDone,
      bossKills: state.bossKills,
      customGymWorkouts: state.customGymWorkouts,
      weeklyPoints: state.weeklyPoints,
      lastActiveDate: state.lastActiveDate,
      lastResetDate: state.lastResetDate,
      firstTaskCompleted: state.firstTaskCompleted,
      scytheLevel: state.scytheLevel,
      dailyPoints: state.dailyPoints,
      rescuedFairies: state.rescuedFairies,
      currentTitle: state.currentTitle,
      unlockedTitles: state.unlockedTitles,
      onboardingProgress: state.onboardingProgress,
      onboardingActive: state.onboardingActive,
      pendingGuardianProgress: state.pendingGuardianProgress,
      hasSeenMapGuide: state.hasSeenMapGuide,
      hasSeenLedgerGuide: state.hasSeenLedgerGuide,
      hasSeenForgeGuide: state.hasSeenForgeGuide,
      hasSeenRitualsGuide: state.hasSeenRitualsGuide,
      hasSeenFitnessPeek: state.hasSeenFitnessPeek,
    };

    // Set status to pending and mark unsynced changes immediately
    useWarscytheStore.setState({ syncStatus: 'pending', hasPendingChanges: true });

    const changedDomains = getDomainsForFields(changedFields);
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      useWarscytheStore.getState().saveUserState(state.user.id, changedDomains);
    }, 5000); // Batch rapid tutorial, workout, and task mutations into one sync.
  }
});

const waitForStoreHydration = () => {
  if (useWarscytheStore.persist.hasHydrated()) return Promise.resolve();
  return new Promise(resolve => {
    const unsubscribe = useWarscytheStore.persist.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });
};

// Listen to auth state changes to fetch latest user state on app initialization/refresh
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log(`[AUTH TRACE] onAuthStateChange fired with event: ${event}, user ID: ${session?.user?.id || 'none'}`);

  await waitForStoreHydration();
  const state = useWarscytheStore.getState();
  const currentUser = state.user;

  if (event === 'PASSWORD_RECOVERY') {
    useWarscytheStore.setState({ showResetPasswordModal: true });
  }

  if (session?.user) {
    const isNewSignIn = event === 'SIGNED_IN' && (!currentUser || currentUser.id !== session.user.id);
    const isInitialLoad = !hasFetchedInitialState;
    console.log(`[AUTH TRACE] User found. isNewSignIn: ${isNewSignIn}, isInitialLoad: ${isInitialLoad}, hasFetchedInitialState: ${hasFetchedInitialState}`);

    // If a different user is logging in, wipe current client state first to prevent crossover
    if (currentUser && currentUser.id !== session.user.id) {
      console.log(`[AUTH TRACE] Wiping client state because user switched from ${currentUser.id} to ${session.user.id}`);
      state.clearClientState();
    }

    useWarscytheStore.setState({
      user: session.user,
      authResolved: true,
      profileResolved: false,
    });

    if (isNewSignIn || isInitialLoad) {
      console.log(`[AUTH TRACE] Triggering initial server load...`);
      const loadTimeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Initial server load timed out after 8 seconds')), 8000)
      );
      try {
        await Promise.race([
          (async () => {
            await useWarscytheStore.getState().fetchUserState(session.user.id);
          })(),
          loadTimeoutPromise
        ]);
      } catch (loadErr) {
        console.error(`[AUTH TRACE] Error during initial server load:`, loadErr);
      } finally {
        hasFetchedInitialState = true;
        useWarscytheStore.setState({ profileResolved: true });
        console.log(`[AUTH TRACE] Initial server load completed. hasFetchedInitialState is now: ${hasFetchedInitialState}`);
      }
    } else {
      useWarscytheStore.setState({ profileResolved: true });
    }
  } else {
    console.log(`[AUTH TRACE] No user session found.`);
    // If session is null, but we had a logged-in user, they signed out - wipe state to default template
    if (currentUser) {
      console.log(`[AUTH TRACE] Wiping client state because logged-in user signed out.`);
      state.clearClientState();
    }
    useWarscytheStore.setState({
      user: null,
      authResolved: true,
      profileResolved: true,
    });
  }
});
