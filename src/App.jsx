import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from './store/useWarscytheStore';
import Header from './components/Header';
import TaskModal from './components/TaskModal';
import TaskDetail from './components/TaskDetail';
import AuthModal from './components/AuthModal';
import VaultModal from './components/VaultModal';
import EliteNavigation from './components/EliteNavigation';
import { ShieldAlert } from 'lucide-react';
import './styles/main.css';
import DashboardLayout from './components/layout/DashboardLayout';
import Operations from './pages/Operations';
import QuestMap from './pages/QuestMap';
import LevelUpModal from './components/LevelUpModal';
import FocusOverlay from './components/FocusOverlay';
import ScratchCard from './components/ScratchCard';

export default function App() {
  const [activeTab, setActiveTab] = useState('ops');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showRealityLock, setShowRealityLock] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  const user = useWarscytheStore(state => state.user);
  
  const pendingReward = useWarscytheStore(state => state.pendingReward);
  const clearPendingReward = useWarscytheStore(state => state.clearPendingReward);
  const pendingLevelUp = useWarscytheStore(state => state.pendingLevelUp);
  const clearPendingLevelUp = useWarscytheStore(state => state.clearPendingLevelUp);
  const completeTask = useWarscytheStore(state => state.completeTask);
  const updateProgress = useWarscytheStore(state => state.updateProgress);

  const handleFinalize = () => {
    setShowRealityLock(false);
    setIsValidating(true);
    
    setTimeout(() => {
      completeTask(selectedTaskId);
      setIsValidating(false);
      setSelectedTaskId(null);
    }, 2000);
  };

  const handleReturn = () => {
    setShowRealityLock(false);
    updateProgress(selectedTaskId, 95);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowTaskModal(false);
        setShowVault(false);
        setSelectedTaskId(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!user) {
    return (
      <DashboardLayout>
        <AuthModal onClose={() => {}} isMandatory={true} />
        <div id="toast-container" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Header 
        onOpenMap={() => setActiveTab('map')} 
        onOpenVault={() => setShowVault(true)} 
        onOpenAuth={() => setShowAuth(true)}
      />
      
      <main className="flex-1 w-full overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'ops' ? (
            <motion.div
              key="ops"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full w-full"
            >
              <Operations 
                onAddTask={() => setShowTaskModal(true)} 
                onOpenTask={setSelectedTaskId}
                onCompleteTask={(id) => {
                  setSelectedTaskId(id);
                  setShowRealityLock(true);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full w-full"
            >
              <QuestMap />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <EliteNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <AnimatePresence>
        {showTaskModal && (
          <TaskModal onClose={() => setShowTaskModal(false)} />
        )}
        
        {selectedTaskId && (
          <TaskDetail 
            taskId={selectedTaskId} 
            onClose={() => setSelectedTaskId(null)} 
            onComplete={() => setShowRealityLock(true)}
          />
        )}

        {showVault && (
          <VaultModal onClose={() => setShowVault(false)} />
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
          </div>
        )}

        {pendingReward && (
          <ScratchCard 
            data={pendingReward} 
            onClose={clearPendingReward} 
          />
        )}

        {pendingLevelUp && (
          <LevelUpModal 
            data={pendingLevelUp} 
            onClose={clearPendingLevelUp} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <FocusOverlay />
      </AnimatePresence>

      <div id="toast-container" />
    </DashboardLayout>
  );
}