// Keep date-only journal days intact; timestamps use the reader's local day.
export function getRitualJournal(events = []) {
  const seen = new Set();
  return events.flatMap((event) => {
    if (!event || typeof event !== 'object') return [];
    const value = event.date || event.occurredAt;
    if (!value) return [];
    let day;
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
      if (!Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0,10) !== value) return [];
      day = value;
    } else {
      const date = new Date(value); if (!Number.isFinite(date.getTime())) return [];
      day = [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-');
    }
    const id = event.eventUuid || event.id || [event.ritualUuid || event.ritualId || event.ritualTitle || 'ritual',day].join(':');
    if (seen.has(id)) return []; seen.add(id);
    return [{ id, day, title:event.ritualTitle || 'Archived Ritual' }];
  }).sort((a,b) => b.day.localeCompare(a.day));
}
