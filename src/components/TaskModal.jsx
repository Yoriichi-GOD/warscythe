import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, ShieldAlert, Crosshair, Calendar, Zap, Activity, Plus, Trash2, ChevronDown } from 'lucide-react';

export default function TaskModal({ onClose, initialEffort = 'Medium' }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [effort, setEffort] = useState(initialEffort);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('none');
  const [subTaskText, setSubTaskText] = useState('');
  const [subTasks, setSubTasks] = useState([]);
  const [error, setError] = useState(null);
  
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [effortOpen, setEffortOpen] = useState(false);
  
  const tasks = useWarscytheStore(state => state.tasks) || [];
  const addTask = useWarscytheStore(state => state.addTask);
  const triggerBossFlash = useWarscytheStore(state => state.triggerBossFlash);
  const tutorialStep = useWarscytheStore(state => state.tutorialStep);
  const setTutorialStep = useWarscytheStore(state => state.setTutorialStep);

  useEffect(() => {
    if (tutorialStep === 'task_creation') {
      setTutorialStep('task_modal_open');
    }
  }, [tutorialStep]);

  const handleClose = () => {
    if (tutorialStep === 'task_modal_open') {
      setTutorialStep('task_creation');
    }
    onClose();
  };

  const categoryOptions = [
    { value: 'Work', label: 'SYSTEMS // WORK' },
    { value: 'Study', label: 'INTEL // STUDY' },
    { value: 'Fitness', label: 'FORCE // FITNESS' },
    { value: 'Creative', label: 'FORGE // CREATIVE' }
  ];

  const effortOptions = [
    { value: 'Low', label: 'RECON (LOW)' },
    { value: 'Medium', label: 'SKIRMISH (MED)' },
    { value: 'High', label: 'ASSAULT (HIGH)' },
    { value: 'Boss', label: 'BOSS RAID' }
  ];

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
      if (tutorialStep === 'task_modal_open') {
        setTutorialStep('click_task');
      }
      if (effort === 'Boss') {
        triggerBossFlash('initiate');
      }
      onClose();
    } else {
      setError(success || "Operation failed.");
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`modal-content glass-panel tactical-modal custom-scrollbar ${
          tutorialStep === 'task_modal_open' ? 'modal-onboarding-open' : 'max-h-[90vh] overflow-y-auto'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-box">
            <Crosshair size={18} className="text-gold" />
            <h2>NEW OPERATION</h2>
          </div>
          <button className="btn-close-circle" onClick={handleClose}><X size={16} /></button>
        </div>

        {error && (
          <div className="error-banner">
            <ShieldAlert size={14} />
            <span>{error}</span>
          </div>
        )}

        {(categoryOpen || effortOpen) && (
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={() => { setCategoryOpen(false); setEffortOpen(false); }} 
          />
        )}

        <form onSubmit={handleSubmit} className="tactical-form">
          {tasks.length >= 3 && (
            <div className="capacity-warning">
              <div className="warning-icon-shield">
                <ShieldAlert size={16} />
              </div>
              <p className="warning-text">
                You're exceeding your Command Capacity. Beyond 3 Active Operations, your focus dilutes. Hyperfocus becomes scatter. Momentum compounds into chaos. You can proceed, but understand: every operation beyond 3 is a target you won't finish.
              </p>
            </div>
          )}
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
            {tutorialStep === 'task_modal_open' && (
              <div className="onboarding-pointer left-pointer">
                <span className="pointer-tag">GUIDE</span>
                <h4>Objective</h4>
                <p>Define your strike target. Frame it as an action to force momentum.</p>
              </div>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group" style={{ position: 'relative' }}>
              <label><ShieldAlert size={10} /> CATEGORY</label>
              <div className="custom-select-container">
                <button 
                  type="button" 
                  className="custom-select-trigger" 
                  onClick={() => { setCategoryOpen(!categoryOpen); setEffortOpen(false); }}
                >
                  <span>{categoryOptions.find(o => o.value === category)?.label}</span>
                  <ChevronDown size={12} />
                </button>
                {categoryOpen && (
                  <div className="custom-select-options">
                    {categoryOptions.map(opt => (
                      <div 
                        key={opt.value} 
                        className="custom-select-option" 
                        onClick={() => { setCategory(opt.value); setCategoryOpen(false); }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {tutorialStep === 'task_modal_open' && (
                <div className="onboarding-pointer left-pointer select-pointer">
                  <span className="pointer-tag">GUIDE</span>
                  <h4>Intel Category</h4>
                  <p>Classify your operation to align with your neural specialization.</p>
                </div>
              )}
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label><Activity size={10} /> RESISTANCE LEVEL</label>
              <div className="custom-select-container">
                <button 
                  type="button" 
                  className="custom-select-trigger" 
                  onClick={() => { setEffortOpen(!effortOpen); setCategoryOpen(false); }}
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
              {tutorialStep === 'task_modal_open' && (
                <div className="onboarding-pointer right-pointer select-pointer">
                  <span className="pointer-tag">GUIDE</span>
                  <h4>Resistance Level</h4>
                  <p>Choose the scale of effort. Boss raids award legendary drops.</p>
                </div>
              )}
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
            {tutorialStep === 'task_modal_open' && (
              <div className="onboarding-pointer left-pointer">
                <span className="pointer-tag">GUIDE</span>
                <h4>Target Deadline</h4>
                <p>Set a boundary. Boundaries create urgency, forcing focus.</p>
              </div>
            )}
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
            {tutorialStep === 'task_modal_open' && (
              <div className="onboarding-pointer right-pointer">
                <span className="pointer-tag">GUIDE</span>
                <h4>Priority Beacon</h4>
                <p>Focus your energy. High priority beacon colors the interface with warning heat.</p>
              </div>
            )}
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
            {tutorialStep === 'task_modal_open' && (
              <div className="onboarding-pointer right-pointer">
                <span className="pointer-tag">GUIDE</span>
                <h4>Tactical Sub-Tasks</h4>
                <p>Decompose the objective into micro steps. Chop the wall down.</p>
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
          display: flex; justify-content: center; align-items: flex-start; z-index: 1000;
          padding: 2rem 1.5rem;
          overflow-y: auto;
        }
        
        .tactical-modal { 
          width: 100%; 
          max-width: 500px; 
          padding: 1.5rem; 
          border: 1px solid var(--border-bright);
          box-shadow: 0 0 50px rgba(0,0,0,0.8);
          background: linear-gradient(135deg, var(--bg-panel), rgba(10,10,15,0.95));
          margin: auto;
          position: relative;
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
        .form-group { display: flex; flex-direction: column; gap: 0.75rem; position: relative; }
        
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

        /* ═══════════════ CAPACITY WARNING STYLE (RED & BLACK) ═══════════════ */
        .capacity-warning {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          background: #000;
          border: 1px solid #e74c3c;
          padding: 1rem;
          border-radius: 4px;
          box-shadow: 0 0 15px rgba(231, 76, 60, 0.1);
        }
        .warning-icon-shield {
          color: #e74c3c;
          flex-shrink: 0;
          margin-top: 0.15rem;
          animation: warning-pulse-red 2s infinite ease-in-out;
        }
        .warning-text {
          font-family: var(--font-main);
          font-size: 0.75rem;
          color: #e74c3c;
          line-height: 1.4;
          margin: 0;
          letter-spacing: 0.01em;
          text-transform: none;
        }
        @keyframes warning-pulse-red {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        /* ═══════════════ ONBOARDING POINTERS ═══════════════ */
        .onboarding-pointer {
          background: #08080a;
          border: 1px solid var(--gold-core);
          padding: 0.8rem;
          border-radius: 4px;
          box-shadow: 0 0 15px rgba(197, 160, 89, 0.2);
          z-index: 100;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-align: left;
        }
        .pointer-tag {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          font-weight: 900;
          color: var(--gold-core);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .onboarding-pointer h4 {
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          color: #fff;
          margin: 0;
          text-transform: uppercase;
        }
        .onboarding-pointer p {
          font-size: 0.65rem;
          color: var(--text-dim);
          line-height: 1.4;
          margin: 0;
          text-transform: none;
        }
        
        .modal-onboarding-open {
          overflow: visible !important;
          max-height: none !important;
        }
        .modal-onboarding-open .tactical-form {
          gap: 2.2rem;
        }
        
        @media (min-width: 1024px) {
          .modal-onboarding-open .tactical-form {
            gap: 2.8rem;
          }
          .onboarding-pointer {
            position: absolute;
            width: 190px;
          }
          .left-pointer {
            right: calc(100% + 20px);
            top: 50%;
            transform: translateY(-50%);
          }
          .left-pointer::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 100%;
            transform: translateY(-50%);
            border: 6px solid transparent;
            border-left-color: var(--gold-core);
          }
          .right-pointer {
            left: calc(100% + 20px);
            top: 50%;
            transform: translateY(-50%);
          }
          .right-pointer::after {
            content: '';
            position: absolute;
            top: 50%;
            right: 100%;
            transform: translateY(-50%);
            border: 6px solid transparent;
            border-right-color: var(--gold-core);
          }
        }
        @media (max-width: 1023px) {
          .onboarding-pointer {
            margin-top: 0.5rem;
            border-color: rgba(197, 160, 89, 0.3);
            background: rgba(197, 160, 89, 0.03);
          }
        }
      `}</style>
    </div>
  );
}
