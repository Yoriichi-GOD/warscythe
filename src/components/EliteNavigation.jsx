import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Map as MapIcon, Compass } from 'lucide-react';

export default function EliteNavigation({ activeTab, onTabChange }) {
  return (
    <nav className="elite-nav">
      <div className="nav-container">
        {/* Left Side: Operations */}
        <button 
          className={`elite-tab ${activeTab === 'ops' ? 'active' : ''}`}
          onClick={() => onTabChange('ops')}
        >
          <div className="tab-icon-box">
            <Sword size={20} />
          </div>
          <span className="tab-label">OPERATIONS</span>
          <div className="tab-glow" />
        </button>

        {/* Center: The Great Compass */}
        <div className="compass-center">
          <motion.div 
            className="compass-outer"
            animate={{ rotate: activeTab === 'ops' ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="compass-ring-1" />
            <div className="compass-ring-2" />
            <div className="compass-core">
              <Compass size={32} className="compass-icon" />
            </div>
          </motion.div>
          <div className="compass-flare" />
        </div>

        {/* Right Side: Quest Map */}
        <button 
          className={`elite-tab ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => onTabChange('map')}
        >
          <div className="tab-icon-box">
            <MapIcon size={20} />
          </div>
          <span className="tab-label">QUEST MAP</span>
          <div className="tab-glow" />
        </button>
      </div>

      <style jsx>{`
        .elite-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 80px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 1rem;
          z-index: 1000;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
          pointer-events: none;
        }

        .nav-container {
          display: flex;
          align-items: center;
          gap: 4rem;
          pointer-events: auto;
          position: relative;
        }

        .elite-tab {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          position: relative;
          width: 120px;
          transition: 0.3s;
          padding: 0.5rem;
        }

        .tab-icon-box {
          color: var(--text-dim);
          transition: 0.3s;
        }

        .tab-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
          font-weight: 800;
        }

        .elite-tab.active .tab-icon-box { color: var(--gold-bright); filter: drop-shadow(0 0 8px var(--gold-glow)); }
        .elite-tab.active .tab-label { color: var(--gold-core); }

        .tab-glow {
          position: absolute;
          top: -10px;
          width: 60%;
          height: 2px;
          background: var(--gold-core);
          opacity: 0;
          transition: 0.3s;
          box-shadow: 0 0 15px var(--gold-core);
        }

        .elite-tab.active .tab-glow { opacity: 1; top: -5px; }

        /* Compass Styles */
        .compass-center {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 10px;
        }

        .compass-outer {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .compass-ring-1 {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid var(--gold-core);
          border-radius: 50%;
          opacity: 0.2;
        }

        .compass-ring-2 {
          position: absolute;
          width: 80%;
          height: 80%;
          border: 2px solid var(--gold-core);
          border-radius: 50%;
          opacity: 0.1;
          border-style: dashed;
        }

        .compass-core {
          position: absolute;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, #1a1a1a 0%, #000 100%);
          border: 2px solid var(--gold-core);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold-bright);
          box-shadow: 0 0 30px rgba(0,0,0,0.8), inset 0 0 10px var(--gold-glow);
        }

        .compass-icon {
          filter: drop-shadow(0 0 5px var(--gold-glow));
        }

        .compass-flare {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(197, 160, 89, 0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: -1;
        }

        .elite-tab:hover .tab-icon-box { color: #fff; }
      `}</style>
    </nav>
  );
}
