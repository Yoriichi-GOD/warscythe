import { DEITY_ROSTER, FITNESS_REWARD_RULESET } from './deityRoster.js';
import { normalizeWorkoutHistory } from './workoutNormalization.js';
import { calculateWorkoutEvidence } from './workoutEvidence.js';

const SESSION_MILESTONES = Object.freeze([
  [5, 1], [12, 1], [25, 2], [50, 2], [75, 3], [100, 3], [150, 4], [200, 5], [300, 8],
]);

const VOLUME_MILESTONES = Object.freeze([
  [5_000, 1], [25_000, 2], [75_000, 3], [150_000, 4], [250_000, 5],
  [400_000, 6], [600_000, 7], [1_000_000, 8],
]);

function calculateAffinity(workout) {
  return calculateWorkoutEvidence(workout).affinity;
}

function estimatedOneRepMax(weight, reps) {
  if (!weight || !reps) return 0;
  return weight * (1 + reps / 30);
}

function getWorkoutBestByMovement(workout) {
  return new Map(workout.movements.map(movement => [
    movement.identity,
    Math.max(...movement.sets.map(set => estimatedOneRepMax(set.weight, set.reps))),
  ]));
}

function createEvent(type, source, payload = {}) {
  return {
    id: `${FITNESS_REWARD_RULESET.id}:${type}:${source}`,
    type,
    ruleset: FITNESS_REWARD_RULESET.id,
    ...payload,
  };
}

function createInitialDeityState(deity) {
  return {
    ...deity,
    unlockedByVolume: false,
    ascended: false,
    workouts: 0,
    volume: 0,
    fragmentsRecovered: 0,
    affinityEarned: 0,
    activeBlessingIndex: 0,
    ascensionSnapshot: null,
    blessings: deity.blessings.map(blessing => ({
      ...blessing,
      affinity: 0,
      fragments: 0,
      completed: false,
      completedAt: null,
      journey: {
        startedAt: null,
        firstFragmentAt: null,
        lastWorkoutAt: null,
        workouts: 0,
        volume: 0,
        completedSets: 0,
        totalReps: 0,
        bestLift: null,
      },
    })),
  };
}

function recordBlessingWorkout(blessing, workout) {
  const bestLift = workout.movements
    .flatMap(movement => movement.sets.map(set => ({ movement: movement.name, weight: set.weight })))
    .reduce((best, lift) => !best || lift.weight > best.weight ? lift : best, null);

  blessing.journey.startedAt ||= workout.date;
  blessing.journey.lastWorkoutAt = workout.date;
  blessing.journey.workouts += 1;
  blessing.journey.volume += workout.totalVolume;
  blessing.journey.completedSets += workout.completedSets;
  blessing.journey.totalReps += workout.totalReps;
  if (bestLift && (!blessing.journey.bestLift || bestLift.weight > blessing.journey.bestLift.weight)) {
    blessing.journey.bestLift = bestLift;
  }
}

function findActiveJourney(deities, lifetimeVolume) {
  for (let deityIndex = 0; deityIndex < deities.length; deityIndex += 1) {
    const deity = deities[deityIndex];
    const previousComplete = deityIndex === 0 || deities[deityIndex - 1].ascended;
    if (lifetimeVolume < deity.volumeGate || !previousComplete) return null;
    if (!deity.ascended) {
      return {
        deityIndex,
        blessingIndex: deity.activeBlessingIndex,
        deity,
        blessing: deity.blessings[deity.activeBlessingIndex],
      };
    }
  }
  return null;
}

function completeJourneyIfEligible(journey, workout, totals, ceremonies) {
  if (!journey) return;
  const { deity, blessing } = journey;
  if (blessing.completed || blessing.affinity < 100 || blessing.fragments < blessing.fragmentsRequired) return;

  blessing.completed = true;
  blessing.completedAt = workout.date;
  ceremonies.push(createEvent('blessing-recognized', `${deity.id}:${blessing.id}`, {
    deityId: deity.id,
    blessingId: blessing.id,
    occurredAt: workout.date,
  }));

  if (deity.activeBlessingIndex < deity.blessings.length - 1) {
    deity.activeBlessingIndex += 1;
    return;
  }

  deity.ascended = true;
  deity.ascensionSnapshot = {
    occurredAt: workout.date,
    lifetimeVolume: totals.lifetimeVolume,
    validWorkouts: totals.validWorkouts,
    completedSets: totals.completedSets,
  };
  ceremonies.push(createEvent('deity-ascended', deity.id, {
    deityId: deity.id,
    occurredAt: workout.date,
    snapshot: deity.ascensionSnapshot,
  }));
}

