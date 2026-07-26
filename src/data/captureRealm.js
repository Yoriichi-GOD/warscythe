const day = (offset = 0, hour = 18) => {
  const value = new Date();
  value.setHours(hour, 0, 0, 0);
  value.setDate(value.getDate() + offset);
  return value.toISOString();
};

const dateKey = offset => day(offset).slice(0, 10);

const operation = ({ id, title, category, effort, priority, progress, deadline, notes, steps }) => ({
  id,
  taskUuid: id,
  title,
  category,
  effort,
  priority,
  progress,
  deadline: day(deadline, 21),
  notes,
  createdAt: day(-18, 9),
  lastProgressUpdate: day(-1, 22),
  syncStatus: 'synced',
  isTutorialTask: false,
  microSteps: steps.map((label, index) => ({
    id: `${id}-step-${index + 1}`,
    label,
    checked: index < Math.round((steps.length * progress) / 100),
  })),
});

const ritual = ({ id, title, effort, streak, time, notes, completedToday = false }) => ({
  id,
  ritualUuid: id,
  title,
  frequency: 'daily',
  effort,
  streak,
  bestStreak: streak,
  targetTime: time,
  notes,
  createdAt: day(-45, 7),
  updatedAt: day(-1, 20),
  lastCompletedAt: completedToday ? day(0, 7) : day(-1, 7),
  syncStatus: 'synced',
});

const completedOperation = (id, title, category, effort, priority, offset, notes) => ({
  id,
  taskUuid: id,
  title,
  category,
  effort,
  priority,
  progress: 100,
  notes,
  createdAt: day(offset - 8, 10),
  completedAt: day(offset, 20),
  microSteps: [],
  syncStatus: 'synced',
  isTutorialTask: false,
});

const workout = (id, offset, split, movements, notes) => ({
  id,
  eventUuid: `${id}-event`,
  date: day(offset, 19),
  split,
  movements: movements.map((movement, movementIndex) => ({
    id: `${id}-movement-${movementIndex + 1}`,
    name: movement.name,
    sets: movement.sets.map(([weight, reps, rpe], setIndex) => ({
      id: `${id}-set-${movementIndex + 1}-${setIndex + 1}`,
      weight,
      reps,
      rpe,
      type: setIndex === 0 ? 'warmup' : 'working',
      completed: true,
    })),
  })),
  notes,
  syncStatus: 'synced',
});

const artifact = (id, name, rarity, type, offset, context) => ({
  id,
  name,
  rarity,
  type,
  date: day(offset, 20),
  context,
  effortContext: 'Recovered through founder execution.',
});

export const CAPTURE_SCENES = [
  { id: 'operations-command', label: 'Operations // Command', tab: 'ops' },
  { id: 'operations-detail', label: 'Operations // Detail', tab: 'ops', taskId: 'capture-operation-yc' },
  { id: 'rituals-command', label: 'Rituals // Command', tab: 'rituals' },
  { id: 'rituals-medal', label: 'Rituals // Medal', tab: 'rituals', target: '.cc-ultimate-artifact' },
  { id: 'fitness-olympus', label: 'Fitness // Olympus', tab: 'fitness' },
  { id: 'fitness-session', label: 'Fitness // Session', tab: 'fitness', fitnessHistory: true },
  { id: 'ledger-calendar', label: 'Ledger // Calendar', tab: 'ledger', ledgerSubTab: 'history', selectLatestConquest: true },
  { id: 'ledger-relics', label: 'Ledger // Relics', tab: 'ledger', ledgerSubTab: 'vault', selectFirstArtifact: true },
  { id: 'legion-command', label: 'Legion // Command', tab: 'social', socialSubTab: 'legion' },
  { id: 'legion-objective', label: 'Legion // Objective', tab: 'social', socialSubTab: 'legion', legionOperationId: 'capture-legion-operation' },
];

