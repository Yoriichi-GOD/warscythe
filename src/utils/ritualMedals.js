export const RITUAL_MEDAL_TIERS = {
  bronze: {
    label: 'BRONZE',
    ratio: 15 / 30,
    image: '/medals/ritual-medal-bronze.png',
  },
  silver: {
    label: 'SILVER',
    ratio: 22 / 30,
    image: '/medals/ritual-medal-silver.png',
  },
  gold: {
    label: 'GOLD',
    ratio: 28 / 30,
    image: '/medals/ritual-medal-gold.png',
  },
};

export const STREAK_SCYTHE_TIERS = [
  { id: 'neophyte', name: 'NEOPHYTE', displayName: 'Neophyte Reaper', days: 5 },
  { id: 'acolyte', name: 'ACOLYTE', displayName: 'Acolyte Reaper', days: 15 },
  { id: 'reaper', name: 'REAPER', displayName: 'Reaper', days: 30 },
  { id: 'executioner', name: 'EXECUTIONER', displayName: 'Executioner Reaper', days: 60 },
  { id: 'sovereign', name: 'SOVEREIGN', displayName: 'Sovereign Reaper', days: 120 },
  { id: 'void-walker', name: 'VOID-WALKER', displayName: 'Void-Walker Reaper', days: 200 },
  { id: 'eternal', name: 'ETERNAL', displayName: 'Eternal Reaper', days: 300 },
];

const dateKey = value => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
};

const DAY_MS = 86400000;
export const RITUAL_MEDAL_CYCLE_DAYS = 31;

const startOfUtcDay = value => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

const addUtcDays = (value, days) => new Date(startOfUtcDay(value).getTime() + (days * DAY_MS));

const daysBetweenInclusive = (start, end) => (
  Math.max(0, Math.floor((end - start) / DAY_MS) + 1)
);

const scheduledOpportunities = (ritual, start, end) => {
  if (end < start) return 0;
  if (ritual.frequency !== 'weekly') return daysBetweenInclusive(start, end);

  const targetWeekday = new Date(ritual.createdAt || start).getUTCDay();
  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    if (cursor.getUTCDay() === targetWeekday) count += 1;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return count;
};

const targetsForRitual = (ritual, opportunities) => {
  if (ritual.frequency !== 'weekly' && opportunities === RITUAL_MEDAL_CYCLE_DAYS) {
    return { bronze: 15, silver: 22, gold: 28 };
  }
  return {
    bronze: Math.ceil(opportunities * RITUAL_MEDAL_TIERS.bronze.ratio),
    silver: Math.ceil(opportunities * RITUAL_MEDAL_TIERS.silver.ratio),
    gold: Math.ceil(opportunities * RITUAL_MEDAL_TIERS.gold.ratio),
  };
};

const medalForCount = (ritual, completed, opportunities) => {
  if (!opportunities) return null;
  const targets = targetsForRitual(ritual, opportunities);
  if (completed >= targets.gold) return 'gold';
  if (completed >= targets.silver) return 'silver';
  if (completed >= targets.bronze) return 'bronze';
  return null;
};

const cycleBounds = (ritual, referenceDate = new Date(), cycleIndex) => {
  const created = startOfUtcDay(ritual.createdAt || referenceDate);
  const reference = startOfUtcDay(referenceDate);
  const inferredIndex = Math.max(0, Math.floor((reference - created) / (RITUAL_MEDAL_CYCLE_DAYS * DAY_MS)));
  const index = Number.isInteger(cycleIndex) ? Math.max(0, cycleIndex) : inferredIndex;
  const start = addUtcDays(created, index * RITUAL_MEDAL_CYCLE_DAYS);
  const end = addUtcDays(start, RITUAL_MEDAL_CYCLE_DAYS - 1);
  return { created, start, end, index };
};

const eventsForRitual = (ritual, events, start, end) => {
  const ritualId = ritual.ritualUuid || ritual.id;
  return new Set(
    events
      .filter(event => (
        (event.ritualUuid === ritualId || event.ritualId === ritualId)
        && startOfUtcDay(event.date || event.occurredAt) >= start
        && startOfUtcDay(event.date || event.occurredAt) <= end
      ))
      .map(event => dateKey(event.date || event.occurredAt))
      .filter(Boolean)
  );
};

export const getRitualMonthStats = (
  ritual,
  events = [],
  referenceDate = new Date(),
  cycleIndex
) => {
  const today = startOfUtcDay(referenceDate);
  const { start, end, index } = cycleBounds(ritual, referenceDate, cycleIndex);
  const isCurrentCycle = today >= start && today <= end;
  const elapsedEnd = today < start ? new Date(start.getTime() - DAY_MS) : (today < end ? today : end);
  const completionDates = eventsForRitual(ritual, events, start, end);
  const totalOpportunities = scheduledOpportunities(ritual, start, end);
  const elapsedOpportunities = scheduledOpportunities(ritual, start, elapsedEnd);
  const completed = Math.min(completionDates.size, totalOpportunities);
  const attainableFrom = isCurrentCycle ? today : new Date(end.getTime() + DAY_MS);
  const attainableOpportunities = scheduledOpportunities(ritual, attainableFrom, end);
  const completedAttainableDates = [...completionDates].filter(day => (
    new Date(`${day}T00:00:00.000Z`) >= attainableFrom
  )).length;
  const remaining = Math.max(0, attainableOpportunities - completedAttainableDates);
  const projectedCompleted = Math.min(totalOpportunities, completed + remaining);
  const projectedMedal = medalForCount(ritual, projectedCompleted, totalOpportunities);
  const earnedMedal = medalForCount(ritual, completed, totalOpportunities);
  const targets = targetsForRitual(ritual, totalOpportunities);

  return {
    ritualId: ritual.ritualUuid || ritual.id,
    title: ritual.title || 'Unnamed Ritual',
    cycleIndex: index,
    cycleStart: dateKey(start),
    cycleEnd: dateKey(end),
    cycleComplete: today > end,
    completed,
    elapsedOpportunities,
    totalOpportunities,
    remaining,
    projectedCompleted,
    projectedMedal,
    earnedMedal,
    bronzeTarget: targets.bronze,
    silverTarget: targets.silver,
    goldTarget: targets.gold,
    completionRate: elapsedOpportunities ? completed / elapsedOpportunities : 0,
    createdAt: ritual.createdAt || '',
  };
};

