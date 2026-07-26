import React, { useEffect, useMemo, useState } from 'react';
import { useWarscytheStore, getLore } from '../../store/useWarscytheStore';
import { CAPTURE_SCENES, createCaptureRealmState } from '../../data/captureRealm';
import { REGIONS } from '../../store/constants';

const REALM_KEY = 'warscythe_test_realm_active';
const SNAPSHOT_KEY = 'warscythe_test_realm_snapshots';
const ORIGINAL_STATE_KEY = 'warscythe_test_realm_original_state';
const CAPTURE_MODE_KEY = 'warscythe_capture_mode';
const TEST_USER = {
  id: '00000000-0000-4000-8000-000000000001',
  email: 'test-realm@warscythe.local',
  aud: 'authenticated',
  role: 'authenticated'
};

const BASE_STATE = {
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
  pendingVictoryScreen: null,
  closerDismissed: false,
  isFocusMode: false,
  focusedTaskId: null,
  streakCount: 0,
  xp: 0,
  coins: 0,
  scytheLevel: 'DORMANT',
  lastActiveDate: null,
  lastResetDate: null,
  bossKills: 0,
  gymLog: [],
  activeWorkout: null,
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
  rescuedFairies: {},
  username: 'Realm Tester',
  user: TEST_USER,
  syncStatus: 'realm',
  hasPendingChanges: false,
  isMerging: false,
  isAdFree: true
};

const SNAPSHOT_FIELDS = Object.keys(BASE_STATE).filter(key => key !== 'user');

const scenarioState = (scenario) => {
  if (scenario === 'fresh') return { ...BASE_STATE };
  if (scenario === 'rituals') return {
    ...BASE_STATE,
    onboardingProgress: 3,
    tutorialStep: 'completed',
    firstTaskCompleted: true,
    postGuardianTutorial: 'rituals_intro',
    xp: 300,
    executionScore: 300
  };
  if (scenario === 'forge') return {
    ...BASE_STATE,
    onboardingProgress: 3,
    tutorialStep: 'completed',
    firstTaskCompleted: true,
    postGuardianTutorial: 'forge_intro',
    xp: 300,
    streakCount: 3,
    executionScore: 300
  };
  if (scenario === 'map') return {
    ...BASE_STATE,
    onboardingProgress: 5,
    tutorialStep: 'completed',
    firstTaskCompleted: true,
    postGuardianTutorial: 'quest_map_intro',
    level: 2,
    xp: 500,
    executionScore: 500,
    bossKills: 1,
    rescuedFairies: { 1: true },
    unlockedTitles: ['Recruit', 'Curious Explorer']
  };
  if (scenario === 'veteran') return {
    ...BASE_STATE,
    onboardingProgress: 10,
    onboardingActive: false,
    tutorialStep: 'completed',
    hasCompletedTutorial: true,
    firstTaskCompleted: true,
    level: 6,
    xp: 6665,
    coins: 2400,
    executionScore: 6665,
    streakCount: 21,
    bossKills: 5,
    scytheLevel: 'AWAKENED',
    rescuedFairies: { 1: true, 2: true, 3: true, 4: true, 5: true },
    unlockedTitles: ['Recruit', 'Curious Explorer', 'Seasoned Wanderer']
  };
  return { ...BASE_STATE };
};

const readSnapshots = () => {
  try {
    return JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || '{}');
  } catch {
    return {};
  }
};

const createMilestoneFiveTask = () => ({
  id: 'test-realm-region-one-boss',
  title: 'Defeat Malgrath the Dread',
  category: 'Onboarding Campaign',
  effort: 'Boss',
  priority: 'boss',
  progress: 100,
  microSteps: [],
  createdAt: new Date().toISOString(),
  isTutorialTask: false
});

const createMilestoneTenTask = () => ({
  id: 'test-realm-region-two-boss',
  title: 'Defeat Stoneback Krul',
  category: 'Onboarding Campaign',
  effort: 'Boss',
  priority: 'boss',
  progress: 100,
  microSteps: [],
  createdAt: new Date().toISOString(),
  isTutorialTask: false
});

const loreStateForMilestone = (progress) => {
  const firstRegionPages = Math.min(5, Math.max(0, progress));
  const secondRegionPages = Math.min(5, Math.max(0, progress - 5));
  return {
    ...(firstRegionPages ? { 0: getLore(0).slice(0, firstRegionPages) } : {}),
    ...(secondRegionPages ? { 1: getLore(1).slice(0, secondRegionPages) } : {})
  };
};

