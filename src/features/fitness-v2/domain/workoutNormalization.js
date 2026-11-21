function numberOrZero(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function stableHash(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function normalizeMovementName(value) {
  return String(value || 'Unnamed Movement')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeModernMovements(workout) {
  return (workout.movements || []).map((movement, movementIndex) => {
    const sets = (movement.sets || [])
      .filter(set => set?.completed === true && set?.type !== 'warmup')
      .map((set, setIndex) => {
        const weight = numberOrZero(set.weight);
        const reps = numberOrZero(set.reps);
        return {
          id: String(set.id || `${movementIndex}-${setIndex}`),
          weight,
          reps,
          rpe: numberOrZero(set.rpe),
          volume: weight * reps,
        };
      })
      .filter(set => set.weight > 0 && set.reps > 0);

    return {
      id: String(movement.id || movementIndex),
      name: String(movement.name || 'Unnamed Movement').trim(),
      identity: normalizeMovementName(movement.name),
      sets,
      volume: sets.reduce((total, set) => total + set.volume, 0),
    };
  }).filter(movement => movement.sets.length > 0);
}

function normalizeLegacyExercises(workout) {
  return (workout.exercises || []).map((exercise, exerciseIndex) => {
    const weight = numberOrZero(exercise.weight);
    const reps = numberOrZero(exercise.reps);
    const setCount = Math.floor(numberOrZero(exercise.sets));
    const sets = Array.from({ length: setCount }, (_, setIndex) => ({
      id: `legacy-${exerciseIndex}-${setIndex}`,
      weight,
      reps,
      rpe: numberOrZero(exercise.rpe),
      volume: weight * reps,
    })).filter(set => set.weight > 0 && set.reps > 0);

    return {
      id: String(exercise.id || exerciseIndex),
      name: String(exercise.name || 'Unnamed Movement').trim(),
      identity: normalizeMovementName(exercise.name),
      sets,
      volume: sets.reduce((total, set) => total + set.volume, 0),
    };
  }).filter(movement => movement.sets.length > 0);
}

export function normalizeWorkout(workout, fallbackIndex = 0) {
  const movements = Array.isArray(workout?.movements)
    ? normalizeModernMovements(workout)
    : normalizeLegacyExercises(workout || {});
  const dateValue = new Date(workout?.date || 0);
  const date = Number.isNaN(dateValue.getTime()) ? new Date(0) : dateValue;
  const fingerprint = JSON.stringify({
    date: date.toISOString(),
    split: workout?.split || '',
    movements: movements.map(movement => [
      movement.identity,
      movement.sets.map(set => [set.weight, set.reps, set.rpe]),
    ]),
  });
  const sourceId = workout?.eventUuid || workout?.id || `legacy-${fallbackIndex}-${stableHash(fingerprint)}`;
  const completedSets = movements.reduce((total, movement) => total + movement.sets.length, 0);
  const totalReps = movements.reduce((total, movement) => total
    + movement.sets.reduce((movementTotal, set) => movementTotal + set.reps, 0), 0);
  const totalVolume = movements.reduce((total, movement) => total + movement.volume, 0);
  const rpeValues = movements.flatMap(movement => movement.sets.map(set => set.rpe).filter(Boolean));

  return {
    id: String(sourceId),
    sourceId: String(sourceId),
    date: date.toISOString(),
    timestamp: date.getTime(),
    split: String(workout?.split || 'Archived Session'),
    movements,
    completedSets,
    totalReps,
    totalVolume,
    averageRpe: rpeValues.length
      ? rpeValues.reduce((total, value) => total + value, 0) / rpeValues.length
      : 0,
    valid: completedSets > 0 && totalVolume > 0,
  };
}

export function normalizeWorkoutHistory(gymLog = []) {
  const diagnostics = { received: gymLog.length, duplicates: 0, invalid: 0 };
  const byId = new Map();

  gymLog.forEach((workout, index) => {
    const normalized = normalizeWorkout(workout, index);
    if (!normalized.valid) diagnostics.invalid += 1;
    if (byId.has(normalized.sourceId)) diagnostics.duplicates += 1;
    else byId.set(normalized.sourceId, normalized);
  });

  const workouts = [...byId.values()]
    .filter(workout => workout.valid)
    .sort((left, right) => left.timestamp - right.timestamp || left.sourceId.localeCompare(right.sourceId));

  return { workouts, diagnostics: { ...diagnostics, accepted: workouts.length } };
}
