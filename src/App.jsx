import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from './store/useWarscytheStore';
import Header from './components/Header';
import OperationList from './components/OperationList';
import ScytheCenter from './components/ScytheCenter';
import Dashboard from './components/Dashboard';
import TaskModal from './components/TaskModal';
import TaskDetail from './components/TaskDetail';
import ScratchCard from './components/ScratchCard';
import MapSection from './components/MapSection';
import MapModal from './components/MapModal';
import LevelUpModal from './components/LevelUpModal';
import FocusOverlay from './components/FocusOverlay';
import VaultModal from './components/VaultModal';
import AuthModal from './components/AuthModal';
import EliteNavigation from './components/EliteNavigation';
import { ShieldAlert } from 'lucide-react';
import './styles/main.css';

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
    
    // The "Dopamine Delay"
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

  // Handle ESC globally
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
      <div className="app-main-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="grain-overlay" />
        <div className="vignette" />
        <AuthModal onClose={() => {}} isMandatory={true} />
        <div id="toast-container" />
      </div>
    );
  }

  return (
    <div className="app-main-view">
      <div className="grain-overlay" />
      <div className="vignette" />
      <Header 
        onOpenMap={() => setActiveTab('map')} 
        onOpenVault={() => setShowVault(true)} 
        onOpenAuth={() => setShowAuth(true)}
      />
      
      <main className="app-container">
        {activeTab === 'ops' ? (
          <>
            <OperationList 
              onAddTask={() => setShowTaskModal(true)} 
              onOpenTask={setSelectedTaskId}
            />
            <ScytheCenter />
            <Dashboard onOpenTask={setSelectedTaskId} />
          </>
        ) : (
          <MapSection />
        )}
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

        <style jsx>{`
          .reality-lock-panel {
            max-width: 440px;
            padding: 3rem;
            text-align: center;
            background: #0a0a0c;
            border: 2px solid var(--red-core);
            box-shadow: 0 0 60px var(--red-glow);
            position: relative;
            overflow: hidden;
          }
          
          .lock-icon-shield {
            width: 64px;
            height: 64px;
            margin: 0 auto 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--red-hot);
            background: rgba(255, 60, 60, 0.1);
            border-radius: 50%;
            border: 1px solid var(--red-core);
          }

          .reality-title {
            font-family: var(--font-display);
            color: var(--red-hot);
            font-size: 1.6rem;
            letter-spacing: 0.2em;
            margin-bottom: 1rem;
          }

          .reality-desc {
            font-size: 0.95rem;
            color: var(--text-dim);
            margin-bottom: 2.5rem;
            line-height: 1.6;
          }

          .reality-actions {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .confirm-btn {
            position: relative;
            height: 56px;
            background: var(--red-core);
            color: #fff;
            border-radius: 4px;
            font-weight: 900;
            letter-spacing: 0.1em;
            overflow: hidden;
          }
          
          .confirm-btn:hover {
            background: var(--red-hot);
            box-shadow: 0 0 30px var(--red-glow);
          }

          .return-btn {
            height: 50px;
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-dark);
            font-weight: 700;
            font-size: 0.7rem;
            letter-spacing: 0.1em;
          }
          
          .return-btn:hover {
            color: var(--text-primary);
            border-color: var(--text-dim);
          }

          .lock-footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            font-family: var(--font-mono);
            font-size: 0.5rem;
            color: var(--text-dark);
            letter-spacing: 0.1em;
          }
        `}</style>


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
    </div>
  );
}


