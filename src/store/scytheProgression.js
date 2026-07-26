export const deriveDailyScytheLevel = ({ operations = 0, rituals = 0 } = {}) => {
  const totalActions = operations + rituals;

  if (operations >= 3 && rituals >= 4) return 'PLATINUM';
  if (totalActions >= 6 && operations >= 2 && rituals >= 3) return 'ASCENDED';
  if (totalActions >= 4 && operations >= 1 && rituals >= 1) return 'REFINED';
  if (totalActions >= 2) return 'HARDENED';
  if (totalActions >= 1) return 'AWAKENED';
  return 'DORMANT';
};