export const getCurrentRitualMedalProjection = (rituals = [], events = [], referenceDate = new Date()) => {
  const candidates = rituals
    .map(ritual => getRitualMonthStats(ritual, events, referenceDate))
    .filter(stats => stats.totalOpportunities > 0)
    .sort((a, b) => (
      b.completed - a.completed
      || b.completionRate - a.completionRate
      || new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    ));

  return candidates[0] || null;
};

export const getRitualMedalCollection = (rituals = [], events = [], referenceDate = new Date()) => {
  const ritualById = new Map(rituals.map(ritual => [ritual.ritualUuid || ritual.id, ritual]));

  events.forEach(event => {
    const ritualId = event.ritualUuid || event.ritualId;
    if (!ritualId || ritualById.has(ritualId)) return;
    ritualById.set(ritualId, {
      id: ritualId,
      ritualUuid: ritualId,
      title: event.ritualTitle || 'Archived Ritual',
      frequency: event.frequency || 'daily',
      createdAt: event.ritualCreatedAt || event.date || event.occurredAt,
    });
  });

  const awards = getCompletedRitualMedalAwards([...ritualById.values()], events, referenceDate);

  return awards.reduce((collection, award) => {
    collection[award.medal] += 1;
    return collection;
  }, { bronze: 0, silver: 0, gold: 0 });
};

export const getCompletedRitualMedalAwards = (rituals = [], events = [], referenceDate = new Date()) => {
  const today = startOfUtcDay(referenceDate);
  return rituals.flatMap(ritual => {
    const created = startOfUtcDay(ritual.createdAt || referenceDate);
    const completedCycleCount = Math.max(0, Math.floor((today - created) / (RITUAL_MEDAL_CYCLE_DAYS * DAY_MS)));
    return Array.from({ length: completedCycleCount }, (_, cycleIndex) => (
      getRitualMonthStats(ritual, events, referenceDate, cycleIndex)
    ));
  }).filter(stats => stats.cycleComplete && stats.earnedMedal)
    .map(stats => ({
      ...stats,
      medal: stats.earnedMedal,
      awardId: `${stats.ritualId}:cycle-${stats.cycleIndex}:${stats.earnedMedal}`,
    }));
};

export const isRitualScheduledOnDate = (ritual, value = new Date()) => {
  if (ritual.frequency !== 'weekly') return true;
  return new Date(ritual.createdAt || value).getUTCDay() === new Date(value).getUTCDay();
};

export const getStreakScytheMultipliers = (completedTasks = [], ritualEvents = []) => {
  const activityDays = new Set([
    ...completedTasks.map(task => dateKey(task.completedAt)).filter(Boolean),
    ...ritualEvents.map(event => dateKey(event.date || event.occurredAt)).filter(Boolean),
  ]);
  const orderedDays = [...activityDays].sort();
  const chains = [];
  let chain = 0;
  let previous = null;

  orderedDays.forEach(day => {
    const current = new Date(`${day}T00:00:00.000Z`);
    if (!previous || (current - previous) / 86400000 === 1) chain += 1;
    else {
      if (chain) chains.push(chain);
      chain = 1;
    }
    previous = current;
  });
  if (chain) chains.push(chain);

  const multipliers = Object.fromEntries(STREAK_SCYTHE_TIERS.map(tier => [
    tier.id,
    chains.filter(length => length >= tier.days).length,
  ]));

  return {
    multipliers,
    longestChain: chains.length ? Math.max(...chains) : 0,
  };
};

export const getOperativeYearAttendance = (
  completedTasks = [],
  ritualEvents = [],
  operativeCreatedAt,
  referenceDate = new Date()
) => {
  const activityDates = [
    ...completedTasks.map(task => dateKey(task.completedAt)).filter(Boolean),
    ...ritualEvents.map(event => dateKey(event.date || event.occurredAt)).filter(Boolean),
  ];
  const earliestActivity = [...activityDates].sort()[0];
  const origin = new Date(operativeCreatedAt || earliestActivity || referenceDate);
  const now = new Date(referenceDate);
  let yearStart = new Date(Date.UTC(
    now.getUTCFullYear(),
    origin.getUTCMonth(),
    origin.getUTCDate()
  ));
  if (yearStart > now) yearStart.setUTCFullYear(yearStart.getUTCFullYear() - 1);
  const yearEnd = new Date(yearStart);
  yearEnd.setUTCFullYear(yearEnd.getUTCFullYear() + 1);
  yearEnd.setUTCDate(yearEnd.getUTCDate() - 1);

  const attendanceDays = new Set(activityDates.filter(day => {
    const value = new Date(`${day}T00:00:00.000Z`);
    return value >= yearStart && value <= now;
  })).size;

  return {
    attendanceDays,
    yearStart: dateKey(yearStart),
    yearEnd: dateKey(yearEnd),
  };
};
