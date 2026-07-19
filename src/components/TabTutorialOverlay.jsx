import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, ChevronRight, Flame, Sparkles, Map as MapIcon } from 'lucide-react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import RitualModal from './RitualModal';

// ─── TUTORIAL DEFINITIONS ──────────────────────────────────────────────────────

const LEGACY_RITUALS_STEPS = [
  {
    type: 'ritual_complete',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "The vow is enshrined inside this rehearsal. In the living Rituals ledger, the circle beside its name is how you conquer that vow each day.",
    cta: "Continue →"
  },
  {
    type: 'dialogue',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "The Forge is where consistency becomes power. Streak-based evolution, scythe skins, acquired themes — all of it lives here.",
    cta: "Show me →"
  },
  {
    type: 'dialogue',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "Your Rituals are daily vows — not tasks you complete once, but habits you keep without exception. Miss one, and the whole streak falls. That is not cruelty. That is honesty.",
    cta: "Understood →"
  },
  {
    type: 'dialogue',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "Enshrine your first Ritual now. Give it a name. Set its difficulty. Seal it. From this moment, it runs every day.",
    cta: "Enshrine a Ritual →",
    openRitualForm: true
  },
  // Step 3 is handled by the RitualModal — after user submits, we advance
  {
    type: 'dialogue',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "Your first Ritual is sworn. Hold it every day. Now let me show you the Forge — your Scythe evolution, acquired skins, and themes live here.",
    cta: "To the Forge →",
    nextTutorial: 'forge_intro'
  }
];

const RITUALS_STEPS = [
  {
    type: 'dialogue',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "The Forge is where consistency becomes power. Streak evolution, Scythe skins, and acquired themes all begin with the vows kept here.",
    cta: "Show me"
  },
  {
    type: 'dialogue',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "Rituals are daily vows, not tasks completed once. Miss one and the streak falls. That is not cruelty. That is honesty.",
    cta: "Understood"
  },
  {
    type: 'dialogue',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "Enshrine a rehearsal Ritual now. Choose its preset, frequency, resistance, and hour. Nothing from this lesson will remain in your true ledger.",
    cta: "Enshrine a Ritual",
    openRitualForm: true
  },
  {
    type: 'ritual_complete',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "Your rehearsal vow now stands inside Active Rituals. Conquer it through the circle beside its name. The path to the Forge remains sealed until the vow is fulfilled.",
    cta: null
  },
  {
    type: 'dialogue',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    title: 'VOW ENSHRINED',
    text: "The vow has answered your hand. Remember this rhythm: enshrine, return, conquer. Now the Forge may open, where your Scythe evolution, acquired skins, and themes await.",
    cta: "Enter the Forge",
    nextTutorial: 'forge_intro'
  }
];

const FORGE_STEPS = [
  {
    type: 'dialogue',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "This is the Forge — WEAPON FORGE & COSMETICS. Three sections: Streak Weapons (earned by maintaining your daily ritual streak), Acquired Skins (premium scythes from the shop), and Acquired Themes (region themes).",
    cta: "Next →"
  },
  {
    type: 'highlight',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "First — your Streak Weapons. Every streak milestone unlocks a more powerful form. Your dormant Scythe evolves through nine tiers as you build unbreakable habits. Click 'Streak Weapons' above.",
    highlightId: 'forge-streak-tab',
    cta: null // user must click the highlighted element
  },
  {
    type: 'highlight',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "Now look at your Acquired Skins. These are premium Scythe cosmetics from the Shop — unique skins that follow your Scythe through all evolution tiers. Click 'Acquired Skins'.",
    highlightId: 'forge-shop-tab',
    cta: null
  },
  {
    type: 'highlight',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "Finally — Acquired Themes. These change the entire visual environment of the Forge, tied to the regions you unlock. Click 'Acquired Themes'.",
    highlightId: 'forge-theme-tab',
    cta: null
  },
  {
    type: 'dialogue',
    speaker: 'Guardian',
    portrait: '/guardian-observer.png',
    text: "The Forge is yours to explore. Every skin you acquire from the Shop lives here. Every streak milestone your Scythe has earned — visible, owned, ready to equip. Come back often.",
    cta: "Let's go →"
  }
];

