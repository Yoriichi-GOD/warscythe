import React from 'react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { Trophy, Map, Brain, Shield, Crosshair, Award, ShieldCheck, Fingerprint, Map as MapIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header({ onOpenMap, onOpenVault, onOpenAuth }) {
  const { executionScore: xp, level, currentTitle, user, signOut, isFocusMode } = useWarscytheStore();
  
  const xpForNext = level * 1000;
  const progress = (xp / xpForNext) * 100;

  return (
    <header className="main-header glass-panel">
      <div className="header-left">
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

      <div className="header-center">
        <div className="progress-hub">
          <div className="progress-header">
            <span className="progress-label">REGION PROGRESS</span>
            <span className="progress-value">{Math.round(progress / 10)}/10</span>
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
        <div className="xp-counter">
          <span className="xp-label">TOTAL XP</span>
          <span className="xp-value">{xp.toLocaleString()}</span>
        </div>
        
        <div className="action-buttons">
          <button 
            className={`nav-btn ${user ? 'active' : ''}`} 
            onClick={user ? () => signOut() : () => onOpenAuth()}
            title={user ? `Logged in as ${user.email}` : 'Warscythe Link'}
          >
            {user ? <ShieldCheck size={18} /> : <Fingerprint size={18} />}
          </button>
          <button className="nav-btn" onClick={() => onOpenVault()} title="Artifact Vault">
            <Award size={18} />
          </button>
          <button className="nav-btn" onClick={onOpenMap} title="Tactical Map">
            <MapIcon size={18} />
          </button>
          <button 
            className={`nav-btn ${isFocusMode ? 'active' : ''}`} 
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
      `}</style>
    </header>
  );
}
