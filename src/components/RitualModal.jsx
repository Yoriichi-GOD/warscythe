import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, ShieldAlert, Crosshair, Zap, Activity, ChevronDown } from 'lucide-react';
import { HABIT_TEMPLATES } from '../store/constants';

export default function RitualModal({ onClose, tutorialMode = false }) {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [effort, setEffort] = useState('Medium');
  const [targetTime, setTargetTime] = useState('');
  
  const [presetOpen, setPresetOpen] = useState(false);
  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [effortOpen, setEffortOpen] = useState(false);
  const [tutorialStage, setTutorialStage] = useState(0);
  
  const addRitual = useWarscytheStore(state => state.addRitual);
  const triggerBossFlash = useWarscytheStore(state => state.triggerBossFlash);

  const handleSelectPreset = (presetTitle) => {
    const preset = HABIT_TEMPLATES.find(t => t.title === presetTitle);
    if (preset) {
      setTitle(preset.title);
      setEffort(preset.effort);
    }
    setPresetOpen(false);
    if (tutorialMode) setTutorialStage(1);
  };

  const frequencyOptions = [
    { value: 'daily', label: 'DAILY REPETITION' },
    { value: 'weekly', label: 'WEEKLY CADENCE' }
  ];

  const effortOptions = [
    { value: 'Low', label: 'RECON (LOW)' },
    { value: 'Medium', label: 'SKIRMISH (MED)' },
    { value: 'High', label: 'ASSAULT (HIGH)' },
    { value: 'Boss', label: 'BOSS RAID' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    if (tutorialMode) {
      if (tutorialStage < 4) return;
      onClose({ title, frequency, effort, targetTime: targetTime || null });
      return;
    }
    
    const success = addRitual(title, frequency, effort, targetTime || null);
    if (success) {
      if (effort === 'Boss') {
        triggerBossFlash('initiate');
      }
      onClose();
    }
    else alert("Ritual creation failed.");
  };

  return (
    <div className="modal-backdrop" onClick={tutorialMode ? undefined : onClose}>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="modal-content glass-panel tactical-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-box">
            <Crosshair size={18} className="text-gold" />
            <h2>ENSHRINE RITUAL</h2>
          </div>
          {!tutorialMode && <button className="btn-close-circle" onClick={onClose}><X size={16} /></button>}
        </div>

        {tutorialMode && (
          <div className="rehearsal-order" aria-live="polite">
            <span>OATHBOUND REHEARSAL // {tutorialStage + 1} OF 5</span>
            <strong>
              {tutorialStage === 0 && 'CHOOSE A PRESET TO GIVE THE RITUAL ITS FIRST FORM.'}
              {tutorialStage === 1 && 'CHOOSE HOW OFTEN THIS VOW RETURNS.'}
              {tutorialStage === 2 && 'CHOOSE THE RESISTANCE THIS VOW DEMANDS.'}
              {tutorialStage === 3 && 'SET THE HOUR AT WHICH THIS VOW CALLS YOU BACK.'}
              {tutorialStage === 4 && 'THE FORM IS READY. CONFIRM ITS ENSHRINEMENT.'}
            </strong>
          </div>
        )}

        {(presetOpen || frequencyOpen || effortOpen) && (
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={() => { setPresetOpen(false); setFrequencyOpen(false); setEffortOpen(false); }} 
          />
        )}

        <form onSubmit={handleSubmit} className="tactical-form">
          <div className={`form-group full tutorial-field ${tutorialMode && tutorialStage !== 0 ? 'tutorial-locked' : 'tutorial-active'}`} style={{ position: 'relative', zIndex: presetOpen ? 200 : 10 }}>
            <label><Zap size={10} /> TEMPLATE PRESETS</label>
            <div className="custom-select-container">
              <button 
                type="button" 
                className="custom-select-trigger" 
                onClick={() => { if (!tutorialMode || tutorialStage === 0) setPresetOpen(!presetOpen); setFrequencyOpen(false); setEffortOpen(false); }}
              >
                <span>-- SELECT QUICK HABIT PRESET --</span>
                <ChevronDown size={12} />
              </button>
              {presetOpen && (
                <div className="custom-select-options">
                  {HABIT_TEMPLATES.map((h, idx) => (
                    <div 
                      key={idx} 
                      className="custom-select-option" 
                      onClick={() => handleSelectPreset(h.title)}
                    >
                      {h.title} ({h.effort})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`form-group full ${tutorialMode ? 'tutorial-locked tutorial-derived' : ''}`}>
            <label><Zap size={10} /> RITUAL IDENTIFIER</label>
            <input 
              type="text" 
              placeholder="ENTER HABIT ROUTINE..." 
              value={title} 
              onChange={e => !tutorialMode && setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-grid">
            <div className={`form-group tutorial-field ${tutorialMode && tutorialStage !== 1 ? 'tutorial-locked' : 'tutorial-active'}`} style={{ position: 'relative', zIndex: frequencyOpen ? 200 : 10 }}>
              <label><ShieldAlert size={10} /> FREQUENCY</label>
              <div className="custom-select-container">
                <button 
                  type="button" 
                  className="custom-select-trigger" 
                  onClick={() => { if (!tutorialMode || tutorialStage === 1) setFrequencyOpen(!frequencyOpen); setPresetOpen(false); setEffortOpen(false); }}
                >
                  <span>{frequencyOptions.find(o => o.value === frequency)?.label}</span>
                  <ChevronDown size={12} />
                </button>
                {frequencyOpen && (
                  <div className="custom-select-options">
                    {frequencyOptions.map(opt => (
                      <div 
                        key={opt.value} 
                        className="custom-select-option" 
                        onClick={() => { setFrequency(opt.value); setFrequencyOpen(false); if (tutorialMode) setTutorialStage(2); }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`form-group tutorial-field ${tutorialMode && tutorialStage !== 2 ? 'tutorial-locked' : 'tutorial-active'}`} style={{ position: 'relative', zIndex: effortOpen ? 200 : 10 }}>
              <label><Activity size={10} /> RESISTANCE LEVEL</label>
              <div className="custom-select-container">
                <button 
                  type="button" 
                  className="custom-select-trigger" 
                  onClick={() => { if (!tutorialMode || tutorialStage === 2) setEffortOpen(!effortOpen); setPresetOpen(false); setFrequencyOpen(false); }}
                >
                  <span>{effortOptions.find(o => o.value === effort)?.label}</span>
                  <ChevronDown size={12} />
                </button>
                {effortOpen && (
                  <div className="custom-select-options">
                    {effortOptions.map(opt => (
                      <div 
                        key={opt.value} 
                        className="custom-select-option" 
                        onClick={() => { setEffort(opt.value); setEffortOpen(false); if (tutorialMode) setTutorialStage(3); }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className={`form-group full mt-4 tutorial-field ${tutorialMode && tutorialStage !== 3 ? 'tutorial-locked' : 'tutorial-active'}`}>
            <label><Zap size={10} /> TARGET TIME (OPTIONAL ALERT CUE)</label>
            <input 
              type="time" 
              className="tactical-time-input w-full bg-black/40 border border-gold-core/20 hover:border-gold-core/50 focus:border-gold-bright text-white px-3 py-2 rounded text-xs font-mono focus:outline-none transition-colors"
              value={targetTime} 
              onChange={e => {
                setTargetTime(e.target.value);
                if (tutorialMode && e.target.value) setTutorialStage(4);
              }}
              style={{ colorScheme: 'dark' }}
            />
            <span className="text-[9px] text-gray-500 font-mono mt-1 block tracking-wider">
              SET A SPECIFIC HOUR TO RECEIVE DISPATCH REMINDERS (1HR, 30MIN, 15MIN, AND EXACT).
            </span>
          </div>

          <div className={`modal-footer tutorial-field ${tutorialMode && tutorialStage !== 4 ? 'tutorial-locked' : 'tutorial-active'}`}>
            <button type="submit" disabled={tutorialMode && tutorialStage !== 4} className="btn-primary deploy-btn">
              <span>CONFIRM ENSHRINEMENT</span>
            </button>
          </div>
        </form>
      </motion.div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.9); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
          padding: 1rem;
        }
        
        .tactical-modal { 
          width: 100%; 
          max-width: 500px; 
          padding: 1.5rem; 
          border: 1px solid var(--border-bright);
          box-shadow: 0 0 50px rgba(0,0,0,0.8);
          background: linear-gradient(135deg, var(--bg-panel), rgba(10,10,15,0.95));
        }

        @media (min-width: 640px) {
          .tactical-modal { padding: 2.5rem; }
        }

        .modal-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 2rem; 
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
        }

        @media (min-width: 640px) {
          .modal-header { margin-bottom: 2.5rem; }
        }
        
        .modal-title-box { display: flex; align-items: center; gap: 1rem; }
        .modal-title-box h2 { 
          font-family: var(--font-display); 
          font-size: 0.9rem; 
          letter-spacing: 0.2em; 
          color: var(--text-primary);
          margin: 0;
        }
        @media (min-width: 640px) {
          .modal-title-box h2 { font-size: 1rem; }
        }
        .text-gold { color: var(--gold-core); filter: drop-shadow(0 0 5px var(--gold-glow)); }

        .btn-close-circle { 
          width: 32px; height: 32px; border-radius: 50%; 
          background: rgba(255,255,255,0.03); border: 1px solid var(--border);
          color: var(--text-dim); display: flex; align-items: center; justify-content: center;
          transition: 0.2s;
        }
        .btn-close-circle:hover { background: var(--red-core); color: #fff; border-color: var(--red-hot); }

        .tactical-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .rehearsal-order {
          display: flex; flex-direction: column; gap: .45rem; padding: .85rem 1rem;
          margin: -1rem 0 1.25rem; border-left: 2px solid var(--gold-core);
          background: rgba(197,160,89,.07); font-family: var(--font-mono);
        }
        .rehearsal-order span { color: var(--gold-core); font-size: .55rem; letter-spacing: .22em; }
        .rehearsal-order strong { color: #fff; font-size: .62rem; letter-spacing: .12em; line-height: 1.6; }
        .tutorial-field { transition: opacity .2s ease, filter .2s ease; }
        .tutorial-locked { opacity: .22; filter: grayscale(1); pointer-events: none; }
        .tutorial-derived { opacity: .48; }
        .tutorial-active { position: relative; }
        .tutorial-active::after {
          content: ''; position: absolute; inset: -7px; pointer-events: none;
          border: 1px solid var(--gold-core); border-radius: 6px;
          box-shadow: 0 0 22px rgba(197,160,89,.24);
        }
        .form-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 640px) {
          .form-grid { grid-template-columns: 1fr 1fr; }
        }
        .form-group { display: flex; flex-direction: column; gap: 0.75rem; }
        
        label { 
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.55rem; font-weight: 900; letter-spacing: 0.15em; color: var(--text-dark); 
          text-transform: uppercase;
        }
        
        input, select {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 1rem;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          transition: 0.2s;
        }
        
        input:focus, select:focus { 
          outline: none; 
          border-color: var(--gold-core); 
          background: rgba(197, 160, 89, 0.05);
          box-shadow: 0 0 15px rgba(197, 160, 89, 0.1);
        }
        
        input::placeholder { color: var(--text-dark); opacity: 0.5; }

        .deploy-btn {
          width: 100%;
          height: 54px;
          border-radius: 4px;
          font-family: var(--font-display);
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          background: rgba(197, 160, 89, 0.1);
          border: 1px solid var(--gold-core);
          color: var(--gold-core);
          box-shadow: 0 0 15px rgba(197, 160, 89, 0.2), inset 0 0 10px rgba(197, 160, 89, 0.1);
          transition: all 0.2s ease;
          margin-top: 1rem;
        }
        
        .deploy-btn:hover {
          background: var(--gold-core);
          color: #000;
          box-shadow: 0 0 25px rgba(197, 160, 89, 0.4);
        }
        
        .deploy-btn span { position: relative; z-index: 2; font-weight: 700; }

        /* ═══════════════ CUSTOM SELECT STYLE (BLACK & WHITE) ═══════════════ */
        .custom-select-container {
          position: relative;
          width: 100%;
          z-index: 50;
        }
        .custom-select-trigger {
          width: 100%;
          background: #000;
          border: 1px solid #fff;
          border-radius: 4px;
          padding: 1rem;
          color: #fff;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .custom-select-trigger:focus {
          outline: none;
          border-color: var(--color-gold-core);
        }
        .custom-select-options {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #08080a !important;
          border: 1px solid rgba(197, 160, 89, 0.3) !important;
          border-radius: 4px;
          margin-top: 4px;
          z-index: 5000;
          max-height: 200px;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.95);
        }
        .custom-select-option {
          padding: 0.8rem 1rem;
          color: #fff;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.1s ease;
        }
        .custom-select-option:hover {
          background: #fff;
          color: #000;
        }
      `}</style>
    </div>
  );
}