const QUEST_MAP_STEPS = [
  {
    type: 'dialogue',
    speaker: 'Fairy',
    portrait: null, // will be crests/region-crest-5.png
    text: "Thank you for freeing me! Let me show you what you've won — the Quest Map.",
    cta: "Show me →"
  },
  {
    type: 'dialogue',
    speaker: 'Fairy',
    portrait: null,
    text: "This is Region 1 — the land you just liberated. Each region has 5 key locations connected by a path. I'll walk you through each one.",
    cta: "Next →"
  },
  {
    type: 'map_node',
    speaker: 'Fairy',
    portrait: null,
    nodeId: 'boss',
    text: "Here — Dragon's Nest. This is where Malgrath the Dread lived. You defeated it and claimed this region. Click the Dragon's Nest node on the map.",
    cta: null
  },
  {
    type: 'map_node',
    speaker: 'Fairy',
    portrait: null,
    nodeId: 'jail',
    text: "This is the Iron Jail — where I was imprisoned. Your conquest freed me from here. Click it.",
    cta: null
  },
  {
    type: 'map_node',
    speaker: 'Fairy',
    portrait: null,
    nodeId: 'castle',
    text: "Castle Blackvale — your Ledger lives here. Every conquest you record is stored in this archive. Click it.",
    cta: null
  },
  {
    type: 'map_node',
    speaker: 'Fairy',
    portrait: null,
    nodeId: 'stone',
    text: "And these are the training grounds — alternating daily between Stonehollow Defiles and Village of Ashendale. Visit them for discipline and physical conditioning. Click it.",
    cta: null
  },
  {
    type: 'dialogue',
    speaker: 'Fairy',
    portrait: null,
    text: "Now you know this land. I'll be watching the map as you push into Region 2. There are more fairies waiting — and more dragons to fell. Go.",
    cta: "Let's conquer →"
  }
];

const LEDGER_STEPS = [
  { type:'dialogue', speaker:'Guardian', text:"Your sixth victory has opened the deeper Ledger. This is not a list of chores. It is proof that your days have weight.", cta:"Open the record →" },
  { type:'highlight', speaker:'Guardian', text:"History Logs place every completed operation upon the Temporal Conquest Grid. Click it to read the rhythm of your execution.", highlightId:'ledger-history-tab' },
  { type:'highlight', speaker:'Guardian', text:"Relics & Lore keeps the artifacts, dragon trophies, and Empress fragments earned through conquest. Nothing here is cosmetic memory. Every object records a victory. Open it.", highlightId:'ledger-vault-tab' },
  { type:'highlight', speaker:'Guardian', text:"Guardian Chronicles preserve every transmission you have earned. Return here whenever resolve weakens and borrow strength from the warrior you already proved yourself to be.", highlightId:'ledger-prophecies-tab' },
  { type:'dialogue', speaker:'Guardian', text:"The archive is understood. Your real records remain untouched by this lesson. Fill them through action.", cta:"Seal the lesson →" }
];

const SOCIAL_STEPS = [
  { type:'dialogue', speaker:'Guardian', text:"No campaign is truly solitary. This chamber lets you witness other operatives without turning their lives into your measure.", cta:"Enter the campfire →" },
  { type:'highlight', speaker:'Guardian', text:"The Leaderboard is a campfire, not a throne. It shows weekly motion, streaks, and your own best. Click it and learn from the company around you.", highlightId:'social-leaderboard-tab' },
  { type:'highlight', speaker:'Guardian', text:"The Operative Graph is where trusted people become visible. Click it to see requests, allies, and the line between you.", highlightId:'social-friends-tab' },
  { type:'sandbox_submit', speaker:'Guardian', text:"Type anything into the operative field and send it. This is only a rehearsal dispatch. It will teach the motion, advance the lesson, and will never search for or contact a real user.", highlightId:'social-add-friend' },
  { type:'dialogue', speaker:'Guardian', text:"Compete only with yesterday. Encourage the living warrior beside you. That is how this campfire stays warm.", cta:"Return to the campaign →" }
];

