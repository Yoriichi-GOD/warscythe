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
import EliteNavigation from './components/EliteNavigation';
import { ShieldAlert } from 'lucide-react';
import './styles/main.css';
import DashboardLayout from './components/layout/DashboardLayout';
import Operations from './pages/Operations';
import Rituals from './pages/Rituals';
import QuestMap from './pages/QuestMap';
import Fitness from './pages/Fitness';
import Forge from './pages/Forge';
import Ledger from './pages/Ledger';
import LevelUpModal from './components/LevelUpModal';
import FocusOverlay from './components/FocusOverlay';
import ScratchCard from './components/ScratchCard';
import { initNetworkMonitoring } from './utils/nativeTriggers';

import TutorialModal from './components/TutorialModal';
import StreakScrollModal from './components/StreakScrollModal';
import BossFlashScreen from './components/BossFlashScreen';
import RegionFlashScreen from './components/RegionFlashScreen';
import { REGIONS } from './store/constants';

export default function App() {
  useEffect(() => {
    const state = useWarscytheStore.getState();
    const ritualsCompleted = (state.rituals || []).reduce((acc, r) => acc + (r.streak || 0), 0);
    const tasksCompleted = (state.completedTasks || []).length;
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
    
    // Unconditionally force sync to fix any corrupted state
    useWarscytheStore.setState({
      totalCompletions: trueTotalCompletions,
      level: trueLevel,
      currentLevelProgress: trueProgress,
      unlockedLore: reconstructedLore,
      unlockedScythes: cleanUnlocked,
      scytheMigrationDone: true
    });
  }, []);

  const [activeTab, setActiveTab] = useState('ops');
  const [ledgerSubTab, setLedgerSubTab] = useState('history');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskModalInitialEffort, setTaskModalInitialEffort] = useState('Medium');
  const [showRitualModal, setShowRitualModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showRealityLock, setShowRealityLock] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showSlash, setShowSlash] = useState(false);
  const [pendingEntryScreen, setPendingEntryScreen] = useState(null);
  
  const user = useWarscytheStore(state => state.user);
  
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

  const tasks = useWarscytheStore(state => state.tasks);
  const isFocusMode = useWarscytheStore(state => state.isFocusMode);
  const focusedTaskId = useWarscytheStore(state => state.focusedTaskId);
  const scytheLevel = useWarscytheStore(state => state.scytheLevel);

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

  const handleFinalize = () => {
    setShowRealityLock(false);
    setIsValidating(true);
    setShowSlash(false);
    
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

    window.addEventListener('keydown', handleEsc);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('navToLedgerVault', handleNavToLedgerVault);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('navToLedgerVault', handleNavToLedgerVault);
    };
  }, []);

  useEffect(() => {
    if (user) {
      updateStreak();
    }
  }, [user, updateStreak]);

  if (!user) {
    return (
      <DashboardLayout>
        <AuthModal onClose={() => {}} isMandatory={true} />
        <div id="toast-container" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab}>
      <Header 
        onOpenMap={() => setActiveTab('map')} 
        onOpenVault={() => setActiveTab('ledger')} 
        onOpenAuth={() => setShowAuth(true)}
        onOpenGymLog={() => setActiveTab('fitness')}
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
          <Forge />
        </div>
        
        <div 
          style={{ display: activeTab === 'map' ? 'block' : 'none' }} 
          className="h-full w-full overflow-hidden"
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
                
                <div className="reality-actions">
                  <button className="confirm-btn" onClick={handleFinalize}>
                    <div className="btn-glitch-layer">FINISH IT</div>
                    <span>FINISH IT</span>
                  </button>
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

        {pendingReward && !activeBossFlash && !pendingVictoryScreen && (
          <ScratchCard 
            data={pendingReward} 
            onClose={clearPendingReward} 
          />
        )}

        {activeBossFlash && !pendingVictoryScreen && (
          <BossFlashScreen 
            key="boss-flash-screen"
            type={activeBossFlash} 
            onClose={clearBossFlash} 
          />
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
        {pendingEntryScreen && !pendingLevelUp && (
          <RegionFlashScreen
            key="entry-screen"
            type="entry"
            regionData={pendingEntryScreen}
            onClose={() => setPendingEntryScreen(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <FocusOverlay />
      </AnimatePresence>

      <TutorialModal />
      <StreakScrollModal />

      <div id="toast-container" />
    </DashboardLayout>
  );
}