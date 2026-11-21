import { useSyncExternalStore } from 'react';

const reducedQuery = '(prefers-reduced-motion: reduce)';
const getReducedMotion = () => typeof window !== 'undefined' && window.matchMedia(reducedQuery).matches;
const getAmbientMotion = () => typeof document !== 'undefined' && !document.hidden && !getReducedMotion();
const getServerSnapshot = () => false;

function subscribe(listener) {
  const media = window.matchMedia(reducedQuery);
  media.addEventListener('change', listener);
  document.addEventListener('visibilitychange', listener);
  return () => {
    media.removeEventListener('change', listener);
    document.removeEventListener('visibilitychange', listener);
  };
}

export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribe, getReducedMotion, getServerSnapshot);
}

// No per-frame React updates: only system preference and tab visibility changes.
export function useAmbientMotion() {
  return useSyncExternalStore(subscribe, getAmbientMotion, getServerSnapshot);
}

export function getScrollBehavior() {
  return getReducedMotion() ? 'auto' : 'smooth';
}
