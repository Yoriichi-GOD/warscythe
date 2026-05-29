import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, ShieldAlert, Crosshair, Calendar, Zap, Activity, Plus, Trash2 } from 'lucide-react';
import { HABIT_TEMPLATES } from '../store/constants';

export default function TaskModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [effort, setEffort] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('none');
  const [subTaskText, setSubTaskText] = useState('');
  const [subTasks, setSubTasks] = useState([]);
  const [error, setError] = useState(null);
  
  const addTask = useWarscytheStore(state => state.addTask);

  const handleSelectPreset = (e) => {
    const val = e.target.value;
    if (!val) return;
    const preset = HABIT_TEMPLATES.find(t => t.title === val);
    if (preset) {
      setTitle(preset.title);
      setCategory(preset.category === 'Health' || preset.category === 'Physical' ? 'Fitness' : preset.category);
      setEffort(preset.effort);
      
      // Auto-set deadline boundary
      const d = new Date();
      if (preset.effort === 'Low') d.setDate(d.getDate() + 1);
      else if (preset.effort === 'Medium') d.setDate(d.getDate() + 3);
      else if (preset.effort === 'High') d.setDate(d.getDate() + 7);
      setDeadline(d.toISOString().slice(0, 10));
    }
  };

  const handleAddSubTask = () => {
    if (!subTaskText.trim()) return;
    setSubTasks([...subTasks, subTaskText.trim()]);
    setSubTaskText('');
  };

  const handleRemoveSubTask = (idx) => {
    setSubTasks(subTasks.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!title || !deadline) return;
    
    const success = addTask(title, category, effort, deadline, priority, subTasks);
    if (success === true) {
      onClose();
    } else {
      setError(success || "Operation failed.");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="modal-content glass-panel tactical-modal max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-box">
            <Crosshair size={18} className="text-gold" />
            <h2>NEW OPERATION</h2>
          </div>
          <button className="btn-close-circle" onClick={onClose}><X size={16} /></button>
        </div>

        {error && (
          <div className="error-banner">
            <ShieldAlert size={14} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="tactical-form">
          <div className="form-group full">
            <label><Zap size={10} /> TEMPLATE PRESETS</label>
            <select onChange={handleSelectPreset} defaultValue="">
              <option value="">-- SELECT QUICK HABIT PRESET --</option>
              {HABIT_TEMPLATES.map((h, idx) => (
                <option key={idx} value={h.title}>{h.title} ({h.effort})</option>
              ))}
            </select>
          </div>

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

          <div className="form-group full">
            <label><ShieldAlert size={10} /> PRIORITY BEACON</label>
            <div className="priority-toggle-group">
              {[
                { id: 'none', label: 'DEFAULT', color: 'var(--color-gold-core)' },
                { id: 'low', label: 'LOW', color: '#2ecc71' },
                { id: 'medium', label: 'MEDIUM', color: '#f1c40f' },
                { id: 'high', label: 'HIGH', color: '#e74c3c' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  className={`priority-btn ${priority === p.id ? 'active' : ''}`}
                  style={{ 
                    borderColor: priority === p.id ? p.color : 'rgba(255,255,255,0.06)', 
                    color: p.color,
                    boxShadow: priority === p.id ? `0 0 10px ${p.color}33` : 'none'
                  }}
                  onClick={() => setPriority(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group full">
            <label><Plus size={10} /> ADD TACTICAL SUB-TASKS</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="ENTER SUB-TASK REQUIREMENT..." 
                value={subTaskText}
                onChange={e => setSubTaskText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubTask(); } }}
              />
              <button type="button" className="btn-add-sub" onClick={handleAddSubTask}>
                <Plus size={16} />
              </button>
            </div>
            {subTasks.length > 0 && (
              <div className="sub-tasks-preview flex flex-col gap-2 mt-2">
                {subTasks.map((st, idx) => (
                  <div key={idx} className="sub-task-preview-item flex justify-between items-center p-2 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-[11px] font-mono text-gray-400">{st}</span>
                    <button type="button" className="text-red-400 hover:text-red-500" onClick={() => handleRemoveSubTask(idx)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

        .error-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          padding: 0.8rem 1.2rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

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
          flex: 1;
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

        .priority-toggle-group {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        .priority-btn {
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          padding: 0.8rem 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          font-weight: 900;
          cursor: pointer;
          transition: 0.2s;
          letter-spacing: 0.05em;
        }

        .priority-btn.active {
          background: rgba(255,255,255,0.04);
        }

        .btn-add-sub {
          width: 50px;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          color: var(--text-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          cursor: pointer;
          transition: 0.2s;
          margin-left: 0.5rem;
        }

        .btn-add-sub:hover {
          background: rgba(255,255,255,0.05);
          border-color: var(--gold-core);
          color: #fff;
        }
        
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
      `}</style>
    </div>
  );
}
