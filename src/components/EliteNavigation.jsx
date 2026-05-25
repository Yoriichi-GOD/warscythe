import React from 'react';
import { motion } from 'framer-motion';
import { Swords, BookOpen } from 'lucide-react';
import { triggerHaptics } from '../utils/nativeTriggers';

export default function EliteNavigation({ activeTab, onTabChange }) {
  const handleCoreClick = async () => {
    try {
      await triggerHaptics('MEDIUM');
    } catch (e) {
      // Native haptics not available in browser
    }
  };

  return (
    <nav className="elite-nav">
      <div className="nav-container">
        {/* Left: Operations */}
        <motion.button 
          whileTap={{ scale: 0.94 }}
          className={`elite-tab ${activeTab === 'ops' || activeTab === 'rituals' ? 'active' : ''}`}
          onClick={() => onTabChange('ops')}
        >
          <div className="tab-icon-box">
            <Swords size={20} />
          </div>
          <span className="tab-label">Operations</span>
        </motion.button>

        {/* Center: Command Core Emblem */}
        <div className="compass-center" onClick={handleCoreClick}>
          <div className="compass-outer">
            <div className="compass-ring-1" />
            <div className="compass-core bg-transparent border-none shadow-none">
               <motion.img 
                 src="/command-core.png" 
                 alt="Command Core"
                 className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(197,160,89,0.4)] cursor-pointer"
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                 whileTap={{ scale: 0.95 }}
               />
            </div>
          </div>
          <div className="compass-flare" />
        </div>

        {/* Right: Quest Map */}
        <motion.button 
          whileTap={{ scale: 0.94 }}
          className={`elite-tab ${activeTab === 'map' || activeTab === 'log' ? 'active' : ''}`}
          onClick={() => onTabChange('map')}
        >
          <div className="tab-icon-box">
            <BookOpen size={20} />
          </div>
          <span className="tab-label">Quest Map</span>
        </motion.button>
      </div>
    </nav>
  );
}
