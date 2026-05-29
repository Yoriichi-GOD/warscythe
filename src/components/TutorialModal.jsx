import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Compass, ShieldAlert, Award, Heart } from 'lucide-react';
import { useWarscytheStore } from '../store/useWarscytheStore';

export default function TutorialModal() {
  const { hasCompletedTutorial, completeTutorial } = useWarscytheStore();
  const [slide, setSlide] = useState(0);

  if (hasCompletedTutorial) return null;

  const slides = [
    {
      title: "WELCOME TO THE WAR COUNCIL",
      icon: <BookOpen size={48} className="text-gold-core" />,
      desc: "Warscythe is a high-stakes operational dashboard built to harness raw focus and ADHD hyper-drive. Here, daily tasks are treated as tactical strikes, and habits are daily rituals.",
      points: [
        "Earn digital coins for deploying and executing operations.",
        "Maintain streaks to upgrade your rank and title.",
        "Face boss raid operations to unlock mythic artifacts."
      ]
    },
    {
      title: "THE CAMPAIGN THEATER",
      icon: <Compass size={48} className="text-gold-core" />,
      desc: "The Quest Map tracks your daily conquest of goals. Completing operations moves you through mysterious, procedurally mapped territories.",
      points: [
        "The routes and locked pathways shift dynamically every single day.",
        "Unlock hidden lore fragments by completing tasks.",
        "Unlock legendary volcanic nodes for boss raids."
      ]
    },
    {
      title: "SCYTHE SHOP & CUSTOM THEMES",
      icon: <Award size={48} className="text-gold-core" />,
      desc: "Earn coins through consistent, focused execution. Spend them in the Armory to customize your scythe or unlock custom glow visual themes.",
      points: [
        "Scythe levels represent daily points weight and reset at 5 AM.",
        "Purchase elite cosmetics early using digital coins.",
        "Priority level adjustments change the entire glow accent of your dashboard."
      ]
    },
    {
      title: "THE FINAL DOCTRINE: BALANCE",
      icon: <Heart size={48} className="text-gold-core" />,
      desc: "Relentless execution is a weapon, but hyper-focus can blind you to the world around you. We have built safeguards to protect your mental health.",
      points: [
        "Your scythe level resets to dormant every day at 5 AM—pace yourself.",
        "Streak count alerts act as check-ins.",
        "At 200 days, the Royal Decree will lock focus to check in on your mental well-being."
      ]
    }
  ];

  const current = slides[slide];

  return (
    <div className="tutorial-backdrop">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="tutorial-modal glass-panel"
      >
        <div className="tutorial-header">
          <span className="panel-tag font-mono text-[9px] text-gold-core">TACTICAL ONBOARDING // SLIDE {slide + 1} OF 4</span>
          <button className="skip-btn" onClick={completeTutorial}>
            SKIP TUTORIAL <X size={12} className="ml-1" />
          </button>
        </div>

        <div className="tutorial-body">
          <div className="tutorial-icon-box">
            {current.icon}
          </div>
          <h2 className="tutorial-slide-title">{current.title}</h2>
          <p className="tutorial-slide-desc">{current.desc}</p>

          <div className="tutorial-points">
            {current.points.map((p, idx) => (
              <div key={idx} className="tutorial-point-item">
                <span className="bullet">✦</span>
                <p className="point-text">{p}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="tutorial-footer">
          <div className="slide-dots">
            {slides.map((_, idx) => (
              <div key={idx} className={`slide-dot ${slide === idx ? 'active' : ''}`} />
            ))}
          </div>

          <div className="flex gap-3">
            {slide > 0 && (
              <button className="tutorial-nav-btn secondary" onClick={() => setSlide(s => s - 1)}>
                PREVIOUS
              </button>
            )}
            
            {slide < slides.length - 1 ? (
              <button className="tutorial-nav-btn primary" onClick={() => setSlide(s => s + 1)}>
                NEXT PROTOCOL
              </button>
            ) : (
              <button className="tutorial-nav-btn primary complete" onClick={completeTutorial}>
                INITIALIZE COMMAND
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .tutorial-backdrop {
          position: fixed; inset: 0; background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center; z-index: 3000; padding: 1rem;
        }

        .tutorial-modal {
          max-width: 480px; width: 100%; border: 1px solid rgba(197, 160, 89, 0.25);
          padding: 2.5rem; background: rgba(8, 8, 10, 0.98);
          box-shadow: 0 0 50px rgba(197, 160, 89, 0.1), inset 0 0 30px rgba(0,0,0,0.9);
          border-radius: 8px; display: flex; flex-direction: column; gap: 2rem;
        }

        .tutorial-header {
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 0.8rem;
        }

        .skip-btn {
          font-family: var(--font-mono); font-size: 0.6rem; font-weight: 900;
          color: var(--text-dim); display: flex; align-items: center; transition: 0.2s;
        }
        .skip-btn:hover { color: #fff; }

        .tutorial-body {
          display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;
        }

        .tutorial-icon-box {
          width: 80px; height: 80px; border-radius: 50%; border: 1px solid rgba(197, 160, 89, 0.2);
          display: flex; align-items: center; justify-content: center;
          background: rgba(197, 160, 89, 0.04); margin-bottom: 0.5rem;
          box-shadow: inset 0 0 15px rgba(197, 160, 89, 0.05);
        }

        .tutorial-slide-title {
          font-family: var(--font-display); font-size: 1.25rem; color: #fff;
          letter-spacing: 0.15em; margin: 0;
        }

        .tutorial-slide-desc {
          font-size: 0.75rem; color: var(--text-dim); line-height: 1.6; margin: 0;
        }

        .tutorial-points {
          display: flex; flex-direction: column; gap: 0.6rem; width: 100%; text-align: left;
          background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 4px; padding: 1.2rem; margin-top: 1rem;
        }

        .tutorial-point-item {
          display: flex; gap: 0.75rem; align-items: flex-start;
        }

        .bullet {
          color: var(--gold-core); font-size: 0.7rem; margin-top: 0.1rem;
        }

        .point-text {
          font-family: var(--font-mono); font-size: 0.65rem; color: #fff; line-height: 1.5; margin: 0;
        }

        .tutorial-footer {
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 1.2rem;
        }

        .slide-dots {
          display: flex; gap: 0.5rem;
        }

        .slide-dot {
          width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.1);
          transition: 0.2s;
        }
        .slide-dot.active {
          background: var(--gold-core); transform: scale(1.3);
          box-shadow: 0 0 8px var(--gold-core);
        }

        .tutorial-nav-btn {
          font-family: var(--font-mono); font-size: 0.65rem; font-weight: 900;
          letter-spacing: 0.1em; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer;
          transition: 0.2s;
        }

        .tutorial-nav-btn.primary {
          background: var(--gold-core); border: 1px solid var(--gold-bright); color: #000;
        }
        .tutorial-nav-btn.primary:hover {
          background: var(--gold-bright); transform: translateY(-1px);
        }
        .tutorial-nav-btn.primary.complete {
          background: #10b981; border-color: #34d399; color: #fff;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
        }
        .tutorial-nav-btn.primary.complete:hover {
          background: #059669;
        }

        .tutorial-nav-btn.secondary {
          background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-dim);
        }
        .tutorial-nav-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.05); color: #fff;
        }
      `}</style>
    </div>
  );
}