const LORE_STEPS = [
  { type:'dialogue', speaker:'Guardian', text:"A conquered realm is older than its conqueror. Its memory waits in the Lore Codex.", cta:"Find the Codex →" },
  { type:'highlight', speaker:'Guardian', text:"Open the Lore Codex from the book sigil above. The world existed before you entered it. Read before you claim to understand it.", highlightId:'onboarding-lore-button' },
  { type:'highlight', speaker:'Guardian', text:"The five numbered seals are the five chapters of a realm: the dragon's birth, the Empress, their war, the prophecy, and your victory. Use them to move between pages.", highlightId:'lore-page-tabs' },
  { type:'dialogue', speaker:'Guardian', text:"The arrows beside the region name move between regional chronicles. Locked seals open as operations are completed. You may always return to every realm you have already earned.", cta:"One final chamber →" },
  { type:'highlight', speaker:'Guardian', text:"Close the Codex. Its histories remain available whenever you need to remember what your victories restored.", highlightId:'lore-close' },
  { type:'dialogue', speaker:'Guardian', text:"The final chamber belongs to another keeper. Coin, weapon, and presentation are his trade. Listen closely to Cassian, Master of the Dread Armory. He values judgment more than wealth.", cta:"Meet the trader" },
  { type:'highlight', speaker:'Guardian', text:"Open the Dread Armory from the golden satchel. Cassian expects you. This is an inspection only. You will not be asked to buy anything.", highlightId:'onboarding-shop-button' },
  { type:'dialogue', speaker:'Trader', text:"Welcome, young Reaper. I am Cassian. Every blade here can change the shape of your legend, but none can perform the work required to deserve it. Keep your purse closed. Today, we inspect.", cta:"Show me the Armory" },
  { type:'inspect', speaker:'Trader', text:"Your coin balance rests here. Warscythe coins are earned through execution and spent only when you choose. I keep an honest ledger, even when heroes do not.", highlightId:'shop-coins', cta:"Continue" },
  { type:'inspect', speaker:'Trader', text:"These are Weapon Evolution Skins. They alter the form of your Scythe without altering your strength. Preview paid Scythes safely from the Forge before deciding whether one belongs to you.", highlightId:'shop-weapon-skins', cta:"Continue" },
  { type:'dialogue', speaker:'Trader', text:"No credits? Do not lower your eyes. I accept hard work and grit too. Bring me the coins earned by your own execution, and I will still place worthy steel in your hands.", cta:"Show me what grit buys" },
  { type:'inspect', speaker:'Trader', text:"These are Progression Coin Weapons. No money opens them. Completed work becomes coin, coin becomes armament, and the armament remembers how it was earned.", highlightId:'shop-coin-weapons', cta:"Continue" },
  { type:'inspect', speaker:'Trader', text:"Visual Environment Scrolls change the atmosphere surrounding your Forge. They alter presentation, never power. A warrior may choose the sky around the anvil without pretending the sky swung the blade.", highlightId:'shop-environment-scrolls', cta:"Continue" },
  { type:'highlight', speaker:'Trader', text:"Close the Armory. Nothing was purchased. Return whenever you wish to inspect, and preview paid Scythes in the Forge before you spend a single coin or credit.", highlightId:'shop-close' },
  { type:'dialogue', speaker:'Guardian', text:"You now know the difference between earned strength and chosen presentation. The Codex holds the world's memory. The Armory holds optional forms. Neither asks you to mistake appearance for power.", cta:"End the lesson →" }
];

