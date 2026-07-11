import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sword, Shield, Activity, Music, Terminal, BookOpen, Layers, 
  CheckCircle2, ChevronRight, Scale, ShieldAlert, X, Eye, Users, 
  HelpCircle, Compass, CreditCard, Sparkles, Heart 
} from 'lucide-react';

export default function LandingPage({ onLaunch }) {
  const [activeTab, setActiveTab] = useState('operations');
  const [showLegal, setShowLegal] = useState(null); // 'terms' | 'privacy' | null

  // 11 Chapters matching the full WARSCYTHE_INFO_ICON_DESCRIPTIONS_COMPLETE.md document
  const chapters = [
    {
      id: 'operations',
      label: 'Operations & Raids',
      icon: Sword,
      asset: '/nodes/node-blackvale.png',
      topics: [
        {
          title: 'What is an Operation?',
          philosophy: 'An operation is your declaration of war against a specific obstacle. Not a vague goal—a concrete, time-bound commitment. The moment you create it, you\'ve crossed the threshold from thinking to doing.',
          useCase: 'You need to finish a project, learn a skill, build something, overcome resistance—anything that takes focus and time. Create an operation, assign it a difficulty level (how hard will this push you?), set a deadline, then execute.',
          details: [
            'One operation at a time per region? No. You can have up to 5 active simultaneously.',
            'Each operation unlocks artifacts when completed. Artifacts prove you did the work.',
            'Operations live in regions. Completing them advances regional progress toward fairy liberation.',
            'Boss Raids are the hardest operations (14-day minimum). They\'re the climax of a region\'s story.'
          ]
        },
        {
          title: 'What are Threat Levels?',
          philosophy: 'Threat levels are honest. Don\'t pretend your task is harder than it is. A low-threat operation should feel achievable. A legendary boss raid should feel like you\'re walking into actual danger.',
          useCase: 'When creating an operation, you choose: Low (1-3 days), Medium (3-7 days), High (7-14 days), Legendary (14+ days, Boss Raid only).',
          details: [
            'Low: Something you can finish in a focused day or two. Clearing email, single workout session, small write-up.',
            'Medium: A project that spans a week. A presentation, a feature, a mini-goal.',
            'High: Something that demands sustained focus. A major deliverable, competitive training block, serious creative work.',
            'Legendary: Only for the hardest wars. Launching a project, major exam, transformative commitment. Boss Raids live here.'
          ],
          whyItMatters: 'The app respects your time. If you say legendary, the app knows you\'re serious. If you\'re always legendary, the app will eventually call you out (through lore, through Guardian Angel whispers). You can\'t lie to the system—it will know.'
        },
        {
          title: 'What is a Region?',
          philosophy: 'Regions are worlds. Each dragon rules a world. Freeing a fairy means restoring that world to order. You\'re not just completing tasks—you\'re on a hero\'s journey across 40 distinct mythologies.',
          useCase: 'Regions unlock sequentially. You unlock a new region only after completing 5 key operations in your current region. Each region has:',
          details: [
            'A unique aesthetic (void purple, lava gold, forest green, etc.)',
            'A unique dragon (with its own personality and realm)',
            'A unique imprisoned fairy (with her own story)',
            '5 key operations to complete before you can challenge the dragon'
          ],
          currentState: 'You have access to Region 1 (Ashwood) at launch. Complete 5 operations, unlock Region 2. Keep going.'
        },
        {
          title: 'What is a Boss Raid?',
          philosophy: 'Not every operation is a boss raid. Boss raids are the climax. You\'ve prepared, gathered artifacts, built momentum. Now you face the dragon itself—the final obstacle before a fairy is free.',
          useCase: 'After completing 4 normal operations in a region, you can initiate a Boss Raid:',
          details: [
            '14-day minimum (non-negotiable)',
            'Deposits 1/5 key per completion (like normal operations)',
            'Completes the liberation sequence for that fairy once you gather all 5 keys'
          ],
          whyItMatters: 'A Boss Raid is narrative theater. The game treats it as a war moment. Flash screens celebrate it. Your Guardian Angel acknowledges the weight.'
        }
      ]
    },
    {
      id: 'rituals',
      label: 'Daily Rituals & Streaks',
      icon: Shield,
      asset: '/nodes/node-ashendale.png',
      topics: [
        {
          title: 'What is a Ritual?',
          philosophy: 'Operations are wars against specific obstacles. Rituals are your daily religion. They\'re the non-negotiable habits that build you. Miss one ritual, and you break the chain. The chain is the point.',
          useCase: 'Rituals are daily or weekly commitments you make to yourself (e.g., Morning run, Meditation, Gym session, Writing hour, Meal prep, or whatever builds you).',
          details: [
            'Operations are discrete projects (they end)',
            'Rituals are continuous (they\'re forever, until you consciously end them)',
            'Missing one ritual breaks ALL streaks (the system doesn\'t negotiate)'
          ]
        },
        {
          title: 'What is the Streak?',
          philosophy: 'The streak is your scoreboard against yourself. It\'s not about perfection—it\'s about consistency. One day, one completed ritual set, one more link in the chain.',
          useCase: 'Every day you complete ALL active rituals, the streak counter increases by 1. If you skip even one ritual, the streak resets to 0, all progress resets, and you start over tomorrow.',
          details: [
            'Consistency is the actual superpower. Not intensity, not brilliance—consistency.',
            'The streak trains you to show up, even when you don\'t feel like it, even when it\'s cold.',
            'At 200 days, the app will send you a letter. It\'s not congratulations. It\'s a warning asking: "Are you doing this for you, or are you addicted to the number?"'
          ]
        }
      ]
    },
    {
      id: 'scythe',
      label: 'Scythe & Progression',
      icon: Layers,
      asset: '/artifacts/artifact-scroll.png',
      topics: [
        {
          title: 'What is the Scythe?',
          philosophy: 'The Scythe is your signature. It evolves with you. As you complete more operations, as your focus sharpens, the Scythe transforms. It\'s not a game mechanic. It\'s a visual symbol of your power growing.',
          useCase: 'The Scythe has 6 evolution tiers: DORMANT (new player, untested), AWAKENED, HARDENED, REFINED, ASCENDED, and PLATINUM (ultimate form). You earn tiers by completing enough operations.',
          whyItMatters: 'Every time you open the app, you see your scythe. Watching it evolve is watching yourself evolve. It\'s proof you\'re not stuck. You\'re building.'
        },
        {
          title: 'What are Artifacts?',
          philosophy: 'Artifacts are not loot. They\'re mementos. Each artifact tells a story about a specific ADHD execution truth. When you complete an operation, you receive an artifact that celebrates what you just proved about yourself.',
          useCase: 'Every operation completion awards an artifact from a pool of 125 unique pieces, categorized by rarity (Common, Uncommon, Rare, Epic, Legendary).',
          details: [
            'CROWN: You stopped doing everything. You conquered what mattered.',
            'BLADE: Criticism used to break you. Now it sharpens you.',
            'LANTERN: You carried light into darkness. For yourself first.'
          ],
          whyItMatters: 'Artifacts don\'t drop instantly. You physically scratch an encrypted overlay to reveal them. This micro-pause lets the win register emotionally. The scratch action is the celebration.'
        },
        {
          title: 'What is the Ledger?',
          philosophy: 'The Ledger is your trophy vault. It\'s proof. All the dragons you\'ve slain, all the fairies you\'ve freed, all the artifacts you\'ve earned, all the streaks you\'ve built—they live here, permanently.',
          useCase: 'The Ledger contains three primary logs: History Logs (daily completions), Relics & Lore (fairies/dragons/artifacts), and Guardian Chronicles (prophecies received).'
        }
      ]
    },
    {
      id: 'fitness',
      label: 'Fitness & Deities',
      icon: Activity,
      asset: '/bg/bg-region-10.png',
      topics: [
        {
          title: 'What is Deity Progression?',
          philosophy: 'Fitness isn\'t separate from execution. Your body and your mind are the same machine. The app honors both by weaving gym work into cosmological progression.',
          useCase: 'As you accumulate gym volume (measured in kg), you unlock Greek deities:',
          details: [
            'Hermes (50k kg): Speed, overcoming paralysis',
            'Apollo (150k kg): Clarity, cutting through fog',
            'Ares (250k kg): War, willingness to bleed',
            'Hercules (375k kg): Transcendence, becoming legend',
            'Zeus (500k kg): Sovereignty, ruling the storm'
          ],
          whyItMatters: 'This progression takes 12-24 months of consistent training. It\'s not a sprint. It\'s a journey toward strength.'
        },
        {
          title: 'What is the Iron Ledger?',
          philosophy: 'Gym sessions are operations too. They deserve the same tracking, the same celebration, the same integration into your mythology.',
          useCase: 'The Iron Ledger tracks SBD workouts, accessory volumes, conditioning metrics, and milestones. Your gym volume feeds directly into deity progression. Lift more, unlock the next god.'
        }
      ]
    },
    {
      id: 'fairies',
      label: 'Fairy & Dragon Lore',
      icon: BookOpen,
      asset: '/fairies/empress-9-caged.png',
      topics: [
        {
          title: 'What is a Fairy?',
          philosophy: 'Every region has an imprisoned fairy. Your job isn\'t just to conquer. It\'s to liberate. The distinction matters. You\'re not taking territory. You\'re freeing souls.',
          useCase: 'To free a fairy: Complete 5 operations in the region to collect keys, then defeat the dragon in a Boss Raid. Once liberated, she claims her throne and her story is revealed in the Ledger.'
        },
        {
          title: 'What are Dragons?',
          philosophy: 'Dragons represent your greatest psychological blockades—the final guardians of your focus. Slaying them is not just a triumph of task completion, but the active reclaiming of your mental territory.',
          useCase: 'Once you obtain all 5 regional keys, you challenge the dragon in a 14-day Boss Raid. Defeating the dragon completes the liberation sequence, rewards you with the dragon\'s head trophy in your Ledger, and frees the fairy.'
        },
        {
          title: 'What is Lore?',
          philosophy: 'Lore is the story behind each region. Why is that dragon there? What does the fairy dream of? What does her liberation mean? Every page of lore validates the work you\'re doing.',
          useCase: 'Lore unlocks sequentially as you complete operations (5 pages per region). Each page is a novel-style narrative with an illustration.'
        }
      ]
    },
    {
      id: 'social',
      label: 'Friends & Social',
      icon: Users,
      asset: '/olympus-bg.png',
      topics: [
        {
          title: 'What is a Friend?',
          philosophy: 'Friends aren\'t just names on a list. They\'re witnesses to your journey. They see your streaks, your region progress, your victories. You see theirs. You\'re walking this path together.',
          useCase: 'Add friends by username or Warscythe ID (max 50 friends to keep it meaningful). Shows their region progress, current streak tier, and active conquests.'
        },
        {
          title: 'What is the Friends Leaderboard?',
          philosophy: 'The leaderboard answers one question: who else is walking this path with me? Default view is always self-comparison to prevent demotivation.',
          details: [
            'Personal mode (default): Shows your streak vs. personal bests and weekly XP targets.',
            'Competitive mode (opt-in): Ranks friends by weekly XP (resets weekly, preventing insurmountable gaps).'
          ]
        },
        {
          title: 'What is a Legion Operation?',
          philosophy: 'Legion operations are distributed wars. You can\'t win them alone. You need other warriors. The app becomes cooperative, not just personal.',
          useCase: 'Invite friends to a shared operation. Break it into sub-tasks (each friend takes one). All must complete their assignments for the legion to succeed and earn XP/artifacts.'
        },
        {
          title: 'What is the XP System?',
          philosophy: 'XP is invisible scorekeeping. Every operation completion, daily ritual check-in, or sub-task in a legion feeds a counter that determines your standing relative to friends.',
          useCase: 'XP determines weekly leaderboard rankings, deity progression tiers, and seasonal achievements.'
        }
      ]
    },
    {
      id: 'atmosphere',
      label: 'Atmosphere & Cache',
      icon: Music,
      asset: '/soundscape-jukebox.png',
      topics: [
        {
          title: 'What is a Soundscape?',
          philosophy: 'Music demands attention. Soundscapes support it. The goal: work for an hour, forget the audio was playing, then feel something missing when you turn it off.',
          useCase: 'Each region features a unique, original soundscape composition (e.g. Ashwood forest winds, Kailash bells, Lava Citadel crackling embers). Activation is optional and volume is independent of system controls.'
        },
        {
          title: 'What is the Tactical Cache Core?',
          philosophy: 'You\'re offline half your life. The app never punishes you for that. Soundscapes, regions, artifacts, lore—all cached locally. You can work fully offline with zero latency.',
          useCase: 'Downloaded soundscapes play offline with zero buffering. If a soundscape isn\'t cached, it falls back to silence—no error, no broken state. Everything degrades gracefully.'
        }
      ]
    },
    {
      id: 'terminal',
      label: 'War Terminal',
      icon: Terminal,
      asset: '/guardian-observer.png',
      topics: [
        {
          title: 'What is the War Terminal?',
          philosophy: 'The Terminal is a command palette. Structured commands, predictable outputs, zero latency. It\'s not AI. It\'s not natural language. It\'s pure intention made instant.',
          useCase: 'Open with Cmd+K / Ctrl+K (desktop) or floating button (mobile). Guide yourself with autocomplete prompts. Example: "/strike Finish YC application /threat legendary".'
        },
        {
          title: 'Terminal Commands',
          philosophy: 'All commands are immediately available. No unlock tiers. Artificial gating on a palette that maps to existing functionality is redundant complexity.',
          useCase: 'Supported commands include: /strike (create task), /ritual (create habit), /workout (log gym session), /exercise (add sets/reps/rpe), /region (assign coordinate), and /priority.'
        }
      ]
    },
    {
      id: 'guardian',
      label: 'Guardian Angel',
      icon: Sparkles,
      asset: '/bg/bg-region-1.png',
      topics: [
        {
          title: 'What is the Guardian Angel?',
          philosophy: 'Not motivation. Not a cheerleader. The Guardian Angel is a witness who speaks ADHD truth. It appears during execution, validates your neurology, and occasionally asks you to rest.',
          useCase: 'Every 5-15 minutes during task execution, a prophecy appears on screen to align your context. At 200 days, the Angel triggers a letter questioning if you are playing for the number or for actual growth.'
        }
      ]
    },
    {
      id: 'onboarding',
      label: 'Onboarding & Settings',
      icon: Compass,
      asset: '/scroll-roller-top.png',
      topics: [
        {
          title: 'The Doctrine of Will',
          philosophy: 'Before you start, you should know what you\'re walking into. This app is for people who want to execute, not people who want to be managed.',
          useCase: 'On first launch, the app shows the doctrine: "You are here because you\'ve decided something. Not because it\'s easy. Because it matters. The app doesn\'t motivate. It witnesses. It respects your time. Your resistance is not weakness. It\'s signal."'
        },
        {
          title: 'First Operation Tutorial',
          philosophy: 'Don\'t learn buttons. Learn the system. Your first operation should feel sacred, not mechanical.',
          useCase: 'The onboarding leads you through the Doctrine, Region Unlock animation, and interactive gold-button steps to create your first actual task.'
        },
        {
          title: 'What is Personal Mode?',
          philosophy: 'Competition isn\'t for everyone. Some people thrive with friends\' rankings visible. Others find it demoralizing. The app respects both.',
          useCase: 'Toggle Personal Mode ON to hide friends lists and focus entirely on your own metrics, bests, and daily checks.'
        }
      ]
    },
    {
      id: 'payment',
      label: 'Monetization & Bundle',
      icon: CreditCard,
      asset: '/shop-bg.png',
      topics: [
        {
          title: 'What is Ad-Free?',
          philosophy: 'Ads appear only on transition screens—between operations, during loading. Never during execution. Execution is sacred.',
          useCase: 'Remove all banner and full-screen transition ads with a premium subscription.'
        },
        {
          title: 'What are Cosmetics?',
          philosophy: 'Cosmetics are emotional attachment. They don\'t make you stronger. They make the journey feel more personal.',
          useCase: 'Unlock visual variants of your Scythe or region-specific themes that switch visuals and soundscapes simultaneously.'
        },
        {
          title: 'What is the Bundle?',
          philosophy: 'The bundle bundles value. You want ad-free + themes? The bundle costs less than buying them separately.',
          useCase: 'The Genesis Bundle includes 2 cosmetic scythes, 1 region theme, and 1 month of ad-free subscription.'
        }
      ]
    }
  ];

  const handleScrollToFeatures = () => {
    document.getElementById('features-anchor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeChapter = chapters.find(c => c.id === activeTab) || chapters[0];

  return (
    <div className="landing-page-root custom-scrollbar">
      {/* Header */}
      <header className="landing-header">
        <div className="logo-group flex items-center gap-3">
          <img src="/command-core.png" alt="Warscythe Core Logo" className="w-8 h-8 rounded-full border border-gold-core/30 object-cover" />
          <div className="flex flex-col">
            <h1 className="cinzel-title text-base font-bold tracking-[0.25em] text-white leading-none">WARSCYTHE</h1>
            <span className="font-mono text-[7px] text-gold-core/80 tracking-[0.4em] uppercase mt-1">VERSION 1.0 // GENESIS</span>
          </div>
        </div>
        <button className="btn-gothic-gold px-4 py-2 text-[9px] tracking-widest font-mono" onClick={onLaunch}>
          LAUNCH APPLICATION
        </button>
      </header>

      {/* Hero Section */}
      <section className="landing-hero" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.65), rgba(8,8,10,1)), url("/boss-kill/boss-initiate-screen.png")' }}>
        <div className="hero-content text-center max-w-3xl px-6 relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-badge font-mono text-[8px] text-gold-core border border-gold-core/25 px-3 py-1 rounded-full uppercase tracking-[0.25em] mb-4"
          >
            ✦ GENESIS TACTICAL MODULE ✦
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="cinzel-title text-4xl lg:text-5xl font-extrabold tracking-widest text-white leading-tight"
          >
            EMBODY THE SCYTHE.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-mono text-[10px] text-gray-400 max-w-xl uppercase tracking-wider leading-relaxed my-6"
          >
            A high-resistance command center for execution, habits, and body conditioning. We do not motivate. We witness.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-4"
          >
            <button className="btn-gothic-gold px-6 py-3 text-[10px] tracking-widest font-mono" onClick={onLaunch}>
              ENTER SANCTUARY
            </button>
            <button className="btn-gothic-outline px-6 py-3 text-[10px] tracking-widest font-mono" onClick={handleScrollToFeatures}>
              EXPLORE CODEX
            </button>
          </motion.div>
        </div>
        <div className="hero-gradient-overlay" />
      </section>

      {/* Info Block: What is Warscythe */}
      <section className="landing-about px-6 py-16 lg:py-24 border-t border-white/5 bg-[#08080a] relative">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col text-left">
            <span className="font-mono text-[8px] text-gold-core tracking-[0.3em] uppercase mb-2">✦ OPERATIVE DOCTRINE</span>
            <h3 className="cinzel-title text-xl font-bold tracking-widest text-white uppercase mb-4">WHAT IS WARSCYTHE?</h3>
            <p className="font-mono text-[9px] text-gray-400 tracking-wider leading-relaxed uppercase mb-4">
              Warscythe is a tactical command center for execution, focus, and daily habit consistency. It is a tool designed specifically for high-resistance brains that do not need hand-holding or superficial gamification.
            </p>
            <p className="font-mono text-[9px] text-gray-400 tracking-wider leading-relaxed uppercase">
              It treats your goals as campaigns, your habits as daily rituals, and your physical strength as deity progression. It is a permanent archive of your discipline.
            </p>
          </div>
          <div className="about-media rounded border border-white/10 overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            <img src="/bg/bg-region-6.png" alt="Warscythe Core Platform" className="w-full object-cover aspect-video" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] to-transparent opacity-60" />
          </div>
        </div>
      </section>

      {/* Interactive Feature Codex */}
      <section id="features-anchor" className="landing-features px-6 py-16 lg:py-24 border-t border-white/5 bg-[#050507]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-[8px] text-gold-core tracking-[0.3em] uppercase mb-2">✦ THE ARCHIVES OF CONQUEST</span>
            <h3 className="cinzel-title text-2xl font-bold tracking-widest text-white uppercase">SYSTEM CODEX</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {chapters.map(feat => {
                const Icon = feat.icon;
                const isActive = activeTab === feat.id;
                return (
                  <button
                    key={feat.id}
                    onClick={() => setActiveTab(feat.id)}
                    className={`p-3.5 rounded border text-left flex items-start gap-4 transition-all ${
                      isActive 
                        ? 'border-gold-core/40 bg-gold-core/[0.02] shadow-[0_0_15px_rgba(197,160,89,0.03)]' 
                        : 'border-white/5 bg-black/40 hover:border-white/10 hover:bg-black/60'
                    }`}
                  >
                    <Icon className={`mt-0.5 shrink-0 ${isActive ? 'text-gold-core' : 'text-gray-500'}`} size={15} />
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider">{feat.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Display Panel */}
            <div className="lg:col-span-8 border border-white/10 rounded-lg overflow-hidden bg-black/50 shadow-2xl flex flex-col">
              {/* Feature Media */}
              <div className="feature-panel-media w-full aspect-[21/9] overflow-hidden relative border-b border-white/5">
                {activeTab === 'fairies' ? (
                  <div className="w-full h-full flex">
                    <img src="/fairies/empress-9-caged.png" alt="Empress Caged" className="w-1/2 h-full object-cover border-r border-white/5" />
                    <img src="/dragons/dragon-abyssal.png" alt="Dragon Abyssal" className="w-1/2 h-full object-cover" />
                  </div>
                ) : (
                  <img src={activeChapter.asset} alt={activeChapter.label} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80 pointer-events-none" />
              </div>

              {/* Feature Content */}
              <div className="p-6 flex flex-col text-left max-h-[50vh] overflow-y-auto custom-scrollbar">
                <span className="font-mono text-[8px] text-gold-core tracking-[0.25em] uppercase mb-2">CODEX COMPONENT // {activeChapter.label.toUpperCase()}</span>
                
                {activeChapter.topics.map((topic, tIdx) => (
                  <div key={tIdx} className={`flex flex-col ${tIdx > 0 ? 'mt-8 pt-6 border-t border-white/5' : ''}`}>
                    <h4 className="cinzel-title text-sm font-bold text-white tracking-widest uppercase mb-3 flex items-center gap-2">
                      <ChevronRight size={14} className="text-gold-core shrink-0" />
                      {topic.title}
                    </h4>
                    
                    <div className="flex flex-row justify-between items-start gap-4">
                      <div className="flex-1 flex flex-col gap-3 font-mono text-[9px] text-gray-300 tracking-wide leading-relaxed uppercase">
                        <div>
                          <span className="text-gold-core font-bold block mb-1">✦ PHILOSOPHY:</span>
                          <p className="text-gray-400 font-mono pl-3 border-l border-gold-core/20">{topic.philosophy}</p>
                        </div>

                        {topic.useCase && (
                          <div>
                            <span className="text-gold-core font-bold block mb-1">✦ USE CASE / MECHANIC:</span>
                            <p className="text-gray-400 font-mono pl-3 border-l border-white/10">{topic.useCase}</p>
                          </div>
                        )}

                        {topic.details && topic.details.length > 0 && (
                          <div className="mt-2">
                            <span className="text-gold-core font-bold block mb-1">✦ CORE PARAMETERS:</span>
                            <ul className="list-none pl-3 flex flex-col gap-1.5 text-gray-400">
                              {topic.details.map((detail, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-2">
                                  <CheckCircle2 size={9} className="text-gold-core shrink-0 mt-0.5" />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {topic.whyItMatters && (
                          <div className="mt-2 p-3 bg-white/[0.01] border border-white/5 rounded">
                            <span className="text-gold-core font-bold block mb-1">✦ GUIDANCE INTEL:</span>
                            <p className="text-gray-400 font-mono">{topic.whyItMatters}</p>
                          </div>
                        )}
                      </div>
                      
                      {topic.title === 'What is Deity Progression?' && (
                        <img 
                          src="/deity/hermes.png" 
                          alt="Hermes" 
                          className="w-[120px] lg:w-[150px] shrink-0 h-auto object-contain mt-2 opacity-80 filter drop-shadow-[0_0_15px_rgba(197,160,89,0.2)] pointer-events-none" 
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Login Actions */}
      <footer className="landing-footer border-t border-white/5 bg-[#030304] px-6 py-12 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <h3 className="cinzel-title text-base font-bold tracking-widest text-white uppercase mb-2">CLAIM YOUR SECTOR</h3>
          <p className="font-mono text-[8px] text-gray-500 uppercase tracking-widest mb-6">
            Enter the command core and start your campaign.
          </p>

          <div className="flex gap-4 mb-8">
            <button className="btn-gothic-gold px-5 py-2.5 text-[9px] tracking-widest font-mono" onClick={onLaunch}>
              LOG IN
            </button>
            <button className="btn-gothic-outline px-5 py-2.5 text-[9px] tracking-widest font-mono" onClick={onLaunch}>
              SIGN UP
            </button>
          </div>

          <div className="flex gap-6 font-mono text-[7.5px] text-gray-500 uppercase tracking-[0.25em] mb-4">
            <button className="hover:text-gold-core transition-colors" onClick={() => setShowLegal('terms')}>TERMS OF SERVICE</button>
            <span>•</span>
            <button className="hover:text-gold-core transition-colors" onClick={() => setShowLegal('privacy')}>PRIVACY POLICY</button>
          </div>

          <p className="font-mono text-[7px] text-gray-600 uppercase tracking-wider">
            © 2026 WARSCYTHE COMMAND SYSTEM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* Legal Overlay Modal */}
      <AnimatePresence>
        {showLegal && (
          <div className="modal-backdrop legal-backdrop flex items-center justify-center p-6" onClick={() => setShowLegal(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl border border-white/10 rounded-lg p-6 bg-[#08080a] flex flex-col max-h-[80vh] overflow-hidden"
              style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.92), rgba(0,0,0,0.98)), url("/shop-bg.png")', backgroundSize: 'cover' }}
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <Scale className="text-gold-core" size={16} />
                  <span className="cinzel-title text-sm font-bold text-white tracking-widest uppercase">
                    {showLegal === 'terms' ? 'TERMS OF SERVICE' : 'PRIVACY POLICY'}
                  </span>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors" onClick={() => setShowLegal(null)}>
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[8px] text-gray-400 tracking-wide uppercase leading-relaxed text-left flex flex-col gap-4 pr-2">
                {showLegal === 'terms' ? (
                  <>
                    <h5 className="text-white font-bold text-[9px] tracking-wider">1. TERMS OF USE</h5>
                    <p>Welcome to Warscythe. By entering the platform, you commit to our Operative Doctrine. The platform acts as a tactical command interface to witness your real-world campaigns and habits. You are solely responsible for executing your goals.</p>
                    
                    <h5 className="text-white font-bold text-[9px] tracking-wider">2. NO FITNESS OR MEDICAL ADVICE</h5>
                    <p>Fitness Deity features measure training volume (accumulated weight) for narrative milestone purposes. We do not provide physical therapy, medical diagnoses, or personal training instruction. Consult a professional before lifting heavy weights.</p>
                    
                    <h5 className="text-white font-bold text-[9px] tracking-wider">3. USER ACCOUNTS & ENTITLEMENTS</h5>
                    <p>Your data is stored securely using Supabase. Paid theme cosmetics, skins, or ad-free packages are linked to your authenticated account. Cheating regional progress via manual command exploits ruins your own cognitive journey; the system assumes you act with honor.</p>
                  </>
                ) : (
                  <>
                    <h5 className="text-white font-bold text-[9px] tracking-wider">1. DATA HARVESTING DECREE</h5>
                    <p>We respect your privacy. Warscythe operates on a secure Supabase cloud foundation. We store your account details, streak levels, logged workouts, active campaigns, and collected artifact tokens.</p>
                    
                    <h5 className="text-white font-bold text-[9px] tracking-wider">2. MONETIZATION & ADSENSE DATA</h5>
                    <p>For non-premium browser clients, Google AdSense Auto Ads are dynamically integrated. Google may use cookies to serve personalized ads based on your visits to this and other websites. Premium accounts dismiss all tracking and ad modules.</p>
                    
                    <h5 className="text-white font-bold text-[9px] tracking-wider">3. CLIENT-SIDE CACHING</h5>
                    <p>To enable lag-free offline operations, game assets (soundscapes, theme variants, map segments) are stored locally using the browser's Cache Storage API. You have the right to purge these files at any time via the Cache Manager.</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .landing-page-root {
          width: 100%;
          min-height: 100vh;
          background-color: #08080a;
          color: #fff;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .landing-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 65px;
          background: rgba(8, 8, 10, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          z-index: 1000;
        }

        .landing-hero {
          height: 100vh;
          width: 100%;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding-top: 65px;
        }

        .hero-gradient-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, transparent 30%, rgba(8,8,10,1) 100%);
          z-index: 1;
        }

        .btn-gothic-gold {
          background: var(--gold-core);
          color: #000;
          border: 1px solid var(--gold-core);
          font-weight: bold;
          transition: all 0.3s ease;
          border-radius: 2px;
          cursor: pointer;
        }

        .btn-gothic-gold:hover {
          background: #fff;
          border-color: #fff;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }

        .btn-gothic-outline {
          background: transparent;
          color: #c5a059;
          border: 1px solid rgba(197, 160, 89, 0.4);
          transition: all 0.3s ease;
          border-radius: 2px;
          cursor: pointer;
        }

        .btn-gothic-outline:hover {
          color: #fff;
          border-color: #fff;
          background: rgba(255, 255, 255, 0.02);
        }

        .about-media {
          box-shadow: 0 20px 40px rgba(0,0,0,0.8);
        }

        .cinzel-title {
          font-family: 'Cinzel Decorative', 'Cinzel', serif;
        }

        .legal-backdrop {
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 2200;
        }

        /* Webkit scrollbar for custom styling inside panels */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(197, 160, 89, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 160, 89, 0.6);
        }
      `}</style>
    </div>
  );
}
