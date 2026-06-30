import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore, getLore } from './store/useWarscytheStore';
import { TASKS_PER_LEVEL } from './store/constants';
import Header from './components/Header';
import TaskModal from './components/TaskModal';
import RitualModal from './components/RitualModal';
import TaskDetail from './components/TaskDetail';
import AuthModal from './components/AuthModal';
import VaultModal from './components/VaultModal';
import UsernameSetup from './components/UsernameSetup';
import EliteNavigation from './components/EliteNavigation';
import PremiumModal from './components/PremiumModal';
import ShopModal from './components/ShopModal';
import AssetDownloaderModal from './components/AssetDownloaderModal';
import CacheAlertPopup from './components/CacheAlertPopup';
import { ShieldAlert, X, Lock, Terminal } from 'lucide-react';
import './styles/main.css';
import DashboardLayout from './components/layout/DashboardLayout';
import Operations from './pages/Operations';
import Rituals from './pages/Rituals';
import QuestMap from './pages/QuestMap';
import Fitness from './pages/Fitness';
import Forge from './pages/Forge';
import Ledger from './pages/Ledger';
import Social from './pages/Social';
import InfoModal from './components/InfoModal';
import { infoData } from './data/infoDescriptions';
import LevelUpModal from './components/LevelUpModal';
import FocusOverlay from './components/FocusOverlay';
import { AdManager, AdSenseManager } from './utils/adManager';
import ScratchCard from './components/ScratchCard';
import { initNetworkMonitoring } from './utils/nativeTriggers';
import { App as CapacitorApp } from '@capacitor/app';
import { supabase } from './lib/supabase';
import LandingPage from './components/LandingPage';

import TutorialModal from './components/TutorialModal';
import StreakScrollModal from './components/StreakScrollModal';
import BossFlashScreen from './components/BossFlashScreen';
import RegionFlashScreen from './components/RegionFlashScreen';
import LoreModal from './components/LoreModal';
import WarTerminal from './components/command/WarTerminal';
import { REGIONS } from './store/constants';
const PROPHECIES = [
  "Your brain accelerates when stakes are high. The chaos you feel is your processor scaling. Trust it.",
  "Fatigue is data, not failure.",
  "You're hitting a wall. This is normal. Your neurochemistry needs recalibration. Take 3 minutes. Breathe. Return. Your velocity will resume.",
  "Your mind is synthesizing. You just switched focus three times in 2 minutes. This isn't distraction. Your brain is making connections. Trust the process. One of those connections will reshape the work.",
  "Pressure sharpens you. Your clock is accelerating. Most people panic. You sharpen. Your peak velocity is approaching. Ride it.",
  "You are the type who finishes. You've started 47 tasks this month. You're completing this one. That's not luck. That's your architecture. Keep moving.",
  "The final 1% costs 50% of effort. You're close. The remaining work feels impossible. It's not. It's just the final 1%. It always costs this much. You always pay it. Continue.",
  "You've been hyperfocused for 90 minutes. Your body needs water. Stand up. Come back in 3 minutes. Your flow will resume."
];

const TIPS = {
  gym: [
    "Form degrades at fatigue. Check your mirror. Reset.",
    "You're 2 sets away from new volume. Push into the discomfort."
  ],
  operations: [
    "You're in flow. Don't break it. The chaos is coherence. Trust your fingers.",
    "You've rewritten this section multiple times. Each version is sharper. One more pass."
  ],
  ritual: [
    "Consistency compounds. This single rep builds the identity you want to become.",
    "You're tired. You're still here. That's the definition of discipline."
  ]
};

const getTaskCategoryType = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('gym') || cat.includes('fit') || cat.includes('train') || cat.includes('health') || cat.includes('workout')) {
    return 'gym';
  }
  if (cat.includes('ritual') || cat.includes('habit') || cat.includes('daily') || cat.includes('routine')) {
    return 'ritual';
  }
  return 'operations';
};