const LEGION_STEPS = [
  { type:'dialogue', speaker:'Guardian', text:"A friend witnesses your road. A Legion walks it with you. We will rehearse its command without creating, inviting, or disbanding anything real.", cta:"Begin the war game →" },
  { type:'highlight', speaker:'Guardian', text:"Legion Command is the garrison. Here a creator names the Legion, invites trusted friends, and divides an operation into owned assignments.", highlightId:'social-legion-tab' },
  { type:'dialogue', speaker:'Guardian', text:"First create a banner and name. Then reinforce the garrison by selecting an accepted friend. Only the creator may add or remove members, and no outsider may enter another region uninvited.", cta:"Continue rehearsal →" },
  { type:'dialogue', speaker:'Guardian', text:"A creator may begin the parent operation before another member accepts an assignment. Each brother's sub-task carries its own deadline and priority, while the Legion records the shared outcome.", cta:"What if I walk alone? →" },
  { type:'dialogue', speaker:'Guardian', text:"If no ally walks with you today, disband the empty rehearsal and continue. You are a fiery-hearted warrior for facing dragons alone. Remember this also: battles grow lighter when brothers carry part of the shield.", cta:"Disband rehearsal →" },
  { type:'dialogue', speaker:'Guardian', text:"The war game is erased. Your real Legion records were never touched. When the right people arrive, return and raise a banner worth following.", cta:"End lesson →" }
];

const TUTORIAL_STEPS = {
  rituals_intro: RITUALS_STEPS,
  forge_intro: FORGE_STEPS,
  quest_map_intro: QUEST_MAP_STEPS,
  ledger_intro: LEDGER_STEPS,
  social_intro: SOCIAL_STEPS,
  lore_intro: LORE_STEPS,
  codex_intro: LORE_STEPS.slice(0, 5),
  shop_intro: LORE_STEPS.slice(5),
  legion_intro: LEGION_STEPS
};

// ─── GUARDIAN CARD ─────────────────────────────────────────────────────────────

function GuardianCard({ step, onNext, onOpenRitual }) {
  const isFairy = step.speaker === 'Fairy';
  const isTrader = step.speaker === 'Trader';
  const portrait = isFairy
    ? '/fairies/empress-1-liberated.png'
    : isTrader
      ? '/dread-armory-trader.png'
      : step.portrait || '/guardian-observer.png';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-md bg-zinc-950/98 border border-white/8 rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.9)] p-6 flex flex-col items-center gap-4"
    >
      {/* Portrait */}
      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gold-core/20 bg-black/40 flex-shrink-0">
        <img src={portrait} alt={step.speaker} className="w-full h-full object-contain" />
        <div className="absolute inset-x-0 bottom-0 py-1 bg-black/80 border-t border-white/5 text-center">
          <span className={`font-mono text-[9px] font-black tracking-widest uppercase ${isFairy ? 'text-emerald-400' : isTrader ? 'text-amber-400' : 'text-gold-core'}`}>
            {step.speaker}
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="w-full border border-stone-800/40 bg-black/50 p-4 rounded-lg">
        {step.title && (
          <h3 className="mb-3 text-center font-display text-lg tracking-[.2em] text-gold-core uppercase">
            {step.title}
          </h3>
        )}
        <div className="flex gap-2">
          <Scroll size={11} className={`${isFairy ? 'text-emerald-500' : 'text-gold-core'} mt-0.5 flex-shrink-0`} />
          <p className="font-serif italic text-xs leading-relaxed text-stone-200">{step.text}</p>
        </div>
      </div>

      {/* CTA */}
      {step.cta && (
        <button
          onClick={() => step.openRitualForm ? onOpenRitual() : onNext()}
          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gold-core text-black hover:bg-white font-mono text-[9px] font-black tracking-widest uppercase rounded shadow-[0_0_15px_rgba(236,200,128,0.2)] cursor-pointer transition-all duration-300"
        >
          <span>{step.cta}</span>
          <ChevronRight size={12} />
        </button>
      )}

      {step.type === 'map_node' && (
        <p className="font-mono text-[8px] tracking-widest text-stone-500 uppercase animate-pulse">
          ↑ Click the highlighted node on the map above
        </p>
      )}

      {step.type === 'highlight' && (
        <p className="font-mono text-[8px] tracking-widest text-stone-500 uppercase animate-pulse">
          ↑ Click the highlighted tab above
        </p>
      )}

      {step.type === 'sandbox_submit' && (
        <p className="font-mono text-[8px] tracking-widest text-stone-500 uppercase animate-pulse">
          ↑ Type any rehearsal name and press the highlighted search button
        </p>
      )}
    </motion.div>
  );
}

