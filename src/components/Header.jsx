import React from 'react';
import { useWarlordStore } from '../store/useWarlordStore';
import { Trophy, Map, Brain, Shield, Crosshair, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header({ onOpenMap, onOpenVault }) {
  const { level, currentTitle, executionScore, currentLevelProgress, totalCompletions, isFocusMode, toggleFocus } = useWarlordStore();
  
  const progressPercent = (currentLevelProgress / 10) * 100;

  return (
    <header className="main-header glass-panel">
      <div className="header-left">
        <div className="logo-section">
          <div className="logo-icon-box">
            <Crosshair size={24} className="logo-svg" />
          </div>
          <div className="logo-text">
            <h1>WARLORD</h1>
            <span>VERSION 1.0 // GENESIS</span>
          </div>
        </div>
        
        <div className="divider" />

        <div className="rank-badge">
          <div className="rank-icon"><Shield size={14} /></div>
          <div className="rank-info">
            <span className="rank-label">OPERATIVE STATUS</span>
            <span className="rank-title">{currentTitle}</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="progress-hub">
          <div className="progress-header">
            <span className="progress-label">REGION PROGRESS</span>
            <span className="progress-value">{currentLevelProgress}/10</span>
          </div>
          <div className="progress-bar-container">
            <motion.div 
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <div className="progress-bar-glow" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="xp-counter">
          <span className="xp-label">TOTAL XP</span>
          <span className="xp-value">{executionScore.toLocaleString()}</span>
        </div>
        
        <div className="action-buttons">
          <button className="nav-btn" onClick={() => onOpenVault()} title="Artifact Vault">
            <Award size={18} />
          </button>
          <button className="nav-btn" onClick={onOpenMap} title="Tactical Map">
            <Map size={18} />
          </button>
          <button 
            className={`nav-btn ${isFocusMode ? 'active' : ''}`} 
            onClick={() => toggleFocus()} 
            title="Focus Mode (ADHD Special)"
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
          padding: 0.75rem 2rem;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-top: none;
          height: 72px;
        }

        .header-left { display: flex; align-items: center; gap: 2rem; }
        
        .logo-section { display: flex; align-items: center; gap: 1rem; }
        .logo-icon-box {
          width: 40px;
          height: 40px;
          background: var(--gold-core);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #000;
          box-shadow: 0 0 15px var(--gold-glow);
        }
        .logo-text h1 {
          font-family: var(--font-display);
          font-size: 1.2rem;
          letter-spacing: 0.2em;
          color: var(--text-primary);
          line-height: 1;
        }
        .logo-text span {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          color: var(--gold-core);
          letter-spacing: 0.1em;
          margin-top: 4px;
          display: block;
        }

        .divider { width: 1px; height: 30px; background: var(--border); }

        .rank-badge { display: flex; align-items: center; gap: 0.75rem; }
        .rank-icon { color: var(--gold-core); opacity: 0.8; }
        .rank-info { display: flex; flex-direction: column; }
        .rank-label { font-size: 0.5rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; }
        .rank-title { font-size: 0.8rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; }

        .progress-hub { width: 220px; }
        .progress-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .progress-label { font-size: 0.55rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; }
        .progress-value { font-family: var(--font-mono); font-size: 0.6rem; color: var(--gold-core); font-weight: 700; }
        
        .progress-bar-container { height: 4px; background: rgba(255,255,255,0.05); border-radius: 100px; position: relative; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: var(--gold-core); border-radius: 100px; position: relative; z-index: 2; }
        .progress-bar-glow { position: absolute; top: 0; left: 0; height: 100%; background: var(--gold-core); filter: blur(4px); opacity: 0.5; }

        .header-right { display: flex; align-items: center; gap: 2rem; }
        .xp-counter { text-align: right; }
        .xp-label { display: block; font-size: 0.5rem; font-weight: 900; color: var(--text-dim); letter-spacing: 0.1em; }
        .xp-value { font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: var(--gold-core); }

        .action-buttons { display: flex; gap: 0.75rem; }
        .nav-btn {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-dim);
          transition: 0.2s;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); border-color: var(--border-bright); }
      `}</style>
    </header>
  );
}
