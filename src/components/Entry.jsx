import { lazy, Suspense, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import LandingPage from './LandingPage';
import { shouldStartApplication } from '../utils/startupPolicy';

const Application = lazy(() => import('../App.jsx'));
const startupOptions = { native: Capacitor.isNativePlatform(), dev: import.meta.env.DEV };

export default function Entry() {
  const [showApplication, setShowApplication] = useState(() => shouldStartApplication(window, startupOptions));
  const [authRequested, setAuthRequested] = useState(false);
  useEffect(() => {
    const onStorage = () => { if (shouldStartApplication(window, startupOptions)) setShowApplication(true); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  if (!showApplication) return <LandingPage onLaunch={() => { setAuthRequested(true); setShowApplication(true); }} />;
  return <Suspense fallback={<div className="entry-loading" role="status"><img src={startupOptions.native ? '/command-core.webp' : '/generated/ui/command-core-96.webp'} alt="" width="48" height="48" /><p>Opening your command…</p></div>}><Application initialAuthOnWeb={authRequested} /></Suspense>;
}
