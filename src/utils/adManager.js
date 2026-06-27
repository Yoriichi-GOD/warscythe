const isMobileApp = typeof window !== 'undefined' && window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform();

// AdMob Test Unit IDs (replace with your production IDs from the AdMob console when releasing)
const AD_UNITS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',       // Google Test Banner
  interstitial: 'ca-app-pub-3940256099942544/1033173712'  // Google Test Interstitial
};

let AdMobModule = null;

const getAdMob = async () => {
  if (AdMobModule) return AdMobModule;
  try {
    // Dynamic import with variable and vite-ignore prevents Rolldown build failure before npm install is run
    const pluginName = '@capacitor-community/admob';
    const mod = await import(/* @vite-ignore */ pluginName);
    AdMobModule = mod;
    return mod;
  } catch (err) {
    console.warn('AdMob plugin is not installed or available on this platform.', err);
    return null;
  }
};

/**
 * AdManager handles AdMob logic for Android/iOS mobile application environments.
 */
export const AdManager = {
  isInitialized: false,
  isBannerShowing: false,

  initialize: async () => {
    if (!isMobileApp) return;
    if (AdManager.isInitialized) return;

    const admob = await getAdMob();
    if (!admob) return;

    try {
      // Initialize the AdMob plugin
      await admob.AdMob.initialize({
        requestTrackingAuthorization: true, // ATT dialog on iOS / Android permissions
        testingDevices: [],
        initializeForTesting: true,
      });

      AdManager.isInitialized = true;
      console.log('AdMob core initialized successfully.');
    } catch (err) {
      console.error('AdMob initialization error:', err);
    }
  },

  showBanner: async () => {
    if (!isMobileApp) return;

    const { useWarscytheStore } = await import('../store/useWarscytheStore');
    const isAdFree = useWarscytheStore.getState().isAdFree;
    if (isAdFree) {
      await AdManager.hideBanner();
      return;
    }

    const admob = await getAdMob();
    if (!admob) return;

    try {
      await admob.AdMob.showBanner({
        adId: AD_UNITS.banner,
        adSize: admob.BannerAdSize.BANNER,
        position: admob.BannerAdPosition.BOTTOM_CENTER,
        margin: 55, // Clear navigation tabs
        isTesting: true
      });
      AdManager.isBannerShowing = true;
      console.log('Banner Ad requested.');
    } catch (err) {
      console.error('Failed to show banner ad:', err);
    }
  },

  hideBanner: async () => {
    if (!isMobileApp) return;
    
    const admob = await getAdMob();
    if (!admob) return;

    try {
      await admob.AdMob.removeBanner();
      AdManager.isBannerShowing = false;
      console.log('Banner Ad removed.');
    } catch (err) {
      console.error('Failed to hide banner ad:', err);
    }
  },

  showInterstitial: async () => {
    if (!isMobileApp) return;

    const { useWarscytheStore } = await import('../store/useWarscytheStore');
    const isAdFree = useWarscytheStore.getState().isAdFree;
    if (isAdFree) return;

    const admob = await getAdMob();
    if (!admob) return;

    try {
      // Prepare interstitial ad
      await admob.AdMob.prepareInterstitial({
        adId: AD_UNITS.interstitial,
        isTesting: true
      });

      // Show prepared interstitial ad
      await admob.AdMob.showInterstitial();
      console.log('Interstitial Ad displayed.');
    } catch (err) {
      console.error('Failed to show interstitial ad:', err);
    }
  }
};

/**
 * AdSenseManager handles dynamic Google AdSense Auto Ads injection for web/browser environments.
 */
export const AdSenseManager = {
  scriptElement: null,

  initialize: async () => {
    if (isMobileApp) return;

    const { useWarscytheStore } = await import('../store/useWarscytheStore');
    const isAdFree = useWarscytheStore.getState().isAdFree;
    if (isAdFree) {
      AdSenseManager.removeAds();
      return;
    }

    if (AdSenseManager.scriptElement) return;

    try {
      // Inject Google AdSense Auto Ads script tag dynamically into the document header
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6633543150979941';
      script.crossOrigin = 'anonymous';
      script.id = 'adsense-script';
      
      document.head.appendChild(script);
      AdSenseManager.scriptElement = script;
      console.log('AdSense script loaded successfully.');
    } catch (err) {
      console.error('Failed to initialize Google AdSense:', err);
    }
  },

  removeAds: () => {
    if (isMobileApp) return;
    
    const script = document.getElementById('adsense-script');
    if (script) {
      script.remove();
      AdSenseManager.scriptElement = null;
      console.log('AdSense script removed for premium account.');
    }
  }
};
