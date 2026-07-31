export const isRegionalProgressionEvent = event => (
  event?.eventType === 'operation_completed'
  && event?.metadata?.countsForProgression !== false
);

export const uniqueRegionalProgressionEvents = events => {
  const seen = new Set();
  return (events || [])
    .filter(isRegionalProgressionEvent)
    .filter(event => {
      const identity = event.eventUuid || `${event.eventType}:${event.sourceUuid}`;
      if (seen.has(identity)) return false;
      seen.add(identity);
      return true;
    })
    .sort((a, b) => (
      String(a.occurredAt || '').localeCompare(String(b.occurredAt || ''))
      || Number(a.deviceSequence || 0) - Number(b.deviceSequence || 0)
    ));
};

export const deriveOfflineLevelUpCeremonies = ({
  events,
  confirmedCompletions,
  confirmedLevel,
  tasksPerLevel = 5,
}) => {
  let projectedCompletions = Math.max(0, Number(confirmedCompletions) || 0);
  const baseLevel = Math.max(1, Number(confirmedLevel) || 1);
  let projectedLevel = baseLevel;
  const ceremonies = [];

  for (const event of uniqueRegionalProgressionEvents(events)) {
    projectedCompletions += 1;
    const nextLevel = Math.max(
      baseLevel,
      Math.floor(projectedCompletions / tasksPerLevel) + 1
    );
    if (nextLevel > projectedLevel) {
      ceremonies.push({
        eventUuid: event.eventUuid,
        previousLevel: projectedLevel,
        newLevel: nextLevel,
        taskTitle: event.metadata?.taskTitle || 'A conquered Operation',
        taskCategory: event.metadata?.taskCategory || 'General',
      });
    }
    projectedLevel = nextLevel;
  }

  return { ceremonies, projectedCompletions, projectedLevel };
};
