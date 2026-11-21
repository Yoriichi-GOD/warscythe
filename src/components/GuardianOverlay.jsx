import { revealUiTarget } from '../utils/revealUiTarget';
import OrnateFrame from './frames/OrnateFrame';
import { KINGDOM_CHAPTERS } from '../data/kingdomChapters';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Scroll, ChevronRight, Check } from 'lucide-react';

const DIALOGUES = {
  "1": [
    {
      "speaker": "Guardian",
      "target": "onboarding-scythe-display",
      "text": "This kingdom lives on the back of the Worldbearer, a dragon born to the divine Emperor and Empress. Your first real promise has stirred the Scythe. Each completed Operation helps open the road."
    },
    {
      "speaker": "Guardian",
      "target": "onboarding-sync",
      "text": "This indicator shows your current sync state. Check it when moving between devices; a connection and successful sync are needed to carry your latest changes."
    },
    {
      "speaker": "Guardian",
      "target": "onboarding-notifications",
      "text": "Dispatches gather here. Settings beside them let you adjust sound, account controls and privacy. You can return to these controls whenever you need them."
    }
  ],
  "2": [
    {
      "speaker": "Guardian",
      "target": "onboarding-soundscape",
      "text": "Wind carries the sound of distant regions along the Worldbearer’s back. Choose an optional soundscape here, or keep the silence."
    },
    {
      "speaker": "Guardian",
      "target": "onboarding-focus-mode",
      "text": "A kingdom is restored one promise at a time. Focus Mode gives one Operation your full attention. You can leave it whenever you need the command deck."
    }
  ],
  "3": [
    {
      "speaker": "Guardian",
      "text": "The old watchfires stayed lit because their keepers returned. Rituals are your returning promises; the Forge remembers their rhythm."
    },
    {
      "speaker": "Guardian",
      "text": "First rehearse a vow: choose it, set its cadence and complete it. Practice changes no real progress. Then we will enter the Forge.",
      "afterTutorial": "rituals_intro"
    }
  ],
  "4": [
    {
      "speaker": "Guardian",
      "text": "The Ledger keeps the evidence of your journey: completed Operations, recovered artifacts and trophies. Open it to find what your work has left behind."
    }
  ],
  "5": [
    {
      "speaker": "Guardian",
      "text": "The hostile dragon falls; the Worldbearer beneath us still breathes. These invaders were created by its divine sibling, who chose to rule through fear."
    },
    {
      "speaker": "Fairy",
      "text": "You freed this region, and earned Curious Explorer. Come: I will show you the paths and places on your Quest Map. The wider kingdom is still waiting.",
      "afterTutorial": "quest_map_intro"
    }
  ],
  "6": [
    {
      "speaker": "Guardian",
      "text": "The regional Empresses kept this living kingdom’s roads and sanctuaries. Their fragments preserve its local stories. Inspect one in the Ledger; the remaining pages will open through your work.",
      "afterTutorial": "ledger_intro"
    }
  ],
  "7": [
    {
      "speaker": "Guardian",
      "text": "Other lights answer from the ridges. Friends and the campfire leaderboard let you witness another traveler’s progress. Adding someone is optional; the next promise is still your own.",
      "afterTutorial": "social_intro"
    }
  ],
  "8": [
    {
      "speaker": "Guardian",
      "text": "Two children of the divine sovereigns shaped this age: one carries the kingdom, the other creates its hostile dragons. The Codex holds the keepers’ accounts. Its regional pages retain their own voices."
    },
    {
      "speaker": "Guardian",
      "text": "You may also browse the Shop’s cosmetics. No purchase is needed to continue your journey. Let us read an unlocked page first.",
      "afterTutorial": "lore_intro"
    }
  ],
  "9": [
    {
      "speaker": "Guardian",
      "text": "A Legion shares work beneath one banner: named keepers, clear tasks and honest deadlines. Learn the workflow before choosing whether to form or join a company.",
      "afterTutorial": "legion_intro"
    }
  ],
  "10": [
    {
      "speaker": "Guardian",
      "text": "I fold the teaching map, not the world. Regions remain unseen, and the Betrayer’s creatures still haunt the Worldbearer’s back. You have earned Seasoned Wanderer. Choose your next promise; the Kingdom Chronicle will be here when you need your bearings."
    }
  ]
};

const revealTeachingTarget = (targetId) => {
  if (!targetId) return;

  let attempts = 0;
  const reveal = () => {
    const element = document.getElementById(targetId);
    if (element) {
      revealUiTarget(element);
      return;
    }

    attempts += 1;
    if (attempts < 12) window.setTimeout(reveal, 80);
  };

  window.requestAnimationFrame(reveal);
};

