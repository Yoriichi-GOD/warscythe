export const GUIDE_VERSION = 1;
export const GOALS = {
  operation: { tab: 'ops', label: 'Plan one task', detail: 'Save a real Operation. Do it when you are ready.' },
  workout: { tab: 'fitness', label: 'Log a workout', detail: 'Choose a session, add a movement and record your sets.' },
  habit: { tab: 'rituals', label: 'Build a habit', detail: 'Save a Ritual you want to return to.' },
};
export const guideKey = userId => `warscythe:journey:v${GUIDE_VERSION}:${encodeURIComponent(userId || 'local')}`;
export function hasJourneyHistory(state) {
  return !!(state.hasCompletedTutorial || state.firstTaskCompleted || state.totalCompletions > 0
    || state.completedTasks?.length || state.tasks?.some(task => !task.isTutorialTask)
    || state.rituals?.length || state.gymLog?.length || state.activeWorkout);
}
export function initialGuide(saved, state) {
  if (saved?.version === GUIDE_VERSION && ['welcome','idle','active','done'].includes(saved.status)) {
    return { ...saved, goal: GOALS[saved.goal] ? saved.goal : null, before: Array.isArray(saved.before) ? saved.before.filter(id => typeof id === 'string') : [], paused: !!saved.paused };
  }
  return { version: GUIDE_VERSION, status: hasJourneyHistory(state) ? 'idle' : 'welcome', goal: null, before: [], paused: false };
}
export function savedWork(goal, before, state) {
  const previous = new Set(before);
  if (goal === 'operation') return [...(state.tasks || []), ...(state.completedTasks || [])].find(task => !previous.has(task.id) && !task.isTutorialTask);
  if (goal === 'habit') return state.rituals?.find(ritual => !previous.has(ritual.id));
  if (goal === 'workout') return state.activeWorkout || state.gymLog?.find(workout => !previous.has(workout.id));
  return null;
}
export function guideStep(guide, state) {
  const work = savedWork(guide.goal, guide.before, state);
  if (guide.goal === 'operation') return work
    ? { title: work.completedAt ? 'Your victory is recorded.' : 'Your Operation is saved.', text: work.completedAt ? 'Your campaign has advanced. Open The Unquiet Post to read your new find, or return when you are ready for another task.' : 'Open its card to see the steps or use Focus. Complete it only after you have done the work; your first real completion uncovers a document.', done: true, target: 'operations-primary-panel' }
    : { title: 'Start with something finishable.', text: 'Give one real task a name and deadline. Category, effort, priority and smaller steps are available when you need them.', target: 'operation-add-button' };
  if (guide.goal === 'habit') return work
    ? { title: 'Your Ritual is saved.', text: 'Return on its scheduled day. Mark it complete only after doing it. You can edit its frequency and hour later.', done: true, target: 'ritual-enshrine-button' }
    : { title: 'Choose a promise you can repeat.', text: 'Name your habit and choose its frequency. This saves a real Ritual; there is no practice completion to perform first.', target: 'ritual-enshrine-button' };
  if (guide.goal === 'workout') {
    if (work && !state.activeWorkout) return { title:'Your session is archived.', text:'Your movements, sets and notes are in the Iron Ledger. Start the next session when you are ready; the rest of the app is available.', done:true };
    if (!work) return { title: 'Choose the session you are doing.', text: 'Open the training split to begin. Workout Mode gives your log the screen; Minimize returns to the app without ending the session.', target: 'fitness-split-select' };
    if (!work.movements?.length) return { title: 'Add your first movement.', text: 'Choose a movement or type your own. Your active session is saved while you use other parts of the app.', target: 'fitness-movement-selector' };
    if (!work.movements.some(movement => movement.sets?.length)) return { title: 'Add a set beneath the movement.', text: 'Record load, repetitions and set type. RPE records how hard the set felt. Use numbers from your actual session.', target: 'fitness-add-set' };
    return { title: 'Your workout log is ready.', text: 'Tick each set after performing it to start recovery. Keep logging, minimize whenever you need to, and use Finish when the whole session is over.', done: true, target: 'fitness-complete-set' };
  }
  return null;
}
