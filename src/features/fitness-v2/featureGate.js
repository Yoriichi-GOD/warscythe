export function isFitnessV2PreviewEnabled() {
  if (typeof window === 'undefined') return false;
  return import.meta.env.DEV || import.meta.env.VITE_FITNESS_V2_OLYMPUS === 'true';
}
