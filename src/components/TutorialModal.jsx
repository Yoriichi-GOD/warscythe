import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Compass, Scroll, Crosshair, Award, Sparkles, ShieldAlert, CheckCircle } from 'lucide-react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import RegionFlashScreen from './RegionFlashScreen';

export default function TutorialModal() {
  const hasCompletedTutorial = useWarscytheStore(state => state.hasCompletedTutorial);
  const tutorialStep = useWarscytheStore(state => state.tutorialStep);
  const setTutorialStep = useWarscytheStore(state => state.setTutorialStep);
  const completeTutorial = useWarscytheStore(state => state.completeTutorial);

  const [introStage, setIntroStage] = useState(1);

  useEffect(() => {
    if (tutorialStep === 'fairy_intro') {
      setIntroStage(1);
    }
  }, [tutorialStep]);

  if (hasCompletedTutorial || tutorialStep === 'completed') return null;

  // Render Fullscreen Backdrop Modal (Lore Drop, Region Unlock, & Fairy Intro)
  if (tutorialStep === 'not_started' || tutorialStep === 'region_unlock' || tutorialStep === 'fairy_intro') {
    return (
      <div className={`tutorial-backdrop ${tutorialStep === 'fairy_intro' ? 'fairy-backdrop' : ''}`}>
        <AnimatePresence mode="wait">
          {tutorialStep === 'fairy_intro' && introStage === 2 ? (
            <motion.div 
              key="stage2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fullscreen-black-cinematic"
            >
              <h1 className="cinematic-title-glowing font-display uppercase">
                your journey begins here... <br />
                <span className="text-gold-core">scythe warrior</span>
              </h1>
              
              <div className="cinematic-footer">
                <button 
                  className="tutorial-nav-btn primary continue-bottom-left" 
                  onClick={() => setIntroStage(3)}
                >
                  CONTINUE
                </button>
              </div>
            </motion.div>
          ) : tutorialStep === 'fairy_intro' && introStage === 3 ? (
            <RegionFlashScreen
              key="region-flash-stage3"
              type="entry"
              regionData={{ mapIndex: 1 }}
              onClose={completeTutorial}
            />
          ) : (
            <motion.div 
              key="main-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="tutorial-modal glass-panel"
            >
              {tutorialStep === 'not_started' ? (
                // Screen 1: The Narrative Entry (Full Lore Drop)
                <div className="flex flex-col gap-6">
                  <div className="tutorial-header">
                    <span className="panel-tag font-mono text-[9px] text-gold-core">COMMAND ARCHIVE // DOCTRINE OF WILL</span>
                  </div>
                  
                  <div className="tutorial-body">
                    <div className="tutorial-icon-box">
                      <BookOpen size={36} className="text-gold-core" />
                    </div>
                    <h2 className="tutorial-slide-title">THE DOCTRINE OF WILL</h2>
                    <div className="tutorial-lore-text custom-scrollbar">
                      <p>Most productivity tools treat you like a machine. They show you numbers, graphs, and daily streaks. Numbers don’t build determination — they build anxiety.</p>
                      <p>In <strong>Warscythe</strong>, your discipline takes physical form. Every completed task is a strike that alters the world itself. You do not simply check off boxes; you rescue what was lost.</p>
                      <p>Long ago, an ancient war scattered the Fairy Empresses — fragments of divine will — across the dark realms. Imprisoned in desolate keeps by legendary dragons, they wait for a warrior of action.</p>
                      <p>Deploy operations to earn keys. Unlock their cages, free the land, and claim the ancient relics. Your journey begins now.</p>
                    </div>
                  </div>

                  <div className="tutorial-footer flex justify-between items-center mt-4">
                    <button className="skip-btn-muted" onClick={completeTutorial}>
                      SKIP ONBOARDING
                    </button>
                    <button 
                      className="tutorial-nav-btn primary" 
                      onClick={() => setTutorialStep('region_unlock')}
                    >
                      CONTINUE REGIONAL ANALYSIS
                    </button>
                  </div>
                </div>
              ) : tutorialStep === 'region_unlock' ? (
                // Screen 2: First Region Unlock
                <div className="flex flex-col gap-6">
                  <div className="tutorial-header">
                    <span className="panel-tag font-mono text-[9px] text-gold-core">TACTICAL REPORT // ACTIVE SECTOR</span>
                  </div>

                  <div className="tutorial-body">
                    <div className="region-bg-circle">
                      <img src="/bg/bg-region-1.png" alt="The Threshold" className="region-bg-img" />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-mono text-gold-core/60 tracking-[0.3em] uppercase block mb-1">REGION 1 UNLOCKED</span>
                      <h2 className="tutorial-slide-title !text-lg">THE THRESHOLD</h2>
                      <span className="text-[9px] font-mono text-red-500 tracking-widest uppercase block mt-1">MALGRATH THE DREAD RULES</span>
                    </div>

                    <div className="tutorial-lore-text text-center !text-gray-400">
                      <p>Empress Dryad of Ashwood is bound in thorns at the gateway. Her imprisonment has withered the ancient forest. You must collect 5 keys to open her cage and reclaim the land.</p>
                      <p className="text-gold-core/80 mt-2 font-mono text-[10px] tracking-wider uppercase">"She is waiting, Commander. You are her only hope."</p>
                    </div>
                  </div>

                  <div className="tutorial-footer flex justify-between items-center mt-4">
                    <button className="skip-btn-muted" onClick={completeTutorial}>
                      SKIP ONBOARDING
                    </button>
                    <button 
                      className="tutorial-nav-btn primary" 
                      onClick={() => setTutorialStep('map_guide')}
                    >
                      INITIALIZE STRIKE INTERFACE
                    </button>
                  </div>
                </div>
              ) : (
                // Screen 3: Captured Fairy Intro (fairy_intro Stage 1)
                <div className="flex flex-col gap-6 w-full items-center">
                  <div className="tutorial-header w-full">
                    <span className="panel-tag font-mono text-[9px] text-gold-core">REGIONAL INTEL // ACTIVE IMPRISONMENT</span>
                  </div>
                  
                  <div className="tutorial-body w-full flex flex-col items-center">
                    <div className="empress-caged-container">
                      <img src="/fairies/empress-1-caged.png" alt="Empress Dryad Caged" className="empress-caged-img" />
                      <div className="cage-vignette" />
                    </div>
                    
                    <div className="text-center mt-4">
                      <span className="text-[10px] font-mono text-gold-core/60 tracking-[0.3em] uppercase block mb-1">THE CAPTURED FAIRY</span>
                      <h2 className="tutorial-slide-title !text-lg">EMPRESS DRYAD OF ASHWOOD</h2>
                      <span className="text-[9px] font-mono text-red-500 tracking-widest uppercase block mt-1">MALGRATH'S THORN CAGE</span>
                    </div>

                    <div className="tutorial-lore-text text-center !text-gray-400 max-h-[150px] overflow-y-auto">
                      <p>The Dryad Empress of Ashwood is bound at the gateway. Her imprisonment has withered the ancient forest. You must collect 5 keys to open her cage and reclaim the land.</p>
                      <p className="text-gold-core/80 mt-2 font-mono text-[10px] tracking-wider uppercase">"Only your completed operations can shatter her chains."</p>
                    </div>
                  </div>

                  <div className="tutorial-footer flex justify-end items-center mt-4 w-full">
                    <button 
                      className="tutorial-nav-btn primary" 
                      onClick={() => setIntroStage(2)}
                    >
                      CONFRONT REALM
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx>{`
          .tutorial-backdrop {
            position: fixed; inset: 0; background: rgba(5, 5, 6, 0.96); backdrop-filter: blur(16px);
            display: flex; align-items: center; justify-content: center; z-index: 3000; padding: 1.5rem;
          }
          .tutorial-backdrop.fairy-backdrop {
            background: radial-gradient(circle, rgba(5,5,6,0.92) 0%, rgba(0,0,0,0.98) 100%), url('/bg/bg-region-1.png');
            background-size: cover;
            background-position: center;
            background-blend-mode: multiply;
          }
          .tutorial-modal {
            max-width: 520px; width: 100%; border: 1px solid rgba(197, 160, 89, 0.2);
            padding: 2.5rem; background: rgba(8, 8, 10, 0.99);
            box-shadow: 0 0 50px rgba(197, 160, 89, 0.15), inset 0 0 30px rgba(0,0,0,0.9);
            border-radius: 8px; display: flex; flex-direction: column;
          }
          .tutorial-header {
            border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 0.8rem;
          }
          .tutorial-body {
            display: flex; flex-direction: column; align-items: center; gap: 1rem;
            width: 100%;
          }
          .tutorial-icon-box {
            width: 70px; height: 70px; border-radius: 50%; border: 1px solid rgba(197, 160, 89, 0.15);
            display: flex; align-items: center; justify-content: center;
            background: rgba(197, 160, 89, 0.03); margin-bottom: 0.5rem;
          }
          .region-bg-circle {
            width: 100px; height: 100px; border-radius: 50%;
            border: 2px solid var(--gold-core);
            box-shadow: 0 0 25px rgba(197, 160, 89, 0.5);
            overflow: hidden; display: flex; align-items: center; justify-content: center;
            background: #000; margin-bottom: 0.5rem;
            animation: circlePulse 3s infinite ease-in-out;
          }
          .region-bg-img {
            width: 100%; height: 100%; object-fit: cover;
            animation: regionZoom 6s ease-in-out infinite;
          }
          .empress-caged-container {
            position: relative; width: 120px; height: 120px; border-radius: 8px;
            border: 1px solid rgba(231, 76, 60, 0.3); overflow: hidden;
            box-shadow: 0 0 20px rgba(231, 76, 60, 0.15);
          }
          .empress-caged-img {
            width: 100%; height: 100%; object-fit: cover;
          }
          .cage-vignette {
            position: absolute; inset: 0;
            background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%);
            border: 2px solid rgba(231, 76, 60, 0.2);
          }
          .tutorial-slide-title {
            font-family: var(--font-display); font-size: 1.35rem; color: #fff;
            letter-spacing: 0.15em; text-align: center; margin: 0;
          }
          .tutorial-lore-text {
            max-height: 220px; overflow-y: auto; text-align: left;
            display: flex; flex-direction: column; gap: 0.8rem; padding-right: 0.5rem;
            width: 100%;
          }
          .tutorial-lore-text p {
            font-size: 0.78rem; color: var(--text-dim); line-height: 1.7; margin: 0;
          }
          .tutorial-footer {
            border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 1.2rem;
          }
          .skip-btn-muted {
            font-family: var(--font-mono); font-size: 0.65rem; font-weight: 700;
            color: rgba(255, 255, 255, 0.25); tracking: 0.1em; transition: 0.2s;
          }
          .skip-btn-muted:hover {
            color: rgba(255, 255, 255, 0.6);
          }
          .tutorial-nav-btn {
            font-family: var(--font-mono); font-size: 0.68rem; font-weight: 900;
            letter-spacing: 0.1em; padding: 0.7rem 1.4rem; border-radius: 4px; cursor: pointer;
            transition: 0.2s;
          }
          .tutorial-nav-btn.primary {
            background: var(--gold-core); border: 1px solid var(--gold-bright); color: #000;
            box-shadow: 0 0 15px rgba(197, 160, 89, 0.15);
          }
          .tutorial-nav-btn.primary:hover {
            background: var(--gold-bright); transform: translateY(-1px);
            box-shadow: 0 0 20px rgba(197, 160, 89, 0.25);
          }
          
          /* Cinematic Stage 2 Styles */
          .fullscreen-black-cinematic {
            position: fixed; inset: 0; background: #000;
            display: flex; align-items: center; justify-content: center; z-index: 3100;
          }
          .cinematic-title-glowing {
            font-size: 1.5rem; color: #fff; letter-spacing: 0.25em; text-align: center;
            line-height: 2; text-shadow: 0 0 10px rgba(197, 160, 89, 0.4), 0 0 20px rgba(197, 160, 89, 0.2);
            animation: glowPulse 3s infinite ease-in-out;
            padding: 2rem;
          }
          .cinematic-footer {
            position: absolute; bottom: 3rem; left: 3rem;
          }
          .continue-bottom-left {
            background: #000 !important;
            border: 1px solid var(--gold-core) !important;
            color: var(--gold-core) !important;
          }
          .continue-bottom-left:hover {
            background: var(--gold-core) !important;
            color: #000 !important;
          }

          @keyframes circlePulse {
            0%, 100% { box-shadow: 0 0 15px rgba(197, 160, 89, 0.3); transform: scale(1); }
            50% { box-shadow: 0 0 30px rgba(197, 160, 89, 0.7); transform: scale(1.05); }
          }
          @keyframes regionZoom {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.25); }
          }
          .region-bg-circle-mini {
            width: 24px; height: 24px; border-radius: 50%;
            border: 1px solid var(--gold-core);
            box-shadow: 0 0 10px rgba(197, 160, 89, 0.5);
            overflow: hidden; display: flex; align-items: center; justify-content: center;
            background: #000;
            animation: circlePulse 3s infinite ease-in-out;
          }
          @keyframes glowPulse {
            0%, 100% { opacity: 0.8; text-shadow: 0 0 10px rgba(197, 160, 89, 0.4), 0 0 20px rgba(197, 160, 89, 0.2); }
            50% { opacity: 1; text-shadow: 0 0 20px rgba(197, 160, 89, 0.8), 0 0 40px rgba(197, 160, 89, 0.4); }
          }
        `}</style>
      </div>
    );
  }

  // Render Floating Guide Tooltips (Interactive Navigation Steps)
  let stepTitle = "";
  let stepText = "";
  let stepInstruction = "";
  let stepIcon = null;

  switch (tutorialStep) {
    case 'map_guide':
      stepTitle = "THE THEATER OF WAR";
      stepText = "The Quest Map displays the active regional battlefield. Here you can inspect local keeps and the caged Empress.";
      stepInstruction = "Click QUEST MAP in the navigation bar to inspect the battleground.";
      stepIcon = (
        <div className="region-bg-circle-mini shrink-0">
          <img src="/bg/bg-region-1.png" alt="Region" className="region-bg-img" />
        </div>
      );
      break;
    case 'ops_guide':
      stepTitle = "REGIONAL INTELLIGENCE";
      stepText = "This map displays your progress. Return to your primary console to prepare your tasks.";
      stepInstruction = "Click OPERATIONS in the navigation bar to return.";
      stepIcon = <Crosshair size={18} className="text-gold-core" />;
      break;
    case 'ledger_guide':
      stepTitle = "THE COMMAND JOURNAL";
      stepText = "The Ledger vault permanently stores your rescued fairy fragments, trophies, and relics.";
      stepInstruction = "Click LEDGER in the navigation bar to inspect the vault.";
      stepIcon = <Scroll size={18} className="text-gold-core" />;
      break;
    case 'task_creation_prompt':
      stepTitle = "THE VAULT IS DORMANT";
      stepText = "Your vault is currently empty. Let's return and set up your first active strike.";
      stepInstruction = "Click OPERATIONS in the navigation bar to return.";
      stepIcon = <Award size={18} className="text-gold-core" />;
      break;
    case 'task_creation':
      stepTitle = "DEPLOY AN OPERATION";
      stepText = "Set up your first task (Operation) to deploy your strike. Every completed task unlocks a key to the cage.";
      stepInstruction = "Click '+ INITIATE STRIKE' on the operations panel.";
      stepIcon = <Crosshair size={18} className="text-gold-core animate-pulse" />;
      break;
    case 'task_modal_open':
    case 'click_task':
    case 'validate_execution':
    case 'reality_check':
    case 'scratch_card':
      return null; // pointers are shown inline in their respective components
    default:
      return null;
  }

  return (
    <div className="tutorial-floating-container">
      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="tutorial-floating-card glass-panel"
      >
        <div className="card-header flex items-center gap-2 mb-2">
          {stepIcon}
          <span className="text-[10px] font-display text-white tracking-[0.2em] uppercase">{stepTitle}</span>
        </div>
        <p className="card-desc text-[11px] text-gray-400 leading-relaxed mb-3">{stepText}</p>
        
        <div className="card-instruction p-2.5 rounded bg-gold-core/5 border border-gold-core/25">
          <p className="text-[9px] font-mono text-gold-core tracking-wider uppercase font-bold text-center">
            {stepInstruction}
          </p>
        </div>

        <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
          <button className="skip-btn-muted !text-[8px]" onClick={completeTutorial}>
            SKIP TUTORIAL
          </button>
          <span className="font-mono text-[8px] text-gray-600">ACTIVE GUIDANCE MODE</span>
        </div>
      </motion.div>

      <style jsx>{`
        .tutorial-floating-container {
          position: fixed; bottom: 85px; right: 24px; z-index: 2500; max-width: 320px; width: calc(100vw - 48px);
        }
        .tutorial-floating-card {
          padding: 1.25rem; background: rgba(8, 8, 10, 0.98);
          border: 1px solid rgba(197, 160, 89, 0.3);
          box-shadow: 0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(197, 160, 89, 0.08);
          border-radius: 6px;
        }
        .skip-btn-muted {
          font-family: var(--font-mono); font-size: 0.65rem; font-weight: 700;
          color: rgba(255, 255, 255, 0.25); tracking: 0.1em; transition: 0.2s;
        }
        .skip-btn-muted:hover {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
}
