import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFitnessRewardPreview, calculateAffinity } from './rewardEngine.js';
import { normalizeWorkoutHistory } from './workoutNormalization.js';
import { calculateWorkoutEvidence, MAX_AFFINITY_PER_WORKOUT } from './workoutEvidence.js';

function workout(id, day, { weight = 100, reps = 10, sets = 5, rpe = 8 } = {}) {
  return {
    id,
    eventUuid: `event-${id}`,
    date: `2026-01-${String(day).padStart(2, '0')}T10:00:00.000Z`,
    split: 'SBD Powerlifting Day',
    movements: [{
      id: `movement-${id}`,
      name: 'Competition Bench Press',
      sets: Array.from({ length: sets }, (_, index) => ({
        id: `${id}-set-${index}`,
        weight,
        reps,
        rpe,
        type: 'working',
        completed: true,
      })),
    }],
  };
}

test('empty and incomplete sessions earn no Olympus progress', () => {
  const preview = buildFitnessRewardPreview([{
    id: 'empty',
    date: '2026-01-01T10:00:00.000Z',
    movements: [{ name: 'Squat', sets: [{ weight: 100, reps: 5, completed: false }] }],
  }]);

  assert.equal(preview.totals.validWorkouts, 0);
  assert.equal(preview.events.length, 0);
  assert.equal(preview.diagnostics.invalid, 1);
});

test('duplicate canonical workout events cannot award twice', () => {
  const original = workout('one', 1);
  const preview = buildFitnessRewardPreview([original, { ...original, id: 'different-local-id' }]);

  assert.equal(preview.totals.validWorkouts, 1);
  assert.equal(preview.diagnostics.duplicates, 1);
  assert.equal(preview.totals.lifetimeVolume, 5_000);
  assert.equal(preview.events.filter(event => event.type === 'affinity-earned').length, 1);
});

test('legacy aggregate exercise records remain readable', () => {
  const { workouts } = normalizeWorkoutHistory([{
    id: 'legacy',
    date: '2026-01-01T10:00:00.000Z',
    exercises: [{ name: 'Squat', sets: 3, reps: 5, weight: 100 }],
  }]);

  assert.equal(workouts[0].completedSets, 3);
  assert.equal(workouts[0].totalReps, 15);
  assert.equal(workouts[0].totalVolume, 1_500);
});

test('Affinity evidence reports only deterministic workout facts', () => {
  const normalized = normalizeWorkoutHistory([workout('evidence', 1)]).workouts[0];
  assert.deepEqual(calculateWorkoutEvidence(normalized), {
    evidence: [
      { label: 'SESSION COMPLETION', value: 'ARCHIVED', affinity: 4 },
      { label: 'SETS EXECUTED', value: 5, affinity: 1 },
      { label: 'REPS EXECUTED', value: 50, affinity: 2 },
      { label: 'VOLUME EXECUTED', value: '5,000 KG', affinity: 2 },
    ],
    affinity: 9,
  });
});

test('a valid session crossing the Hermes gate starts the first journey', () => {
  const preview = buildFitnessRewardPreview([workout('gate', 1)]);

  assert.equal(preview.totals.lifetimeVolume, 5_000);
  assert.equal(preview.activeJourney.deity.id, 'hermes');
  assert.equal(preview.activeJourney.blessing.id, 'winged-sandals');
  assert.ok(preview.activeJourney.blessing.affinity > 0);
  assert.equal(preview.activeJourney.blessing.fragments, 1);
});

test('one extreme workout cannot complete a 100-point Affinity chapter', () => {
  const normalized = normalizeWorkoutHistory([
    workout('extreme', 1, { weight: 1_000, reps: 100, sets: 50, rpe: 10 }),
  ]).workouts[0];

  assert.equal(calculateAffinity(normalized), MAX_AFFINITY_PER_WORKOUT);
  const preview = buildFitnessRewardPreview([workout('extreme', 1, { weight: 1_000, reps: 100, sets: 50, rpe: 10 })]);
  assert.equal(preview.completedBlessings, 0);
});

test('the same history always rebuilds the same event ledger', () => {
  const history = Array.from({ length: 12 }, (_, index) => workout(`stable-${index}`, index + 1));
  const first = buildFitnessRewardPreview(history);
  const second = buildFitnessRewardPreview([...history].reverse());

  assert.deepEqual(first.events, second.events);
  assert.deepEqual(first.deities, second.deities);
  assert.deepEqual(first.ceremonies, second.ceremonies);
});

test('a blessing keeps deterministic evidence from its own training journey', () => {
  const history = Array.from({ length: 25 }, (_, index) => workout(`journey-${index}`, index + 1));
  const preview = buildFitnessRewardPreview(history);
  const blessing = preview.deities[0].blessings[0];

  assert.equal(blessing.completed, true);
  assert.equal(blessing.journey.startedAt, '2026-01-01T10:00:00.000Z');
  assert.equal(blessing.journey.firstFragmentAt, '2026-01-01T10:00:00.000Z');
  assert.equal(blessing.completedAt, blessing.journey.lastWorkoutAt);
  assert.ok(blessing.journey.workouts > 0);
  assert.equal(blessing.journey.volume, blessing.journey.workouts * 5_000);
  assert.equal(blessing.journey.completedSets, blessing.journey.workouts * 5);
  assert.deepEqual(blessing.journey.bestLift, { movement: 'Competition Bench Press', weight: 100 });
});
