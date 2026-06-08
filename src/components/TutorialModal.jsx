import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Compass, Scroll, Crosshair, Award } from 'lucide-react';
import { useWarscytheStore } from '../store/useWarscytheStore';

export default function TutorialModal() {
  const { 
    hasCompletedTutorial, 
    tutorialStep, 
    setTutorialStep, 
    completeTutorial 
  } = useWarscytheStore();

  if (hasCompletedTutorial || tutorialStep === 'completed') return null;

  // Render Fullscreen Backdrop Modal (Lore Drop & Region Unlock)
  if (tutorialStep === 'not_started' || tutorialStep === 'region_unlock') {
    return (
      <div className="tutorial-backdrop">
        <motion.div 
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
          ) : (
            // Screen 2: First Region Unlock
            <div className="flex flex-col gap-6">
              <div className="tutorial-header">
                <span className="panel-tag font-mono text-[9px] text-gold-core">TACTICAL REPORT // ACTIVE SECTOR</span>
              </div>

              <div className="tutorial-body">
                <div className="tutorial-icon-box">
                  <Compass size={36} className="text-gold-core" />
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
          )}
        </motion.div>

        <style jsx>{`
          .tutorial-backdrop {
            position: fixed; inset: 0; background: rgba(5, 5, 6, 0.96); backdrop-filter: blur(16px);
            display: flex; align-items: center; justify-content: center; z-index: 3000; padding: 1.5rem;
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
          }
          .tutorial-icon-box {
            width: 70px; height: 70px; border-radius: 50%; border: 1px solid rgba(197, 160, 89, 0.15);
            display: flex; align-items: center; justify-content: center;
            background: rgba(197, 160, 89, 0.03); margin-bottom: 0.5rem;
          }
          .tutorial-slide-title {
            font-family: var(--font-display); font-size: 1.35rem; color: #fff;
            letter-spacing: 0.15em; text-align: center; margin: 0;
          }
          .tutorial-lore-text {
            max-height: 220px; overflow-y: auto; text-align: left;
            display: flex; flex-direction: column; gap: 0.8rem; padding-right: 0.5rem;
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
      stepIcon = <Compass size={18} className="text-gold-core animate-spin" style={{ animationDuration: '6s' }} />;
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
