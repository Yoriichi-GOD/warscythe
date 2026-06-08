import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { ph } from '../lib/ph';
import { triggerHaptics, scheduleStreakAlert } from '../utils/nativeTriggers';
import {
  REGIONS, TITLES, LORE_TEMPLATES, BASE_ARTIFACTS,
  EFFORT_MULT, TASKS_PER_LEVEL, MAX_TASKS, POINTS_BASE
} from './constants';

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const todayKey = () => new Date().toISOString().slice(0, 10);

let isSyncingFromServer = false;
let lastState = null;

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
  const tasks = mergeArraysById(local.tasks || [], saved.tasks || [], 'id', 'lastProgressUpdate');
  const rituals = mergeArraysById(local.rituals || [], saved.rituals || [], 'id', 'lastCompletedAt');
  const completedTasks = mergeArraysById(local.completedTasks || [], saved.completedTasks || [], 'id', 'completedAt');
  const abandonedTasks = mergeArraysById(local.abandonedTasks || [], saved.abandonedTasks || [], 'id', 'completedAt');
  const gymLog = mergeArraysById(local.gymLog || [], saved.gymLog || [], 'id', 'date');
  const collectedArtifacts = mergeArraysById(local.collectedArtifacts || [], saved.collectedArtifacts || [], 'name', 'date');

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

  // Daily Log
  const dailyLog = { ...(local.dailyLog || {}) };
  Object.entries(saved.dailyLog || {}).forEach(([date, score]) => {
    dailyLog[date] = Math.max(dailyLog[date] || 0, score || 0);
  });

  // Unlocked Lore
  const unlockedLore = { ...(local.unlockedLore || {}) };
  Object.entries(saved.unlockedLore || {}).forEach(([region, serverFrags]) => {
    const localFrags = unlockedLore[region] || [];
    if (serverFrags.length > localFrags.length) {
      unlockedLore[region] = serverFrags;
    }
  });

  // Active Workout
  let activeWorkout = local.activeWorkout;
  if (saved.activeWorkout) {
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
  const scytheLevel = scytheLevels[Math.max(levelLocal, levelServer)];

  // Simple Flags
  const scytheMigrationDone = !!(local.scytheMigrationDone || saved.scytheMigrationDone);
  const hasCompletedTutorial = !!(local.hasCompletedTutorial || saved.hasCompletedTutorial);
  const tutorialStep = local.tutorialStep || saved.tutorialStep || 'not_started';
  const firstTaskCompleted = !!(local.firstTaskCompleted || saved.firstTaskCompleted);
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
    dailyLog,
    unlockedLore,
    activeWorkout,
    scytheLevel,
    scytheMigrationDone,
    hasCompletedTutorial,
    tutorialStep,
    firstTaskCompleted,
    lastActiveDate,
    lastResetDate,
    rescuedFairies
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
  if (regionIdx < LORE_TEMPLATES.length) return LORE_TEMPLATES[regionIdx];
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

export const useWarscytheStore = create(
  persist(
    (set, get) => ({
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
      scytheMigrationDone: false,
      coins: 0,
      gymLog: [],
      activeWorkout: null,
      hasCompletedTutorial: false,
      tutorialStep: 'not_started',
      firstTaskCompleted: false,
      dailyPoints: 0,
      lastResetDate: null,
      syncStatus: 'synced',
      hasPendingChanges: false,
      isMerging: false,
      user: null,
      rescuedFairies: {},
      pendingVictoryScreen: null,
      receivedProphecies: [],

      // Auth & Sync
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        set({ user: data.user });
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
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        
        // If email confirmation is enabled, session is null, so we DO NOT log them in.
        // If email confirmation is disabled, session is populated, so we log them in.
        if (data.session) {
          set({ user: data.user });
          ph.identify(data.user.id, { email });
        }
        ph.capture('warscythe_sign_up');
      },

      signOut: async () => {
        await supabase.auth.signOut();
        // Reset all client state to defaults on log out
        set({
          user: null,
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
          scytheMigrationDone: false,
          coins: 0,
          gymLog: [],
          activeWorkout: null,
          hasCompletedTutorial: false,
          tutorialStep: 'not_started',
          firstTaskCompleted: false,
          dailyPoints: 0,
          lastResetDate: null,
          syncStatus: 'synced',
          hasPendingChanges: false,
          isMerging: false,
          rescuedFairies: {},
          pendingVictoryScreen: null,
          receivedProphecies: [],
        });
        ph.capture('warscythe_sign_out');
      },

      fetchUserState: async (userId) => {
        if (get().isMerging) return;
        set({ isMerging: true });
        try {
          isSyncingFromServer = true;
          const { data, error } = await supabase
            .from('profiles')
            .select('state')
            .eq('id', userId)
            .single();
            
          if (error) {
            // If no profile row exists, create one with the current store state
            if (error.code === 'PGRST116') {
              isSyncingFromServer = false;
              await get().saveUserState(userId);
            } else {
              console.error('Error fetching user state:', error.message);
            }
          } else if (data && data.state) {
            const saved = data.state;
            const merged = mergeState(get(), saved);
            set({
              ...merged,
              syncStatus: 'synced',
              hasPendingChanges: false
            });
            // Immediately write the merged state back to the server to ensure parity
            await get().saveUserState(userId);
          }
        } catch (err) {
          console.error('Exception in fetchUserState:', err);
        } finally {
          isSyncingFromServer = false;
          set({ isMerging: false });
        }
      },

      saveUserState: async (userId) => {
        const u = userId || get().user?.id;
        if (!u) return;
        
        set({ syncStatus: 'pending' });
        const state = get();
        const payload = {
          tasks: state.tasks,
          rituals: state.rituals,
          completedTasks: state.completedTasks,
          abandonedTasks: state.abandonedTasks,
          executionScore: state.executionScore,
          dailyLog: state.dailyLog,
          notes: state.notes,
          level: state.level,
          totalCompletions: state.totalCompletions,
          currentLevelProgress: state.currentLevelProgress,
          collectedArtifacts: state.collectedArtifacts,
          unlockedLore: state.unlockedLore,
          currentTitle: state.currentTitle,
          consecutiveLow: state.consecutiveLow,
          streakCount: state.streakCount,
          xp: state.xp,
          scytheLevel: state.scytheLevel,
          lastActiveDate: state.lastActiveDate,
          bossKills: state.bossKills,
          unlockedScythes: state.unlockedScythes,
          scytheMigrationDone: state.scytheMigrationDone,
          coins: state.coins,
          gymLog: state.gymLog,
          activeWorkout: state.activeWorkout,
          hasCompletedTutorial: state.hasCompletedTutorial,
          tutorialStep: state.tutorialStep,
          firstTaskCompleted: state.firstTaskCompleted,
          dailyPoints: state.dailyPoints,
          lastResetDate: state.lastResetDate,
          rescuedFairies: state.rescuedFairies,
        };

        try {
          const { error } = await supabase.from('profiles').upsert({
            id: u,
            state: payload,
            updated_at: new Date().toISOString()
          });
          if (error) {
            console.error('Save error:', error.message);
            set({ syncStatus: 'failed' });
          } else {
            set({ syncStatus: 'synced', hasPendingChanges: false });
          }
        } catch (err) {
          console.error('Exception in saveUserState:', err);
          set({ syncStatus: 'failed' });
        }
      },

      forceSync: async () => {
        const u = get().user?.id;
        if (!u) return;

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
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const target = new Date(deadline);
          target.setHours(0, 0, 0, 0);
          const diffMs = target - today;
          const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
          
          if (effort === 'Low' && diffDays < 1) {
            return "Low effort tasks must have a minimum limit of 1 day.";
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
          lastProgressUpdate: new Date().toISOString()
        };

        set(state => {
          const updates = { tasks: [...state.tasks, newTask] };
          if (state.tutorialStep === 'task_creation') {
            updates.tutorialStep = 'completed';
            updates.hasCompletedTutorial = true;
          }
          return updates;
        });
        return true;
      },

      addRitual: (title, frequency, effort) => {
        const newRitual = {
          id: genId(),
          title,
          frequency, // 'daily' | 'weekly'
          effort,    // 'Low' | 'Medium' | 'High' | 'Boss'
          streak: 0,
          bestStreak: 0,
          lastCompletedAt: null,
          createdAt: new Date().toISOString()
        };
        set(state => ({
          rituals: [...(state.rituals || []), newRitual]
        }));
        return true;
      },

      deleteRitual: (id) => {
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
      },

      completeTask: (id) => {
        get().updateStreak();
        const state = get();
        const taskIdx = state.tasks.findIndex(t => t.id === id);
        if (taskIdx === -1) return;

        const task = { ...state.tasks[taskIdx] };
        task.progress = 100;
        task.completedAt = new Date().toISOString();

        const isStalled = task.progress >= 80 && task.progress < 95 && task.stalledAt;
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

        // Daily Points and Daily-based Scythe Level Reset
        const dailyPoints = state.dailyPoints + totalPts;
        let newScytheLevel = "DORMANT";
        if (dailyPoints >= 1000) newScytheLevel = "PLATINUM";
        else if (dailyPoints >= 700) newScytheLevel = "ASCENDED";
        else if (dailyPoints >= 400) newScytheLevel = "REFINED";
        else if (dailyPoints >= 250) newScytheLevel = "HARDENED";
        else if (dailyPoints >= 100) newScytheLevel = "AWAKENED";

        // Digital Coins Award
        const coinReward = Math.round(basePts * 0.1) + Math.round(reward.bonusPts * 0.1);
        const newCoins = state.coins + coinReward;

        const today = todayKey();
        const dailyLog = { ...state.dailyLog };
        if (!dailyLog[today]) dailyLog[today] = { completed: 0, weight: 0 };
        dailyLog[today].completed++;
        dailyLog[today].weight = (dailyLog[today].weight || 0) + mult;

        const newTotalCompletions = state.totalCompletions + 1;
        const newLevel = Math.floor(newTotalCompletions / TASKS_PER_LEVEL) + 1;
        const finalLevelProgress = newTotalCompletions % TASKS_PER_LEVEL;

        const keyElements = ['fire', 'water', 'earth', 'wind', 'spirit'];
        const keyIndex = (newTotalCompletions - 1) % TASKS_PER_LEVEL;
        const keyElement = keyElements[keyIndex % keyElements.length];

        let level = state.level;
        let currentTitle = state.currentTitle;
        let pendingLevelUp = null;

        // Lore unlock
        const regionIdx = level - 1;
        const loreArr = getLore(regionIdx);
        const fragIdx = finalLevelProgress === 0 ? TASKS_PER_LEVEL - 1 : finalLevelProgress - 1;
        const fragment = loreArr[Math.min(Math.max(0, fragIdx), loreArr.length - 1)];
        const unlockedLore = { ...state.unlockedLore };
        if (!unlockedLore[regionIdx]) unlockedLore[regionIdx] = [];
        if (unlockedLore[regionIdx].length < 10 && fragment && !unlockedLore[regionIdx].includes(fragment)) {
          unlockedLore[regionIdx].push(fragment);
        }

        const rescuedFairies = { ...(state.rescuedFairies || {}) };

        let pendingVictoryScreen = null;
        // Level up check
        if (newLevel > state.level) {
          const oldMapIndex = ((state.level - 1) % 10) + 1;
          level = newLevel;
          currentTitle = level <= TITLES.length ? TITLES[level - 1] : TITLES[TITLES.length - 1] + ' ' + (level - TITLES.length + 1);
          pendingLevelUp = {
            regionIdx: level - 1,
            newLevel: level,
            newTitle: currentTitle
          };
          pendingVictoryScreen = {
            regionIdx: state.level - 1,
            mapIndex: oldMapIndex,
            taskTitle: task.title
          };
          if (!rescuedFairies[state.level - 1]) {
            rescuedFairies[state.level - 1] = {
              date: new Date().toISOString(),
              taskTitle: task.title,
              taskCategory: task.category || 'General'
            };
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
          currentLevelProgress: finalLevelProgress,
          level,
          currentTitle,
          consecutiveLow,
          collectedArtifacts: [...state.collectedArtifacts, {
            ...reward.artifact,
            rarity: reward.rarity,
            date: new Date().toISOString(),
            context: !state.firstTaskCompleted 
              ? "Forged during your Tactical Onboarding. Your journey has begun."
              : `Forged on Day ${state.streakCount} of the Quest.`,
            effortContext: !state.firstTaskCompleted
              ? "Initial Command execution completed successfully."
              : `Claimed during a ${task.effort || 'Moderate'} Resistance Strike.`
          }],
          unlockedLore,
          pendingReward: { reward, basePts, totalPts, fragment, taskTitle: task.title, keyElement },
          pendingLevelUp,
          pendingVictoryScreen,
          closerDismissed: false,
          lastActiveDate: today,
          bossKills: state.bossKills + (isBoss ? 1 : 0),
          rescuedFairies,
          firstTaskCompleted: true
        });

        ph.capture('operation_conquered', {
          category: task.category,
          pts: totalPts,
          level_up: !!pendingLevelUp
        });

        triggerHaptics(task.effort === 'Boss' ? 'HEAVY' : 'MEDIUM');
        scheduleStreakAlert(18);
      },

      completeRitual: (id) => {
        get().updateStreak();
        const state = get();
        const rituals = state.rituals || [];
        const ritIdx = rituals.findIndex(r => r.id === id);
        if (ritIdx === -1) return;

        const ritual = { ...rituals[ritIdx] };
        const today = todayKey();

        // Prevent completing multiple times a day for daily rituals
        const isCompletedToday = ritual.lastCompletedAt && ritual.lastCompletedAt.slice(0, 10) === today;
        if (isCompletedToday) return;

        ritual.lastCompletedAt = new Date().toISOString();
        const newStreak = (ritual.streak || 0) + 1;
        ritual.streak = newStreak;
        ritual.bestStreak = Math.max(ritual.bestStreak || 0, newStreak);

        const mult = EFFORT_MULT[ritual.effort] || 1;
        let basePts = Math.round(POINTS_BASE * mult);
        const reward = rollReward(ritual.effort === 'Boss');

        const totalPts = basePts + reward.bonusPts;
        const newXP = state.xp + totalPts;

        // Daily Points and Daily-based Scythe Level Reset
        const dailyPoints = state.dailyPoints + totalPts;
        let newScytheLevel = "DORMANT";
        if (dailyPoints >= 1000) newScytheLevel = "PLATINUM";
        else if (dailyPoints >= 700) newScytheLevel = "ASCENDED";
        else if (dailyPoints >= 400) newScytheLevel = "REFINED";
        else if (dailyPoints >= 250) newScytheLevel = "HARDENED";
        else if (dailyPoints >= 100) newScytheLevel = "AWAKENED";

        // Digital Coins Award
        const coinReward = Math.round(basePts * 0.1) + Math.round(reward.bonusPts * 0.1);
        const newCoins = state.coins + coinReward;

        const dailyLog = { ...state.dailyLog };
        if (!dailyLog[today]) dailyLog[today] = { completed: 0, weight: 0 };
        dailyLog[today].completed++;
        dailyLog[today].weight = (dailyLog[today].weight || 0) + mult;

        const newTotalCompletions = state.totalCompletions + 1;
        const newLevel = Math.floor(newTotalCompletions / TASKS_PER_LEVEL) + 1;
        const finalLevelProgress = newTotalCompletions % TASKS_PER_LEVEL;

        const keyElements = ['fire', 'water', 'earth', 'wind', 'spirit'];
        const keyIndex = (newTotalCompletions - 1) % TASKS_PER_LEVEL;
        const keyElement = keyElements[keyIndex % keyElements.length];

        let level = state.level;
        let currentTitle = state.currentTitle;
        let pendingLevelUp = null;

        // Lore unlock
        const regionIdx = level - 1;
        const loreArr = getLore(regionIdx);
        const fragIdx = finalLevelProgress === 0 ? TASKS_PER_LEVEL - 1 : finalLevelProgress - 1;
        const fragment = loreArr[Math.min(Math.max(0, fragIdx), loreArr.length - 1)];
        const unlockedLore = { ...state.unlockedLore };
        if (!unlockedLore[regionIdx]) unlockedLore[regionIdx] = [];
        if (unlockedLore[regionIdx].length < 10 && fragment && !unlockedLore[regionIdx].includes(fragment)) {
          unlockedLore[regionIdx].push(fragment);
        }

        const isBoss = ritual.effort === 'Boss';
        const rescuedFairies = { ...(state.rescuedFairies || {}) };

        let pendingVictoryScreen = null;
        // Level up check
        if (newLevel > state.level) {
          const oldMapIndex = ((state.level - 1) % 10) + 1;
          level = newLevel;
          currentTitle = level <= TITLES.length ? TITLES[level - 1] : TITLES[TITLES.length - 1] + ' ' + (level - TITLES.length + 1);
          pendingLevelUp = {
            regionIdx: level - 1,
            newLevel: level,
            newTitle: currentTitle
          };
          pendingVictoryScreen = {
            regionIdx: state.level - 1,
            mapIndex: oldMapIndex,
            taskTitle: ritual.title
          };
          if (!rescuedFairies[state.level - 1]) {
            rescuedFairies[state.level - 1] = {
              date: new Date().toISOString(),
              taskTitle: ritual.title,
              taskCategory: 'Ritual'
            };
          }
        }

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
          totalCompletions: newTotalCompletions,
          currentLevelProgress: finalLevelProgress,
          level,
          currentTitle,
          collectedArtifacts: [...state.collectedArtifacts, {
            ...reward.artifact,
            rarity: reward.rarity,
            date: new Date().toISOString(),
            context: `Forged on Day ${state.streakCount} of the Quest.`,
            effortContext: `Claimed during a Daily Ritual Strike.`
          }],
          unlockedLore,
          pendingReward: { reward, basePts, totalPts, fragment, taskTitle: ritual.title, keyElement },
          pendingLevelUp,
          pendingVictoryScreen,
          closerDismissed: false,
          lastActiveDate: today,
          rescuedFairies
        });

        ph.capture('ritual_conquered', {
          effort: ritual.effort,
          pts: totalPts,
          level_up: !!pendingLevelUp
        });

        triggerHaptics(ritual.effort === 'Boss' ? 'HEAVY' : 'MEDIUM');
        scheduleStreakAlert(18);
      },

      updateStreak: () => {
        const today = todayKey();
        const state = get();

        // 5 AM RESET CHECK
        const now = new Date();
        const currentHour = now.getHours();
        const lastResetDate = state.lastResetDate;
        let scytheResetHappened = false;

        if (lastResetDate !== today && currentHour >= 5) {
          scytheResetHappened = true;
        }

        if (state.lastActiveDate === today) {
          if (scytheResetHappened && state.scytheLevel !== "DORMANT") {
            set({
              scytheLevel: "DORMANT",
              dailyPoints: 0,
              lastResetDate: today
            });
          }
          return;
        }

        const last = state.lastActiveDate ? new Date(state.lastActiveDate) : null;
        const nowDay = new Date(today);
        const diffDays = last ? Math.floor((nowDay - last) / (1000 * 60 * 60 * 24)) : 0;

        let newStreak = state.streakCount;
        let newXP = state.xp;

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 0;
          // ELITE DECAY SYSTEM: 20 XP loss per day missed
          const decayAmount = diffDays * 20;
          newXP = Math.max(0, state.xp - decayAmount);
        }

        // Daily active reset of scythe level on day transition
        const newScytheLevel = "DORMANT";
        const dailyPoints = 0;

        // Reset missed daily rituals
        const yesterday = new Date(nowDay);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);

        const updatedRituals = (state.rituals || []).map(r => {
          if (r.frequency === 'daily') {
            const lastCompDate = r.lastCompletedAt ? r.lastCompletedAt.slice(0, 10) : null;
            if (lastCompDate !== yesterdayStr && lastCompDate !== today) {
              return { ...r, streak: 0 };
            }
          }
          return r;
        });

        set({
          streakCount: newStreak,
          xp: newXP,
          dailyPoints,
          scytheLevel: newScytheLevel,
          rituals: updatedRituals,
          lastActiveDate: today,
          lastResetDate: today
        });

      },

      abandonTask: (id) => {
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
      clearPendingLevelUp: () => set({ pendingLevelUp: null }),
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

      startWorkout: (split) => {
        set({
          activeWorkout: {
            id: genId(),
            date: new Date().toISOString(),
            split: split || 'Default Split',
            movements: []
          }
        });
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
            id: genId(),
            date: new Date().toISOString(),
            ...finalWorkout
          };
          return {
            gymLog: [newWorkout, ...(state.gymLog || [])],
            activeWorkout: null
          };
        });
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

          const totalCompletions = (state.completedTasks || []).length;
          const newLevel = Math.floor(totalCompletions / TASKS_PER_LEVEL) + 1;
          const finalLevelProgress = totalCompletions % TASKS_PER_LEVEL;

          let newScytheLevel = "DORMANT";
          if (state.dailyPoints >= 1000) newScytheLevel = "PLATINUM";
          else if (state.dailyPoints >= 700) newScytheLevel = "ASCENDED";
          else if (state.dailyPoints >= 400) newScytheLevel = "REFINED";
          else if (state.dailyPoints >= 250) newScytheLevel = "HARDENED";
          else if (state.dailyPoints >= 100) newScytheLevel = "AWAKENED";

          return {
            xp: newXP,
            level: newLevel,
            totalCompletions,
            currentLevelProgress: finalLevelProgress,
            scytheLevel: newScytheLevel,
            bossKills
          };
        });
      }
    }),
    {
      name: 'Warscythe-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Auto-sync store state to Supabase on state change if user is logged in
let saveTimeout = null;
useWarscytheStore.subscribe((state) => {
  if (!state.user?.id) {
    lastState = null;
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
    };
    return;
  }

  // Check if relevant game progress state has changed
  const hasChanged =
    state.tasks !== lastState.tasks ||
    state.rituals !== lastState.rituals ||
    state.completedTasks !== lastState.completedTasks ||
    state.abandonedTasks !== lastState.abandonedTasks ||
    state.xp !== lastState.xp ||
    state.level !== lastState.level ||
    state.streakCount !== lastState.streakCount ||
    state.notes !== lastState.notes ||
    state.executionScore !== lastState.executionScore ||
    state.collectedArtifacts !== lastState.collectedArtifacts ||
    state.gymLog !== lastState.gymLog ||
    state.activeWorkout !== lastState.activeWorkout;

  if (hasChanged) {
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
    };

    // Set status to pending and mark unsynced changes immediately
    useWarscytheStore.setState({ syncStatus: 'pending', hasPendingChanges: true });

    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      useWarscytheStore.getState().saveUserState(state.user.id);
    }, 1500); // 1.5 second debounce to prevent spamming queries
  }
});

// Listen to auth state changes to fetch latest user state on app initialization/refresh
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    useWarscytheStore.setState({ user: session.user });
    await useWarscytheStore.getState().fetchUserState(session.user.id);
  }
});
