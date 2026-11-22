import { useState } from 'react';

export function useMobileDisplay(key, forceOpen = false, initiallyCollapsed = false) {
  const [collapsed, setCollapsed] = useState(() => {
    try { const saved = localStorage.getItem(`warscythe-display-${key}`); return saved === null ? initiallyCollapsed : saved === 'collapsed'; } catch { return initiallyCollapsed; }
  });
  const toggle = () => setCollapsed(value => {
    const next = !value;
    try { localStorage.setItem(`warscythe-display-${key}`, next ? 'collapsed' : 'expanded'); } catch { /* Optional preference. */ }
    return next;
  });
  return { collapsed: collapsed && !forceOpen, toggle, forceOpen };
}
