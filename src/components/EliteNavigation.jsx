import React from 'react';
import { motion } from 'framer-motion';
import { Swords, BookOpen, History, Flame } from 'lucide-react';

export default function EliteNavigation({ activeTab, onTabChange }) {
  return (
    <nav className="elite-nav">
      <div className="nav-container">
        {/* Left: Operations & Rituals */}
        <div className="flex gap-4 sm:gap-10">
          <button 
            className={`elite-tab ${activeTab === 'ops' ? 'active' : ''}`}
            onClick={() => onTabChange('ops')}
          >
            <div className="tab-icon-box">
              <Swords size={18} />
            </div>
            <span className="tab-label">Operations</span>
          </button>

          <button 
            className={`elite-tab ${activeTab === 'rituals' ? 'active' : ''}`}
            onClick={() => onTabChange('rituals')}
          >
            <div className="tab-icon-box">
              <Flame size={18} />
            </div>
            <span className="tab-label">Rituals</span>
          </button>
        </div>

        {/* Center: Command Core Emblem */}
        <div className="compass-center">
          <div className="compass-outer">
            <div className="compass-ring-1" />
            <div className="compass-core bg-transparent border-none shadow-none">
               <motion.img 
                 src="/command-core.png" 
                 alt="Command Core"
                 className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(197,160,89,0.4)]"
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
               />
            </div>
          </div>
          <div className="compass-flare" />
        </div>

        {/* Right: Map & Ledger */}
        <div className="flex gap-4 sm:gap-10">
          <button 
            className={`elite-tab ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => onTabChange('map')}
          >
            <div className="tab-icon-box">
              <BookOpen size={18} />
            </div>
            <span className="tab-label">Map</span>
          </button>

          <button 
            className={`elite-tab ${activeTab === 'log' ? 'active' : ''}`}
            onClick={() => onTabChange('log')}
          >
            <div className="tab-icon-box">
              <History size={18} />
            </div>
            <span className="tab-label">Ledger</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
