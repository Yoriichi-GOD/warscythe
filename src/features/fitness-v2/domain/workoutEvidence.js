export const MAX_AFFINITY_PER_WORKOUT = 12;

function nonNegativeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function volumeAffinityFor(volume) {
  if (volume >= 10_000) return 3;
  if (volume >= 5_000) return 2;
  if (volume >= 1_000) return 1;
  return 0;
}

export function calculateWorkoutEvidence(workout = {}) {
  const completedSets = Math.floor(nonNegativeNumber(workout.completedSets));
  const totalReps = Math.floor(nonNegativeNumber(workout.totalReps));
  const totalVolume = nonNegativeNumber(workout.totalVolume ?? workout.volume);
  const sessionCompleted = workout.valid !== false && completedSets > 0;
  const evidence = [
    { label: 'SESSION COMPLETION', value: sessionCompleted ? 'ARCHIVED' : 'NOT ARCHIVED', affinity: sessionCompleted ? 4 : 0 },
    { label: 'SETS EXECUTED', value: completedSets, affinity: sessionCompleted ? Math.min(3, Math.floor(completedSets / 4)) : 0 },
    { label: 'REPS EXECUTED', value: totalReps, affinity: sessionCompleted ? Math.min(2, Math.floor(totalReps / 25)) : 0 },
    { label: 'VOLUME EXECUTED', value: `${Math.round(totalVolume).toLocaleString('en-US')} KG`, affinity: sessionCompleted ? volumeAffinityFor(totalVolume) : 0 },
  ];
  const affinity = Math.min(MAX_AFFINITY_PER_WORKOUT, evidence.reduce((sum, record) => sum + record.affinity, 0));
  return { evidence, affinity };
}
