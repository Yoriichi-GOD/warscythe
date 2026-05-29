import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, ShieldAlert, Crosshair, Zap, Activity, ChevronDown } from 'lucide-react';
import { HABIT_TEMPLATES } from '../store/constants';

export default function RitualModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [effort, setEffort] = useState('Medium');
  
  const [presetOpen, setPresetOpen] = useState(false);
  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [effortOpen, setEffortOpen] = useState(false);
  
  const addRitual = useWarscytheStore(state => state.addRitual);

  const handleSelectPreset = (presetTitle) => {
    const preset = HABIT_TEMPLATES.find(t => t.title === presetTitle);
    if (preset) {
      setTitle(preset.title);
      setEffort(preset.effort);
    }
    setPresetOpen(false);
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
    
    const success = addRitual(title, frequency, effort);
    if (success) onClose();
    else alert("Ritual creation failed.");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
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
          <button className="btn-close-circle" onClick={onClose}><X size={16} /></button>
        </div>

        {(presetOpen || frequencyOpen || effortOpen) && (
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={() => { setPresetOpen(false); setFrequencyOpen(false); setEffortOpen(false); }} 
          />
        )}

        <form onSubmit={handleSubmit} className="tactical-form">
          <div className="form-group full" style={{ position: 'relative' }}>
            <label><Zap size={10} /> TEMPLATE PRESETS</label>
            <div className="custom-select-container">
              <button 
                type="button" 
                className="custom-select-trigger" 
                onClick={() => { setPresetOpen(!presetOpen); setFrequencyOpen(false); setEffortOpen(false); }}
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

          <div className="form-group full">
            <label><Zap size={10} /> RITUAL IDENTIFIER</label>
            <input 
              type="text" 
              placeholder="ENTER HABIT ROUTINE..." 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group" style={{ position: 'relative' }}>
              <label><ShieldAlert size={10} /> FREQUENCY</label>
              <div className="custom-select-container">
                <button 
                  type="button" 
                  className="custom-select-trigger" 
                  onClick={() => { setFrequencyOpen(!frequencyOpen); setPresetOpen(false); setEffortOpen(false); }}
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
                        onClick={() => { setFrequency(opt.value); setFrequencyOpen(false); }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label><Activity size={10} /> RESISTANCE LEVEL</label>
              <div className="custom-select-container">
                <button 
                  type="button" 
                  className="custom-select-trigger" 
                  onClick={() => { setEffortOpen(!effortOpen); setPresetOpen(false); setFrequencyOpen(false); }}
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
                        onClick={() => { setEffort(opt.value); setEffortOpen(false); }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn-primary deploy-btn">
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
          background: #000;
          border: 1px solid #fff;
          border-radius: 4px;
          margin-top: 4px;
          z-index: 100;
          max-height: 200px;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
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
