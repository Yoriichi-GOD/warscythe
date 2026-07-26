import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, CheckCircle, Trash2, Zap, Target, BookOpen, Plus } from 'lucide-react';

export default function TaskDetail({ taskId, onClose, onComplete }) {
  const task = useWarscytheStore(state => 
    state.tasks.find(t => t.id === taskId) || 
    state.completedTasks.find(t => t.id === taskId)
  );
  const updateProgress = useWarscytheStore(state => state.updateProgress);
  const abandonTask = useWarscytheStore(state => state.abandonTask);
  const updateNotes = useWarscytheStore(state => state.updateTaskNotes);
  const generateMicroSteps = useWarscytheStore(state => state.generateMicroSteps);
  const toggleMicroStep = useWarscytheStore(state => state.toggleMicroStep);
  const addMicroStep = useWarscytheStore(state => state.addMicroStep);
  const deleteMicroStep = useWarscytheStore(state => state.deleteMicroStep);

  const [newSubText, setNewSubText] = useState('');
  
  const tutorialStep = useWarscytheStore(state => state.tutorialStep);
  const setTutorialStep = useWarscytheStore(state => state.setTutorialStep);
  const [hasTouchedSlider, setHasTouchedSlider] = useState(false);

  useEffect(() => {
    if (tutorialStep === 'click_task') {
      setTutorialStep('task_detail_tutorial');
    }
  }, [tutorialStep]);

  if (!task) return null;

  const handleComplete = () => {
    if (tutorialStep === 'validate_execution') {
      setTutorialStep('scratch_card');
    }
    onComplete();
  };

  const handleClose = () => {
    if (tutorialStep === 'task_detail_tutorial' || tutorialStep === 'validate_execution') {
      setTutorialStep('click_task');
    }
    onClose();
  };

  const handleAddSub = () => {
    if (!newSubText.trim()) return;
    addMicroStep(task.id, newSubText.trim());
    setNewSubText('');
  };

  const trackColor = 'var(--gold-core)';

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="task-detail-panel"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="td-header">
          <div className="td-title-group">
            <div className="flex gap-2 items-center mb-1">
              <span className="td-category">{task.category}</span>
              {task.priority && task.priority !== 'none' && (
                <span className={`priority-badge priority-${task.priority}`}>
                  {(task.priority || '').toUpperCase()} PRIORITY
                </span>
              )}
            </div>
            <h2 className="td-title">{task.title}</h2>
          </div>
          <button className="td-close" onClick={handleClose}><X size={20} /></button>
        </div>

        <div className="td-body custom-scrollbar">
          
          {/* Progress Slider */}
          <div className="td-section">
            <div className="td-section-header">
              <label>PROGRESS: {task.progress}%</label>
              <span className="td-stage" style={{ color: trackColor }}>
                {task.progress < 70 ? 'BUILD' : task.progress < 95 ? 'FINISH' : 'SHIP'}
              </span>
            </div>
            
            <div className="td-slider-container">
              <div className="td-slider-track">
                <div className="td-slider-fill" style={{ width: `${task.progress}%`, background: trackColor }} />
              </div>
              <input 
                type="range" 
                min="0" max="100" step="5"
                value={task.progress}
                onChange={e => {
                  updateProgress(task.id, parseInt(e.target.value));
                  if (!hasTouchedSlider) {
                    setHasTouchedSlider(true);
                  }
                }}
                className="td-native-slider"
              />
            </div>
          </div>

          {/* Micro Steps */}
          <div className="td-section">
             <div className="td-section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <label>TACTICAL SUB-TASKS</label>
                </div>
                <button 
                  className="td-btn-recalc" 
                  onClick={() => generateMicroSteps(task.id)}
                >
                  <Zap size={10} /> RECALCULATE
                </button>
             </div>
             
             <div className="td-steps-list">
                {task.microSteps.length === 0 ? (
                  <div className="td-empty-state">
                    <p>No tactical steps generated.</p>
                    <span>Resistance is high? Recalculate your approach.</span>
                  </div>
                ) : (
                  task.microSteps.map(step => (
                   <div 
                    key={step.id} 
                    className={`td-step-item ${step.checked ? 'checked' : ''}`}
                   >
                     <div className="td-checkbox" onClick={() => toggleMicroStep(task.id, step.id)}>
                       {step.checked && <CheckCircle size={14} style={{ color: 'var(--gold-core)' }} />}
                     </div>
                     <span className="td-step-label" onClick={() => toggleMicroStep(task.id, step.id)}>{step.label}</span>
                     <button 
                       className="text-red-400 hover:text-red-500 ml-auto p-1"
                       onClick={(e) => {
                         e.stopPropagation();
                         deleteMicroStep(task.id, step.id);
                       }}
                     >
                       <Trash2 size={12} />
                     </button>
                   </div>
                 ))
               )}

               {/* Subtask Quick Add Input */}
               {task.completedAt === null && (
                 <div className="flex gap-2 mt-2">
                   <input 
                     type="text" 
                     placeholder="Add custom sub-task step..."
                     value={newSubText}
                     onChange={e => setNewSubText(e.target.value)}
                     onKeyDown={e => { if (e.key === 'Enter') handleAddSub(); }}
                     className="td-sub-input"
                   />
                   <button className="td-btn-add-sub" onClick={handleAddSub}>
                     <Plus size={14} />
                   </button>
                 </div>
               )}
             </div>
             {tutorialStep === 'task_detail_tutorial' && (
               <div className="onboarding-pointer left-pointer select-pointer mt-4" style={{ position: 'relative', width: '100%', pointerEvents: 'auto' }}>
                 <div className="flex items-center gap-3">
                   <div className="flex-1">
                     <span className="pointer-tag">GUARDIAN</span>
                     <p className="text-[11px] font-serif text-white">
                       Break it down here if it's fighting you. Check them off — the bar moves on its own.
                     </p>
                     {hasTouchedSlider && (
                       <p className="text-[11px] font-serif text-gold-core mt-2">
                         Or drag it yourself. Your call.
                       </p>
                     )}
                   </div>
                   <img src="/guardian-observer.png" alt="Guardian" className="w-10 h-10 object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(197,160,89,0.3)]" />
                 </div>
                 <button 
                   type="button" 
                   onClick={() => setTutorialStep('validate_execution')}
                   className="mt-2 text-[9px] font-mono text-gold-core hover:text-white uppercase tracking-wider border border-gold-core/30 px-2 py-0.5 rounded cursor-pointer self-start"
                 >
                   Next →
                 </button>
               </div>
             )}
          </div>

          {/* Field Notes */}
          <div className="td-section">
            <div className="td-section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <label>FIELD NOTES</label>
              </div>
            </div>
            <textarea 
              className="td-textarea"
              placeholder="Record strategic observations, roadblocks, or intelligence..."
              value={task.notes}
              onChange={e => updateNotes(task.id, e.target.value)}
            />
          </div>

        </div>

        {/* Action Bar */}
        <div className="td-footer" style={{ position: 'relative' }}>
          <button className={`td-btn-validate ${tutorialStep === 'validate_execution' ? 'gold-glow-ring' : 'opacity-40'}`} onClick={handleComplete}>
            <CheckCircle size={18} /> 
            <span>VALIDATE EXECUTION</span>
          </button>

          {tutorialStep === 'validate_execution' && (
            <div className="onboarding-pointer select-pointer" style={{ position: 'absolute', bottom: '100%', left: '0', marginBottom: '1rem', width: '250px' }}>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <span className="pointer-tag">GUARDIAN</span>
                  <p className="text-[11px] font-serif text-white">Confirm it's done.</p>
                </div>
                <img src="/guardian-observer.png" alt="Guardian" className="w-10 h-10 object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(197,160,89,0.3)]" />
              </div>
            </div>
          )}
          
          <button 
            className={`td-btn-danger transition-all duration-300 ${
              (tutorialStep === 'task_detail_tutorial' || tutorialStep === 'validate_execution')
                ? 'w-0 opacity-0 overflow-hidden p-0 m-0 pointer-events-none'
                : ''
            }`} 
            onClick={() => { if(window.confirm("Abandon mission?")) { abandonTask(task.id); handleClose(); }}}
          >
            <Trash2 size={18} />
          </button>
        </div>

      </motion.div>

      <style>{`
        .modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 2000;
          padding: 1rem;
        }

        .task-detail-panel {
          width: 100%; max-width: 500px; max-height: 90vh;
          background: #0a0a0d;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          display: flex; flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        /* HEADER */
        .td-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
        }
        .td-title-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .td-category { font-family: var(--font-mono); font-size: 0.65rem; color: var(--gold-core); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 900; }
        .td-title { font-family: var(--font-display); font-size: 1.25rem; color: #fff; letter-spacing: 0.05em; line-height: 1.3; margin: 0; }
        .td-close { color: rgba(255,255,255,0.4); cursor: pointer; transition: 0.2s; padding: 0.25rem; background: transparent; border: none; }
        .td-close:hover { color: #fff; transform: rotate(90deg); }

        /* BODY */
        .td-body {
          padding: 1.5rem;
          overflow-y: auto;
          display: flex; flex-direction: column; gap: 2rem;
        }
        
        .td-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .td-section-header { display: flex; justify-content: space-between; align-items: center; }
        .td-section-header label { font-family: var(--font-mono); font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.6); letter-spacing: 0.15em; margin: 0; }
        .td-stage { font-family: var(--font-mono); font-size: 0.65rem; font-weight: 900; letter-spacing: 0.2em; text-shadow: 0 0 10px currentColor; }

        /* SLIDER */
        .td-slider-container { position: relative; height: 24px; display: flex; align-items: center; margin-top: 0.5rem; }
        .td-slider-track { position: absolute; left: 0; right: 0; height: 6px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: visible; }
        .td-slider-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease, background 0.3s ease; position: relative; }
        .td-slider-fill::after {
          content: '';
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          background: var(--gold-bright);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--gold-core);
        }
        .td-native-slider {
          position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 10; margin: 0;
        }

        /* MICRO STEPS */
        .td-btn-recalc { 
          display: flex; align-items: center; gap: 0.25rem;
          background: rgba(197, 160, 89, 0.1); color: var(--gold-core); 
          font-family: var(--font-mono); font-size: 0.55rem; padding: 4px 8px; border-radius: 4px; font-weight: 800; letter-spacing: 0.1em;
          border: 1px solid rgba(197, 160, 89, 0.2); transition: 0.2s; cursor: pointer;
        }
        .td-btn-recalc:hover { background: rgba(197, 160, 89, 0.2); border-color: rgba(197, 160, 89, 0.4); }

        .td-steps-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .td-step-item { 
          display: flex; align-items: flex-start; gap: 0.8rem; 
          background: rgba(255,255,255,0.02); padding: 1rem; 
          border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);
          cursor: pointer; transition: 0.2s;
        }
        .td-step-item:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }
        .td-step-item.checked { opacity: 0.5; border-color: transparent; }
        .td-step-item.checked .td-step-label { text-decoration: line-through; color: rgba(255,255,255,0.4); }
        
        .td-checkbox { 
          width: 20px; height: 20px; flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; 
          display: flex; align-items: center; justify-content: center; 
          margin-top: 2px; transition: 0.2s;
        }
        .td-step-item.checked .td-checkbox { border-color: transparent; background: transparent; }
        .td-step-label { font-size: 0.85rem; color: rgba(255,255,255,0.8); line-height: 1.4; transition: 0.2s; }

        .td-empty-state {
          padding: 1.5rem; text-align: center; background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px dashed rgba(255,255,255,0.1);
        }
        .td-empty-state p { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-bottom: 0.25rem; }
        .td-empty-state span { font-size: 0.65rem; font-family: var(--font-mono); color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.1em; }

        .td-sub-input {
          flex: 1;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          padding: 0.6rem 0.8rem;
          color: #fff;
          font-family: var(--font-mono);
          font-size: 0.75rem;
        }
        .td-sub-input:focus {
          outline: none;
          border-color: var(--gold-core);
        }
        .td-btn-add-sub {
          background: rgba(197, 160, 89, 0.1);
          border: 1px solid var(--gold-core);
          color: var(--gold-core);
          border-radius: 4px;
          padding: 0.6rem 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }
        .td-btn-add-sub:hover {
          background: var(--gold-core);
          color: #000;
        }
        .priority-badge {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        .priority-badge.priority-low { background: rgba(46, 204, 113, 0.1); border: 1px solid #2ecc71; color: #2ecc71; }
        .priority-badge.priority-medium { background: rgba(241, 196, 15, 0.1); border: 1px solid #f1c40f; color: #f1c40f; }
        .priority-badge.priority-high { background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; color: #e74c3c; }

        /* TEXTAREA */
        .td-textarea {
          width: 100%; min-height: 100px; 
          background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); 
          border-radius: 8px; color: #fff; padding: 1rem; 
          font-family: var(--font-mono); font-size: 0.75rem; line-height: 1.5;
          resize: vertical; transition: 0.2s;
        }
        .td-textarea:focus { outline: none; border-color: rgba(197, 160, 89, 0.4); background: rgba(0,0,0,0.5); }

        /* FOOTER ACTIONS */
        .td-footer {
          display: flex; gap: 0.75rem; padding: 1.5rem;
          background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05);
        }
        
        .td-btn-validate {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          background: linear-gradient(135deg, rgba(197, 160, 89, 0.15) 0%, rgba(197, 160, 89, 0.05) 100%);
          border: 1px solid var(--gold-core); border-radius: 8px;
          color: var(--gold-bright); font-family: var(--font-mono); font-weight: 900; font-size: 0.85rem; letter-spacing: 0.15em;
          padding: 1rem; cursor: pointer; transition: 0.3s;
          box-shadow: 0 0 20px rgba(197, 160, 89, 0.1);
        }
        .td-btn-validate:hover {
          background: rgba(197, 160, 89, 0.2); box-shadow: 0 0 30px rgba(197, 160, 89, 0.2); transform: translateY(-2px);
        }

        .td-btn-danger {
          width: 54px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
          background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); border-radius: 8px;
          color: rgba(220, 38, 38, 0.8); cursor: pointer; transition: 0.2s;
        }
        .td-btn-danger:hover {
          background: rgba(220, 38, 38, 0.2); border-color: rgba(220, 38, 38, 0.6); color: #ef4444; transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
