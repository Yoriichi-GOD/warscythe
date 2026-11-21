import { getScrollBehavior } from '../motion/useMotionEnvironment';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { X, ShieldAlert, Crosshair, Calendar, Clock, Zap, Activity, Plus, Trash2, ChevronDown } from 'lucide-react';
import RitualTimePicker from './RitualTimePicker';

function CustomDatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dateObj = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewMonth, setViewMonth] = useState(dateObj.getMonth());
  const [viewYear, setViewYear] = useState(dateObj.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    onChange(`${viewYear}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  const daysArray = [];
  for (let i = 0; i < startOffset; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const displayDate = value ? new Date(value + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : 'Select Date...';

  return (
    <div className="custom-date-picker-container" style={{ position: 'relative', width: '100%' }}>
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-transparent" onClick={() => setIsOpen(false)} />
      )}
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'relative', zIndex: 101 }}
      >
        <span>{displayDate}</span>
        <Calendar size={12} className="text-gold-core" />
      </button>

      {isOpen && (
        <div className="custom-calendar-dropdown" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 102 }}>
          <div className="calendar-header">
            <button type="button" onClick={handlePrevMonth} className="cal-nav-btn">&lt;</button>
            <span className="calendar-month-year">{months[viewMonth]} {viewYear}</span>
            <button type="button" onClick={handleNextMonth} className="cal-nav-btn">&gt;</button>
          </div>
          <div className="calendar-weekdays">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(w => (
              <span key={w} className="calendar-weekday">{w}</span>
            ))}
          </div>
          <div className="calendar-days">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <span key={`empty-${idx}`} className="calendar-day empty" />;
              }
              const isSelected = value === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`calendar-day ${isSelected ? 'selected' : ''}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TaskModal({
  onClose,
  initialEffort = 'Medium',
  initialDraft = null,
  onDraftChange,
  onSubmitted,
}) {
  const isPresent = useIsPresent();
  const [title, setTitle] = useState(initialDraft?.title || '');
  const [category, setCategory] = useState(initialDraft?.category || 'Work');
  const [effort, setEffort] = useState(initialDraft?.effort || initialEffort);
  const [deadline, setDeadline] = useState(initialDraft?.deadline || '');
  const [deadlineTime, setDeadlineTime] = useState(initialDraft?.deadlineTime || '23:59');
  const [priority, setPriority] = useState(initialDraft?.priority || 'none');
  const [subTaskText, setSubTaskText] = useState(initialDraft?.subTaskText || '');
  const [subTasks, setSubTasks] = useState(initialDraft?.subTasks || []);
  const [error, setError] = useState(null);
  
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [effortOpen, setEffortOpen] = useState(false);
  const [formTutorialStep, setFormTutorialStep] = useState(initialDraft?.formTutorialStep || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const tasks = useWarscytheStore(state => state.tasks) || [];
  const addTask = useWarscytheStore(state => state.addTask);
  const triggerBossFlash = useWarscytheStore(state => state.triggerBossFlash);
  const tutorialStep = useWarscytheStore(state => state.tutorialStep);
  const setTutorialStep = useWarscytheStore(state => state.setTutorialStep);

  useEffect(() => {
    onDraftChange?.({
      title,
      category,
      effort,
      deadline,
      deadlineTime,
      priority,
      subTaskText,
      subTasks,
      formTutorialStep,
    });
  }, [title, category, effort, deadline, deadlineTime, priority, subTaskText, subTasks, formTutorialStep, onDraftChange]);

  const advanceTutorial = (fromStep) => {
    if (tutorialStep === 'task_modal_open' && formTutorialStep === fromStep) {
      const nextStep = fromStep + 1;
      setFormTutorialStep(nextStep);
      if (nextStep === 1) {
        setCategoryOpen(true);
        setEffortOpen(false);
      } else if (nextStep === 2) {
        setEffortOpen(true);
        setCategoryOpen(false);
      } else {
        setCategoryOpen(false);
        setEffortOpen(false);
      }
    }
  };

  const isDimmed = (stepIdx) => {
    if (error) return false;
    return tutorialStep === 'task_modal_open' && formTutorialStep !== stepIdx;
  };

  useEffect(() => {
    if (tutorialStep === 'task_modal_open') {
      const activeEl = document.getElementById(`tutorial-step-${formTutorialStep}`);
      if (activeEl) {
        setTimeout(() => {
          activeEl.scrollIntoView({ behavior: getScrollBehavior(), block: 'center' });
        }, 100);
      }
    }
  }, [formTutorialStep, tutorialStep]);

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
    if (!title || !deadline || !deadlineTime) return;

    const deadlineDate = new Date(`${deadline}T${deadlineTime}:00`);
    if (Number.isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
      setError("Choose a deadline later than the current time.");
      return;
    }
    const preciseDeadline = deadlineDate.toISOString();
    
    if (tutorialStep === 'task_modal_open') {
      setIsSubmitting(true);
      setTimeout(() => {
        const success = addTask(title, category, effort, preciseDeadline, priority, subTasks);
        if (success === true) {
          onSubmitted?.();
          setTutorialStep('click_task');
          onClose();
        } else {
          setError(success || "Operation failed.");
          setIsSubmitting(false);
        }
      }, 600);
      return;
    }

    const success = addTask(title, category, effort, preciseDeadline, priority, subTasks);
    if (success === true) {
      onSubmitted?.();
      if (effort === 'Boss') {
        triggerBossFlash('initiate');
      }
      onClose();
    } else {
      setError(success || "Operation failed.");
    }
  };

  return (
    <motion.div className="modal-backdrop" onClick={handleClose} inert={!isPresent} style={{pointerEvents:isPresent ? undefined : 'none'}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.16}}>
      <motion.div 
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="tactical-modal-shell"
        onClick={e => e.stopPropagation()}
      >
        <span className="tactical-modal-frame" aria-hidden="true">
          <img className="tactical-modal-frame__crown" src="/frames/closure/closure-dominant.webp" alt="" />
          <img className="tactical-modal-frame__corner tactical-modal-frame__corner--tl" src="/frames/ledger/corner.webp" alt="" />
          <img className="tactical-modal-frame__corner tactical-modal-frame__corner--tr" src="/frames/ledger/corner.webp" alt="" />
          <img className="tactical-modal-frame__corner tactical-modal-frame__corner--bl" src="/frames/ledger/corner.webp" alt="" />
          <img className="tactical-modal-frame__corner tactical-modal-frame__corner--br" src="/frames/ledger/corner.webp" alt="" />
        </span>
        <div className={`modal-content glass-panel tactical-modal custom-scrollbar ${
          tutorialStep === 'task_modal_open' ? 'modal-onboarding-open' : 'max-h-[78dvh] overflow-y-auto'
        }`}>
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
          <div id="tutorial-step-0" className={`form-group full motion-control duration-300 ${isDimmed(0) ? 'opacity-10 pointer-events-none filter grayscale' : ''}`}>
            <label><Zap size={10} /> OBJECTIVE IDENTIFIER</label>
            <input 
              type="text" 
              placeholder="ENTER TASK PROTOCOL..." 
              value={title} 
              onChange={e => { setTitle(e.target.value); setError(null); }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (title.trim().length > 0) {
                    advanceTutorial(0);
                  }
                }
              }}
              autoFocus
              required
            />
            {tutorialStep === 'task_modal_open' && formTutorialStep === 0 && (
              <div className="onboarding-pointer left-pointer select-pointer mt-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="pointer-tag">GUARDIAN</span>
                    <p className="text-[11px] font-serif text-white">Name your target.</p>
                  </div>
                  <img src="/guardian-observer.webp" alt="Guardian" className="w-10 h-10 object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(197,160,89,0.3)]" />
                </div>
                <button 
                  type="button" 
                  onClick={() => title.trim() && advanceTutorial(0)}
                  className="mt-2 text-[9px] font-mono text-gold-core hover:text-white uppercase tracking-wider border border-gold-core/30 px-2 py-0.5 rounded cursor-pointer self-start"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          <div className="form-grid">
            <div id="tutorial-step-1" className={`form-group motion-control duration-300 ${isDimmed(1) ? 'opacity-10 pointer-events-none filter grayscale' : ''}`} style={{ position: 'relative', zIndex: categoryOpen ? 200 : 10 }}>
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
                        onClick={() => { setCategory(opt.value); setCategoryOpen(false); setError(null); advanceTutorial(1); }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {tutorialStep === 'task_modal_open' && formTutorialStep === 1 && !categoryOpen && (
                <div className="onboarding-pointer left-pointer select-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <span className="pointer-tag">GUARDIAN</span>
                      <p className="text-[11px] font-serif text-white">Where does this strike belong?</p>
                    </div>
                    <img src="/guardian-observer.webp" alt="Guardian" className="w-10 h-10 object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(197,160,89,0.3)]" />
                  </div>
                </div>
              )}
            </div>

            <div id="tutorial-step-2" className={`form-group motion-control duration-300 ${isDimmed(2) ? 'opacity-10 pointer-events-none filter grayscale' : ''}`} style={{ position: 'relative', zIndex: effortOpen ? 200 : 10 }}>
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
                        onClick={() => { setEffort(opt.value); setEffortOpen(false); setError(null); advanceTutorial(2); }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {tutorialStep === 'task_modal_open' && formTutorialStep === 2 && !effortOpen && (
                <div className="onboarding-pointer right-pointer select-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <span className="pointer-tag">GUARDIAN</span>
                      <p className="text-[11px] font-serif text-white">How hard will it fight back?</p>
                    </div>
                    <img src="/guardian-observer.webp" alt="Guardian" className="w-10 h-10 object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(197,160,89,0.3)]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div id="tutorial-step-3" className={`form-group full motion-control duration-300 ${isDimmed(3) ? 'opacity-10 pointer-events-none filter grayscale' : ''}`}>
            <label><Calendar size={10} /> TARGET DEADLINE</label>
            <div className="operation-deadline-grid">
              <CustomDatePicker
                value={deadline}
                onChange={(val) => { setDeadline(val); setError(null); advanceTutorial(3); }}
              />
              <div className="operation-time-field">
                <span className="operation-time-label"><Clock size={10} /> EXACT TIME</span>
                <RitualTimePicker
                  value={deadlineTime}
                  onChange={(val) => { setDeadlineTime(val); setError(null); }}
                  clearLabel="Clear operation deadline time"
                />
              </div>
            </div>
            {tutorialStep === 'task_modal_open' && formTutorialStep === 3 && (
              <div className="onboarding-pointer left-pointer select-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="pointer-tag">GUARDIAN</span>
                    <p className="text-[11px] font-serif text-white">Set the clock. No clock, no strike.</p>
                  </div>
                  <img src="/guardian-observer.webp" alt="Guardian" className="w-10 h-10 object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(197,160,89,0.3)]" />
                </div>
                <button 
                  type="button" 
                  onClick={() => deadline && advanceTutorial(3)}
                  className="mt-2 text-[9px] font-mono text-gold-core hover:text-white uppercase tracking-wider border border-gold-core/30 px-2 py-0.5 rounded cursor-pointer self-start"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          <div id="tutorial-step-4" className={`form-group full motion-control duration-300 ${isDimmed(4) ? 'opacity-10 pointer-events-none filter grayscale' : ''}`}>
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
                  onClick={() => { setPriority(p.id); setError(null); advanceTutorial(4); }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {tutorialStep === 'task_modal_open' && formTutorialStep === 4 && (
              <div className="onboarding-pointer right-pointer select-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="pointer-tag">GUARDIAN</span>
                    <p className="text-[11px] font-serif text-white">How loud does this scream?</p>
                  </div>
                  <img src="/guardian-observer.webp" alt="Guardian" className="w-10 h-10 object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(197,160,89,0.3)]" />
                </div>
                <button 
                  type="button" 
                  onClick={() => advanceTutorial(4)}
                  className="mt-2 text-[9px] font-mono text-gold-core hover:text-white uppercase tracking-wider border border-gold-core/30 px-2 py-0.5 rounded cursor-pointer self-start"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          <div className={`form-group full motion-control duration-300 ${isDimmed(-1) ? 'opacity-20 pointer-events-none filter grayscale' : ''}`}>
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

          <div id="tutorial-step-5" className={`modal-footer motion-control duration-300 ${isDimmed(5) ? 'opacity-10 pointer-events-none filter grayscale' : ''}`}>
            <button type="submit" className="btn-primary deploy-btn">
              <span className="deploy-btn-frame" aria-hidden="true">
                <img className="deploy-btn-frame__line" src="/frames/dividers/sapphire-line.webp" alt="" />
                <img className="deploy-btn-frame__terminal deploy-btn-frame__terminal--left" src="/frames/dividers/sapphire-terminal.webp" alt="" />
                <img className="deploy-btn-frame__terminal deploy-btn-frame__terminal--right" src="/frames/dividers/sapphire-terminal.webp" alt="" />
                <img className="deploy-btn-frame__gem" src="/frames/dividers/gold-diamond.webp" alt="" />
              </span>
              <span>{isSubmitting ? "LOCKING IT IN..." : "CONFIRM DEPLOYMENT"}</span>
            </button>
            {tutorialStep === 'task_modal_open' && formTutorialStep === 5 && (
              <div className="onboarding-pointer left-pointer select-pointer mt-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="pointer-tag">GUARDIAN</span>
                    <p className="text-[11px] font-serif text-white">Confirm. There's no walking this back.</p>
                  </div>
                  <img src="/guardian-observer.webp" alt="Guardian" className="w-10 h-10 object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(197,160,89,0.3)]" />
                </div>
              </div>
            )}
          </div>
        </form>
        </div>
      </motion.div>

      <style>{`
        .modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.68); backdrop-filter: blur(5px);
          display: flex; justify-content: center; align-items: flex-start; z-index: 1000;
          padding: 1rem;
          padding-top: max(1rem, env(safe-area-inset-top));
          overflow-y: auto;
        }

        .tactical-modal-shell {
          width: 100%;
          max-width: 500px;
          margin: auto;
          position: relative;
          isolation: isolate;
        }

        .tactical-modal { 
          width: 100%; 
          max-width: none;
          padding: 1rem;
          max-height: 78dvh;
          overflow-y: auto;
          overscroll-behavior: contain;
          border: 0;
          box-shadow: inset 0 0 38px rgba(0,0,0,0.72), 0 0 50px rgba(0,0,0,0.8), 0 0 24px rgba(197,160,89,0.08);
          background: linear-gradient(135deg, rgba(7, 7, 10, 0.98), rgba(0, 0, 0, 0.99)) !important;
          margin: 0;
          position: relative;
          scrollbar-width: thin;
          scrollbar-color: rgba(197, 160, 89, 0.35) rgba(255, 255, 255, 0.02);
        }
        .tactical-modal::-webkit-scrollbar { width: 4px; }
        .tactical-modal::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .tactical-modal::-webkit-scrollbar-thumb { background: rgba(197, 160, 89, 0.35); border-radius: 2px; }

        .tactical-modal-frame {
          position: absolute;
          inset: 0;
          z-index: 6;
          overflow: visible;
          pointer-events: none;
        }
        .tactical-modal-frame img {
          position: absolute;
          display: block;
          object-fit: contain;
          user-select: none;
          filter: drop-shadow(0 3px 7px rgba(0, 0, 0, 0.9));
        }
        .tactical-modal-frame__crown {
          top: -76px;
          left: 50%;
          width: min(430px, 86vw);
          height: 160px;
          transform: translateX(-50%);
        }
        .tactical-modal-frame__corner {
          --task-modal-ledger-width: clamp(92px, 10vw, 138px);
          width: var(--task-modal-ledger-width);
          aspect-ratio: 2 / 3;
        }
        .tactical-modal-frame__corner--bl {
          bottom: calc(var(--task-modal-ledger-width) * -0.322);
          left: calc(var(--task-modal-ledger-width) * -0.198);
          transform: scaleY(-1);
        }
        .tactical-modal-frame__corner--tl {
          top: calc(var(--task-modal-ledger-width) * -0.322);
          left: calc(var(--task-modal-ledger-width) * -0.198);
        }
        .tactical-modal-frame__corner--tr {
          top: calc(var(--task-modal-ledger-width) * -0.322);
          right: calc(var(--task-modal-ledger-width) * -0.198);
          transform: scaleX(-1);
        }
        .tactical-modal-frame__corner--br {
          right: calc(var(--task-modal-ledger-width) * -0.198);
          bottom: calc(var(--task-modal-ledger-width) * -0.322);
          transform: scale(-1);
        }

        @media (min-width: 640px) {
          .tactical-modal { padding: 2.5rem; max-height: 85dvh; }
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
          transition: var(--motion-control-transition);
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
          transition: var(--motion-control-transition);
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
          transition: var(--motion-control-transition);
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
          transition: var(--motion-control-transition);
          margin-left: 0.5rem;
        }

        .btn-add-sub:hover {
          background: rgba(255,255,255,0.05);
          border-color: var(--gold-core);
          color: #fff;
        }

        .deploy-btn {
          position: relative;
          isolation: isolate;
          overflow: visible;
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
          transition: var(--motion-control-transition);
          margin-top: 1rem;
        }

        .deploy-btn:hover {
          background: var(--gold-core);
          color: #000;
          box-shadow: 0 0 25px rgba(197, 160, 89, 0.4);
        }

        .deploy-btn span { position: relative; z-index: 2; font-weight: 700; }
        .deploy-btn > span:last-child { z-index: 5; }
        .deploy-btn-frame {
          position: absolute !important;
          inset: 0;
          z-index: 4 !important;
          pointer-events: none;
          overflow: visible;
        }
        .deploy-btn-frame img {
          position: absolute;
          display: block;
          object-fit: contain;
          user-select: none;
        }
        .deploy-btn-frame__line {
          top: -22px;
          left: 8%;
          width: 84%;
          height: 44px;
          object-fit: fill !important;
        }
        .deploy-btn-frame__terminal {
          top: auto;
          bottom: -31px;
          width: 78px;
          height: 62px;
          filter: drop-shadow(0 0 7px rgba(52, 105, 190, .34));
        }
        .deploy-btn-frame__terminal--left { left: -24px; transform: scaleX(-1); }
        .deploy-btn-frame__terminal--right { right: -24px; }
        .deploy-btn-frame__gem {
          top: -32px;
          left: 50%;
          width: 64px;
          height: 64px;
          transform: translateX(-50%);
          filter: drop-shadow(0 0 9px rgba(236, 200, 128, .42));
        }

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
          transition: var(--motion-control-transition);
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
          transition: var(--motion-control-transition);
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
          pointer-events: auto;
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
          gap: 1.5rem;
        }

        .onboarding-pointer {
          margin-top: 0.5rem;
          border-color: rgba(197, 160, 89, 0.3);
          background: rgba(197, 160, 89, 0.03);
        }

        /* ═══════════════ CUSTOM CALENDAR DROPDOWN STYLE ═══════════════ */
        .custom-calendar-dropdown {
          background: #000000 !important;
          border: 1px solid rgba(197, 160, 89, 0.3) !important;
          border-radius: 4px;
          padding: 10px;
          width: 230px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8);
          font-family: 'Times New Roman', Georgia, Times, serif;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 6px;
        }

        .calendar-month-year {
          color: #c5a059;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cal-nav-btn {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 2px;
        }

        .cal-nav-btn:hover {
          color: #c5a059;
          background: rgba(255,255,255,0.05);
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 4px;
        }

        .calendar-weekday {
          color: #8c6a4a;
          font-size: 8px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }

        .calendar-day {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 10px;
          padding: 4px 0;
          text-align: center;
          cursor: pointer;
          border-radius: 2px;
          font-family: var(--font-mono);
        }

        .calendar-day:hover:not(.empty) {
          background: rgba(197, 160, 89, 0.15);
          color: #c5a059;
        }

        .calendar-day.selected {
          background: #c5a059 !important;
          color: #000000 !important;
          font-weight: bold;
        }

        .calendar-day.empty {
          cursor: default;
        }

        @media (max-width: 639px) {
          .modal-backdrop {
            top: 108px;
            bottom: calc(72px + env(safe-area-inset-bottom));
            left: 0;
            width: 100%;
            height: auto;
            padding: 0.5rem 0.7rem;
            align-items: center;
            overflow: hidden;
          }

          .tactical-modal,
          .modal-onboarding-open {
            width: 100%;
            max-width: 520px;
            max-height: 100% !important;
            margin: 0;
            padding: 0.7rem 0.8rem;
            overflow-y: auto !important;
            border-color: rgba(236, 200, 128, 0.38);
            border-radius: 10px;
          }

          .modal-header {
            min-height: 48px;
            margin-bottom: 0.65rem;
            padding-bottom: 0.55rem;
          }

          .modal-title-box { gap: 0.65rem; }
          .modal-title-box h2 { font-size: 0.78rem; }
          .btn-close-circle { width: 30px; height: 30px; }

          .tactical-form,
          .modal-onboarding-open .tactical-form {
            gap: 0.62rem;
          }

          .form-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.6rem;
          }

          .form-group { gap: 0.35rem; }

          input,
          select,
          .custom-select-trigger {
            min-height: 42px;
            padding: 0.65rem 0.72rem;
            font-size: 0.68rem;
          }

          .operation-deadline-grid {
            grid-template-columns: 1fr;
            gap: 0.55rem;
          }

          .operation-time-field {
            width: 100%;
          }

          .operation-time-field .ritual-time-popover {
            width: 100%;
          }

          .operation-time-label {
            margin-bottom: 0.25rem;
            font-size: 0.48rem;
          }

          .operation-time-field .ritual-time-trigger {
            min-height: 42px;
            padding: 0.55rem 0.6rem;
            font-size: 0.58rem;
          }

          .priority-btn { padding: 0.58rem 0.3rem; font-size: 0.52rem; }
          .btn-add-sub { width: 42px; margin-left: 0; }
          .deploy-btn { height: 44px; margin-top: 0.15rem; font-size: 0.72rem; }
          .capacity-warning { padding: 0.6rem; }
          .warning-text { font-size: 0.62rem; }
          .onboarding-pointer { padding: 0.55rem; margin-top: 0.25rem; }
        }
      `}</style>
    </motion.div>
  );
}