// ─── HIGHLIGHT PULSE OVERLAY ───────────────────────────────────────────────────

const getClippedHighlightRect = (element) => {
  const targetRect = element.getBoundingClientRect();
  const headerRect = document.getElementById('warscythe-header')?.getBoundingClientRect();
  const taskbarRect = document.getElementById('warscythe-taskbar')?.getBoundingClientRect();
  const contentRect = document.getElementById('warscythe-content-stage')?.getBoundingClientRect();
  const insideHeader = Boolean(element.closest('#warscythe-header'));
  const insideTaskbar = Boolean(element.closest('#warscythe-taskbar'));

  let owner = element.parentElement;
  while (owner && owner !== document.body) {
    const style = window.getComputedStyle(owner);
    if (/(auto|scroll|hidden|clip)/.test(`${style.overflow}${style.overflowY}${style.overflowX}`)) break;
    owner = owner.parentElement;
  }
  const ownerRect = owner && owner !== document.body
    ? owner.getBoundingClientRect()
    : contentRect;

  let top = targetRect.top - 6;
  let left = targetRect.left - 6;
  let right = targetRect.right + 6;
  let bottom = targetRect.bottom + 6;

  if (!insideHeader && !insideTaskbar) {
    if (contentRect) {
      top = Math.max(top, contentRect.top);
      left = Math.max(left, contentRect.left);
      right = Math.min(right, contentRect.right);
      bottom = Math.min(bottom, contentRect.bottom);
    }
    if (ownerRect) {
      top = Math.max(top, ownerRect.top);
      left = Math.max(left, ownerRect.left);
      right = Math.min(right, ownerRect.right);
      bottom = Math.min(bottom, ownerRect.bottom);
    }
    if (headerRect) top = Math.max(top, headerRect.bottom);
    if (taskbarRect) bottom = Math.min(bottom, taskbarRect.top);
  } else if (insideHeader && headerRect) {
    top = Math.max(top, headerRect.top);
    left = Math.max(left, headerRect.left);
    right = Math.min(right, headerRect.right);
    bottom = Math.min(bottom, headerRect.bottom);
  } else if (insideTaskbar && taskbarRect) {
    top = Math.max(top, taskbarRect.top);
    left = Math.max(left, taskbarRect.left);
    right = Math.min(right, taskbarRect.right);
    bottom = Math.min(bottom, taskbarRect.bottom);
  }

  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);
  if (width < 2 || height < 2) return null;
  return { top, left, width, height };
};

