import React from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { Trophy, Map, Brain, Shield, Crosshair, Award, ShieldCheck, Fingerprint, Map as MapIcon, Dumbbell, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { TASKS_PER_LEVEL } from '../store/constants';

export default function Header({ onOpenMap, onOpenVault, onOpenAuth, onOpenGymLog, onOpenPremium }) {
  const { executionScore: xp, level, currentTitle, user, signOut, deleteAccount, isFocusMode, currentLevelProgress, syncStatus, forceSync, tutorialStep, isAdFree } = useWarscytheStore();
  const [showDropdown, setShowDropdown] = React.useState(false);
  
  const xpForNext = level * 1000;
  const displayProgress = Math.min(currentLevelProgress || 0, TASKS_PER_LEVEL);
  const progress = (displayProgress / TASKS_PER_LEVEL) * 100;

  const isTutorialActive = tutorialStep && tutorialStep !== 'completed';

  return (
    <header className="main-header glass-panel">
      <div className={`header-left ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`}>
        <div className="logo-section">
          <div className="logo-icon-box" style={{ background: 'transparent', boxShadow: 'none', borderRadius: '50%', overflow: 'hidden' }}>
            <img src="/command-core.png" alt="Warscythe" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="logo-text">
            <h1>WARSCYTHE</h1>
            <span>VERSION 1.0 // GENESIS</span>
          </div>
        </div>
        
        <div className="divider" />

        <div className="rank-badge">
          <div className="rank-icon"><ShieldCheck size={14} /></div>
          <div className="rank-info">
            <span className="rank-label">OPERATIVE STATUS</span>
            <span className="rank-title">{currentTitle}</span>
          </div>
        </div>
      </div>

      <div className={`header-center ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`}>
        <div className="progress-hub">
          <div className="progress-header">
            <span className="progress-label">REGION PROGRESS</span>
            <span className="progress-value">{displayProgress}/{TASKS_PER_LEVEL}</span>
          </div>
          <div className="progress-bar-container">
            <motion.div 
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <div className="progress-bar-glow" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className={`xp-counter ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`}>
          <span className="xp-label">TOTAL XP</span>
          <span className="xp-value">{xp.toLocaleString()}</span>
        </div>

        {user && (
          <div className={`flex items-center ml-2 ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`}>
            {isAdFree ? (
              <div 
                className="elite-badge flex items-center justify-center font-mono font-bold tracking-widest text-[8px] border border-gold-core/40 text-gold-core bg-gold-core/5 rounded px-2.5 py-1.5 shadow-[0_0_12px_rgba(236,200,128,0.25)] animate-pulse" 
                title="Elite Operative Status Active"
              >
                ELITE STATUS
              </div>
            ) : (
              <button 
                className="upgrade-elite-badge font-mono font-black tracking-widest text-[8px] bg-gold-core text-black rounded px-2.5 py-1.5 shadow-[0_0_15px_rgba(236,200,128,0.4)] hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] cursor-pointer transition-all duration-300"
                onClick={onOpenPremium}
              >
                UPGRADE TO ELITE
              </button>
            )}
          </div>
        )}
        
        <div className="action-buttons">
          {user && (
            <button 
              className={`nav-btn sync-btn status-${syncStatus} ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`} 
              onClick={syncStatus === 'failed' ? () => onOpenAuth() : forceSync}
              title={
                syncStatus === 'synced' ? 'All progress synced with command core' :
                syncStatus === 'pending' ? 'Synchronizing with command core...' :
                'Sync failure! Click to re-authenticate and resolve.'
              }
            >
              {syncStatus === 'synced' && <RefreshCw size={14} className="text-gold-core/60" />}
              {syncStatus === 'pending' && <RefreshCw size={14} className="text-gold-core animate-spin" />}
              {syncStatus === 'failed' && <AlertCircle size={14} className="text-red-500 animate-pulse" />}
            </button>
          )}
          
          <div style={{ position: 'relative' }}>
            <button 
              className={`nav-btn ${user ? 'active' : ''}`} 
              onClick={user ? () => setShowDropdown(!showDropdown) : () => onOpenAuth()}
              title={user ? `Logged in as ${user.email}` : 'Warscythe Link'}
            >
              {user ? <ShieldCheck size={18} /> : <Fingerprint size={18} />}
            </button>
            
            {showDropdown && user && (
              <div className="header-dropdown-menu">
                <button onClick={() => { setShowDropdown(false); window.open('/privacy.html', '_blank'); }}>
                  PRIVACY POLICY
                </button>
                <button onClick={() => { setShowDropdown(false); alert("Terms & Conditions:\n\n1. Do your daily work.\n2. Do not cheat yourself.\n3. Keep your focus high.\n4. Warscythe is built for ultimate productivity."); }}>
                  TERMS & CONDITIONS
                </button>
                <button onClick={() => {
                  setShowDropdown(false);
                  const hasUnsynced = syncStatus === 'failed' || useWarscytheStore.getState().hasPendingChanges;
                  if (hasUnsynced) {
                    if (!window.confirm("WARNING: You have unsynced offline progress. Logging out will discard these local changes. Are you sure you want to sign out?")) {
                      return;
                    }
                  }
                  signOut();
                }}>
                  LOG OUT
                </button>
                <button 
                  className="delete-btn"
                  onClick={async () => {
                    setShowDropdown(false);
                    if (window.confirm("WARNING: This will permanently delete your account, scythe progress, and active operations. This action CANNOT be undone.\n\nAre you sure you want to delete your account?")) {
                      if (window.confirm("FINAL CONFIRMATION: Type 'DELETE' to confirm account deletion.")) {
                        try {
                          await deleteAccount();
                          alert("Account deleted successfully.");
                        } catch (err) {
                          alert("Failed to delete account: " + err.message);
                        }
                      }
                    }
                  }}
                >
                  DELETE ACCOUNT
                </button>
              </div>
            )}
          </div>
          <button className={`nav-btn ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`} onClick={onOpenGymLog} title="Gym & Fitness Log">
            <Dumbbell size={18} />
          </button>
          <button className={`nav-btn ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`} onClick={() => onOpenVault()} title="Artifact Vault">
            <Award size={18} />
          </button>
          <button className={`nav-btn ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`} onClick={onOpenMap} title="Tactical Map">
            <MapIcon size={18} />
          </button>
          <button 
            className={`nav-btn ${isFocusMode ? 'active' : ''} ${isTutorialActive ? 'pointer-events-none opacity-20 filter grayscale' : ''}`} 
            onClick={() => useWarscytheStore.getState().toggleFocus()} 
            title="Neural Focus"
          >
            <Brain size={18} className={isFocusMode ? 'text-gold pulse' : ''} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .main-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-top: none;
          height: 64px;
        }

        @media (min-width: 1024px) {
          .main-header {
            padding: 0.75rem 2rem;
            height: 72px;
          }
        }

        .header-left { display: flex; align-items: center; gap: 1rem; }
        @media (min-width: 1024px) { .header-left { gap: 2rem; } }
        
        .logo-section { display: flex; align-items: center; gap: 0.75rem; }
        .logo-icon-box {
          width: 32px;
          height: 32px;
          background: var(--gold-core);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #000;
          box-shadow: 0 0 15px var(--gold-glow);
        }

        @media (min-width: 1024px) {
          .logo-icon-box {
            width: 40px;
            height: 40px;
          }
        }

        .logo-text h1 {
          font-family: var(--font-display);
          font-size: 0.9rem;
          letter-spacing: 0.2em;
          color: var(--text-primary);
          line-height: 1;
        }

        @media (min-width: 1024px) {
          .logo-text h1 {
            font-size: 1.2rem;
          }
        }

        .logo-text span {
          font-family: var(--font-mono);
          font-size: 0.45rem;
          color: var(--gold-core);
          letter-spacing: 0.1em;
          margin-top: 4px;
          display: block;
        }

        @media (min-width: 1024px) {
          .logo-text span {
            font-size: 0.55rem;
          }
        }

        .divider { display: none; width: 1px; height: 30px; background: var(--border); }
        @media (min-width: 1024px) { .divider { display: block; } }

        .rank-badge { display: none; align-items: center; gap: 0.75rem; }
        @media (min-width: 640px) { .rank-badge { display: flex; } }

        .rank-icon { color: var(--gold-core); opacity: 0.8; }
        .rank-info { display: flex; flex-direction: column; }
        .rank-label { font-size: 0.5rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; }
        .rank-title { font-size: 0.8rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; }

        .header-center { display: none; }
        @media (min-width: 1024px) {
          .header-center { display: block; }
        }

        .progress-hub { width: 220px; }
        .progress-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .progress-label { font-size: 0.55rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; }
        .progress-value { font-family: var(--font-mono); font-size: 0.6rem; color: var(--gold-core); font-weight: 700; }
        
        .progress-bar-container { height: 4px; background: rgba(255,255,255,0.05); border-radius: 100px; position: relative; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: var(--gold-core); border-radius: 100px; position: relative; z-index: 2; }
        .progress-bar-glow { position: absolute; top: 0; left: 0; height: 100%; background: var(--gold-core); filter: blur(4px); opacity: 0.5; }

        .header-right { display: flex; align-items: center; gap: 1rem; }
        @media (min-width: 1024px) { .header-right { gap: 2rem; } }

        .xp-counter { display: none; text-align: right; }
        @media (min-width: 768px) { .xp-counter { display: block; } }

        .xp-label { display: block; font-size: 0.5rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; }
        .xp-value { font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: var(--gold-core); }

        .action-buttons { display: flex; gap: 0.5rem; }
        @media (min-width: 1024px) { .action-buttons { gap: 0.75rem; } }

        .nav-btn {
          width: 32px;
          height: 32px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        @media (min-width: 1024px) {
          .nav-btn {
            width: 36px;
            height: 36px;
          }
        }
        .nav-btn:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); border-color: var(--border-bright); }
        .nav-btn:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); border-color: var(--border-bright); }
        
        .sync-btn {
          cursor: pointer;
          position: relative;
        }
        .sync-btn.status-failed {
          border-color: rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.05);
        }
        .sync-btn.status-pending {
          border-color: rgba(236, 200, 128, 0.3);
        }

        .header-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: rgba(10, 10, 15, 0.95);
          border: 1px solid rgba(197, 160, 89, 0.35);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          min-width: 160px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(197,160,89,0.05);
          z-index: 100;
          overflow: hidden;
        }
        .header-dropdown-menu button {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          color: #9ca3af;
          padding: 0.75rem 1rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-align: left;
          cursor: pointer;
          transition: 0.2s;
        }
        .header-dropdown-menu button:last-child {
          border-bottom: none;
        }
        .header-dropdown-menu button:hover {
          background: rgba(197, 160, 89, 0.08);
          color: #fff;
        }
        .header-dropdown-menu button.delete-btn {
          color: #ef4444;
        }
        .header-dropdown-menu button.delete-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }
      `}</style>
    </header>
  );
}
