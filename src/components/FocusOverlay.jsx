import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, Zap, Target, CheckCircle, Brain, AlertCircle } from 'lucide-react';

export default function FocusOverlay() {
  const { isFocusMode, focusedTaskId, tasks, toggleFocus, generateMicroSteps, toggleMicroStep, updateProgress } = useWarscytheStore();
  const task = tasks.find(t => t.id === focusedTaskId);
  
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play alert sound if we had one
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  if (!isFocusMode) return null;

  if (!task) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="focus-fullscreen-overlay no-task"
      >
        <div className="focus-header">
           <div className="focus-label-group">
            <Brain size={16} className="text-gold pulse" />
            <span className="focus-mode-title">NEURAL FOCUS MODE</span>
          </div>
          <button className="focus-exit-btn" onClick={() => toggleFocus()}>
            <X size={20} />
            <span>EXIT FOCUS</span>
          </button>
        </div>
        <div className="focus-placeholder">
          <AlertCircle size={48} className="text-gold" />
          <h2>NO ACTIVE OPERATION DETECTED</h2>
          <p>YOU MUST DEPLOY AN OPERATION BEFORE ENTERING FOCUS LOCKDOWN.</p>
          <button className="recalc-btn" onClick={() => toggleFocus()} style={{ fontSize: '0.8rem', padding: '10px 20px' }}>
            RETURN TO COMMAND
          </button>
        </div>

        <style jsx>{`
          .focus-fullscreen-overlay {
            position: fixed; inset: 0; background: #050507; z-index: 2000;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
          }
          .focus-header { position: absolute; top: 0; width: 100%; display: flex; justify-content: space-between; padding: 2rem 3rem; }
          .focus-placeholder { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; max-width: 400px; }
          .focus-placeholder h2 { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.1em; color: #fff; }
          .focus-placeholder p { font-size: 0.8rem; color: var(--text-dim); line-height: 1.6; }
          .text-gold { color: var(--gold-core); }
          .pulse { animation: focus-pulse 2s infinite; }
          @keyframes focus-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
          .focus-label-group { display: flex; align-items: center; gap: 1rem; }
          .focus-mode-title { font-family: var(--font-display); font-size: 0.9rem; letter-spacing: 0.3em; color: var(--gold-core); }
          .focus-exit-btn {
            display: flex; align-items: center; gap: 0.75rem; 
            background: rgba(255, 60, 60, 0.1); border: 1px solid rgba(255, 60, 60, 0.3);
            color: var(--red-hot); padding: 0.6rem 1.2rem; border-radius: 4px; font-weight: 800; font-size: 0.7rem;
          }
          .recalc-btn { 
            display: flex; align-items: center; gap: 0.5rem; 
            background: rgba(197, 160, 89, 0.1); border: 1px solid var(--gold-core);
            color: var(--gold-core); font-weight: 900; border-radius: 4px; cursor: pointer;
          }
        `}</style>
      </motion.div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = task.progress;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="focus-fullscreen-overlay"
    >
      <div className="focus-vignette" />
      <div className="focus-scanner-line" />
      
      <div className="focus-header">
        <div className="focus-label-group">
          <Brain size={16} className="text-gold pulse" />
          <span className="focus-mode-title">NEURAL FOCUS MODE // ACTIVE</span>
        </div>
        <button className="focus-exit-btn" onClick={() => toggleFocus()}>
          <X size={20} />
          <span>EXIT FOCUS</span>
        </button>
      </div>

      <div className="focus-main-content">
        <div className="focus-timer-section">
          <div className="timer-display">
            <span className="timer-digits">{formatTime(timeLeft)}</span>
            <span className="timer-sub">REMAINING UNTIL RECALIBRATION</span>
          </div>
          <div className="timer-progress-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="timer-ring-bg" />
              <motion.circle 
                cx="50" cy="50" r="45" 
                className="timer-ring-fill"
                style={{ 
                  pathLength: timeLeft / (15 * 60),
                  rotate: -90,
                  originX: "50%",
                  originY: "50%"
                }}
              />
            </svg>
          </div>
        </div>

        <div className="focus-task-info">
          <div className="task-focus-header">
            <span className="task-focus-cat">{task.category}</span>
            <h2 className="task-focus-title">{task.title}</h2>
          </div>

          <div className="focus-micro-steps">
            <div className="steps-header">
              <label>TACTICAL CHUNKS (ADHD SPECIAL)</label>
              <button className="recalc-btn" onClick={() => generateMicroSteps(task.id)}>
                <Zap size={10} /> RECALCULATE
              </button>
            </div>
            
            <div className="focus-steps-list">
              {task.microSteps.length === 0 ? (
                <div className="empty-focus-steps">
                   <AlertCircle size={20} />
                   <p>NO STEPS GENERATED. USE RECALCULATE TO BREAK THE RESISTANCE.</p>
                </div>
              ) : (
                task.microSteps.map(step => (
                  <motion.div 
                    key={step.id} 
                    className={`focus-step-item ${step.checked ? 'checked' : ''}`}
                    onClick={() => toggleMicroStep(task.id, step.id)}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="focus-checkbox">
                      {step.checked && <CheckCircle size={16} />}
                    </div>
                    <span className="step-label-text">{step.label}</span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="focus-footer">
        <div className="focus-progress-block">
          <div className="label-row">
            <span>OPERATIONAL COMPLETION</span>
            <span>{progress}%</span>
          </div>
          <div className="focus-progress-track">
            <motion.div 
              className="focus-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .focus-fullscreen-overlay {
          position: fixed;
          inset: 0;
          background: #050507;
          z-index: 2000;
          display: flex;
          flex-direction: column;
          color: var(--text-primary);
          overflow: hidden;
        }

        .focus-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%);
          pointer-events: none;
        }

        .focus-scanner-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold-core), transparent);
          opacity: 0.2;
          animation: scanner-move 8s linear infinite;
        }

        @keyframes scanner-move {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .focus-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 3rem;
          z-index: 10;
        }

        .focus-label-group { display: flex; align-items: center; gap: 1rem; }
        .focus-mode-title { font-family: var(--font-display); font-size: 0.9rem; letter-spacing: 0.3em; color: var(--gold-core); }
        .pulse { animation: focus-pulse 2s infinite; }
        @keyframes focus-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; filter: drop-shadow(0 0 10px var(--gold-glow)); }
        }

        .focus-exit-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 60, 60, 0.1);
          border: 1px solid rgba(255, 60, 60, 0.3);
          color: var(--red-hot);
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          font-weight: 800;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          transition: 0.2s;
        }
        .focus-exit-btn:hover { background: var(--red-core); color: #fff; }

        .focus-main-content {
          flex: 1;
          display: grid;
          grid-template-columns: 450px 1fr;
          align-items: center;
          gap: 5rem;
          padding: 0 5rem;
          z-index: 10;
        }

        .focus-timer-section {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .timer-display { text-align: center; display: flex; flex-direction: column; gap: 0.5rem; }
        .timer-digits { font-family: var(--font-mono); font-size: 6rem; font-weight: 900; line-height: 1; color: #fff; }
        .timer-sub { font-size: 0.6rem; color: var(--text-dark); letter-spacing: 0.2em; font-weight: 800; }

        .timer-progress-ring {
          position: absolute;
          width: 320px;
          height: 320px;
          opacity: 0.1;
          pointer-events: none;
        }
        .timer-ring-bg { fill: none; stroke: var(--border); stroke-width: 2; }
        .timer-ring-fill { fill: none; stroke: var(--gold-core); stroke-width: 2; stroke-linecap: round; }

        .focus-task-info { display: flex; flex-direction: column; gap: 3rem; }
        .task-focus-cat { font-family: var(--font-mono); font-size: 0.8rem; color: var(--gold-core); letter-spacing: 0.2em; text-transform: uppercase; }
        .task-focus-title { font-family: var(--font-display); font-size: 2.5rem; color: #fff; line-height: 1.2; }

        .focus-micro-steps { display: flex; flex-direction: column; gap: 1.5rem; }
        .steps-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; }
        .steps-header label { font-size: 0.6rem; font-weight: 900; color: var(--text-dark); letter-spacing: 0.2em; }
        
        .recalc-btn { 
          display: flex; align-items: center; gap: 0.5rem; 
          background: rgba(197, 160, 89, 0.1); border: 1px solid var(--gold-core);
          color: var(--gold-core); font-size: 0.55rem; font-weight: 900;
          padding: 4px 10px; border-radius: 4px;
        }

        .focus-steps-list { display: flex; flex-direction: column; gap: 0.75rem; max-height: 400px; overflow-y: auto; padding-right: 1rem; }
        .focus-step-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          padding: 1.25rem 1.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .focus-step-item:hover { background: rgba(255,255,255,0.07); border-color: var(--border-bright); }
        .focus-step-item.checked { opacity: 0.3; background: transparent; }
        
        .focus-checkbox { width: 24px; height: 24px; border: 1px solid var(--border); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--gold-core); }
        .step-label-text { font-size: 1rem; font-weight: 600; color: var(--text-dim); }
        .focus-step-item.checked .step-label-text { text-decoration: line-through; }

        .empty-focus-steps { padding: 3rem; text-align: center; color: var(--text-dark); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .empty-focus-steps p { font-size: 0.8rem; font-family: var(--font-mono); }

        .focus-footer { padding: 3rem 5rem; z-index: 10; }
        .focus-progress-block { display: flex; flex-direction: column; gap: 1rem; max-width: 600px; }
        .label-row { display: flex; justify-content: space-between; font-size: 0.6rem; font-weight: 900; color: var(--text-dark); letter-spacing: 0.2em; }
        .focus-progress-track { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .focus-progress-fill { height: 100%; background: var(--gold-core); box-shadow: 0 0 15px var(--gold-glow); }
      `}</style>
    </motion.div>
  );
}