export function buildFitnessRewardPreview(gymLog = []) {
  const { workouts, diagnostics } = normalizeWorkoutHistory(gymLog);
  const deities = DEITY_ROSTER.map(createInitialDeityState);
  const events = [];
  const ceremonies = [];
  const bestMovementPerformance = new Map();
  const passedSessionMilestones = new Set();
  const passedVolumeMilestones = new Set();
  const totals = { lifetimeVolume: 0, validWorkouts: 0, completedSets: 0 };
  let unallocatedFragments = 0;

  workouts.forEach(workout => {
    totals.lifetimeVolume += workout.totalVolume;
    totals.validWorkouts += 1;
    totals.completedSets += workout.completedSets;
    deities.forEach(deity => { deity.unlockedByVolume = totals.lifetimeVolume >= deity.volumeGate; });

    let journey = findActiveJourney(deities, totals.lifetimeVolume);
    if (journey) {
      recordBlessingWorkout(journey.blessing, workout);
      const affinity = calculateAffinity(workout);
      const acceptedAffinity = Math.min(affinity, 100 - journey.blessing.affinity);
      journey.blessing.affinity += acceptedAffinity;
      journey.deity.affinityEarned += acceptedAffinity;
      journey.deity.workouts += 1;
      journey.deity.volume += workout.totalVolume;
      events.push(createEvent('affinity-earned', workout.sourceId, {
        deityId: journey.deity.id,
        blessingId: journey.blessing.id,
        amount: acceptedAffinity,
        calculatedAmount: affinity,
        occurredAt: workout.date,
      }));
    }

    const fragmentEvents = [];
    SESSION_MILESTONES.forEach(([threshold, yieldCount]) => {
      if (totals.validWorkouts >= threshold && !passedSessionMilestones.has(threshold)) {
        passedSessionMilestones.add(threshold);
        fragmentEvents.push(createEvent('fragment-candidate', `sessions-${threshold}`, {
          amount: yieldCount,
          reason: `${threshold} valid sessions archived`,
          occurredAt: workout.date,
        }));
      }
    });
    VOLUME_MILESTONES.forEach(([threshold, yieldCount]) => {
      if (totals.lifetimeVolume >= threshold && !passedVolumeMilestones.has(threshold)) {
        passedVolumeMilestones.add(threshold);
        fragmentEvents.push(createEvent('fragment-candidate', `volume-${threshold}`, {
          amount: yieldCount,
          reason: `${threshold.toLocaleString()} kg lifetime volume`,
          occurredAt: workout.date,
        }));
      }
    });

    const workoutBests = getWorkoutBestByMovement(workout);
    let bestPrGain = 0;
    let bestPrMovement = null;
    workoutBests.forEach((currentBest, movementId) => {
      const previousBest = bestMovementPerformance.get(movementId) || 0;
      if (previousBest > 0 && currentBest > previousBest * 1.01) {
        const gain = (currentBest - previousBest) / previousBest;
        if (gain > bestPrGain) {
          bestPrGain = gain;
          bestPrMovement = movementId;
        }
      }
      bestMovementPerformance.set(movementId, Math.max(previousBest, currentBest));
    });
    if (bestPrMovement) {
      fragmentEvents.push(createEvent('fragment-candidate', `pr-${workout.sourceId}`, {
        amount: bestPrGain >= 0.05 ? 2 : 1,
        reason: `new ${bestPrMovement} performance record`,
        occurredAt: workout.date,
      }));
    }

    fragmentEvents.forEach(event => {
      journey = findActiveJourney(deities, totals.lifetimeVolume);
      if (!journey) {
        unallocatedFragments += event.amount;
        events.push({ ...event, allocated: false });
        return;
      }
      const room = journey.blessing.fragmentsRequired - journey.blessing.fragments;
      const accepted = Math.min(room, event.amount);
      const overflow = event.amount - accepted;
      journey.blessing.fragments += accepted;
      if (accepted > 0) journey.blessing.journey.firstFragmentAt ||= event.occurredAt;
      journey.deity.fragmentsRecovered += accepted;
      unallocatedFragments += overflow;
      events.push({
        ...event,
        allocated: true,
        deityId: journey.deity.id,
        blessingId: journey.blessing.id,
        acceptedAmount: accepted,
        overflow,
      });
      completeJourneyIfEligible(journey, workout, totals, ceremonies);
    });

    journey = findActiveJourney(deities, totals.lifetimeVolume);
    completeJourneyIfEligible(journey, workout, totals, ceremonies);
  });

  const activeJourney = findActiveJourney(deities, totals.lifetimeVolume);
  const nextVolumeGate = DEITY_ROSTER.find(deity => totals.lifetimeVolume < deity.volumeGate) || null;
  const completedBlessings = deities.flatMap(deity => deity.blessings.filter(blessing => blessing.completed)).length;

  return {
    ruleset: FITNESS_REWARD_RULESET,
    totals,
    diagnostics,
    events,
    ceremonies,
    deities,
    activeJourney,
    nextVolumeGate,
    completedBlessings,
    unallocatedFragments,
    retroactiveSummary: {
      affinity: deities.reduce((sum, deity) => sum + deity.affinityEarned, 0),
      fragments: deities.reduce((sum, deity) => sum + deity.fragmentsRecovered, 0),
      blessingCount: completedBlessings,
      ascensionCount: deities.filter(deity => deity.ascended).length,
      candidateEventCount: events.filter(event => event.type === 'fragment-candidate').length,
    },
  };
}

export { calculateAffinity };
