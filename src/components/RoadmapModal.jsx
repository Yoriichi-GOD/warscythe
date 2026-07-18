import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, Trophy, Check, Lock, ChevronRight } from 'lucide-react';

const NODES_DATA = [
  { id: 1, label: 'Task 1: The Scythe', desc: 'Unlocks Scythe detail panel, settings, and sync.', x: '8%', y: '62%' },
  { id: 2, label: 'Task 2: Soundscapes', desc: 'Unlocks ambient sounds & Focus Mode.', x: '18%', y: '70%' },
  { id: 3, label: 'Task 3: Forge & Rituals', desc: 'Unlocks the Forge & daily Ritual streaks.', x: '28%', y: '78%' },
  { id: 4, label: 'Task 4: The Ledger', desc: 'Unlocks Ledger & Battle Trophies archiving.', x: '38%', y: '74%' },
  { id: 5, label: 'Task 5: Boss Hunt 🏆', desc: 'Defeat R1 boss. Unlocks Map. Title: "Curious Explorer"', x: '48%', y: '55%', isMilestone: true, title: 'Curious Explorer' },
  { id: 6, label: 'Task 6: Lore Inspection', desc: 'Unlocks detail inspect popups inside Ledger.', x: '58%', y: '68%' },
  { id: 7, label: 'Task 7: Social Circle', desc: 'Unlocks Friends list & Campfire leaderboard.', x: '68%', y: '52%' },
  { id: 8, label: 'Task 8: Codex & Shop', desc: 'Unlocks Empress lore codex & Cosmetic Shop.', x: '76%', y: '40%' },
  { id: 9, label: 'Task 9: The Legion', desc: 'Unlocks Legion persistency & group sub-tasks.', x: '84%', y: '30%' },
  { id: 10, label: 'Task 10: Full Release 🏆', desc: 'Onboarding completed. Title: "Seasoned Wanderer"', x: '92%', y: '18%', isMilestone: true, title: 'Seasoned Wanderer' }
];

