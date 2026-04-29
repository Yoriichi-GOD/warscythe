const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

if (posthogKey && window.posthog) {
  window.posthog.init(posthogKey, {
    api_host: posthogHost,
    autocapture: true,
    capture_pageview: true,
    persistence: 'localStorage',
  });
}

export const ph = window.posthog || { capture: () => {}, identify: () => {} };
