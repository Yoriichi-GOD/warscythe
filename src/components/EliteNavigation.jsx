import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Map as MapIcon, Compass, Shield } from 'lucide-react';

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
            <Sword size={22} />
          </div>
          <span className="tab-label">OPERATIONS</span>
        </button>

        {/* Center: Tactical Emblem */}
        <div className="compass-center">
          <motion.div 
            className="compass-outer"
            animate={{ rotate: activeTab === 'ops' ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="compass-ring-1" />
            <div className="compass-ring-2" />
            <div className="compass-core">
               <div className="relative">
                  <Shield size={32} className="opacity-20 absolute inset-0 blur-[2px]" />
                  <Shield size={32} />
               </div>
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
            <MapIcon size={22} />
          </div>
          <span className="tab-label">QUEST MAP</span>
        </button>
      </div>
    </nav>
  );
}