export const createCaptureRealmState = () => {
  const operations = [
    operation({
      id: 'capture-operation-yc',
      title: 'Submit Warscythe to Y Combinator',
      category: 'WARSCYTHE // COMPANY',
      effort: 'Boss',
      priority: 'boss',
      progress: 72,
      deadline: 5,
      notes: 'Final pass: demo, founder video, application proof and submission review.',
      steps: ['Lock founder script', 'Record product demo', 'Capture product evidence', 'Review application answers', 'Submit together'],
    }),
    operation({
      id: 'capture-operation-landing',
      title: 'Ship the cinematic landing page',
      category: 'WARSCYTHE // PRODUCT',
      effort: 'High',
      priority: 'high',
      progress: 84,
      deadline: 2,
      notes: 'Use the real product as evidence. Keep the fantasy world cinematic and readable.',
      steps: ['Generate realm artwork', 'Build page architecture', 'Refine responsive layout', 'Capture real product screens', 'Production QA'],
    }),
    operation({
      id: 'capture-operation-demo',
      title: 'Record the founder demo',
      category: 'WARSCYTHE // STORY',
      effort: 'Medium',
      priority: 'medium',
      progress: 46,
      deadline: 1,
      notes: 'Show the execution loop clearly: objective, progress, consequence.',
      steps: ['Prepare capture realm', 'Record clean walkthrough', 'Edit the strongest ninety seconds'],
    }),
  ];

  const rituals = [
    ritual({ id: 'capture-ritual-deep-work', title: 'Two hours of deep work', effort: 'High', streak: 24, time: '08:00', notes: 'Build before opening messages.', completedToday: true }),
    ritual({ id: 'capture-ritual-train', title: 'Train with intent', effort: 'High', streak: 21, time: '18:30', notes: 'Record every working set.', completedToday: false }),
    ritual({ id: 'capture-ritual-study', title: 'Study one difficult concept', effort: 'Medium', streak: 19, time: '21:00', notes: 'One concept understood is enough.', completedToday: true }),
    ritual({ id: 'capture-ritual-founder', title: 'Founder review with Abhay', effort: 'Medium', streak: 17, time: '22:30', notes: 'Decisions, owners and the next strike.', completedToday: false }),
  ];

  const completedTasks = [
    completedOperation('capture-complete-sync', 'Verify Supabase Sync V2 and egress', 'WARSCYTHE // ENGINEERING', 'Boss', 'boss', -1, 'Validated on the live founder account.'),
    completedOperation('capture-complete-script', 'Lock the YC founder video script', 'WARSCYTHE // STORY', 'High', 'high', -3, 'Both founder sections approved.'),
    completedOperation('capture-complete-onboarding', 'Refine the onboarding roadmap', 'WARSCYTHE // PRODUCT', 'High', 'medium', -6, 'Guardian guidance now follows the execution journey.'),
    completedOperation('capture-complete-medals', 'Build Ritual consistency medals', 'WARSCYTHE // PRODUCT', 'Medium', 'medium', -9, 'Monthly projection and permanent evidence shipped.'),
    completedOperation('capture-complete-legion', 'Plan the Legion demo objective', 'WARSCYTHE // COMPANY', 'Medium', 'low', -12, 'Shared founder work prepared for capture.'),
  ];

  const gymLog = [
    workout('capture-workout-push', -1, 'PUSH // STRENGTH', [
      { name: 'Barbell Bench Press', sets: [[40, 10, 6], [65, 8, 8], [70, 6, 9]] },
      { name: 'Overhead Press', sets: [[25, 10, 6], [40, 8, 8], [42.5, 6, 9]] },
      { name: 'Weighted Dips', sets: [[0, 12, 6], [15, 10, 8], [20, 8, 9]] },
    ], 'Strong pressing session. New controlled six-rep bench set.'),
    workout('capture-workout-pull', -4, 'PULL // BACK', [
      { name: 'Deadlift', sets: [[60, 8, 5], [110, 5, 8], [125, 3, 9]] },
      { name: 'Weighted Pull-Up', sets: [[0, 8, 6], [10, 7, 8], [15, 5, 9]] },
    ], 'Grip held. Add one rep to the final pull-up set next week.'),
    workout('capture-workout-legs', -7, 'LEGS // POWER', [
      { name: 'Back Squat', sets: [[40, 10, 5], [80, 8, 8], [90, 5, 9]] },
      { name: 'Romanian Deadlift', sets: [[45, 10, 6], [75, 8, 8], [80, 7, 9]] },
    ], 'Depth stayed consistent under fatigue.'),
  ];

  const ritualCompletionEvents = [];
  rituals.forEach((item, ritualIndex) => {
    const completedDays = [24, 21, 19, 17][ritualIndex];
    for (let offset = -(completedDays - 1); offset <= 0; offset += 1) {
      ritualCompletionEvents.push({
        id: `${item.id}:${dateKey(offset)}`,
        eventUuid: `${item.id}:${dateKey(offset)}`,
        ritualUuid: item.id,
        ritualTitle: item.title,
        ritualCreatedAt: item.createdAt,
        frequency: item.frequency,
        date: dateKey(offset),
        occurredAt: day(offset, 7),
        syncStatus: 'synced',
      });
    }
  });

  const activeWorkout = workout('capture-active-workout', 0, 'PUSH // STRENGTH', [
    { name: 'Barbell Bench Press', sets: [[40, 10, 6], [65, 8, 8], [70, 6, 9]] },
    { name: 'Overhead Press', sets: [[25, 10, 6], [40, 8, 8]] },
    { name: 'Cable Lateral Raise', sets: [[7.5, 15, 7], [10, 12, 8]] },
  ], 'Founder demo after the final working set.');

  return {
    username: 'Saishreek',
    tasks: operations,
    rituals,
    completedTasks,
    abandonedTasks: [{
      id: 'capture-abandoned',
      title: 'Rebuild the old landing-page concept',
      category: 'WARSCYTHE // PRODUCT',
      effort: 'Medium',
      priority: 'medium',
      abandonedAt: day(-14, 16),
      createdAt: day(-20, 11),
    }],
    dailyLog: Object.fromEntries(completedTasks.map((task, index) => [
      task.completedAt.slice(0, 10),
      { completed: index % 2 ? 2 : 1, weight: index % 2 ? 4 : 2 },
    ])),
    ritualCompletionEvents,
    gymLog,
    activeWorkout,
    collectedArtifacts: [
      artifact('capture-artifact-1', 'Crown of Directed Focus', 'mythic', 'crown', -1, 'Recovered while validating Sync V2.'),
      artifact('capture-artifact-2', 'Orb of Deadline Clarity', 'epic', 'orb', -3, 'Recovered while locking the founder script.'),
      artifact('capture-artifact-3', 'Blade of Iteration', 'rare', 'blade', -6, 'Recovered while rebuilding onboarding.'),
      artifact('capture-artifact-4', 'Tome of Obsession', 'uncommon', 'tome', -9, 'Recovered while researching consistency systems.'),
      artifact('capture-artifact-5', 'Scroll of Living Memory', 'rare', 'scroll', -12, 'Recovered while planning the Legion demo.'),
      artifact('capture-artifact-6', 'Crown of Directed Focus', 'mythic', 'crown', -15, 'Recovered during the first YC application pass.'),
    ],
    activeLegion: {
      id: 'capture-legion',
      name: 'BROTHERS IN ARMS',
      level: 4,
      owner_id: TEST_CAPTURE_USER_ID,
      xp: 2840,
      created_at: day(-90),
    },
    legionMembers: [
      { id: 'capture-member-saishreek', user_id: TEST_CAPTURE_USER_ID, role: 'owner', state: 'active', profile: { id: TEST_CAPTURE_USER_ID, username: 'Saishreek', state: 'executing' } },
      { id: 'capture-member-abhay', user_id: '00000000-0000-4000-8000-000000000002', role: 'member', state: 'active', profile: { id: '00000000-0000-4000-8000-000000000002', username: 'Abhay', state: 'executing' } },
    ],
    legionOperations: [{
      id: 'capture-legion-operation',
      legion_id: 'capture-legion',
      creator_id: TEST_CAPTURE_USER_ID,
      title: 'Submit Warscythe to Y Combinator',
      status: 'active',
      effort: 'Boss',
      deadline: day(5, 23),
      created_at: day(-8, 10),
    }],
    legionSubtasks: [
      {
        id: 'capture-legion-subtask-1',
        legion_operation_id: 'capture-legion-operation',
        assigned_to: TEST_CAPTURE_USER_ID,
        title: 'Submit Warscythe to Y Combinator // Record and edit the product demo',
        deadline: day(2, 21),
        priority: 'boss',
        acceptance_status: 'accepted',
        completion_status: 'incomplete',
        xp_value: 180,
        assignee: { id: TEST_CAPTURE_USER_ID, username: 'Saishreek', state: 'executing' },
      },
      {
        id: 'capture-legion-subtask-2',
        legion_operation_id: 'capture-legion-operation',
        assigned_to: '00000000-0000-4000-8000-000000000002',
        title: 'Submit Warscythe to Y Combinator // Final security and application review',
        deadline: day(3, 21),
        priority: 'high',
        acceptance_status: 'accepted',
        completion_status: 'completed',
        xp_value: 140,
        assignee: { id: '00000000-0000-4000-8000-000000000002', username: 'Abhay', state: 'executing' },
      },
      {
        id: 'capture-legion-subtask-3',
        legion_operation_id: 'capture-legion-operation',
        assigned_to: TEST_CAPTURE_USER_ID,
        title: 'Submit Warscythe to Y Combinator // Capture final product evidence',
        deadline: day(4, 21),
        priority: 'high',
        acceptance_status: 'accepted',
        completion_status: 'incomplete',
        xp_value: 120,
        assignee: { id: TEST_CAPTURE_USER_ID, username: 'Saishreek', state: 'executing' },
      },
    ],
    legionEvents: [
      { id: 'capture-legion-event-1', legion_id: 'capture-legion', event_type: 'subtask_completed', actor_id: '00000000-0000-4000-8000-000000000002', metadata: { title: 'Final security and application review' }, created_at: day(-1, 22) },
    ],
    xp: 7761,
    executionScore: 7761,
    coins: 2480,
    level: 6,
    scytheLevel: 'REFINED',
    streakCount: 24,
    dailyPoints: 420,
    totalCompletions: completedTasks.length + ritualCompletionEvents.length,
    currentLevelProgress: 3,
    bossKills: 5,
    currentTitle: 'Seasoned Wanderer',
    unlockedTitles: ['Recruit', 'Curious Explorer', 'Seasoned Wanderer'],
    onboardingActive: false,
    onboardingProgress: 10,
    hasCompletedTutorial: true,
    tutorialStep: 'completed',
    firstTaskCompleted: true,
    hasSeenMapGuide: true,
    hasSeenLedgerGuide: true,
    hasSeenForgeGuide: true,
    hasSeenRitualsGuide: true,
    hasSeenFitnessPeek: true,
    pendingGuardianProgress: null,
    postGuardianTutorial: null,
    pendingReward: null,
    pendingTitleUnlock: null,
    pendingLevelUp: null,
    activeBossFlash: null,
    pendingVictoryScreen: null,
  };
};

export const TEST_CAPTURE_USER_ID = '00000000-0000-4000-8000-000000000001';
