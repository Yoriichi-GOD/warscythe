import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWarlordStore } from '../store/useWarlordStore';
import { X, ShieldAlert, Crosshair, Calendar, Zap, Activity } from 'lucide-react';

export default function TaskModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [effort, setEffort] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  
  const addTask = useWarlordStore(state => state.addTask);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !deadline) return;
    const success = addTask(title, category, effort, deadline);
    if (success) onClose();
    else alert("Operation failed: Max active tasks reached (3).");
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
            <h2>NEW OPERATION</h2>
          </div>
          <button className="btn-close-circle" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="tactical-form">
          <div className="form-group full">
            <label><Zap size={10} /> OBJECTIVE IDENTIFIER</label>
            <input 
              type="text" 
              placeholder="ENTER TASK PROTOCOL..." 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label><ShieldAlert size={10} /> CATEGORY</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Work">SYSTEMS // WORK</option>
                <option value="Study">INTEL // STUDY</option>
                <option value="Fitness">FORCE // FITNESS</option>
                <option value="Creative">FORGE // CREATIVE</option>
              </select>
            </div>

            <div className="form-group">
              <label><Activity size={10} /> RESISTANCE LEVEL</label>
              <select value={effort} onChange={e => setEffort(e.target.value)}>
                <option value="Low">RECON (LOW)</option>
                <option value="Medium">SKIRMISH (MED)</option>
                <option value="High">ASSAULT (HIGH)</option>
                <option value="Boss">BOSS RAID</option>
              </select>
            </div>
          </div>

          <div className="form-group full">
            <label><Calendar size={10} /> TARGET DEADLINE</label>
            <div className="date-input-wrapper">
              <input 
                type="date" 
                value={deadline} 
                onChange={e => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn-primary deploy-btn">
              <span>CONFIRM DEPLOYMENT</span>
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
          padding: 2.5rem; 
          border: 1px solid var(--border-bright);
          box-shadow: 0 0 50px rgba(0,0,0,0.8);
          background: linear-gradient(135deg, var(--bg-panel), rgba(10,10,15,0.95));
        }

        .modal-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 2.5rem; 
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
        }
        
        .modal-title-box { display: flex; align-items: center; gap: 1rem; }
        .modal-title-box h2 { 
          font-family: var(--font-display); 
          font-size: 1rem; 
          letter-spacing: 0.2em; 
          color: var(--text-primary);
          margin: 0;
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
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
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

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
          opacity: 0.5;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
        
        .deploy-btn {
          height: 54px;
          border-radius: 4px;
          font-family: var(--font-display);
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          box-shadow: 0 0 20px var(--gold-glow);
        }
        
        .deploy-btn span { position: relative; z-index: 2; }
      `}</style>
    </div>
  );
}
