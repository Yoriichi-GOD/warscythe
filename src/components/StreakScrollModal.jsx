import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { Heart, Scroll } from 'lucide-react';

export default function StreakScrollModal() {
  const { streakCount } = useWarscytheStore();
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [c3, setC3] = useState(false);
  const [c4, setC4] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Render modal only at exactly 200 streak (or when manually triggered / testing at 200)
  if (streakCount !== 200 || dismissed) return null;

  const allChecked = c1 && c2 && c3 && c4;

  return (
    <div className="scroll-backdrop">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="scroll-decree-container"
      >
        {/* Parchment Scroll Visual Elements */}
        <div className="scroll-wooden-roller top">
          <div className="knob left"></div>
          <div className="roller-bar"></div>
          <div className="knob right"></div>
        </div>

        <div className="parchment-body custom-scrollbar">
          <div className="decree-header">
            <Scroll size={28} className="text-gold-core mb-2" />
            <h1 className="decree-title font-display">ROYAL DECREE</h1>
            <span className="decree-subtitle font-mono">SANITY RECKONING // LEVEL 200 STREAK</span>
          </div>

          <div className="decree-divider"></div>

          <div className="decree-content font-mono">
            <p>
              Executor, you have stood in the crucible for two hundred days. You have automized your rituals, decimated resistance levels, and stood immovable.
            </p>
            <p>
              But stop and listen. In the search of absolute execution, you risk becoming iron. Hardened, yes, but cold. Stagnant. Emotionally numb. 
            </p>
            <p>
              Winning JEE percentiles or getting Play Store approvals are empty victories if they strip away your capacity to smile, to rest, or to share joy with the people around you. Distractions are obstacles, but the people who love you are not. Do not let the grind consume your humanity.
            </p>
            <p className="highlight-text font-bold italic text-gold-bright text-center">
              "A warscythe is a tool to carve a path, not a cage to trap the reaper."
            </p>
          </div>

          <div className="decree-divider"></div>

          <div className="decree-checkboxes flex flex-col gap-3 my-4">
            <label className="checkbox-item flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={c1} onChange={() => setC1(!c1)} />
              <span className="checkbox-label text-[10px] font-mono leading-relaxed">
                I have spoken to a friend or family member in the past week, and I did not talk about work or schedules.
              </span>
            </label>
            <label className="checkbox-item flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={c2} onChange={() => setC2(!c2)} />
              <span className="checkbox-label text-[10px] font-mono leading-relaxed">
                I acknowledge that a project approval is a mile marker, but not a replacement for connection.
              </span>
            </label>
            <label className="checkbox-item flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={c3} onChange={() => setC3(!c3)} />
              <span className="checkbox-label text-[10px] font-mono leading-relaxed">
                I am executing this sprint to build a future, not to escape my present.
              </span>
            </label>
            <label className="checkbox-item flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={c4} onChange={() => setC4(!c4)} />
              <span className="checkbox-label text-[10px] font-mono leading-relaxed">
                I will close my computer and take a 1-hour active break today to connect with reality.
              </span>
            </label>
          </div>

          <button 
            className="btn-decree-dismiss"
            disabled={!allChecked}
            onClick={() => setDismissed(true)}
          >
            <Heart size={14} className="mr-1.5" />
            <span>DISMISS DECREE & RESUME CONQUEST</span>
          </button>
        </div>

        <div className="scroll-wooden-roller bottom">
          <div className="knob left"></div>
          <div className="roller-bar"></div>
          <div className="knob right"></div>
        </div>
      </motion.div>

      <style jsx>{`
        .scroll-backdrop {
          position: fixed; inset: 0; background: rgba(0, 0, 0, 0.97); backdrop-filter: blur(15px);
          display: flex; align-items: center; justify-content: center; z-index: 5000; padding: 2rem 1rem;
        }

        .scroll-decree-container {
          max-width: 460px; width: 100%; display: flex; flex-direction: column; position: relative;
        }

        .scroll-wooden-roller {
          display: flex; align-items: center; width: 100%; z-index: 10;
        }
        .scroll-wooden-roller.top { transform: translateY(5px); }
        .scroll-wooden-roller.bottom { transform: translateY(-5px); }

        .roller-bar {
          flex: 1; height: 12px; background: linear-gradient(180deg, #5d4037 0%, #3e2723 100%);
          border-radius: 6px; border: 1px solid #795548;
        }
        .knob {
          width: 14px; height: 24px; background: #8d6e63; border-radius: 4px; border: 1px solid #a1887f;
        }

        .parchment-body {
          background: #171512;
          border-left: 2px solid #5d4037;
          border-right: 2px solid #5d4037;
          padding: 2.5rem 2rem;
          max-height: 75vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.9), 0 10px 40px rgba(0,0,0,0.8);
          border-radius: 2px;
        }

        .decree-header {
          display: flex; flex-direction: column; align-items: center; text-align: center;
        }

        .decree-title {
          font-size: 1.5rem; color: var(--gold-core); letter-spacing: 0.3em; margin: 0;
          text-shadow: 0 0 10px rgba(197,160,89,0.3);
        }

        .decree-subtitle {
          font-size: 0.55rem; color: var(--text-dim); letter-spacing: 0.25em; margin-top: 0.5rem;
        }

        .decree-divider {
          height: 1px; background: linear-gradient(90deg, transparent, #5d4037 50%, transparent);
          width: 100%;
        }

        .decree-content {
          font-size: 0.72rem; color: #a1887f; line-height: 1.7; display: flex; flex-direction: column; gap: 1rem;
        }

        .highlight-text {
          color: var(--gold-bright);
        }

        .decree-checkboxes {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(93, 64, 55, 0.2);
          border-radius: 4px;
          padding: 1.2rem;
        }

        .checkbox-item {
          display: flex; align-items: flex-start;
        }

        .checkbox-item input[type="checkbox"] {
          margin-top: 2px;
          accent-color: var(--gold-core);
          cursor: pointer;
        }

        .checkbox-label {
          color: #8d6e63;
        }

        .btn-decree-dismiss {
          width: 100%; height: 48px; border-radius: 4px;
          font-family: var(--font-mono); font-size: 0.7rem; font-weight: 900;
          letter-spacing: 0.1em; text-transform: uppercase;
          background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981;
          color: #10b981; cursor: pointer; transition: 0.3s;
          display: flex; align-items: center; justify-content: center;
        }
        .btn-decree-dismiss:disabled {
          opacity: 0.3; cursor: not-allowed; border-color: rgba(93, 64, 55, 0.3); color: #8d6e63;
          background: transparent;
        }
        .btn-decree-dismiss:hover:not(:disabled) {
          background: #10b981; color: #fff;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
        }
      `}</style>
    </div>
  );
}
