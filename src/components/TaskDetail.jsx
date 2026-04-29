import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, CheckCircle, Trash2, Zap } from 'lucide-react';

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

  if (!task) return null;

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div 
        layoutId={taskId}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: [0.8, 1.05, 1] }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="modal-content detail-content glass-panel"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="title-area">
            <span className="cat-tag">{task.category}</span>
            <h2>{task.title}</h2>
          </div>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="detail-body">
          <div className="progress-section">
            <div className="progress-info">
              <label>PROGRESS: {task.progress}%</label>
              <span className="stage-name">{task.progress < 70 ? 'BUILD' : task.progress < 95 ? 'FINISH' : 'SHIP'}</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" step="5"
              value={task.progress}
              onChange={e => updateProgress(task.id, parseInt(e.target.value))}
            />
            <div className="progress-track large">
              <div 
                className="progress-fill" 
                style={{ width: `${task.progress}%`, background: task.progress < 70 ? 'var(--stage-build)' : task.progress < 95 ? 'var(--stage-finish)' : 'var(--stage-ship)' }} 
              />
            </div>
          </div>

          <div className="micro-steps-section">
             <div className="section-label">
                <label>MICRO STEPS</label>
                <button 
                  className="btn-tiny" 
                  onClick={() => generateMicroSteps(task.id)}
                  title="Generate steps to overcome resistance"
                >
                  <Zap size={10} /> RECALCULATE
                </button>
             </div>
             <div className="steps-list">
               {task.microSteps.length === 0 ? (
                 <p className="empty-sub">No steps generated. Resistance is high? Use Recalculate.</p>
               ) : (
                 task.microSteps.map(step => (
                   <div 
                    key={step.id} 
                    className={`step-item ${step.checked ? 'checked' : ''}`}
                    onClick={() => toggleMicroStep(task.id, step.id)}
                   >
                     <div className="checkbox">{step.checked && <CheckCircle size={14} />}</div>
                     <span>{step.label}</span>
                   </div>
                 ))
               )}
             </div>
          </div>

          <div className="notes-section">
            <label>FIELD NOTES</label>
            <textarea 
              placeholder="Strategic observations..."
              value={task.notes}
              onChange={e => updateNotes(task.id, e.target.value)}
            />
          </div>

          <div className="detail-actions">
            <button className="btn-primary flex-1" onClick={handleComplete}>
              <CheckCircle size={18} /> VALIDATE EXECUTION
            </button>
            <button className="btn-danger" onClick={() => { if(window.confirm("Abandon mission?")) { abandonTask(task.id); onClose(); }}}>
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
          padding: 1rem;
        }
        .detail-content { max-width: 550px; width: 100%; padding: 2rem; }
        .cat-tag { font-family: var(--font-mono); font-size: 0.6rem; color: var(--gold-core); letter-spacing: 0.1em; }
        .modal-header h2 { margin-top: 0.2rem; font-size: 1.4rem; color: var(--text-primary); }
        
        .progress-section { margin-top: 1.5rem; }
        .progress-info { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.5rem; }
        .stage-name { font-weight: 900; font-size: 0.7rem; color: var(--text-dim); letter-spacing: 0.2em; }
        
        .progress-track.large { height: 12px; }
        input[type="range"] { margin-bottom: 1rem; width: 100%; }

        .micro-steps-section { margin-top: 2rem; }
        .section-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
        .btn-tiny { background: rgba(255,255,255,0.05); color: var(--gold-core); font-size: 0.6rem; padding: 4px 8px; border-radius: 4px; font-weight: 800; }
        
        .steps-list { display: flex; flex-direction: column; gap: 0.5rem; max-height: 250px; overflow-y: auto; padding-right: 4px; }
        .step-item { 
          display: flex; align-items: center; gap: 0.8rem; 
          background: rgba(255,255,255,0.03); padding: 0.6rem 1rem; 
          border-radius: 8px; cursor: pointer; transition: 0.2s;
          font-size: 0.8rem; border: 1px solid transparent;
        }
        .step-item:hover { background: rgba(255,255,255,0.06); border-color: var(--border); }
        .step-item.checked { opacity: 0.4; }
        .checkbox { width: 18px; height: 18px; border: 1px solid var(--border); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: var(--gold-core); }
        
        .notes-section { margin-top: 1.5rem; }
        textarea {
          width: 100%; min-height: 100px; background: rgba(0,0,0,0.2); 
          border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary);
          padding: 1rem; font-family: inherit; font-size: 0.85rem; margin-top: 0.5rem;
        }

        .detail-actions { margin-top: 2rem; display: flex; gap: 0.8rem; }
        .flex-1 { flex: 1; }
        .btn-danger { width: 50px; height: 50px; border-radius: var(--radius); background: rgba(139, 0, 0, 0.2); color: var(--red-hot); border: 1px solid rgba(139, 0, 0, 0.4); }
        .btn-danger:hover { background: var(--red-core); color: #fff; }
      `}</style>
    </div>
  );
}
