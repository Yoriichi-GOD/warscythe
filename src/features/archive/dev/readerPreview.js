// Keep the request until the lazy application has mounted its listener.
// This is temporary UI state; it never enters an account or persistence store.
let pending = null;

export function requestReaderPreview(count, mode) {
  pending = { previewCount:count, mode:mode === 'book' ? 'book' : 'original' };
  window.dispatchEvent(new CustomEvent('warscythe:open-archive', { detail:pending }));
}

export function takeReaderPreview() {
  const request = pending;
  pending = null;
  return request;
}
