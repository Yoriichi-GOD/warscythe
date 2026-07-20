import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Scroll, ChevronRight, Check } from 'lucide-react';

const DIALOGUES = {
  1: [
    { speaker: 'Guardian', target: 'onboarding-scythe-display', text: "You've struck your first blow. Look — your Scythe stirs." },
    { speaker: 'Guardian', target: 'onboarding-scythe-display', text: "This is the Reaper's Scythe. It sleeps now, dormant, but every Operation you conquer feeds it. Watch the weapon in front of you change as your execution grows." },
    { speaker: 'Guardian', target: 'onboarding-sync', text: "Your progress travels with you. This sync indicator confirms that your Operations, rewards, and progress are secured across your devices." },
    { speaker: 'Guardian', target: 'onboarding-notifications', text: "I will speak when it matters — a deadline closing, a region shifting, a ritual approaching. Active dispatches gather here." },
    { speaker: 'Guardian', target: 'onboarding-settings', text: "Your settings live here. Sound, account controls, privacy, and how this world reaches you can all be adjusted from this command." }
  ],
  2: [
    { speaker: 'Guardian', target: 'onboarding-soundscape', text: "Your second strike awakens the Soundscape. Every region carries its own atmosphere — touch the jukebox to let Ashwood breathe around you." },
    { speaker: 'Guardian', target: 'onboarding-soundscape', text: "Choose a region from this panel whenever you want to change the world around your work. Soundscapes are always optional, and silence remains yours." },
    { speaker: 'Guardian', target: 'onboarding-focus-mode', text: "When one objective must consume your full attention, invoke Focus Mode here. It strips the command deck away and leaves only the operation in front of you." }
  ],
  3: [
    { speaker: 'Guardian', text: "The Forge is where consistency becomes power." },
    { speaker: 'Guardian', text: "Your Rituals are the tasks you commit to daily. Miss one, and the whole streak resets to zero. A streak that forgives isn't a streak. Keep your streak, and your Scythe ascends in the Forge.", afterTutorial: 'rituals_intro' }
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
    { speaker: 'Fairy', text: "You have earned the title of 'Curious Explorer' — wear it proudly beneath your name in the social directory!", afterTutorial: 'quest_map_intro' }
  ],
  6: [
    { speaker: 'Guardian', text: "Look closer at your Ledger now. Every Empress you free leaves a Fragment — her story, not just a mark of victory. Every dragon you fell leaves a trophy behind.", afterTutorial: 'ledger_intro' }
  ],
  7: [
    { speaker: 'Guardian', text: "You are not the only one walking this path." },
    { speaker: 'Guardian', text: "Add those you trust. Watch how far you've come against your own best. The Leaderboard is a campfire to sit around, not a ladder to climb over others.", afterTutorial: 'social_intro' }
  ],
  8: [
    { speaker: 'Guardian', text: "Every Empress you free has a history — who she was, what her freedom restores. Read the Codex to understand this world." },
    { speaker: 'Guardian', text: "And should you wish to change how you're seen: the Shop offers new Scythe skins and visual themes. None of it changes your strength. All of it changes your style.", afterTutorial: 'lore_intro' }
  ],
  9: [
    { speaker: 'Guardian', text: "Friends are one thing. A Legion is another." },
    { speaker: 'Guardian', text: "Form a Legion to delegate sub-tasks with real deadlines and priorities. Contribute to double your output; fail, and it's recorded on the Legion's permanent scroll.", afterTutorial: 'legion_intro' }
  ],
  10: [
    { speaker: 'Guardian', text: "You've seen everything now. The Scythe, the Rituals, the Ledger, the Legion, two regions and two fairies freed." },
    { speaker: 'Guardian', text: "There is no more I need to show you. What happens from here is yours to write. You've earned the title of 'Seasoned Wanderer'. Go. Execute." }
  ]
};

const revealTeachingTarget = (targetId) => {
  if (!targetId) return;

  let attempts = 0;
  const reveal = () => {
    const element = document.getElementById(targetId);
    if (element) {
      const isPhone = window.matchMedia('(max-width: 639px)').matches;
      element.scrollIntoView({
        behavior: 'smooth',
        // Phone lessons use a lower-third Guardian card, so the inspected
        // control belongs in the clear teaching stage above him.
        block: isPhone ? 'start' : 'center',
        inline: 'nearest',
      });
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
          ? 'pointer-events-auto fixed left-1/2 bottom-24 -translate-x-1/2 max-sm:bottom-[86px] max-sm:left-3 max-sm:right-3 max-sm:translate-x-0 max-sm:mx-auto w-[min(360px,calc(100vw-1.5rem))] p-5'
          : 'relative w-full max-w-xl mx-4 p-8'} flex flex-col items-center bg-zinc-950/95 border border-gold-core/20 rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.85)] overflow-hidden`}
      >
        {/* Decorative corner runes */}
        <div className="absolute top-3 left-3 font-mono text-[7px] text-stone-700 tracking-widest">RUNIC_GATEWAY_V4</div>
        <div className="absolute bottom-3 right-3 font-mono text-[7px] text-stone-700 tracking-widest">WARSCYTHE_COREGUARD</div>

        {/* Themed Character Frame */}
        <div className={`relative ${isContextual ? 'w-20 h-20 mb-3' : 'w-44 h-44 mb-6'} rounded-lg overflow-hidden border border-gold-core/20 bg-black/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.6)]`}>
          <img
            src={isFairy ? `fairies/empress-1-liberated.png` : `/guardian-observer.png`}
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
                  className={`w-1 h-1 rounded-full transition-all duration-300 ${idx === currentPage ? 'bg-gold-core scale-125' : 'bg-stone-700'
                    }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gold-core text-black hover:bg-white font-mono text-[8px] font-black tracking-widest uppercase rounded shadow-[0_0_15px_rgba(236,200,128,0.2)] cursor-pointer transition-all duration-300"
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