function HighlightRing({ elementId }) {
  const [pos, setPos] = useState(null);
  const revealedElementRef = useRef(null);

  useEffect(() => {
    if (elementId === 'shop-close') {
      window.dispatchEvent(new CustomEvent('warscythe:shop-tutorial-close-enabled'));
    }
  }, [elementId]);

  useEffect(() => {
    setPos(null);
    revealedElementRef.current = null;
    const update = () => {
      const el = document.getElementById(elementId);
      if (!el) return;
      if (revealedElementRef.current !== el) {
        revealedElementRef.current = el;
        const insideFixedChrome = Boolean(el.closest('#warscythe-header, #warscythe-taskbar'));
        el.scrollIntoView({
          behavior: 'smooth',
          block: insideFixedChrome ? 'nearest' : 'start',
          inline: 'nearest',
        });
      }
      setPos(getClippedHighlightRect(el));
    };
    update();
    const retry = window.setInterval(update, 120);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.clearInterval(retry);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [elementId]);

  if (!pos) return null;

  return (
    <motion.div
      style={{ position: 'fixed', ...pos, zIndex: 9999, pointerEvents: 'none', borderRadius: 8 }}
      animate={{ boxShadow: ['0 0 0 2px rgba(236,200,128,0.7), 0 0 20px rgba(236,200,128,0.3)', '0 0 0 4px rgba(236,200,128,1), 0 0 40px rgba(236,200,128,0.6)', '0 0 0 2px rgba(236,200,128,0.7), 0 0 20px rgba(236,200,128,0.3)'] }}
      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
    />
  );
}

// ─── MAIN OVERLAY ──────────────────────────────────────────────────────────────

export default function TabTutorialOverlay({
  tutorialId,
  onComplete,
  onSwitchTab,
  onMapNodeClick,
  onHighlightChange,
  tutorialNodeClicked
}) {
  const setPostGuardianTutorial = useWarscytheStore(s => s.setPostGuardianTutorial);

  const [stepIndex, setStepIndex] = useState(0);
  const [showRitualForm, setShowRitualForm] = useState(false);
  const [sandboxRitualId, setSandboxRitualId] = useState(null);

  const steps = TUTORIAL_STEPS[tutorialId] || [];
  const currentStep = steps[stepIndex];

  // Reset when tutorialId changes
  useEffect(() => {
    setStepIndex(0);
    setShowRitualForm(false);
    setSandboxRitualId(null);
  }, [tutorialId]);

  // Sync map highlight node whenever step changes
  useEffect(() => {
    if (!onHighlightChange) return;
    const step = steps[stepIndex];
    if (step?.type === 'map_node') {
      onHighlightChange(step.nodeId);
    } else {
      onHighlightChange(null);
    }
  }, [stepIndex, tutorialId]);

  // Handle map node clicks advancing the tutorial
  useEffect(() => {
    if (!tutorialNodeClicked || !currentStep) return;
    if (currentStep.type === 'map_node' && currentStep.nodeId === tutorialNodeClicked) {
      setTimeout(() => advanceRef.current(), 400);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialNodeClicked]);

  useEffect(() => {
    if (currentStep?.type !== 'highlight' || !currentStep.highlightId) return undefined;
    const element = document.getElementById(currentStep.highlightId);
    if (!element) return undefined;
    const handleClick = () => window.setTimeout(() => advanceRef.current(), 180);
    element.addEventListener('click', handleClick);
    return () => element.removeEventListener('click', handleClick);
  }, [currentStep?.highlightId, currentStep?.type]);

  useEffect(() => {
    if (currentStep?.type !== 'ritual_complete' || !sandboxRitualId) return undefined;
    const handleComplete = (event) => {
      if (event.detail?.id === sandboxRitualId) advanceRef.current();
    };
    const containLesson = (event) => {
      if (event.target.closest?.(`[data-ritual-id="${sandboxRitualId}"]`)) return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener('warscythe:sandbox-ritual-complete', handleComplete);
    document.addEventListener('click', containLesson, true);
    return () => {
      window.removeEventListener('warscythe:sandbox-ritual-complete', handleComplete);
      document.removeEventListener('click', containLesson, true);
    };
  }, [currentStep?.type, sandboxRitualId]);

  useEffect(() => {
    if (currentStep?.type !== 'sandbox_submit' || !currentStep.highlightId) return undefined;
    let cleanup = () => {};
    const bind = () => {
      const target = document.getElementById(currentStep.highlightId);
      const form = target?.closest('form');
      if (!form) return false;
      const handleSandboxSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        advanceRef.current();
      };
      form.addEventListener('submit', handleSandboxSubmit, true);
      cleanup = () => form.removeEventListener('submit', handleSandboxSubmit, true);
      return true;
    };
    if (bind()) return cleanup;
    const retry = window.setInterval(() => {
      if (bind()) window.clearInterval(retry);
    }, 100);
    return () => {
      window.clearInterval(retry);
      cleanup();
    };
  }, [currentStep?.highlightId, currentStep?.type]);

  const advance = () => {
    if (!currentStep) return;

    // If next tutorial is specified, switch overlays
    if (currentStep.nextTutorial) {
      setPostGuardianTutorial(currentStep.nextTutorial);
      if (currentStep.nextTutorial === 'forge_intro' && onSwitchTab) {
        onSwitchTab('forge');
      }
      return;
    }

    const next = stepIndex + 1;
    if (next >= steps.length) {
      if (onHighlightChange) onHighlightChange(null);
      onComplete();
    } else {
      setStepIndex(next);
    }
  };

  const advanceRef = React.useRef(advance);
  advanceRef.current = advance;

  const handleRitualSubmit = (ritual) => {
    const beforeIds = new Set((useWarscytheStore.getState().rituals || []).map(item => item.id));
    useWarscytheStore.getState().addRitual(
      ritual.title,
      ritual.frequency,
      ritual.effort,
      ritual.targetTime
    );
    const created = (useWarscytheStore.getState().rituals || []).find(item => !beforeIds.has(item.id));
    if (!created) return;
    const id = created.id;
    useWarscytheStore.setState(state => ({
      rituals: (state.rituals || []).map(item => (
        item.id === id ? { ...item, isTutorialSandbox: true } : item
      ))
    }));
    setSandboxRitualId(id);
    setShowRitualForm(false);
    const next = stepIndex + 1;
    if (next < steps.length) setStepIndex(next);
    else onComplete();
  };

  if (!currentStep) return null;

  // Determine which node IDs to highlight — all map nodes except the current one should be dim
  return (
    <>
      {/* Forge highlight ring */}
      {(currentStep?.type === 'highlight' || currentStep?.type === 'inspect' || currentStep?.type === 'sandbox_submit') && currentStep.highlightId && (
        <HighlightRing elementId={currentStep.highlightId} />
      )}
      {currentStep?.type === 'ritual_complete' && sandboxRitualId && (
        <HighlightRing elementId={`ritual-${sandboxRitualId}`} />
      )}

      {/* Blocker overlay — full screen except card area, blocks all interaction */}
      <div
        className={`fixed inset-0 z-[4000] ${tutorialId === 'rituals_intro' && currentStep?.type !== 'ritual_complete' ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ background: 'transparent' }}
      />

      {/* Hide the introductory card while the ritual form teaches each field. */}
      <AnimatePresence>
        {!showRitualForm && (
          <motion.div
            key="tutorial-guardian-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="fixed bottom-0 inset-x-0 z-[10000] flex justify-center px-4 pb-6 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md">
              <GuardianCard
                key={stepIndex}
                step={currentStep}
                onNext={advance}
                onOpenRitual={() => setShowRitualForm(true)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ritual modal in tutorial mode */}
      {showRitualForm && (
        <div className="fixed inset-0 z-[4100]">
          <RitualModal
            onClose={handleRitualSubmit}
            tutorialMode={true}
          />
        </div>
      )}
    </>
  );
}

// Export node IDs for the current map tutorial step so MapSection can highlight them
export function getMapTutorialNodeId(tutorialId, stepIndex) {
  if (tutorialId !== 'quest_map_intro') return null;
  const steps = QUEST_MAP_STEPS;
  const step = steps[stepIndex];
  return step?.type === 'map_node' ? step.nodeId : null;
}
