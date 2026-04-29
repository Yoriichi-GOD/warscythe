import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Map as MapIcon } from 'lucide-react';

export default function EliteNavigation({ activeTab, onTabChange }) {
  return (
    <nav className="elite-nav">
      <div className="nav-container">
        {/* Left Side: Operations */}
        <button 
          className={`elite-tab ${activeTab === 'ops' ? 'active' : ''}`}
          onClick={() => onTabChange('ops')}
        >
          <div className="tab-glow-bar" />
          <div className="tab-icon-box">
            <Sword size={20} />
          </div>
          <span className="tab-label">OPERATIONS</span>
        </button>

        {/* Center: Command Core Asset */}
        <div className="compass-center">
          <motion.div 
            className="compass-outer"
            animate={{ 
               rotate: activeTab === 'ops' ? 0 : 180,
               scale: [1, 1.05, 1]
            }}
            transition={{ 
               rotate: { type: "spring", stiffness: 100, damping: 20 },
               scale: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
          >
            <div className="compass-ring-1" />
            
            {/* THE MASTERPIECE EMBLEM */}
            <div className="compass-core bg-transparent border-none shadow-none">
               <motion.img 
                 src="/command-core.png" 
                 alt="Command Core"
                 className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]"
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
               />
            </div>
          </motion.div>
          <div className="compass-flare" />
        </div>

        {/* Right Side: Quest Map */}
        <button 
          className={`elite-tab ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => onTabChange('map')}
        >
          <div className="tab-glow-bar" />
          <div className="tab-icon-box">
            <MapIcon size={20} />
          </div>
          <span className="tab-label">QUEST MAP</span>
        </button>
      </div>
    </nav>
  );
}
