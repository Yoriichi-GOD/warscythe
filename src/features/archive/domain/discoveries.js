const count = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;

// Legacy regional fragments remain an entitlement record. They no longer
// determine the subject, origin or arrangement of the documents being read.
export function earnedDiscoveryCount(state = {}) {
  const fragments = state.unlockedLore;
  const legacy = fragments && typeof fragments === 'object' && !Array.isArray(fragments)
    ? Object.values(fragments).reduce((total, entries) => total + (Array.isArray(entries)
      ? new Set(entries.filter(entry => typeof entry === 'string' && entry.trim())).size : 0), 0)
    : 0;
  return Math.max(count(state.totalCompletions), legacy);
}

export function collectDocuments(documents, order, state) {
  const byId = new Map(documents.map(document => [document.id, document]));
  return order.slice(0, earnedDiscoveryCount(state)).map(id => byId.get(id)).filter(Boolean);
}

export function visibleConnections(document, collected) {
  const known = new Map(collected.map(item => [item.id, item]));
  return (document.connections || []).filter(link => known.has(link.id))
    .map(link => ({ ...link, document: known.get(link.id) }));
}

export function filterDocuments(documents, { query = '', kind = 'all', thread = 'all' } = {}) {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return documents.filter(document => (kind === 'all' || document.kind === kind)
    && (thread === 'all' || document.threads.includes(thread))
    && words.every(word => [document.title, document.author, document.recipient, ...document.paragraphs]
      .filter(Boolean).join(' ').toLocaleLowerCase().includes(word)));
}

export function archiveStorageKey(userId) {
  return `warscythe:world-archive:v1:${encodeURIComponent(userId || 'local')}`;
}

export function reconcileReadingState(saved, available) {
  const known = new Set(available.map(document => document.id));
  const read = Array.isArray(saved?.read) ? [...new Set(saved.read.filter(id => known.has(id)))] : [];
  return {
    read,
    documentId: known.has(saved?.documentId) ? saved.documentId : available[0]?.id || null,
    page: count(saved?.page),
    paragraph: count(saved?.paragraph),
    mode: ['original', 'book', 'reading'].includes(saved?.mode) ? saved.mode : 'original',
  };
}