export default function RoadmapModal({ onClose }) {
  const onboardingProgress = useWarscytheStore(state => state.onboardingProgress) || 0;
  const onboardingActive = useWarscytheStore(state => state.onboardingActive);
  const scrollContainerRef = useRef(null);

  // Auto-scroll mobile view to center the active node on open
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeNodeIndex = Math.min(onboardingProgress, NODES_DATA.length - 1);
      const activeNodeXPercent = parseFloat(NODES_DATA[activeNodeIndex].x);
      
      // Canvas width is 1100px
      const nodeXPos = (activeNodeXPercent / 100) * 1100;
      const scrollPos = nodeXPos - (container.clientWidth / 2);
      
      container.scrollTo({
        left: Math.max(0, scrollPos),
        behavior: 'smooth'
      });
    }
  }, [onboardingProgress]);

  const getStatus = (nodeId) => {
    if (nodeId <= onboardingProgress) return 'completed';
    if (nodeId === onboardingProgress + 1) return 'current';
    return 'locked';
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl h-[90vh] md:h-[600px] flex flex-col rounded-lg border border-white/5 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-black/40">
          <div>
            <h2 className="font-display font-bold text-sm tracking-widest text-gold-core uppercase">Execution Roadmap</h2>
            <p className="font-mono text-[8px] text-stone-500 tracking-wider uppercase mt-1">Unlock your path from Recruit to Seasoned Wanderer</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-mono text-[9px] px-3 py-1.5 rounded border border-gold-core/20 text-gold-core bg-gold-core/5 tracking-widest uppercase">
              {Math.min(onboardingProgress, 10)}/10 CONCEPTS
            </div>
            <button 
              onClick={onClose} 
              className="p-1 rounded hover:bg-white/5 text-stone-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Dynamic Journey Map Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 w-full overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-none relative bg-black select-none"
        >
          {/* Scrollable Map Frame */}
          <div 
            className="relative h-full"
            style={{ 
              width: '1100px', 
              backgroundImage: "url('/roadmap-bg.webp')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* SVG Connector Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ecc880" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#e08224" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d="M 88 279 Q 143 298 198 315 T 308 351 T 418 333 T 528 247 T 638 306 T 748 234 T 836 180 T 924 135 T 1012 81"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2.5"
                strokeDasharray="4,4"
              />
              <path
                d="M 88 279 Q 143 298 198 315 T 308 351 T 418 333 T 528 247 T 638 306 T 748 234 T 836 180 T 924 135 T 1012 81"
                fill="none"
                stroke="url(#gold-grad)"
                strokeWidth="2.5"
                // Dynamically mask path based on progress
                strokeDasharray="1100"
                strokeDashoffset={1100 - (1100 * (Math.min(onboardingProgress, 10) / 10))}
                className="transition-all duration-[1500ms] ease-out"
              />
            </svg>

            {/* Nodes Render */}
            {NODES_DATA.map((node) => {
              const status = getStatus(node.id);
              
              return (
                <div
                  key={node.id}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: node.x, top: node.y }}
                >
                  {/* Node Circle */}
                  <motion.div
                    whileHover={{ scale: status !== 'locked' ? 1.1 : 1 }}
                    className={`relative flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(0,0,0,0.6)] cursor-default transition-all duration-300 ${
                      node.isMilestone ? 'w-11 h-11' : 'w-8 h-8'
                    } ${
                      status === 'completed'
                        ? 'bg-gold-core border-2 border-gold-bright text-black'
                        : status === 'current'
                        ? 'bg-zinc-900 border-2 border-gold-core animate-pulse text-gold-core shadow-[0_0_15px_rgba(236,200,128,0.4)]'
                        : 'bg-zinc-950 border border-white/5 text-stone-600'
                    }`}
                  >
                    {status === 'completed' ? (
                      <Check size={node.isMilestone ? 16 : 12} className="stroke-[3]" />
                    ) : status === 'locked' ? (
                      <Lock size={node.isMilestone ? 14 : 10} />
                    ) : node.isMilestone ? (
                      <Trophy size={16} className="text-gold-core animate-pulse" />
                    ) : (
                      <span className="font-mono text-[9px] font-black">{node.id}</span>
                    )}

                    {/* Milestone glowing ring */}
                    {node.isMilestone && status !== 'locked' && (
                      <div className="absolute inset-0 rounded-full border border-gold-core/40 animate-ping opacity-60" />
                    )}
                  </motion.div>

                  {/* Title / Description Card */}
                  <div className={`mt-3 flex flex-col items-center max-w-[130px] p-2 bg-black/85 border border-white/5 rounded backdrop-blur text-center pointer-events-none transition-all duration-300 ${
                    status === 'locked' ? 'opacity-40 filter grayscale' : 'opacity-100'
                  }`}>
                    <span className="font-mono text-[8px] font-bold text-white uppercase truncate max-w-[120px]">{node.label}</span>
                    <span className="font-mono text-[6px] text-stone-400 leading-normal mt-0.5 whitespace-normal break-words max-w-[110px]">{status === 'locked' ? 'Unlocked soon' : node.desc}</span>
                    {node.isMilestone && status !== 'locked' && (
                      <span className="mt-1 font-mono text-[6px] font-black text-gold-core animate-pulse uppercase tracking-wider">{node.title}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center p-5 border-t border-white/5 bg-black/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gold-core animate-pulse" />
            <span className="font-mono text-[7.5px] text-stone-400 tracking-wider uppercase">Swipe map side-to-side to view unlocked regions</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 border border-gold-core/40 text-gold-core hover:text-black hover:bg-gold-core font-mono text-[9px] font-bold tracking-widest uppercase rounded shadow-[0_0_15px_rgba(236,200,128,0.1)] cursor-pointer transition-all duration-300"
          >
            <span>CONTINUE JOURNEY</span>
            <ChevronRight size={10} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