export default function App() {
  const user = useWarscytheStore(state => state.user);
  const username = useWarscytheStore(state => state.username);
  const isMerging = useWarscytheStore(state => state.isMerging);
  const level = useWarscytheStore(state => state.level);
  const soundscapeEnabled = useWarscytheStore(state => state.soundscapeEnabled);
  const soundscapeVolume = useWarscytheStore(state => state.soundscapeVolume);
  const activeTheme = useWarscytheStore(state => state.activeTheme);

  useEffect(() => {
    const state = useWarscytheStore.getState();
    const ritualsCompleted = (state.rituals || []).reduce((acc, r) => acc + (r.streak || 0), 0);
    const tasksCompleted = (state.completedTasks || []).filter(t => !t.isTutorialTask).length;
    const trueTotalCompletions = tasksCompleted + ritualsCompleted;
    
    const trueLevel = Math.floor(trueTotalCompletions / TASKS_PER_LEVEL) + 1;
    const trueProgress = trueTotalCompletions % TASKS_PER_LEVEL;
    
    // Retroactively rebuild unlocked lore based on true completions
    const reconstructedLore = {};
    for (let r = 0; r < trueLevel; r++) {
      const loreArr = getLore(r) || [];
      const fragsForThisRegion = r === trueLevel - 1 ? trueProgress : TASKS_PER_LEVEL;
      reconstructedLore[r] = loreArr.slice(0, fragsForThisRegion);
    }
    
    // Run one-time migration to clean up auto-unlocked scythes from legacy streak calculation
    const cleanUnlocked = state.scytheMigrationDone 
      ? (state.unlockedScythes || ['neophyte'])
      : ['neophyte'];
    
    // Auto-detect legacy users to bypass onboarding if they already have progress
    const hasCompletedTutorial = !!(state.hasCompletedTutorial || trueTotalCompletions > 0 || trueLevel > 1 || state.firstTaskCompleted);
    const tutorialStep = hasCompletedTutorial ? 'completed' : state.tutorialStep;

    // Unconditionally force sync to fix any corrupted state
    useWarscytheStore.setState({
      totalCompletions: trueTotalCompletions,
      level: trueLevel,
      currentLevelProgress: trueProgress,
      unlockedLore: reconstructedLore,
      unlockedScythes: cleanUnlocked,
      scytheMigrationDone: true,
      hasCompletedTutorial,
      tutorialStep
    });
  }, [user?.email]);

  const [activeTab, setActiveTab] = useState('ops');
  const [ledgerSubTab, setLedgerSubTab] = useState('history');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskModalInitialEffort, setTaskModalInitialEffort] = useState('Medium');
  const [showRitualModal, setShowRitualModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showDownloaderModal, setShowDownloaderModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showRealityLock, setShowRealityLock] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showSlash, setShowSlash] = useState(false);
  const [pendingEntryScreen, setPendingEntryScreen] = useState(null);
  const [cacheAlertRegionId, setCacheAlertRegionId] = useState(null);
  const [showLoreModal, setShowLoreModal] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showAuthOnWeb, setShowAuthOnWeb] = useState(false);
  
  const openInfoModal = useWarscytheStore(state => state.openInfoModal);

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const foundSectionId = Object.keys(infoData).find(secId =>
          infoData[secId].features.some(f => f.id === hash)
        );
        if (foundSectionId) {
          openInfoModal(foundSectionId, hash);
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [openInfoModal]);
  
  // 🔮 Guardian Angel Global States & Logic
  const [activeProphecy, setActiveProphecy] = useState(null);
  const [showProphecyCard, setShowProphecyCard] = useState(false);

  const addReceivedProphecy = useWarscytheStore(state => state.addReceivedProphecy);

  useEffect(() => {
    const isMobileApp = typeof window !== 'undefined' && window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform();
    if (!isMobileApp) return;

    const handleImageError = (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        const src = e.target.src;
        if (src && src.includes('supabase.co/storage/v1/object/public/cosmetics/')) {
          let detectedRegionId = null;
          const match = src.match(/(?:empress|crest|map|region)-(\d+)/i);
          if (match) {
            detectedRegionId = parseInt(match[1], 10);
          }
          setCacheAlertRegionId(detectedRegionId || 'Unknown');
        }
      }
    };

    window.addEventListener('error', handleImageError, true); // capture phase
    return () => window.removeEventListener('error', handleImageError, true);
  }, []);

  useEffect(() => {
    // Initialize Ads based on environment
    const initAds = async () => {
      // Mobile native setup
      await AdManager.initialize();
      await AdManager.showBanner();

      // Web browser setup
      await AdSenseManager.initialize();
    };
    initAds();

    // Subscribe to store change of isAdFree to update ad status dynamically
    let prevAdFree = useWarscytheStore.getState().isAdFree;
    const unsubscribe = useWarscytheStore.subscribe((state) => {
      const nextAdFree = state.isAdFree;
      if (nextAdFree !== prevAdFree) {
        prevAdFree = nextAdFree;
        if (nextAdFree) {
          AdManager.hideBanner();
          AdSenseManager.removeAds();
        } else {
          AdManager.showBanner();
          AdSenseManager.initialize();
        }
      }
    });

    return () => {
      unsubscribe();
      AdManager.hideBanner();
      AdSenseManager.removeAds();
    };
  }, []);

  useEffect(() => {
    if (showProphecyCard) {
      const timer = setTimeout(() => {
        setShowProphecyCard(false);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [showProphecyCard]);

  useEffect(() => {
    import('./utils/audioManager').then(({ audioManager }) => {
      audioManager.setEnabled(soundscapeEnabled);
      audioManager.setVolume(soundscapeVolume);
      audioManager.playRegion(level - 1);
    });
  }, [level, soundscapeEnabled, soundscapeVolume, activeTheme]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowTerminal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tutorialStep = useWarscytheStore(state => state.tutorialStep);

  useEffect(() => {
    if (tutorialStep && tutorialStep !== 'completed') {
      if (tutorialStep === 'map_guide') {
        setActiveTab('ops');
      } else if (tutorialStep === 'ops_guide') {
        setActiveTab('map');
      } else if (tutorialStep === 'ledger_guide') {
        setActiveTab('ops');
      } else if (tutorialStep === 'task_creation_prompt') {
        setActiveTab('ledger');
      } else if (tutorialStep === 'task_creation') {
        setActiveTab('ops');
      }
    }
  }, [tutorialStep]);

  const pullGlobalProphecy = () => {
    const activeId = isFocusMode ? focusedTaskId : selectedTaskId;
    const activeTask = (tasks || []).find(t => t.id === activeId);
    const isTip = Math.random() < 0.4;
    let text = '';
    let type = 'prophecy';

    if (isTip && activeTask?.category) {
      const catType = getTaskCategoryType(activeTask.category);
      const tipList = TIPS[catType] || TIPS.operations;
      text = tipList[Math.floor(Math.random() * tipList.length)];
      type = 'guardian tip';
    } else {
      text = PROPHECIES[Math.floor(Math.random() * PROPHECIES.length)];
      type = 'prophecy';
    }

    setActiveProphecy({ text, type });
    setShowProphecyCard(true);

    if (addReceivedProphecy) {
      addReceivedProphecy({ text, type });
    }
  };
  

  
  const pendingReward = useWarscytheStore(state => state.pendingReward);
  const clearPendingReward = useWarscytheStore(state => state.clearPendingReward);
  const pendingLevelUp = useWarscytheStore(state => state.pendingLevelUp);
  const clearPendingLevelUp = useWarscytheStore(state => state.clearPendingLevelUp);
  const completeTask = useWarscytheStore(state => state.completeTask);
  const updateProgress = useWarscytheStore(state => state.updateProgress);
  const updateStreak = useWarscytheStore(state => state.updateStreak);
  const activeBossFlash = useWarscytheStore(state => state.activeBossFlash);
  const clearBossFlash = useWarscytheStore(state => state.clearBossFlash);
  const pendingVictoryScreen = useWarscytheStore(state => state.pendingVictoryScreen);
  const clearPendingVictoryScreen = useWarscytheStore(state => state.clearPendingVictoryScreen);
  const setSoundscapeEnabled = useWarscytheStore(state => state.setSoundscapeEnabled);

  const tasks = useWarscytheStore(state => state.tasks);
  const isFocusMode = useWarscytheStore(state => state.isFocusMode);
  const focusedTaskId = useWarscytheStore(state => state.focusedTaskId);
  const scytheLevel = useWarscytheStore(state => state.scytheLevel);
  const showResetPasswordModal = useWarscytheStore(state => state.showResetPasswordModal);
  const updatePassword = useWarscytheStore(state => state.updatePassword);
  const activeTheme = useWarscytheStore(state => state.activeTheme);

  // Sync priority body class
  useEffect(() => {
    if (!user) return;
    const activeId = isFocusMode ? focusedTaskId : selectedTaskId;
    const activeTask = (tasks || []).find(t => t.id === activeId);
    const priority = activeTask ? activeTask.priority : 'none';

    document.body.classList.remove('priority-low', 'priority-medium', 'priority-high');
    if (priority === 'low') {
      document.body.classList.add('priority-low');
    } else if (priority === 'medium') {
      document.body.classList.add('priority-medium');
    } else if (priority === 'high') {
      document.body.classList.add('priority-high');
    }
  }, [isFocusMode, focusedTaskId, selectedTaskId, tasks, user]);

  // Sync active theme body class
  useEffect(() => {
    Array.from(document.body.classList).forEach(cls => {
      if (cls.startsWith('theme-')) {
        document.body.classList.remove(cls);
      }
    });
    if (activeTheme && activeTheme !== 'default') {
      document.body.classList.add(`theme-${activeTheme}`);
    }
  }, [activeTheme]);

  const handleFinalize = () => {
    setShowRealityLock(false);
    setIsValidating(true);
    setShowSlash(false);
    
    if (tutorialStep === 'reality_check') {
      useWarscytheStore.setState({ tutorialStep: 'scratch_card' });
    }

    setTimeout(() => {
      setShowSlash(true);
      setTimeout(() => {
        try {
          completeTask(selectedTaskId);
        } catch (err) {
          console.error("Task completion failed:", err);
        } finally {
          setIsValidating(false);
          setShowSlash(false);
          setSelectedTaskId(null);
        }
      }, 500);
    }, 1500);
  };

  const handleReturn = () => {
    setShowRealityLock(false);
    updateProgress(selectedTaskId, 95);
  };

  useEffect(() => {
    initNetworkMonitoring();
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowTaskModal(false);
        setShowRitualModal(false);
        setSelectedTaskId(null);
      }
    };
    
    const handleBeforeUnload = () => {
      const store = useWarscytheStore.getState();
      if (store.hasPendingChanges) {
        store.forceSync();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const store = useWarscytheStore.getState();
        if (store.hasPendingChanges) {
          store.forceSync();
        }
      }
    };

    // Navigation handler for 'Access Full Vault' -> Ledger Relics & Lore
    const handleNavToLedgerVault = () => {
      setActiveTab('ledger');
      setLedgerSubTab('vault');
    };

    let appUrlListener;
    const setupDeepLinking = async () => {
      try {
        appUrlListener = await CapacitorApp.addListener('appUrlOpen', async (event) => {
          console.log('App opened with URL:', event.url);
          // Standard verify URL: https://warscythe.xyz/#access_token=...&refresh_token=...&type=recovery
          const urlStr = event.url.replace('#', '?');
          const urlObj = new URL(urlStr);
          const accessToken = urlObj.searchParams.get('access_token');
          const refreshToken = urlObj.searchParams.get('refresh_token');
          const type = urlObj.searchParams.get('type');

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            if (error) {
              console.error('Failed to set deep link session:', error.message);
            } else {
              console.log('Deep link login successful, type:', type);
              if (type === 'recovery') {
                useWarscytheStore.setState({ showResetPasswordModal: true });
              }
            }
          }
        });
      } catch (err) {
        console.warn('Capacitor App listener not active (running in browser environment):', err);
      }
    };
    setupDeepLinking();

    const handleTriggerProphecy = () => {
      pullGlobalProphecy();
    };

    window.addEventListener('keydown', handleEsc);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('navToLedgerVault', handleNavToLedgerVault);
    window.addEventListener('triggerProphecy', handleTriggerProphecy);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('navToLedgerVault', handleNavToLedgerVault);
      window.removeEventListener('triggerProphecy', handleTriggerProphecy);
      if (appUrlListener) {
        appUrlListener.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (user) {
      updateStreak();
    }
  }, [user, updateStreak]);

  if (!user) {
    const isMobile = typeof window !== 'undefined' && window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform();
    
    if (isMobile) {
      return (
        <DashboardLayout>
          <AuthModal onClose={() => {}} isMandatory={true} />
          <div id="toast-container" />
        </DashboardLayout>
      );
    }

    if (showAuthOnWeb) {
      return (
        <DashboardLayout>
          <AuthModal onClose={() => setShowAuthOnWeb(false)} isMandatory={false} />
          <div id="toast-container" />
        </DashboardLayout>
      );
    }

    return (
      <>
        <LandingPage onLaunch={() => setShowAuthOnWeb(true)} />
        <div id="toast-container" />
      </>
    );
  }

  if (user && !isMerging && !username) {
    return (
      <DashboardLayout>
        <UsernameSetup />
        <div id="toast-container" />
      </DashboardLayout>
    );
  }

  const isTutorialActive = tutorialStep && tutorialStep !== 'completed';

  return (
    <DashboardLayout activeTab={activeTab}>
      <Header 
        onOpenMap={() => setActiveTab('map')} 
        onOpenVault={() => setActiveTab('ledger')} 
        onOpenAuth={() => setShowAuth(true)}
        onOpenGymLog={() => setActiveTab('fitness')}
        onOpenPremium={() => setShowPremiumModal(true)}
        onOpenShop={() => setShowShopModal(true)}
        onOpenDownloader={() => setShowDownloaderModal(true)}
        onOpenLore={() => setShowLoreModal(true)}
        onOpenSocial={() => setActiveTab('social')}
      />
      
      <main className="flex-1 w-full overflow-hidden relative">
        {/* Persistent Tab Pages for Smooth Mobile Switching */}
        <div 
          style={{ display: activeTab === 'ops' ? 'block' : 'none' }} 
          className="h-full w-full overflow-y-auto custom-scrollbar"
        >
          <Operations 
            onAddTask={() => {
              setTaskModalInitialEffort('Medium');
              setShowTaskModal(true);
            }} 
            onOpenTask={setSelectedTaskId}
            onCompleteTask={(id) => {
              setSelectedTaskId(id);
              setShowRealityLock(true);
            }}
            onOpenGymLog={() => setActiveTab('fitness')}
          />
        </div>

        <div 
          style={{ display: activeTab === 'fitness' ? 'block' : 'none' }} 
          className="h-full w-full overflow-y-auto custom-scrollbar"
        >
          <Fitness />
        </div>
        
        <div 
          style={{ display: activeTab === 'rituals' ? 'block' : 'none' }} 
          className="h-full w-full overflow-y-auto custom-scrollbar"
        >
          <Rituals onAddTask={() => setShowRitualModal(true)} />
        </div>

        <div 
          style={{ display: activeTab === 'forge' ? 'block' : 'none' }} 
          className="h-full w-full overflow-y-auto custom-scrollbar"
        >
          <Forge onOpenShop={() => setShowShopModal(true)} />
        </div>
        
        <div 
          style={{ display: activeTab === 'map' ? 'block' : 'none' }} 
          className="h-full w-full overflow-y-auto lg:overflow-hidden custom-scrollbar"
        >
          <QuestMap onTabChange={(tab, options) => {
            setActiveTab(tab);
            if (options?.openAddTask) {
              setTaskModalInitialEffort(options.defaultEffort || 'Medium');
              setShowTaskModal(true);
            } else if (tab === 'ledger' && options?.subTab) {
              setLedgerSubTab(options.subTab);
            }
          }} />
        </div>
        
        <div 
          style={{ display: activeTab === 'ledger' ? 'block' : 'none' }} 
          className="h-full w-full overflow-y-auto custom-scrollbar"
        >
          <Ledger initialSubTab={ledgerSubTab} onSubTabChange={setLedgerSubTab} />
        </div>

        <div 
          style={{ display: activeTab === 'social' ? 'block' : 'none' }} 
          className="h-full w-full overflow-y-auto custom-scrollbar"
        >
          <Social />
        </div>
      </main>

      <EliteNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <AnimatePresence>
        {showTaskModal && (
          <TaskModal 
            onClose={() => setShowTaskModal(false)} 
            initialEffort={taskModalInitialEffort}
          />
        )}
        
        {showRitualModal && (
          <RitualModal onClose={() => setShowRitualModal(false)} />
        )}
        
        {selectedTaskId && !showRealityLock && !isValidating && (
          <TaskDetail 
            taskId={selectedTaskId} 
            onClose={() => setSelectedTaskId(null)} 
            onComplete={() => setShowRealityLock(true)}
          />
        )}

        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} />
        )}

        {showResetPasswordModal && (
          <AuthModal 
            initialScreen="reset_password" 
            onClose={() => useWarscytheStore.setState({ showResetPasswordModal: false })} 
            isMandatory={true} 
          />
        )}

        {showRealityLock && (
          <div className="modal-backdrop" style={{ zIndex: 1100 }}>
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="modal-content reality-lock-panel"
             >
                <div className="lock-icon-shield">
                   <ShieldAlert size={32} />
                </div>
                <h2 className="reality-title">REALITY CHECK</h2>
                <p className="reality-desc">Is this objective truly conquered, or are you escaping resistance?</p>
                
                <div className="reality-actions" style={{ position: 'relative' }}>
                  <button className={`confirm-btn ${tutorialStep === 'reality_check' ? 'gold-glow-ring' : ''}`} onClick={handleFinalize}>
                    <div className="btn-glitch-layer">FINISH IT</div>
                    <span>FINISH IT</span>
                  </button>

                  {tutorialStep === 'reality_check' && (
                    <div className="onboarding-pointer" style={{ position: 'absolute', bottom: '100%', left: '0', marginBottom: '1rem', width: '250px' }}>
                      <span className="pointer-tag">GUIDE</span>
                      <h4>Reality Check</h4>
                      <p>Be honest with yourself. Did you truly conquer the objective, or are you escaping resistance? Click 'FINISH IT' to log your triumph.</p>
                    </div>
                  )}

                  <button className="return-btn" onClick={handleReturn}>
                    <span>RETURN TO BATTLE</span>
                  </button>
                </div>

                <div className="lock-footer">
                   <span>WARNING: FALSE VALOR DILUTES THE WILL</span>
                </div>
             </motion.div>
          </div>
        )}

        {isValidating && (
          <div className="modal-backdrop validating-overlay">
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="validating-text"
            >
              V A L I D A T I N G
            </motion.div>
            <AnimatePresence>
              {showSlash && (
                <motion.div 
                  className="fullscreen-slash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div 
                    initial={{ scaleX: 0, rotate: -45, opacity: 1 }}
                    animate={{ scaleX: 1, rotate: -45, opacity: [1, 0] }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`slash-line slash-material-${(scytheLevel || 'dormant').toLowerCase()}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* STEP 1 — Victory liberation flash (fires first on level-up) */}
        {pendingVictoryScreen && (
          <RegionFlashScreen
            key="victory-screen"
            type="victory"
            regionData={pendingVictoryScreen}
            onClose={clearPendingVictoryScreen}
          />
        )}

        {/* STEP 2 — LevelUpModal (fires after victory screen dismissed) */}
        {pendingLevelUp && !pendingVictoryScreen && (
          <LevelUpModal 
            data={pendingLevelUp} 
            onClose={() => {
              const newMapIndex = ((pendingLevelUp.newLevel - 1) % 10) + 1;
              setPendingEntryScreen({
                mapIndex: newMapIndex,
                regionName: REGIONS?.[pendingLevelUp.newLevel - 1]?.name || `Region ${newMapIndex}`,
              });
              clearPendingLevelUp();
            }} 
          />
        )}

        {/* STEP 3 — Region entry screen (fires after level-up modal dismissed) */}
        {pendingEntryScreen && !pendingLevelUp && !pendingVictoryScreen && (
          <RegionFlashScreen
            key="entry-screen"
            type="entry"
            regionData={pendingEntryScreen}
            onClose={() => setPendingEntryScreen(null)}
          />
        )}

        {/* STEP 4 — Boss flash screen (fires after entry screen / level transitions) */}
        {activeBossFlash && !pendingVictoryScreen && !pendingLevelUp && !pendingEntryScreen && (
          <BossFlashScreen 
            key="boss-flash-screen"
            type={activeBossFlash} 
            onClose={clearBossFlash} 
          />
        )}

        {pendingReward && !activeBossFlash && !pendingVictoryScreen && !pendingLevelUp && !pendingEntryScreen && (
          <ScratchCard 
            data={pendingReward} 
            onClose={() => {
              clearPendingReward();
              if (tutorialStep === 'scratch_card') {
                useWarscytheStore.setState({ tutorialStep: 'fairy_intro' });
              }
            }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFocusMode && (
          <FocusOverlay 
            onTriggerProphecy={(text, type) => {
              setActiveProphecy({ text, type });
              setShowProphecyCard(true);
            }} 
          />
        )}
      </AnimatePresence>

      {/* 🔮 GLOBAL PROPHECY CARD */}
      <AnimatePresence>
        {showProphecyCard && activeProphecy && !pendingVictoryScreen && !pendingEntryScreen && !activeBossFlash && (
          <motion.div 
            initial={{ opacity: 0, x: 50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="guardian-prophecy-card"
          >
            <button className="prophecy-close-btn" onClick={() => setShowProphecyCard(false)}>
              <X size={12} />
            </button>
            
            <div className="prophecy-card-inner">
              <div className="prophecy-header-row">
                <div className="prophecy-avatar-mini">
                  <img src="/guardian-observer.png" alt="Guardian" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="prophecy-title-type">{activeProphecy.type}</span>
                  <span className="prophecy-subtitle-sub">guardian presence</span>
                </div>
              </div>
              
              <p className="prophecy-text-body">
                "{activeProphecy.text}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPremiumModal && (
          <PremiumModal 
            onClose={() => setShowPremiumModal(false)} 
            onOpenAuth={() => setShowAuth(true)} 
          />
        )}
        {showShopModal && (
          <ShopModal 
            onClose={() => setShowShopModal(false)} 
            onOpenAuth={() => setShowAuth(true)} 
          />
        )}
        {showDownloaderModal && (
          <AssetDownloaderModal 
            onClose={() => setShowDownloaderModal(false)} 
          />
        )}
        {cacheAlertRegionId && (
          <CacheAlertPopup 
            regionId={cacheAlertRegionId}
            onClose={() => setCacheAlertRegionId(null)}
            onOpenDownloader={() => setShowDownloaderModal(true)}
          />
        )}
        {showLoreModal && (
          <LoreModal 
            onClose={() => setShowLoreModal(false)} 
          />
        )}
      </AnimatePresence>

      {/* Floating War Terminal Trigger Button */}
      <button
        onClick={() => setShowTerminal(true)}
        className="fixed bottom-24 right-6 z-50 p-3 rounded-full bg-black/90 border border-gold-core/40 shadow-[0_0_15px_rgba(197,160,89,0.25)] hover:border-gold-bright hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] transition-all flex items-center justify-center cursor-pointer"
        title="Open War Terminal (Ctrl+K)"
      >
        <Terminal size={18} className="text-gold-core" />
      </button>

      <WarTerminal isOpen={showTerminal} onClose={() => setShowTerminal(false)} />

      <InfoModal />

      <TutorialModal />
      <StreakScrollModal />

      <div id="toast-container" />
    </DashboardLayout>
  );
}