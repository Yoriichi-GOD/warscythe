import { useState } from 'react';

export function useMobileDisplay(key, forceOpen = false) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(`warscythe-display-${key}`) === 'collapsed'; } catch { return false; }
  });
  const toggle = () => setCollapsed(value => {
    const next = !value;
    try { localStorage.setItem(`warscythe-display-${key}`, next ? 'collapsed' : 'expanded'); } catch { /* Optional preference. */ }
    return next;
  });
  return { collapsed: collapsed && !forceOpen, toggle, forceOpen };
}