export default function TestRealm() {
  const store = useWarscytheStore();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => localStorage.getItem(REALM_KEY) === 'true');
  const [snapshotName, setSnapshotName] = useState('');
  const [snapshots, setSnapshots] = useState(readSnapshots);
  const [captureMode, setCaptureMode] = useState(() => localStorage.getItem(CAPTURE_MODE_KEY) === 'true');

  useEffect(() => {
    document.body.classList.toggle('warscythe-capture-mode', captureMode);
    localStorage.setItem(CAPTURE_MODE_KEY, String(captureMode));
    return () => document.body.classList.remove('warscythe-capture-mode');
  }, [captureMode]);

  useEffect(() => {
    const restoreControls = event => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        setCaptureMode(false);
        setOpen(true);
      }
    };
    window.addEventListener('keydown', restoreControls);
    return () => window.removeEventListener('keydown', restoreControls);
  }, []);

  const summary = useMemo(() => ({
    progress: store.onboardingProgress,
    xp: store.xp,
    coins: store.coins,
    streak: store.streakCount
  }), [store.onboardingProgress, store.xp, store.coins, store.streakCount]);

  const applyState = (next) => {
    if (localStorage.getItem(REALM_KEY) !== 'true') {
      const originalState = localStorage.getItem('Warscythe-storage');
      if (originalState) localStorage.setItem(ORIGINAL_STATE_KEY, originalState);
    }
    localStorage.setItem(REALM_KEY, 'true');
    setActive(true);
    useWarscytheStore.setState({
      ...next,
      user: TEST_USER,
      username: next.username || 'Realm Tester',
      syncStatus: 'realm',
      hasPendingChanges: false,
      isMerging: false
    });
  };

  const deactivate = () => {
    const originalState = localStorage.getItem(ORIGINAL_STATE_KEY);
    if (originalState) {
      localStorage.setItem('Warscythe-storage', originalState);
    } else {
      localStorage.removeItem('Warscythe-storage');
    }
    localStorage.removeItem(ORIGINAL_STATE_KEY);
    localStorage.removeItem(REALM_KEY);
    setActive(false);
    window.location.reload();
  };

  const setMilestone = (progress) => {
    setOpen(false);
    if (progress === 5) {
      const bossTask = createMilestoneFiveTask();
      applyState({
        ...scenarioState('fresh'),
        tasks: [bossTask],
        onboardingProgress: 4,
        onboardingActive: true,
        totalCompletions: 4,
        currentLevelProgress: 4,
        level: 1,
        xp: 400,
        executionScore: 400,
        unlockedLore: loreStateForMilestone(4),
        tutorialStep: 'completed',
        firstTaskCompleted: true
      });
      window.dispatchEvent(new CustomEvent('warscythe:test-tab', { detail: 'ops' }));
      useWarscytheStore.getState().completeTask(bossTask.id);
      return;
    }
    if (progress === 10) {
      const bossTask = createMilestoneTenTask();
      applyState({
        ...scenarioState('fresh'),
        tasks: [bossTask],
        onboardingProgress: 9,
        onboardingActive: true,
        totalCompletions: 9,
        currentLevelProgress: 4,
        level: 2,
        xp: 900,
        executionScore: 900,
        unlockedLore: loreStateForMilestone(9),
        bossKills: 1,
        rescuedFairies: {
          1: {
            date: new Date().toISOString(),
            taskTitle: 'Defeat Malgrath the Dread',
            taskCategory: 'Onboarding Campaign'
          }
        },
        unlockedTitles: ['Recruit', 'Curious Explorer'],
        tutorialStep: 'completed',
        firstTaskCompleted: true
      });
      window.dispatchEvent(new CustomEvent('warscythe:test-tab', { detail: 'ops' }));
      useWarscytheStore.getState().completeTask(bossTask.id);
      return;
    }
    const current = useWarscytheStore.getState();
    const completed = progress >= 10;
    applyState({
      ...current,
      onboardingProgress: progress,
      level: progress >= 5 ? 2 : 1,
      totalCompletions: progress,
      currentLevelProgress: progress >= 5 ? progress - 5 : progress,
      unlockedLore: loreStateForMilestone(progress),
      onboardingActive: !completed,
      pendingGuardianProgress: progress === 0 ? null : progress,
      postGuardianTutorial: null,
      hasCompletedTutorial: completed,
      tutorialStep: completed ? 'completed' : current.tutorialStep
    });
  };

  const launchTutorial = (tutorialId, tab) => {
    setOpen(false);
    const current = useWarscytheStore.getState();
    const tutorialMilestones = {
      ledger_intro: 6,
      social_intro: 7,
      codex_intro: 8,
      shop_intro: 8,
      legion_intro: 9
    };
    const prerequisite = tutorialId === 'quest_map_intro'
      ? {
          onboardingProgress: 5,
          level: 2,
          totalCompletions: 5,
          currentLevelProgress: 0,
          bossKills: Math.max(1, current.bossKills || 0),
          rescuedFairies: {
            ...(current.rescuedFairies || {}),
            0: current.rescuedFairies?.[0] || {
              date: new Date().toISOString(),
              taskTitle: 'Defeat Malgrath the Dread',
              taskCategory: 'Onboarding Campaign'
            }
          },
          unlockedTitles: Array.from(new Set([...(current.unlockedTitles || ['Recruit']), 'Curious Explorer']))
        }
      : {
          onboardingProgress: Math.max(tutorialMilestones[tutorialId] || 3, current.onboardingProgress || 0)
        };
    applyState({
      ...current,
      ...prerequisite,
      onboardingActive: true,
      tutorialStep: 'completed',
      postGuardianTutorial: tutorialId,
      pendingGuardianProgress: null,
      pendingReward: null,
      pendingLevelUp: null,
      pendingVictoryScreen: null,
      activeBossFlash: null
    });
    window.dispatchEvent(new CustomEvent('warscythe:test-tab', { detail: tab }));
  };

  const launchScytheMilestone = (days) => {
    localStorage.removeItem('warscythe-claimed-streak-scythes');
    applyState({
      ...useWarscytheStore.getState(),
      onboardingProgress: 10,
      onboardingActive: false,
      tutorialStep: 'completed',
      hasCompletedTutorial: true,
      streakCount: days
    });
    setOpen(false);
    window.dispatchEvent(new CustomEvent('warscythe:test-tab', { detail: 'ops' }));
  };

  const launchDeityTier = (id, threshold) => {
    localStorage.removeItem('warscythe-claimed-deity-tiers');
    applyState({
      ...useWarscytheStore.getState(),
      onboardingProgress: 10,
      onboardingActive: false,
      tutorialStep: 'completed',
      hasCompletedTutorial: true,
      gymLog: [{
        id: `test-deity-${id}`,
        date: new Date().toISOString(),
        movements: [{
          id: `test-deity-movement-${id}`,
          name: 'Test Realm Ascension',
          sets: [{ id: `test-deity-set-${id}`, weight: threshold, reps: 1, completed: true, type: 'working' }]
        }]
      }]
    });
    setOpen(false);
    window.dispatchEvent(new CustomEvent('warscythe:test-tab', { detail: 'fitness' }));
  };

  const launchCaptureScene = (scene) => {
    const captureState = createCaptureRealmState();
    applyState({
      ...scenarioState('veteran'),
      ...captureState,
      activeWorkout: scene.activeWorkout ? captureState.activeWorkout : null,
    });
    localStorage.setItem('warscythe_capture_scene', scene.id);
    document.body.dataset.captureScene = scene.id;
    setOpen(false);
    setCaptureMode(true);
    window.dispatchEvent(new CustomEvent('warscythe:capture-scene', { detail: scene }));
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('warscythe:capture-scene', { detail: scene }));
    }, 650);
  };

  const switchVideoRegion = (regionIndex) => {
    const current = useWarscytheStore.getState();
    applyState({
      ...current,
      level: regionIndex + 1,
    });
  };

  const saveSnapshot = () => {
    const name = snapshotName.trim() || `Snapshot ${Object.keys(snapshots).length + 1}`;
    const current = useWarscytheStore.getState();
    const snapshot = {};
    SNAPSHOT_FIELDS.forEach(field => {
      snapshot[field] = current[field];
    });
    const next = { ...snapshots, [name]: snapshot };
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(next));
    setSnapshots(next);
    setSnapshotName('');
  };

  const deleteSnapshot = (name) => {
    const next = { ...snapshots };
    delete next[name];
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(next));
    setSnapshots(next);
  };

  const numericField = (label, field, min = 0) => (
    <label className="flex items-center justify-between gap-3 text-[10px] font-mono uppercase text-zinc-400">
      {label}
      <input
        type="number"
        min={min}
        value={store[field] ?? 0}
        onChange={(event) => applyState({
          ...useWarscytheStore.getState(),
          [field]: Math.max(min, Number(event.target.value) || 0)
        })}
        className="w-24 rounded border border-cyan-500/20 bg-black px-2 py-1 text-right text-cyan-300"
      />
    </label>
  );

  return (
    <div className="warscythe-test-realm fixed bottom-20 right-4 z-[200000] font-mono">
      {open && (
        <div className="mb-3 w-[min(94vw,390px)] max-h-[75vh] overflow-y-auto rounded-xl border border-cyan-400/30 bg-[#03080d]/[0.98] p-4 text-white shadow-[0_0_60px_rgba(34,211,238,0.18)]">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="text-[9px] tracking-[0.35em] text-cyan-400">DEVELOPMENT ONLY</div>
              <h2 className="mt-1 font-serif text-lg tracking-widest">WARSCYTHE TEST REALM</h2>
              <p className="mt-1 text-[9px] leading-relaxed text-zinc-500">Local operative state. Cloud profile writes are disabled while active.</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
          </div>

          {!active ? (
            <button onClick={() => applyState(scenarioState('fresh'))} className="w-full rounded border border-cyan-400/50 bg-cyan-400/10 px-3 py-3 text-[10px] tracking-widest text-cyan-300">
              ENTER TEST REALM
            </button>
          ) : (
            <div className="space-y-5">
              <section>
                <div className="mb-2 text-[9px] tracking-[0.25em] text-cyan-400">SCENARIOS</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['Fresh Recruit', 'fresh'],
                    ['Ritual Handoff', 'rituals'],
                    ['Forge Tour', 'forge'],
                    ['Region Victory', 'map'],
                    ['Veteran', 'veteran']
                  ].map(([label, id]) => (
                    <button
                      key={id}
                      onClick={() => {
                        if (id === 'map') {
                          setMilestone(5);
                        } else {
                          applyState(scenarioState(id));
                          setOpen(false);
                        }
                      }}
                      className="rounded border border-white/10 bg-white/[0.03] px-2 py-2 text-[9px] text-zinc-300 hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-amber-300/20 bg-amber-300/[0.04] p-3">
                <div className="mb-1 text-[9px] tracking-[0.25em] text-amber-300">PRESS CAPTURE SUITE</div>
                <p className="mb-3 text-[8px] leading-relaxed text-zinc-500">
                  Founder data, completed onboarding and clean chrome-free scene states. Use a 1920px desktop viewport. Press Ctrl+Shift+P to restore these controls.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {CAPTURE_SCENES.map(scene => (
                    <button
                      key={scene.id}
                      onClick={() => launchCaptureScene(scene)}
                      className="rounded border border-amber-300/15 bg-black/30 px-2 py-2 text-left text-[8px] text-amber-100/80 hover:border-amber-300/50 hover:text-amber-200"
                    >
                      {scene.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-violet-300/20 bg-violet-300/[0.04] p-3">
                <div className="mb-1 flex items-center justify-between text-[9px] tracking-[0.25em] text-violet-300">
                  <span>VIDEO REGION</span>
                  <span>{Math.min(store.level || 1, REGIONS.length)} / {REGIONS.length}</span>
                </div>
                <p className="mb-3 text-[8px] leading-relaxed text-zinc-500">
                  Changes only the active region atmosphere. Capture data, Operations, Rituals, Fitness and Ledger evidence remain untouched.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {REGIONS.map((region, index) => {
                    const selected = (store.level || 1) === index + 1;
                    return (
                      <button
                        key={region.id || region.name || index}
                        type="button"
                        onClick={() => switchVideoRegion(index)}
                        className={`rounded border px-2 py-2 text-left text-[8px] transition-colors ${
                          selected
                            ? 'border-violet-300 bg-violet-300 text-black'
                            : 'border-white/10 bg-black/30 text-zinc-300 hover:border-violet-300/50 hover:text-violet-200'
                        }`}
                      >
                        <span className="block text-[7px] opacity-60">REGION {index + 1}</span>
                        <strong className="mt-0.5 block truncate tracking-wider">{region.name}</strong>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <div className="mb-2 flex justify-between text-[9px] tracking-[0.25em] text-cyan-400">
                  <span>ONBOARDING MILESTONE</span>
                  <span>{summary.progress}/10</span>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {Array.from({ length: 11 }, (_, index) => (
                    <button key={index} onClick={() => setMilestone(index)} className={`rounded border px-1 py-1.5 text-[9px] ${summary.progress === index ? 'border-cyan-300 bg-cyan-300 text-black' : 'border-white/10 text-zinc-400'}`}>
                      {index}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-2 text-[9px] tracking-[0.25em] text-cyan-400">REPLAY TUTORIAL</div>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => launchTutorial('rituals_intro', 'rituals')} className="rounded border border-white/10 p-2 text-[9px]">Rituals</button>
                  <button onClick={() => launchTutorial('forge_intro', 'forge')} className="rounded border border-white/10 p-2 text-[9px]">Forge</button>
                  <button onClick={() => launchTutorial('quest_map_intro', 'map')} className="rounded border border-white/10 p-2 text-[9px]">Quest Map</button>
                  <button onClick={() => launchTutorial('ledger_intro', 'ledger')} className="rounded border border-white/10 p-2 text-[9px]">Ledger</button>
                  <button onClick={() => launchTutorial('social_intro', 'social')} className="rounded border border-white/10 p-2 text-[9px]">Social</button>
                  <button onClick={() => launchTutorial('codex_intro', 'ops')} className="rounded border border-white/10 p-2 text-[9px]">Codex</button>
                  <button onClick={() => launchTutorial('shop_intro', 'ops')} className="rounded border border-white/10 p-2 text-[9px]">Shop</button>
                  <button onClick={() => launchTutorial('legion_intro', 'social')} className="rounded border border-white/10 p-2 text-[9px]">Legion</button>
                </div>
              </section>

              <section>
                <div className="mb-2 text-[9px] tracking-[0.25em] text-cyan-400">STREAK SCYTHE CEREMONY</div>
                <div className="grid grid-cols-4 gap-1">
                  {[5, 15, 30, 60, 120, 200, 300].map(days => (
                    <button key={days} onClick={() => launchScytheMilestone(days)} className="rounded border border-white/10 p-2 text-[8px] hover:border-cyan-400/40">
                      {days}D
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-2 text-[9px] tracking-[0.25em] text-cyan-400">DEITY ASCENSION CEREMONY</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['Apollo', 'apollo', 10000],
                    ['Ares', 'ares', 50000],
                    ['Hercules', 'hercules', 150000],
                    ['Zeus', 'zeus', 400000]
                  ].map(([label, id, threshold]) => (
                    <button key={id} onClick={() => launchDeityTier(id, threshold)} className="rounded border border-white/10 p-2 text-[8px] hover:border-cyan-400/40">
                      {label} // {Number(threshold).toLocaleString()}KG
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <div className="mb-2 text-[9px] tracking-[0.25em] text-cyan-400">OPERATIVE VALUES</div>
                {numericField('XP', 'xp')}
                {numericField('Coins', 'coins')}
                {numericField('Streak', 'streakCount')}
                {numericField('Boss Kills', 'bossKills')}
              </section>

              <section>
                <div className="mb-2 text-[9px] tracking-[0.25em] text-cyan-400">LOCAL SNAPSHOTS</div>
                <div className="flex gap-2">
                  <input value={snapshotName} onChange={(event) => setSnapshotName(event.target.value)} placeholder="Snapshot name" className="min-w-0 flex-1 rounded border border-white/10 bg-black px-2 py-2 text-[9px]" />
                  <button onClick={saveSnapshot} className="rounded border border-cyan-400/30 px-3 text-[9px] text-cyan-300">SAVE</button>
                </div>
                <div className="mt-2 space-y-1">
                  {Object.entries(snapshots).map(([name, snapshot]) => (
                    <div key={name} className="flex items-center gap-2 rounded border border-white/5 px-2 py-1.5">
                      <button onClick={() => applyState({ ...BASE_STATE, ...snapshot })} className="flex-1 text-left text-[9px] text-zinc-300">{name}</button>
                      <button onClick={() => deleteSnapshot(name)} className="text-[9px] text-red-400">DELETE</button>
                    </div>
                  ))}
                </div>
              </section>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setCaptureMode(true);
                }}
                className="w-full rounded border border-amber-300/40 bg-amber-300/[0.08] px-3 py-2.5 text-[9px] font-black tracking-widest text-amber-200 hover:bg-amber-300 hover:text-black"
              >
                HIDE CONTROLS & RESUME CAPTURE
              </button>

              <button onClick={deactivate} className="w-full rounded border border-red-500/30 px-3 py-2 text-[9px] tracking-widest text-red-400">
                EXIT REALM & RESTORE NORMAL APP
              </button>
            </div>
          )}
        </div>
      )}

      <button onClick={() => setOpen(value => !value)} className={`rounded-full border px-4 py-3 text-[10px] font-black tracking-widest shadow-2xl ${active ? 'border-cyan-300 bg-cyan-300 text-black' : 'border-cyan-400/40 bg-black text-cyan-300'}`} title="Open the development-only Warscythe Test Realm">
        {active ? 'REALM ACTIVE' : 'TEST REALM'}
      </button>
      <style>{`
        body.warscythe-capture-mode .warscythe-test-realm { display: none !important; }
      `}</style>
    </div>
  );
}
