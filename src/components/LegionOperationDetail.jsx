import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { useShallow } from 'zustand/react/shallow';
import { X, CheckCircle, Zap, Target, Calendar, User, ShieldAlert, Award, Clock } from 'lucide-react';

function useCountdown(deadlineIso) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!deadlineIso) return;
    
    const calculateTime = () => {
      const difference = +new Date(deadlineIso) - +new Date();
      if (difference <= 0) {
        setTimeLeft('EXPIRED');
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      let str = '';
      if (days > 0) str += `${days}d `;
      if (hours > 0 || days > 0) str += `${hours}h `;
      str += `${minutes}m ${seconds}s`;
      setTimeLeft(str);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [deadlineIso]);

  return timeLeft;
}

export default function LegionOperationDetail({ operationId, onClose }) {
  const user = useWarscytheStore(state => state.user);
  const activeLegion = useWarscytheStore(state => state.activeLegion) || {};
  const legionMembers = useWarscytheStore(useShallow(state => state.legionMembers || []));
  const operation = useWarscytheStore(state => 
    (state.legionOperations || []).find(op => op.id === operationId)
  );
  
  const subtasks = useWarscytheStore(useShallow(state => 
    (state.legionSubtasks || []).filter(
      s => s.legion_operation_id === operationId && s.acceptance_status !== 'removed_pre_start'
    )
  ));

  const legionEvents = useWarscytheStore(useShallow(state => 
    (state.legionEvents || []).filter(e => e.metadata?.operation_id === operationId)
  ));

  const personalTasks = useWarscytheStore(useShallow(state => state.tasks || []));
  const updateProgress = useWarscytheStore(state => state.updateProgress);
  const updateNotes = useWarscytheStore(state => state.updateTaskNotes);
  const completeTask = useWarscytheStore(state => state.completeTask);

  const respondToSubtask = useWarscytheStore(state => state.respondToSubtask);
  const lockLegionOperation = useWarscytheStore(state => state.lockLegionOperation);
  const restrainLegionMember = useWarscytheStore(state => state.restrainLegionMember);
  const completeLegionSubtask = useWarscytheStore(state => state.completeLegionSubtask);
  const reassignOperationSubtask = useWarscytheStore(state => state.reassignOperationSubtask);
  const removeOperationSubtask = useWarscytheStore(state => state.removeOperationSubtask);

  const countdown = useCountdown(operation?.deadline);

  if (!operation) return null;

  const isLocked = operation.status !== 'acceptance_open';
  const firstSub = subtasks[0];
  const parts = (firstSub?.title || '').split(' // ');
  const parentTitle = parts.length > 1 && parts[0] ? parts[0] : (firstSub?.title || 'Unnamed Operation');
  
  const userSubtask = subtasks.find(s => s.assigned_to === user?.id);

  // Calculate overall operation progress
  const total = subtasks.length;
  const completed = subtasks.filter(
    s => s.completion_status === 'completed' || s.completion_status === 'covered'
  ).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const trackColor = 'var(--gold-core)';

  return (
    <div className="modal-backdrop" onClick={onClose}>
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
          <div className="td-title-group text-left">
            <div className="flex gap-2 items-center mb-1">
              <span className="td-category">LEGION OPERATION</span>
              <span className={`priority-badge ${operation.status === 'active' ? 'priority-medium' : 'priority-low'}`}>
                {operation.status?.toUpperCase()}
              </span>
            </div>
            <h2 className="td-title">{parentTitle}</h2>
          </div>
          <button className="td-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="td-body custom-scrollbar">
          
          {/* Progress Slider (Read-Only) */}
          <div className="td-section">
            <div className="td-section-header">
              <label>OPERATION PROGRESS: {progress}%</label>
              <span className="td-stage" style={{ color: trackColor }}>
                {progress < 50 ? 'INFILTRATE' : progress < 100 ? 'ASSAULT' : 'SECURED'}
              </span>
            </div>
            
            <div className="td-slider-container">
              <div className="td-slider-track">
                <div className="td-slider-fill" style={{ width: `${progress}%`, background: trackColor }} />
              </div>
            </div>
          </div>

          {/* Time Remaining Clock */}
          <div className="td-section">
            <div className="td-section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <label>TIME TO DEADLINE</label>
              </div>
              <span className="text-xs font-mono font-bold text-gold-bright">{countdown}</span>
            </div>
            <div className="p-3 border border-white/5 bg-white/[0.01] rounded text-[10px] font-mono text-gray-500 uppercase flex justify-between">
              <span>TARGET DATE:</span>
              <span className="text-white">{new Date(operation.deadline).toLocaleString()}</span>
            </div>
          </div>

          {/* Sub-tasks assignment details */}
          <div className="td-section">
            <div className="td-section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <label>ASSIGNED TASKS & STATUS</label>
              </div>
            </div>

            <div className="td-steps-list">
              {subtasks.map(s => {
                const assigneeName = s.assignee?.username || s.assignee?.email?.split('@')[0] || 'Unknown';
                const sParts = (s.title || '').split(' // ');
                const cleanSubtaskTitle = sParts.length > 1 ? sParts[1] : s.title;
                const isUserAssigned = s.assigned_to === user?.id;
                const linkedTask = personalTasks.find(t => t.id === s.task_id);

                return (
                  <div key={s.id} className="td-step-item" style={{ flexDirection: 'column', gap: '0.8rem', cursor: 'default' }}>
                    <div className="flex justify-between items-start w-full">
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-white text-[11px] uppercase tracking-wider">{cleanSubtaskTitle || 'UNNAMED OBJECTIVE'}</span>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[8px] text-gray-500 mt-1 uppercase">
                          <span className="flex items-center gap-1"><User size={8} /> ASSIGNEE: {assigneeName}</span>
                          <span>•</span>
                          <span className={`font-bold ${
                            s.priority === 'boss' || s.priority === 'high' ? 'text-red-500' :
                            s.priority === 'medium' ? 'text-amber-500' : 'text-green-500'
                          }`}>PRIORITY: {s.priority || 'medium'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Award size={8} /> REWARD: {s.xp_value} XP</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {/* Status badging */}
                        {!isLocked ? (
                          <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 border rounded ${
                            s.acceptance_status === 'accepted' ? 'border-green-500/20 bg-green-500/5 text-green-500' : 
                            s.acceptance_status === 'declined' ? 'border-red-500/20 bg-red-500/5 text-red-500' : 'border-amber-500/20 bg-amber-500/5 text-amber-500'
                          }`}>
                            {s.acceptance_status?.toUpperCase()}
                          </span>
                        ) : (
                          <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 border rounded ${
                            s.completion_status === 'completed' || s.completion_status === 'covered' ? 'border-gold-core/20 bg-gold-core/5 text-gold-core' : 
                            s.completion_status === 'restrained' ? 'border-red-500/20 bg-red-500/5 text-red-500' : 'border-gray-500/20 bg-gray-500/5 text-gray-500'
                          }`}>
                            {s.completion_status?.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {isUserAssigned && operation.status === 'active' && s.completion_status === 'incomplete' && linkedTask && (
                      <div className="w-full flex flex-col gap-3 pt-2 border-t border-white/[0.03]">
                        {/* Progress Slider */}
                        <div className="td-section !gap-1.5 w-full">
                          <div className="td-section-header">
                            <label className="!text-[8px] !font-mono !tracking-widest">OBJECTIVE PROGRESS: {linkedTask.progress}%</label>
                          </div>
                          <div className="td-slider-container !mt-1">
                            <div className="td-slider-track">
                              <div className="td-slider-fill" style={{ width: `${linkedTask.progress}%`, background: 'var(--gold-core)' }} />
                            </div>
                            <input 
                              type="range" 
                              min="0" max="100" step="5"
                              value={linkedTask.progress}
                              onChange={e => updateProgress(linkedTask.id, parseInt(e.target.value))}
                              className="td-native-slider"
                            />
                          </div>
                        </div>

                        {/* Field Notes */}
                        <div className="td-section !gap-1.5 w-full">
                          <div className="td-section-header">
                            <label className="!text-[8px] !font-mono !tracking-widest">FIELD NOTES</label>
                          </div>
                          <textarea 
                            className="td-textarea !min-h-[60px] !p-2"
                            placeholder="Record strategic observations, roadblocks, or intelligence..."
                            value={linkedTask.notes || ''}
                            onChange={e => updateNotes(linkedTask.id, e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Operational controls during prep or run phase */}
                    <div className="flex justify-between items-center w-full pt-2 border-t border-white/[0.03]">
                      {!isLocked ? (
                        // Reassignment for Owner during acceptance phase
                        activeLegion?.owner_id === user?.id ? (
                          <div className="flex items-center gap-2 w-full justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[8px] text-gray-500 uppercase">REASSIGN:</span>
                              <select
                                value={s.assigned_to}
                                onChange={async (e) => {
                                  const val = e.target.value;
                                  if (val && val !== s.assigned_to) {
                                    try {
                                      await reassignOperationSubtask(s.id, val);
                                    } catch (err) {
                                      alert('Reassignment failed: ' + err.message);
                                    }
                                  }
                                }}
                                className="bg-black/80 border border-white/10 text-white text-[8px] font-mono rounded px-1.5 py-0.5 outline-none hover:border-gold-core/40 transition-colors"
                              >
                                {legionMembers.map(m => (
                                  <option key={m.user_id} value={m.user_id}>
                                    {m.profile?.username || m.profile?.email?.split('@')[0] || 'Unknown'}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Remove this subtask assigned to ${assigneeName}?`)) {
                                  try {
                                    await removeOperationSubtask(s.id);
                                  } catch (err) {
                                    alert('Removal failed: ' + err.message);
                                  }
                                }
                              }}
                              className="text-red-500 hover:text-red-400 text-[8px] border border-red-500/20 px-1.5 py-0.5 rounded bg-red-500/5 hover:bg-red-500/10 transition-colors uppercase font-mono"
                            >
                              Remove Assignment
                            </button>
                          </div>
                        ) : (
                          <span className="text-[8px] text-gray-500 uppercase italic">Waiting for prep phase lock...</span>
                        )
                      ) : (
                        // Actions during active operation run phase
                        operation.status === 'active' && s.completion_status === 'incomplete' ? (
                          <div className="flex gap-2 w-full justify-end">
                            {isUserAssigned ? (
                              <button 
                                onClick={() => completeLegionSubtask(s.id, 'completed')}
                                className="text-[9px] font-mono font-bold tracking-widest bg-gold-core/25 border border-gold-core text-gold-bright px-3 py-1.5 rounded flex items-center gap-1 hover:bg-gold-core/45 hover:scale-[1.02] active:scale-100 transition-all cursor-pointer shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                              >
                                <CheckCircle size={10} /> VALIDATE EXECUTION
                              </button>
                            ) : (
                              <>
                                <button 
                                  onClick={() => completeLegionSubtask(s.id, 'covered')}
                                  className="text-[8px] border border-white/20 text-white/60 px-2 py-1 rounded hover:border-gold-core hover:text-gold-core cursor-pointer transition-colors"
                                >
                                  COVER FOR OP
                                </button>
                                {activeLegion?.owner_id === user?.id && (
                                  <button 
                                    onClick={() => restrainLegionMember(s.id)}
                                    className="text-[8px] border border-red-500/20 text-red-500 px-2 py-1 rounded hover:border-red-500 hover:bg-red-500/5 cursor-pointer transition-colors"
                                  >
                                    RESTRAIN MEMBER
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-[8px] text-gray-500 uppercase">
                            {s.completion_status === 'completed' || s.completion_status === 'covered' ? 'Task execution completed' : 'Operation phase ended'}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operation Events Logs / Operations Trail */}
          <div className="td-section text-left">
            <div className="td-section-header">
              <label>OPERATIONS INTEL TRAIL</label>
            </div>
            <div className="p-4 border border-white/5 bg-black/50 rounded flex flex-col gap-2 max-h-[160px] overflow-y-auto custom-scrollbar">
              {legionEvents.length === 0 ? (
                <span className="text-[8px] font-mono text-gray-600 uppercase">No logs recorded for this operation.</span>
              ) : (
                legionEvents.map((evt, idx) => (
                  <div key={idx} className="flex gap-2 text-[9px] font-mono leading-relaxed border-b border-white/[0.02] pb-1.5 text-left">
                    <span className="text-gold-core flex-shrink-0">
                      [{new Date(evt.created_at).toLocaleTimeString()}]
                    </span>
                    <span className="text-gray-300">
                      {evt.event_description || `Operation event: ${evt.event_type}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="td-footer">
          {operation.status === 'acceptance_open' && userSubtask && userSubtask.acceptance_status === 'pending' && (
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => respondToSubtask(userSubtask.id, 'accepted')}
                className="flex-1 py-2.5 font-mono text-[9px] font-bold border border-green-500 text-green-500 rounded hover:bg-green-500/10 transition-colors cursor-pointer"
              >
                ACCEPT ASSIGNMENT
              </button>
              <button 
                onClick={() => respondToSubtask(userSubtask.id, 'declined')}
                className="flex-1 py-2.5 font-mono text-[9px] font-bold border border-red-500 text-red-500 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                DECLINE ASSIGNMENT
              </button>
            </div>
          )}

          {operation.status === 'acceptance_open' && activeLegion?.owner_id === user?.id && (
            <button 
              type="button"
              onClick={() => lockLegionOperation(operation.id)}
              className="flex-1 py-3 font-mono text-[9px] font-bold border border-gold-core/40 text-gold-core rounded text-center block hover:bg-gold-core/10 transition-colors cursor-pointer shadow-[0_0_15px_rgba(197,160,89,0.05)]"
            >
              LOCK PREP & START TACTICAL RUN
            </button>
          )}

          {operation.status === 'active' && userSubtask && userSubtask.completion_status === 'incomplete' && userSubtask.acceptance_status === 'accepted' && (
            <button 
              onClick={async () => {
                try {
                  await completeLegionSubtask(userSubtask.id, 'completed');
                  await completeTask(userSubtask.task_id);
                  alert('Objective execution validated! Tactical logs updated.');
                } catch (err) {
                  alert('Validation failed: ' + err.message);
                }
              }}
              className="td-btn-validate"
            >
              <CheckCircle size={16} />
              <span>VALIDATE EXECUTION</span>
            </button>
          )}

          <button className="td-btn-danger" style={{ width: 'auto', padding: '0 1.5rem' }} onClick={onClose}>
            CLOSE
          </button>
        </div>

        <style jsx>{`
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

          /* MICRO STEPS */
          .td-steps-list { display: flex; flex-direction: column; gap: 0.5rem; }
          .td-step-item { 
            display: flex; align-items: flex-start; gap: 0.8rem; 
            background: rgba(255,255,255,0.02); padding: 1rem; 
            border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);
            cursor: pointer; transition: 0.2s;
          }
          .td-step-item:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }

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

          /* FOOTER ACTIONS */
          .td-footer {
            display: flex; gap: 0.75rem; padding: 1.5rem;
            background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05);
          }

          .td-btn-danger {
            width: 54px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
            background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); border-radius: 8px;
            color: rgba(220, 38, 38, 0.8); cursor: pointer; transition: 0.2s;
          }
          .td-btn-danger:hover {
            background: rgba(220, 38, 38, 0.2); border-color: rgba(220, 38, 38, 0.6); color: #ef4444; transform: translateY(-2px);
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

          .td-textarea {
            width: 100%; min-height: 100px; 
            background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); 
            border-radius: 8px; color: #fff; padding: 1rem; 
            font-family: var(--font-mono); font-size: 0.75rem; line-height: 1.5;
            resize: vertical; transition: 0.2s;
          }
          .td-textarea:focus { outline: none; border-color: rgba(197, 160, 89, 0.4); background: rgba(0,0,0,0.5); }
        `}</style>

      </motion.div>
    </div>
  );
}
