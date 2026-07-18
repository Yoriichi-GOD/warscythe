import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, Sparkles, ChevronRight, Check } from 'lucide-react';

const DIALOGUES = {
  1: [
    { speaker: 'Guardian', text: "You've struck your first blow. Look — your Scythe stirs." },
    { speaker: 'Guardian', text: "This is the Reaper's Scythe. It sleeps now, dormant, but it will not stay that way. Every task you conquer feeds it. Six tiers stand between where it is and what it will become." },
    { speaker: 'Guardian', text: "Before you go further — three things worth knowing. First: your progress is synchronized. Complete a task here, and it will follow you to any device. Second: I will speak only when it matters. Not to fill silence." }
  ],
  2: [
    { speaker: 'Guardian', text: "Welcome to the Soundscape." },
    { speaker: 'Guardian', text: "Every region carries its own sound — the hum of a place, not just its look. Choose what plays as you walk it. When you need to disappear into a single task, Focus Mode strips everything else away." }
  ],
  3: [
    { speaker: 'Guardian', text: "The Forge is where consistency becomes power." },
    { speaker: 'Guardian', text: "Your Rituals are the tasks you commit to daily. Miss one, and the whole streak resets to zero. A streak that forgives isn't a streak. Keep your streak, and your Scythe ascends in the Forge." }
  ],
  4: [
    { speaker: 'Guardian', text: "This is your Ledger — the permanent record of everything you've taken from this world." },
    { speaker: 'Guardian', text: "Every artifact you've claimed lives here. Every trophy. Nothing is lost, nothing forgotten. Your visual history is a testament to your focus." }
  ],
  5: [
    { speaker: 'Guardian', text: "The dragon falls. The region is yours." },
    { speaker: 'Guardian', text: "I hand you now to one who knows this land better than I do — the one you freed." },
    { speaker: 'Fairy', text: "Thank you for freeing me! Let me show you what you've won." },
    { speaker: 'Fairy', text: "This is the Quest Map — every region you'll walk, every dragon still waiting, every fragment still unclaimed. I lived in the region you just liberated. We are friends now, and I will watch your map from here." },
    { speaker: 'Fairy', text: "You have earned the title of 'Curious Explorer' — wear it proudly beneath your name in the social directory!" }
  ],
  6: [
    { speaker: 'Guardian', text: "Look closer at your Ledger now. Every Empress you free leaves a Fragment — her story, not just a mark of victory. Every dragon you fell leaves a trophy behind." }
  ],
  7: [
    { speaker: 'Guardian', text: "You are not the only one walking this path." },
    { speaker: 'Guardian', text: "Add those you trust. Watch how far you've come against your own best. The Leaderboard is a campfire to sit around, not a ladder to climb over others." }
  ],
  8: [
    { speaker: 'Guardian', text: "Every Empress you free has a history — who she was, what her freedom restores. Read the Codex to understand this world." },
    { speaker: 'Guardian', text: "And should you wish to change how you're seen: the Shop offers new Scythe skins and visual themes. None of it changes your strength. All of it changes your style." }
  ],
  9: [
    { speaker: 'Guardian', text: "Friends are one thing. A Legion is another." },
    { speaker: 'Guardian', text: "Form a Legion to delegate sub-tasks with real deadlines and priorities. Contribute to double your output; fail, and it's recorded on the Legion's permanent scroll." }
  ],
  10: [
    { speaker: 'Guardian', text: "You've seen everything now. The Scythe, the Rituals, the Ledger, the Legion, two regions and two fairies freed." },
    { speaker: 'Guardian', text: "There is no more I need to show you. What happens from here is yours to write. You've earned the title of 'Seasoned Wanderer'. Go. Execute." }
  ]
};

export default function GuardianOverlay({ progress, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);
  const pages = DIALOGUES[progress] || [];

  useEffect(() => {
    setCurrentPage(0);
  }, [progress]);

  if (pages.length === 0) return null;

  const currentLine = pages[currentPage];
  const isLastPage = currentPage === pages.length - 1;

  const handleNext = () => {
    if (isLastPage) {
      onClose();
    } else {
      setCurrentPage(prev => prev + 1);
    }
  };

  const isFairy = currentLine.speaker === 'Fairy';

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 backdrop-blur-lg select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl mx-4 p-8 flex flex-col items-center bg-zinc-950 border border-white/5 rounded-lg shadow-[0_0_60px_rgba(236,200,128,0.05)] relative overflow-hidden"
      >
        {/* Decorative corner runes */}
        <div className="absolute top-3 left-3 font-mono text-[7px] text-stone-700 tracking-widest">RUNIC_GATEWAY_V4</div>
        <div className="absolute bottom-3 right-3 font-mono text-[7px] text-stone-700 tracking-widest">WARSCYTHE_COREGUARD</div>

        {/* Themed Character Frame */}
        <div className="relative w-44 h-44 mb-6 rounded-lg overflow-hidden border border-gold-core/20 bg-black/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.6)]">
          <img 
            src={isFairy ? `/crests/region-crest-${progress}.png` : `/guardian-observer.png`} 
            alt={currentLine.speaker} 
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-x-0 bottom-0 py-1 bg-black/80 border-t border-white/5 text-center">
            <span className="font-mono text-[9px] font-black tracking-widest text-gold-core uppercase">
              {currentLine.speaker}
            </span>
          </div>
        </div>

        {/* Runic Dialog Box */}
        <div className="w-full border border-stone-800/40 bg-black/50 p-6 rounded-md min-h-[120px] flex flex-col justify-between">
          <div className="flex gap-2">
            <Scroll size={12} className={isFairy ? "text-emerald-500 mt-1 flex-shrink-0" : "text-gold-core mt-1 flex-shrink-0"} />
            <p className="font-serif italic text-xs leading-relaxed text-stone-200 whitespace-normal">
              {currentLine.text}
            </p>
          </div>

          {/* Dialog Navigation controls */}
          <div className="flex justify-between items-center mt-5 pt-3 border-t border-white/5">
            <div className="flex gap-1.5">
              {pages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1 h-1 rounded-full transition-all duration-300 ${
                    idx === currentPage ? 'bg-gold-core scale-125' : 'bg-stone-700'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gold-core text-black hover:bg-white font-mono text-[8px] font-black tracking-widest uppercase rounded shadow-[0_0_15px_rgba(236,200,128,0.2)] cursor-pointer transition-all duration-300"
            >
              <span>{isLastPage ? 'LOCK IN' : 'NEXT'}</span>
              {isLastPage ? <Check size={10} className="stroke-[3]" /> : <ChevronRight size={10} />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
