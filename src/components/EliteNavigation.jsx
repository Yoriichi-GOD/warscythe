import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Dumbbell, Flame, Hammer, Map, Scroll } from 'lucide-react';

export default function EliteNavigation({ activeTab, onTabChange }) {
  return (
    <nav className="elite-nav select-none">
      <div className="nav-container">
        
        {/* Left Side: Operations, Fitness, Rituals */}
        <div className="flex gap-2 sm:gap-4 md:gap-8 justify-around items-center">
          <button 
            type="button"
            className={`elite-tab ${activeTab === 'ops' ? 'active' : ''}`}
            onClick={() => onTabChange('ops')}
          >
            <div className="tab-icon-box">
              <Swords size={18} />
            </div>
            <span className="tab-label font-times">OPERATIONS</span>
          </button>

          <button 
            type="button"
            className={`elite-tab ${activeTab === 'fitness' ? 'active' : ''}`}
            onClick={() => onTabChange('fitness')}
          >
            <div className="tab-icon-box">
              <Dumbbell size={18} />
            </div>
            <span className="tab-label font-times">FITNESS</span>
          </button>

          <button 
            type="button"
            className={`elite-tab ${activeTab === 'rituals' ? 'active' : ''}`}
            onClick={() => onTabChange('rituals')}
          >
            <div className="tab-icon-box">
              <Flame size={18} />
            </div>
            <span className="tab-label font-times">RITUALS</span>
          </button>
        </div>

        {/* Center: Command Core Emblem (Winged Medallion) */}
        <div className="compass-center shrink-0">
          <div className="compass-outer">
            <div className="compass-ring-1" />
            <div className="compass-core bg-transparent border-none shadow-none">
               <motion.img 
                 src="/command-core.png" 
                 alt="Command Core"
                 className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(197,160,89,0.55)]"
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
               />
            </div>
          </div>
          <div className="compass-flare" />
        </div>

        {/* Right Side: Forge, Map, Ledger */}
        <div className="flex gap-2 sm:gap-4 md:gap-8 justify-around items-center">
          <button 
            type="button"
            className={`elite-tab ${activeTab === 'forge' ? 'active' : ''}`}
            onClick={() => onTabChange('forge')}
          >
            <div className="tab-icon-box">
              <Hammer size={18} />
            </div>
            <span className="tab-label font-times">THE FORGE</span>
          </button>

          <button 
            type="button"
            className={`elite-tab ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => onTabChange('map')}
          >
            <div className="tab-icon-box">
              <Map size={18} />
            </div>
            <span className="tab-label font-times">QUEST MAP</span>
          </button>

          <button 
            type="button"
            className={`elite-tab ${activeTab === 'ledger' ? 'active' : ''}`}
            onClick={() => onTabChange('ledger')}
          >
            <div className="tab-icon-box">
              <Scroll size={18} />
            </div>
            <span className="tab-label font-times">LEDGER</span>
          </button>
        </div>

      </div>

      <style jsx>{`
        .font-times {
          font-family: "Times New Roman", "Cinzel", "IM Fell English", Times, Georgia, serif;
        }
      `}</style>
    </nav>
  );
}
