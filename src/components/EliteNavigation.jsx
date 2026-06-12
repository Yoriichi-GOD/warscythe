import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Dumbbell, Flame, Hammer, Map, Scroll } from 'lucide-react';
import { useWarscytheStore } from '../store/useWarscytheStore';

export default function EliteNavigation({ activeTab, onTabChange }) {
  const tutorialStep = useWarscytheStore(state => state.tutorialStep);
  const setTutorialStep = useWarscytheStore(state => state.setTutorialStep);

  const isTutorialActive = tutorialStep && tutorialStep !== 'completed';

  const isTabAllowed = (tabName) => {
    if (!isTutorialActive) return true;
    if (tutorialStep === 'map_guide' && tabName === 'map') return true;
    if (tutorialStep === 'ops_guide' && tabName === 'ops') return true;
    if (tutorialStep === 'ledger_guide' && tabName === 'ledger') return true;
    if (tutorialStep === 'task_creation_prompt' && tabName === 'ops') return true;
    if (tutorialStep === 'task_creation' && tabName === 'ops') return true;
    return false;
  };

  const isTabHighlighted = (tabName) => {
    if (!isTutorialActive) return false;
    if (tutorialStep === 'map_guide' && tabName === 'map') return true;
    if (tutorialStep === 'ops_guide' && tabName === 'ops') return true;
    if (tutorialStep === 'ledger_guide' && tabName === 'ledger') return true;
    if (tutorialStep === 'task_creation_prompt' && tabName === 'ops') return true;
    return false;
  };

  const handleTabClick = (tabName) => {
    if (!isTabAllowed(tabName)) return;

    onTabChange(tabName);

    // Advance onboarding steps interactively
    if (tutorialStep === 'map_guide' && tabName === 'map') {
      setTutorialStep('ops_guide');
    } else if (tutorialStep === 'ops_guide' && tabName === 'ops') {
      setTutorialStep('ledger_guide');
    } else if (tutorialStep === 'ledger_guide' && tabName === 'ledger') {
      setTutorialStep('task_creation_prompt');
    } else if (tutorialStep === 'task_creation_prompt' && tabName === 'ops') {
      setTutorialStep('task_creation');
    }
  };

  const getTabClass = (tabName) => {
    let classes = `elite-tab ${activeTab === tabName ? 'active' : ''}`;
    if (isTutorialActive) {
      if (!isTabAllowed(tabName)) {
        classes += ' pointer-events-none opacity-20 filter grayscale';
      } else if (isTabHighlighted(tabName)) {
        classes += ' gold-glow-ring';
      }
    }
    return classes;
  };

  return (
    <nav className="elite-nav select-none">
      <div className="nav-container">
        
        {/* Left Side: Operations, Fitness, Rituals */}
        <div className="flex gap-2 sm:gap-4 md:gap-8 justify-around items-center">
          <button 
            type="button"
            className={getTabClass('ops')}
            onClick={() => handleTabClick('ops')}
          >
            <div className="tab-icon-box">
              <Swords size={18} />
            </div>
            <span className="tab-label font-times">OPERATIONS</span>
          </button>

          <button 
            type="button"
            className={getTabClass('fitness')}
            onClick={() => handleTabClick('fitness')}
          >
            <div className="tab-icon-box">
              <Dumbbell size={18} />
            </div>
            <span className="tab-label font-times">FITNESS</span>
          </button>

          <button 
            type="button"
            className={getTabClass('rituals')}
            onClick={() => handleTabClick('rituals')}
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
                 src="/icon.png" 
                 alt="Command Core"
                 className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(197,160,89,0.55)]"
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
               />
            </div>
          </div>
          <div className="compass-flare" />
        </div>

        {/* Right Side: Forge, Quest Map, Ledger */}
        <div className="flex gap-2 sm:gap-4 md:gap-8 justify-around items-center">
          <button 
            type="button"
            className={getTabClass('forge')}
            onClick={() => handleTabClick('forge')}
          >
            <div className="tab-icon-box">
              <Hammer size={18} />
            </div>
            <span className="tab-label font-times">THE FORGE</span>
          </button>

          <button 
            type="button"
            className={getTabClass('map')}
            onClick={() => handleTabClick('map')}
          >
            <div className="tab-icon-box">
              <Map size={18} />
            </div>
            <span className="tab-label font-times">QUEST MAP</span>
          </button>

          <button 
            type="button"
            className={getTabClass('ledger')}
            onClick={() => handleTabClick('ledger')}
          >
            <div className="tab-icon-box">
              <Scroll size={18} />
            </div>
            <span className="tab-label font-times">LEDGER</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
