import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Plus, Trash2, Calendar, ClipboardList } from 'lucide-react';
import { useWarscytheStore } from '../store/useWarscytheStore';

export default function GymLogBook({ onClose }) {
  const { gymLog, logWorkout } = useWarscytheStore();
  const [split, setSplit] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [currentExercises, setCurrentExercises] = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);

  const handleAddExercise = () => {
    if (!exerciseName.trim() || !sets || !reps) return;
    setCurrentExercises([
      ...currentExercises,
      {
        name: exerciseName.trim(),
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight ? parseFloat(weight) : 0
      }
    ]);
    setExerciseName('');
    setSets('');
    setReps('');
    setWeight('');
  };

  const handleRemoveExercise = (idx) => {
    setCurrentExercises(currentExercises.filter((_, i) => i !== idx));
  };

  const handleSubmitWorkout = (e) => {
    e.preventDefault();
    if (!split.trim() || currentExercises.length === 0) return;
    logWorkout({
      split: split.trim(),
      exercises: currentExercises
    });
    setSplit('');
    setCurrentExercises([]);
    setShowLogForm(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="logbook-modal glass-panel custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-box">
            <Dumbbell size={18} className="text-gold" />
            <h2>GYM & FITNESS LOGBOOK</h2>
          </div>
          <button className="btn-close-circle" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="logbook-content flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <span className="panel-tag font-mono text-[10px] text-gold-core">FITNESS ARCHIVES //</span>
            {!showLogForm && (
              <button className="btn-add-workout" onClick={() => setShowLogForm(true)}>
                <Plus size={14} className="mr-1" /> LOG RECENT SPLIT
              </button>
            )}
          </div>

          <AnimatePresence>
            {showLogForm && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmitWorkout} 
                className="workout-form flex flex-col gap-4 border border-white/5 bg-white/[0.01] p-4 rounded"
              >
                <div className="form-group">
                  <label>WORKOUT SPLIT (OPEN-ENDED)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Upper Push, Javelin Sprinting, Leg Day..." 
                    value={split} 
                    onChange={e => setSplit(e.target.value)} 
                    required 
                    className="logbook-input"
                  />
                </div>

                <div className="exercise-builder border-t border-white/5 pt-3">
                  <span className="form-section-title font-mono text-[9px] text-gray-500 uppercase tracking-widest block mb-3">Add Exercises</span>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="form-group col-span-2">
                      <input 
                        type="text" 
                        placeholder="Exercise Name (e.g. Bench Press)" 
                        value={exerciseName} 
                        onChange={e => setExerciseName(e.target.value)} 
                        className="logbook-input"
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="number" 
                        placeholder="Sets" 
                        value={sets} 
                        onChange={e => setSets(e.target.value)} 
                        className="logbook-input"
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="number" 
                        placeholder="Reps" 
                        value={reps} 
                        onChange={e => setReps(e.target.value)} 
                        className="logbook-input"
                      />
                    </div>
                    <div className="form-group col-span-2">
                      <input 
                        type="number" 
                        placeholder="Weight (lbs/kg, optional)" 
                        value={weight} 
                        onChange={e => setWeight(e.target.value)} 
                        className="logbook-input"
                      />
                    </div>
                  </div>
                  <button type="button" className="btn-add-exercise" onClick={handleAddExercise}>
                    <Plus size={12} className="mr-1" /> ADD TO LIST
                  </button>
                </div>

                {currentExercises.length > 0 && (
                  <div className="exercises-list flex flex-col gap-2 mt-2">
                    {currentExercises.map((ex, idx) => (
                      <div key={idx} className="exercise-item flex justify-between items-center p-2 rounded bg-white/[0.02] border border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-mono text-white font-bold">{ex.name}</span>
                          <span className="text-[9px] font-mono text-gray-400">{ex.sets} sets x {ex.reps} reps {ex.weight > 0 && `@ ${ex.weight} kg`}</span>
                        </div>
                        <button type="button" className="text-red-400 hover:text-red-500" onClick={() => handleRemoveExercise(idx)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 justify-end border-t border-white/5 pt-3 mt-2">
                  <button type="button" className="btn-secondary" onClick={() => setShowLogForm(false)}>
                    CANCEL
                  </button>
                  <button type="submit" className="btn-primary" disabled={currentExercises.length === 0}>
                    RECORD SESSION
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="workout-history-list flex flex-col gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {(!gymLog || gymLog.length === 0) ? (
              <div className="empty-history text-center py-8">
                <ClipboardList size={36} className="text-gray-600 mb-2" />
                <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">No workout sessions archived.</p>
                <span className="text-[9px] font-mono text-gray-600 uppercase">Deploy your training splits to build iron physics.</span>
              </div>
            ) : (
              gymLog.map((log) => (
                <div key={log.id} className="history-card glass-panel bg-white/[0.01] border border-white/5 p-4 rounded flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[12px] font-display text-gold-bright tracking-wider">{log.split.toUpperCase()}</span>
                    <span className="font-mono text-[9px] text-gray-500 flex items-center gap-1">
                      <Calendar size={10} /> {new Date(log.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 pl-2 border-l border-gold-core/25">
                    {log.exercises.map((ex, idx) => (
                      <div key={idx} className="flex justify-between text-[10px] font-mono">
                        <span className="text-white font-bold">{ex.name}</span>
                        <span className="text-gray-400">{ex.sets}s × {ex.reps}r {ex.weight > 0 && `@ ${ex.weight} kg`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 2500; padding: 1rem;
        }

        .logbook-modal {
          max-width: 480px; width: 100%; border: 1px solid rgba(197, 160, 89, 0.2);
          padding: 2.2rem; background: rgba(8, 8, 10, 0.95);
          box-shadow: 0 0 40px rgba(197, 160, 89, 0.1), inset 0 0 25px rgba(0,0,0,0.85);
          border-radius: 8px; max-height: 90vh; overflow-y: auto;
        }

        .modal-header {
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 0.8rem; margin-bottom: 1.5rem;
        }

        .modal-title-box { display: flex; align-items: center; gap: 1rem; }
        .modal-title-box h2 {
          font-family: var(--font-display); font-size: 1rem; color: #fff; letter-spacing: 0.15em; margin: 0;
        }
        .text-gold { color: var(--gold-core); }

        .btn-close-circle {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-dim); display: flex; align-items: center; justify-content: center;
          transition: 0.2s;
        }
        .btn-close-circle:hover { background: var(--red-core); color: #fff; border-color: var(--red-hot); }

        .btn-add-workout {
          background: rgba(197, 160, 89, 0.1); border: 1px solid var(--gold-core);
          color: var(--gold-bright); font-family: var(--font-mono); font-size: 0.6rem;
          padding: 6px 12px; border-radius: 4px; display: flex; align-items: center; cursor: pointer;
          transition: 0.2s;
        }
        .btn-add-workout:hover { background: var(--gold-core); color: #000; }

        .logbook-input {
          width: 100%; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px; padding: 0.8rem; color: #fff; font-family: var(--font-mono); font-size: 0.75rem;
          transition: 0.2s;
        }
        .logbook-input:focus { outline: none; border-color: var(--gold-core); background: rgba(197, 160, 89, 0.05); }

        .btn-add-exercise {
          background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-dim); font-family: var(--font-mono); font-size: 0.6rem;
          padding: 6px 12px; border-radius: 4px; display: flex; align-items: center; cursor: pointer;
          transition: 0.2s; width: fit-content;
        }
        .btn-add-exercise:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }

        .btn-primary {
          background: var(--gold-core); border: 1px solid var(--gold-bright); color: #000;
          font-family: var(--font-mono); font-size: 0.65rem; font-weight: 950; padding: 8px 16px; border-radius: 4px; cursor: pointer;
        }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-primary:hover:not(:disabled) { background: var(--gold-bright); }

        .btn-secondary {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-dim); font-family: var(--font-mono); font-size: 0.65rem; padding: 8px 16px; border-radius: 4px; cursor: pointer;
        }
        .btn-secondary:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }

        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-family: var(--font-mono); font-size: 0.55rem; color: var(--text-dim); letter-spacing: 0.1em; }

        .empty-history { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; justify-content: center; }
      `}</style>
    </div>
  );
}