export default function GuardianOverlay({ progress, onClose, onTutorialAfter }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const pages = DIALOGUES[progress] || [];
  const currentLine = pages[currentPage];
  const isLastPage = currentPage === pages.length - 1;
  const isContextual = progress === 1 || progress === 2;

  useEffect(() => {
    if (!isContextual || !currentLine?.target) {
      return undefined;
    }
    const updateTarget = () => {
      const element = document.getElementById(currentLine.target);
      if (!element) {
        setTargetRect(null);
        return;
      }
      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      });
    };
    updateTarget();
    window.addEventListener('resize', updateTarget);
    window.addEventListener('scroll', updateTarget, true);
    return () => {
      window.removeEventListener('resize', updateTarget);
      window.removeEventListener('scroll', updateTarget, true);
    };
  }, [currentLine?.target, isContextual]);

  if (pages.length === 0) return null;

  const handleNext = () => {
    if (isLastPage) {
      // If this final slide declares an afterTutorial, hand off instead of just closing
      if (currentLine.afterTutorial && onTutorialAfter) {
        onTutorialAfter(currentLine.afterTutorial);
      } else {
        onClose();
      }
    } else {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      // This moves only the current page's scrollable content. It does not
      // advance a click lesson or switch tabs on the user's behalf.
      revealTeachingTarget(pages[nextPage]?.target);
    }
  };

  const isFairy = currentLine.speaker === 'Fairy';

  return (
    <div className={`fixed inset-0 z-[3000] select-none ${isContextual ? 'pointer-events-none' : 'flex items-center justify-center bg-black/90 backdrop-blur-lg'}`}>
      {isContextual && targetRect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed rounded-lg border-2 border-gold-core pointer-events-none"
          style={{
            top: Math.max(8, targetRect.top - 7),
            left: Math.max(8, targetRect.left - 7),
            width: targetRect.width + 14,
            height: targetRect.height + 14,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.08), 0 0 28px rgba(236,200,128,0.8)'
          }}
        />
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`${isContextual
          ? 'pointer-events-auto fixed right-4 top-[22vh] max-sm:top-auto max-sm:bottom-[86px] max-sm:left-3 max-sm:right-3 max-sm:mx-auto w-[min(360px,calc(100vw-1.5rem))] p-5'
          : 'relative w-full max-w-xl mx-4 p-8'} flex flex-col items-center bg-zinc-950/95 border border-gold-core/20 rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.85)] overflow-hidden ornate-surface`}
      >
        <OrnateFrame family={isFairy ? 'apollo' : 'hermes'} quiet className="ornate-frame--inset" />
        <span className="mb-3 font-mono text-[9px] uppercase tracking-widest text-gold-core">Chapter {progress} · {KINGDOM_CHAPTERS[progress - 1]?.title}</span>
        {/* Decorative corner runes */}
        <div className="absolute top-3 left-3 font-mono text-[7px] text-stone-700 tracking-widest">RUNIC_GATEWAY_V4</div>
        <div className="absolute bottom-3 right-3 font-mono text-[7px] text-stone-700 tracking-widest">WARSCYTHE_COREGUARD</div>

        {/* Themed Character Frame */}
        <div className={`relative ${isContextual ? 'w-20 h-20 mb-3' : 'w-44 h-44 mb-6'} rounded-lg overflow-hidden border border-gold-core/20 bg-black/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.6)]`}>
          <img
            src={isFairy ? `fairies/empress-1-liberated.webp` : `/guardian-observer.webp`}
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
        <div className={`w-full border border-stone-800/40 bg-black/50 ${isContextual ? 'p-4 min-h-[105px]' : 'p-6 min-h-[120px]'} rounded-md flex flex-col justify-between`}>
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
                  className={`w-1 h-1 rounded-full motion-control duration-300 ${idx === currentPage ? 'bg-gold-core scale-125' : 'bg-stone-700'
                    }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gold-core text-black hover:bg-white font-mono text-[8px] font-black tracking-widest uppercase rounded shadow-[0_0_15px_rgba(236,200,128,0.2)] cursor-pointer motion-control duration-300"
            >
              <span>{isLastPage ? (currentLine.afterTutorial ? 'EXPLORE →' : 'LOCK IN') : 'NEXT'}</span>
              {isLastPage ? <Check size={10} className="stroke-[3]" /> : <ChevronRight size={10} />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
