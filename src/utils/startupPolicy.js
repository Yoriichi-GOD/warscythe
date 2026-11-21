// This selects the initial bundle; Supabase still owns all authentication checks.
export function shouldStartApplication(browser, { native = false, dev = false } = {}) {
  if (native) return true;
  if (!browser) return false;
  const query = new URLSearchParams(browser.location.search || '');
  const hash = new URLSearchParams((browser.location.hash || '').slice(1));
  if (['code', 'access_token', 'refresh_token', 'token_hash', 'error', 'error_code', 'type'].some(key => query.has(key) || hash.has(key))) return true;
  try {
    const storage = browser.localStorage;
    if (dev && storage.getItem('warscythe_test_realm_active') === 'true') return true;
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      // Expired sessions must reach Supabase too, so it can refresh them.
      if (key?.startsWith('sb-') && key.endsWith('-auth-token') && storage.getItem(key)) return true;
    }
    const saved = JSON.parse(storage.getItem('Warscythe-storage') || 'null');
    return Boolean(saved?.state?.user?.id);
  } catch {
    return false;
  }
}
