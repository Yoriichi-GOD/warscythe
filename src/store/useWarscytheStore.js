import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { ph } from '../lib/ph';
import {
  REGIONS, TITLES, LORE_TEMPLATES, ARTIFACT_POOL,
  EFFORT_MULT, TASKS_PER_LEVEL, MAX_TASKS, POINTS_BASE
} from './constants';

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const todayKey = () => new Date().toISOString().slice(0, 10);

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

const getLore = (regionIdx) => {
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

const rollReward = (forceEpic = false) => {
  const r = Math.random();
  let rarity, bonusPts;
  if (forceEpic || r < 0.05) { rarity = 'epic'; bonusPts = 300 + Math.floor(Math.random() * 200); }
  else if (r < 0.15) { rarity = 'rare'; bonusPts = 150 + Math.floor(Math.random() * 100); }
  else if (r < 0.40) { rarity = 'uncommon'; bonusPts = 75 + Math.floor(Math.random() * 75); }
  else { rarity = 'common'; bonusPts = 25 + Math.floor(Math.random() * 50); }
  const pool = ARTIFACT_POOL[rarity];
  const artifact = pool[Math.floor(Math.random() * pool.length)];
  return { rarity, artifact, bonusPts };
};

export const useWarscytheStore = create(
  persist(
    (set, get) => ({
      tasks: [],
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
      consecutiveLow: 0,
      closerDismissed: false,
      isFocusMode: false,
      focusedTaskId: null,
      streakCount: 0,
      xp: 0,
      scytheLevel: "DORMANT",
      lastActiveDate: null,
      bossKills: 0,
      unlockedScythes: ['neophyte', 'acolyte', 'reaper', 'executioner', 'sovereign', 'void-walker', 'eternal', 'death-lord'],
      user: null,

      // Auth & Sync
      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        set({ user: data.user });
        ph.identify(data.user.id, { email });
        ph.capture('warscythe_sign_in');
      },

      signUp: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // If email confirmation is enabled, data.user might be null or not fully logged in.
        // Assuming auto-login or that the user is returned.
        if (data.user) {
           set({ user: data.user });
           ph.identify(data.user.id, { email });
        }
        ph.capture('warscythe_sign_up');
      },

      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null });
        ph.capture('warscythe_sign_out');
      },

      // Actions
      addTask: (title, category, effort, deadline) => {
        const activeCount = get().tasks.filter(t => t.progress < 80).length;
        if (activeCount >= MAX_TASKS) return false;

        const newTask = {
          id: genId(),
          title,
          category,
          effort,
          deadline,
          progress: 0,
          createdAt: new Date().toISOString(),
          completedAt: null,
          stalledAt: null,
          notes: '',
          microSteps: [],
          lastProgressUpdate: new Date().toISOString()
        };

        set(state => ({
          tasks: [...state.tasks, newTask]
        }));
        return true;
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
        const reward = rollReward(isBoss);

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
        
        // Elite Leveling Logic
        let newScytheLevel = "DORMANT";
        if (newXP >= 1000) newScytheLevel = "PLATINUM";
        else if (newXP >= 600) newScytheLevel = "ASCENDED";
        else if (newXP >= 300) newScytheLevel = "REFINED";
        else if (newXP >= 150) newScytheLevel = "HARDENED";
        else if (newXP >= 50) newScytheLevel = "AWAKENED";

        const today = todayKey();
        const dailyLog = { ...state.dailyLog };
        if (!dailyLog[today]) dailyLog[today] = { completed: 0, weight: 0 };
        dailyLog[today].completed++;
        dailyLog[today].weight = (dailyLog[today].weight || 0) + mult;

        const currentLevelProgress = state.currentLevelProgress + 1;
        let level = state.level;
        let currentTitle = state.currentTitle;
        let pendingLevelUp = null;

        // Lore unlock
        const regionIdx = level - 1;
        const loreArr = getLore(regionIdx);
        const fragment = loreArr[Math.min(currentLevelProgress - 1, loreArr.length - 1)];
        const unlockedLore = { ...state.unlockedLore };
        if (!unlockedLore[regionIdx]) unlockedLore[regionIdx] = [];
        if (unlockedLore[regionIdx].length < 10) unlockedLore[regionIdx].push(fragment);

        // Level up check
        let finalLevelProgress = currentLevelProgress;
        if (currentLevelProgress >= TASKS_PER_LEVEL) {
          finalLevelProgress = 0;
          level++;
          // Get title from TITLES array
          currentTitle = level <= TITLES.length ? TITLES[level - 1] : TITLES[TITLES.length - 1] + ' ' + (level - TITLES.length + 1);
          pendingLevelUp = {
            regionIdx: level - 1,
            newLevel: level,
            newTitle: currentTitle
          };
        }

        set({
          tasks: state.tasks.filter(t => t.id !== id),
          completedTasks: [task, ...state.completedTasks],
          executionScore: state.executionScore + totalPts,
          dailyLog,
          xp: newXP,
          scytheLevel: newScytheLevel,
          totalCompletions: state.totalCompletions + 1,
          currentLevelProgress: finalLevelProgress,
          level,
          currentTitle,
          consecutiveLow,
          collectedArtifacts: [...state.collectedArtifacts, { ...reward.artifact, rarity: reward.rarity, date: new Date().toISOString() }],
          unlockedLore,
          pendingReward: { reward, basePts, totalPts, fragment, taskTitle: task.title },
          pendingLevelUp,
          closerDismissed: false,
          lastActiveDate: today,
          bossKills: state.bossKills + (isBoss ? 1 : 0)
        });

        ph.capture('operation_conquered', {
          category: task.category,
          pts: totalPts,
          level_up: !!pendingLevelUp
        });

        get().updateStreak();
      },

      updateStreak: () => {
        const today = todayKey();
        const state = get();
        if (state.lastActiveDate === today) return;

        const last = state.lastActiveDate ? new Date(state.lastActiveDate) : null;
        const now = new Date(today);
        const diffDays = last ? Math.floor((now - last) / (1000 * 60 * 60 * 24)) : 0;

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

        // Re-calculate Scythe Level after potential decay
        let newScytheLevel = "DORMANT";
        if (newXP >= 1000) newScytheLevel = "PLATINUM";
        else if (newXP >= 600) newScytheLevel = "ASCENDED";
        else if (newXP >= 300) newScytheLevel = "REFINED";
        else if (newXP >= 150) newScytheLevel = "HARDENED";
        else if (newXP >= 50) newScytheLevel = "AWAKENED";

        set({ 
          streakCount: newStreak, 
          xp: newXP,
          scytheLevel: newScytheLevel,
          lastActiveDate: today 
        });

        // Check for milestones
        const milestones = { 
          5: 'neophyte', 
          15: 'acolyte', 
          30: 'reaper', 
          60: 'executioner', 
          120: 'sovereign', 
          200: 'void-walker', 
          300: 'eternal', 
          360: 'death-lord' 
        };
        if (milestones[newStreak]) {
          set(state => ({
            unlockedScythes: [...new Set([...state.unlockedScythes, milestones[newStreak]])]
          }));
        }
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

      updateTaskNotes: (id, notes) => {
        set(state => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, notes } : t)
        }));
      },

      toggleMicroStep: (taskId, stepId) => {
        set(state => ({
          tasks: state.tasks.map(t => {
            if (t.id === taskId) {
              return {
                ...t,
                microSteps: t.microSteps.map(s => s.id === stepId ? { ...s, checked: !s.checked } : s)
              };
            }
            return t;
          })
        }));
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

        const microSteps = Array.from({ length: count }, (_, i) => ({
          id: genId(),
          label: `${v[i % v.length]}: ${task.progress + sz * i}% → ${Math.min(100, task.progress + sz * (i + 1))}% (5-10 min)`,
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
      }
    }),
    {
      name: 'Warscythe-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
