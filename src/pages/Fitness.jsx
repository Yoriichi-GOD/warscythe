import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { getAssetUrl } from '../utils/assetResolver';
import { 
  Dumbbell, Play, Square, Plus, Trash2, Check, 
  RotateCcw, ShieldAlert, Award, Star, TrendingUp, 
  Calendar, Flame, Sparkles, ChevronDown, CheckSquare, SquareSquare,
  ClipboardList, X, Info
} from 'lucide-react';


const OrnatePanel = ({ children, className = '', ...props }) => {
  return (
    <div className={`elite-panel ${className}`} {...props}>
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default function Fitness() {
  const {
    gymLog,
    activeWorkout,
    startWorkout,
    cancelWorkout,
    addMovement,
    removeMovement,
    addSetToMovement,
    updateSetInMovement,
    deleteSetFromMovement,
    logWorkout,
    getTotalTonnage,
    getDeityProgress,
    updateActiveWorkoutNotes,
    activeTheme
  } = useWarscytheStore();

  const deityState = getDeityProgress();
  const totalTonnage = deityState.totalTonnage;
  const activeDeity = deityState.activeDeity;
  const nextDeity = deityState.nextDeity;
  const progressPercent = deityState.progressPercent;
  const deities = deityState.deities;

  // Split template dropdown state
  const [splitDropdownOpen, setSplitDropdownOpen] = useState(false);
  const [customSplitName, setCustomSplitName] = useState('');
  const [showCustomSplitInput, setShowCustomSplitInput] = useState(false);

  // New Movement state
  const [newMovementName, setNewMovementName] = useState('');
  const [movementDropdownOpen, setMovementDropdownOpen] = useState(false);

  // Selected/Focused set for the RPE Dial
  const [focusedSet, setFocusedSet] = useState(null); // { movementId, setId }

  // Rest Timer state
  const [timerDuration, setTimerDuration] = useState(90); // default 90s
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  // Detailed History Modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Split presets
  const splitPresets = [
    "SBD Powerlifting Day",
    "Upper Push (Bench Focus)",
    "Lower Squat Day",
    "Deadlift & Pull Day",
    "Hypertrophy Arms & Shoulders",
    "Custom Workout Split"
  ];

  // Common movement presets
  const movementPresets = [
    "Squat (Low Bar)",
    "Bench Press (Competition)",
    "Deadlift (Conventional)",
    "Deadlift (Sumo)",
    "Overhead Press",
    "Incline Dumbbell Bench",
    "Barbell Row",
    "Pull-Up (Weighted)",
    "Leg Press",
    "RDL (Romanian Deadlift)"
  ];

  // Handle set completion trigger for Rest Timer
  const handleToggleSetComplete = (movementId, setId, currentlyCompleted) => {
    const nextCompleted = !currentlyCompleted;
    updateSetInMovement(movementId, setId, { completed: nextCompleted });

    if (nextCompleted) {
      // Start rest timer automatically
      setTimerSeconds(timerDuration);
      setTimerActive(true);
    }
  };

  // Timer loop (Only restarts when active state changes, avoiding the per-second restart bug)
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive]);

  const handleStartWorkout = (split) => {
    startWorkout(split);
    setSplitDropdownOpen(false);
    setShowCustomSplitInput(false);
    setCustomSplitName('');
    setFocusedSet(null);
  };

  // Increment / Decrement RPE
  const handleAdjustRpe = (amount) => {
    if (!focusedSet || !activeWorkout) return;
    const movement = activeWorkout.movements.find(m => m.id === focusedSet.movementId);
    if (!movement) return;
    const setObj = movement.sets.find(s => s.id === focusedSet.setId);
    if (!setObj) return;

    const newRpe = Math.min(10, Math.max(1, (setObj.rpe || 8) + amount));
    updateSetInMovement(focusedSet.movementId, focusedSet.setId, { rpe: newRpe });
  };

  // Format timer string
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Tonnage calculation helper for individual sessions
  const getSessionTonnage = (workout) => {
    if (workout.movements) {
      return workout.movements.reduce((total, m) => {
        return total + (m.sets || []).reduce((sum, s) => {
          if (s.completed && s.type !== 'warmup') {
            return sum + (Number(s.weight) || 0) * (Number(s.reps) || 0);
          }
          return sum;
        }, 0);
      }, 0);
    }
    if (workout.exercises) {
      return workout.exercises.reduce((total, e) => {
        return total + (Number(e.sets) || 0) * (Number(e.reps) || 0) * (Number(e.weight) || 0);
      }, 0);
    }
    return 0;
  };

  // Count total logged workouts
  const totalWorkouts = gymLog.length;

  return (
    <div className="w-full pt-4 pb-32">
      {/* 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN: THE IRON LEDGER (Columns: 5) ================= */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <OrnatePanel className="border-gold-core/25 !overflow-visible fitness-panel-glass">
            <div className="panel-header-custom flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-gold-core/60 tracking-widest uppercase font-bold">SESSION CONTROL</span>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg text-white tracking-wider uppercase">THE IRON LEDGER</h3>
                  <button 
                    type="button"
                    onClick={() => useWarscytheStore.getState().openVideoModal('fitness')}
                    className="text-gold-core/70 hover:text-gold-bright transition-colors ml-1.5 cursor-pointer"
                    title="Play Walkthrough Guide"
                  >
                    <Play size={12} fill="currentColor" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => useWarscytheStore.getState().openInfoModal('fitness')}
                    className="text-gold-core/70 hover:text-gold-bright transition-colors ml-1"
                    title="Fitness Info"
                  >
                    <Info size={14} />
                  </button>
                </div>
              </div>
              <Dumbbell size={16} className="text-gold-core" />
            </div>

            {/* Active workout state */}
            {!activeWorkout ? (
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-4">
                  No active training session initialized.
                </p>
                
                {/* Custom Split Dropdown Trigger */}
                <div className="relative w-full max-w-xs">
                  <button 
                    onClick={() => setSplitDropdownOpen(!splitDropdownOpen)}
                    className="w-full bg-black border border-white/10 hover:border-gold-core text-white px-4 py-2.5 rounded font-mono text-[10px] tracking-widest uppercase flex justify-between items-center transition-all"
                  >
                    <span>SELECT TRAINING SPLIT</span>
                    <ChevronDown size={14} className={`text-gold-core transition-transform ${splitDropdownOpen ? 'rotate-185' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {splitDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 mt-1.5 bg-black border border-white/15 rounded z-50 max-h-[220px] overflow-y-auto custom-scrollbar shadow-2xl"
                      >
                        {splitPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (preset === "Custom Workout Split") {
                                setShowCustomSplitInput(true);
                                setSplitDropdownOpen(false);
                              } else {
                                handleStartWorkout(preset);
                              }
                            }}
                            className="w-full text-left font-mono text-[9px] text-gray-300 hover:text-white hover:bg-white/[0.04] px-4 py-2 border-b border-white/5 transition-all"
                          >
                            {preset.toUpperCase()}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {showCustomSplitInput && (
                  <div className="mt-4 w-full max-w-xs flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="ENTER CUSTOM SPLIT NAME"
                      value={customSplitName}
                      onChange={(e) => setCustomSplitName(e.target.value)}
                      className="bg-black border border-white/15 rounded p-2 text-[10px] text-white font-mono placeholder-gray-600 focus:outline-none focus:border-gold-core uppercase"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStartWorkout(customSplitName || 'Custom Split')}
                        className="flex-1 bg-gold-core hover:bg-gold-bright text-black font-extrabold font-mono text-[9px] py-1.5 rounded uppercase tracking-wider"
                      >
                        INITIATE
                      </button>
                      <button 
                        onClick={() => setShowCustomSplitInput(false)}
                        className="flex-1 bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 font-mono text-[9px] py-1.5 rounded uppercase tracking-wider"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ACTIVE WORKOUT PANEL */
              <div className="flex flex-col gap-4">
                {/* Active Split Details */}
                <div className="flex justify-between items-center bg-gold-core/5 border border-gold-core/15 p-3 rounded">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-gold-core/70 tracking-widest uppercase">ACTIVE LIFTS</span>
                    <span className="font-display text-xs text-white tracking-widest uppercase font-bold">{activeWorkout.split}</span>
                  </div>
                  <button 
                    onClick={cancelWorkout}
                    className="border border-red-500/20 hover:border-red-500 text-red-500/80 hover:text-red-500 bg-red-500/5 px-2.5 py-1 rounded font-mono text-[8px] tracking-widest uppercase transition-all"
                  >
                    ABANDON
                  </button>
                </div>

                {/* Add Movement Selector */}
                <div className="relative">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ADD MOVEMENT (E.G. SQUAT)"
                      value={newMovementName}
                      onChange={(e) => setNewMovementName(e.target.value)}
                      onFocus={() => setMovementDropdownOpen(true)}
                      className="flex-1 bg-black border border-white/15 rounded p-2 text-[10px] text-white font-mono placeholder-gray-600 focus:outline-none focus:border-gold-core uppercase"
                    />
                    <button 
                      onClick={() => {
                        if (newMovementName.trim()) {
                          addMovement(newMovementName.trim());
                          setNewMovementName('');
                          setMovementDropdownOpen(false);
                        }
                      }}
                      className="bg-white/5 border border-white/10 hover:border-gold-core hover:bg-gold-core/10 text-white hover:text-gold-core px-3 rounded font-mono text-[10px] transition-all flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {movementDropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1 bg-black border border-white/15 rounded z-50 max-h-[160px] overflow-y-auto custom-scrollbar shadow-2xl">
                      {movementPresets
                        .filter(p => p.toLowerCase().includes(newMovementName.toLowerCase()))
                        .map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              addMovement(preset);
                              setNewMovementName('');
                              setMovementDropdownOpen(false);
                            }}
                            className="w-full text-left font-mono text-[9px] text-gray-300 hover:text-white hover:bg-white/[0.04] px-4 py-2 border-b border-white/5 transition-all"
                          >
                            {preset.toUpperCase()}
                          </button>
                        ))
                      }
                      <button 
                        onClick={() => setMovementDropdownOpen(false)}
                        className="w-full text-center font-mono text-[8px] text-gray-500 py-1.5 bg-white/[0.01]"
                      >
                        CLOSE PRESETS
                      </button>
                    </div>
                  )}
                </div>

                {/* Movements and Sets list */}
                <div className="flex flex-col gap-4 mt-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1.5">
                  {activeWorkout.movements.length === 0 ? (
                    <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest text-center py-6">
                      Add movements to begin structure.
                    </p>
                  ) : (
                    activeWorkout.movements.map((movement) => (
                      <div key={movement.id} className="border border-white/5 bg-white/[0.01] p-3 rounded flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="font-display text-[11px] text-white tracking-widest uppercase font-bold">
                            {movement.name}
                          </span>
                          <button 
                            onClick={() => removeMovement(movement.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {/* Set Builder List */}
                        <div className="flex flex-col gap-2">
                          {(movement.sets || []).map((setObj, index) => {
                            const isFocused = focusedSet?.movementId === movement.id && focusedSet?.setId === setObj.id;
                            return (
                              <div 
                                key={setObj.id} 
                                onClick={() => setFocusedSet({ movementId: movement.id, setId: setObj.id })}
                                className={`flex items-center gap-1.5 p-1.5 rounded transition-all cursor-pointer ${
                                  isFocused 
                                    ? 'bg-gold-core/5 border border-gold-core/30 shadow-[0_0_8px_rgba(197,160,89,0.15)]' 
                                    : 'border border-transparent bg-black/40 hover:border-white/5'
                                }`}
                              >
                                {/* Set Number and type select dropdown */}
                                <select
                                  value={setObj.type}
                                  onChange={(e) => updateSetInMovement(movement.id, setObj.id, { type: e.target.value })}
                                  onClick={(e) => e.stopPropagation()}
                                  className="bg-black border border-white/10 text-white font-mono text-[8px] rounded px-1.5 py-0.5 focus:outline-none uppercase shrink-0"
                                >
                                  <option value="warmup">WU</option>
                                  <option value="working">WORK</option>
                                  <option value="topset">TOP</option>
                                  <option value="amrap">AMRAP</option>
                                </select>

                                {/* Weight Input */}
                                <div className="flex items-center gap-0.5 flex-1 min-w-0">
                                  <input 
                                    type="number"
                                    placeholder="KG"
                                    value={setObj.weight || ''}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => updateSetInMovement(movement.id, setObj.id, { weight: e.target.value })}
                                    className="w-full bg-black border border-white/10 text-white font-mono text-[9px] text-center rounded py-0.5 focus:outline-none focus:border-gold-core"
                                  />
                                  <span className="text-[7px] font-mono text-gray-500">KG</span>
                                </div>

                                {/* Reps Input */}
                                <div className="flex items-center gap-0.5 flex-1 min-w-0">
                                  <input 
                                    type="number"
                                    placeholder="RPS"
                                    value={setObj.reps || ''}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => updateSetInMovement(movement.id, setObj.id, { reps: e.target.value })}
                                    className="w-full bg-black border border-white/10 text-white font-mono text-[9px] text-center rounded py-0.5 focus:outline-none focus:border-gold-core"
                                  />
                                  <span className="text-[7px] font-mono text-gray-500">RPS</span>
                                </div>

                                {/* RPE input block */}
                                <div className="flex items-center gap-0.5 w-[50px] shrink-0">
                                  <span className="text-[7px] font-mono text-gray-500 uppercase">@</span>
                                  <input 
                                    type="number"
                                    step="0.5"
                                    placeholder="RPE"
                                    value={setObj.rpe || ''}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => updateSetInMovement(movement.id, setObj.id, { rpe: e.target.value })}
                                    className="w-full bg-black border border-white/10 text-white font-mono text-[9px] text-center rounded py-0.5 focus:outline-none focus:border-gold-core"
                                  />
                                </div>

                                {/* Completed Checkbox */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleSetComplete(movement.id, setObj.id, setObj.completed);
                                  }}
                                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                                    setObj.completed
                                      ? 'border-gold-core text-black bg-gold-core shadow-[0_0_8px_rgba(197,160,89,0.3)]'
                                      : 'border-white/10 text-transparent hover:border-gold-core/50 bg-black/60'
                                  }`}
                                >
                                  <Check size={10} strokeWidth={3} />
                                </button>

                                {/* Delete Set */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSetFromMovement(movement.id, setObj.id);
                                    if (focusedSet?.setId === setObj.id) setFocusedSet(null);
                                  }}
                                  className="text-gray-600 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            );
                          })}

                          {/* Add Set Button */}
                          <button
                            onClick={() => addSetToMovement(movement.id, { weight: 0, reps: 0, rpe: 8, type: 'working' })}
                            className="w-full border border-dashed border-white/10 hover:border-gold-core/35 text-[8px] font-mono text-gray-400 hover:text-gold-core py-1 rounded transition-all uppercase tracking-widest flex items-center justify-center gap-1 mt-1"
                          >
                            <Plus size={10} /> ADD SET
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Session Notes Input */}
                <div className="flex flex-col gap-1 mt-2">
                  <label className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                    SESSION NOTES
                  </label>
                  <textarea 
                    placeholder="ENTER TRAINING NOTES (E.G. FEELING STRONG, SLEEP QUALITY, ETC.)" 
                    value={activeWorkout.notes || ''} 
                    onChange={e => updateActiveWorkoutNotes(e.target.value)} 
                    className="w-full bg-black border border-white/10 hover:border-gold-core/30 rounded p-2 text-[9px] text-white font-mono placeholder-gray-600 focus:outline-none focus:border-gold-core h-16 resize-none uppercase"
                  />
                </div>

                {/* Submit Session Button */}
                <button
                  onClick={() => {
                    logWorkout();
                    setFocusedSet(null);
                  }}
                  disabled={activeWorkout.movements.length === 0}
                  className="w-full bg-gold-core hover:bg-gold-bright disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold font-mono text-[10px] py-2.5 rounded uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(197,160,89,0.2)] mt-2"
                >
                  ARCHIVE COMPLETED SESSION
                </button>
              </div>
            )}
          </OrnatePanel>

          {/* Training Controls widgets: RPE Dial and Rest Timer */}
          {activeWorkout && (
            <div className="grid grid-cols-2 gap-4">
              
              {/* RPE Dial Widget */}
              <OrnatePanel className="flex flex-col justify-between h-[155px] relative overflow-hidden !p-3 fitness-panel-glass">
                <div className="flex justify-between items-start mb-1 z-10">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-mono text-gold-core/60 tracking-wider uppercase font-bold">RPE DIAL</span>
                    <span className="text-[8px] font-mono text-gray-500 uppercase">Focused Set Fatigue</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 z-10 flex-1">
                  {/* Circular Dial Column */}
                  <div className="flex items-center justify-center relative w-[80px] h-[80px] select-none shrink-0">
                    <svg className="w-full h-full radial-dial-svg" viewBox="0 0 80 80">
                      {/* Background arc: 270 deg (circumference 213.6 * 0.75 = 160.2) rotated 135 deg to center gap at bottom */}
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className="radial-dial-bg"
                        strokeWidth="3.5"
                        fill="transparent"
                        strokeDasharray="160.2 53.4"
                        strokeLinecap="round"
                        transform="rotate(135 40 40)"
                      />
                      {/* Progress arc */}
                      {focusedSet && activeWorkout && (() => {
                        const movement = activeWorkout.movements.find(m => m.id === focusedSet.movementId);
                        const setObj = movement?.sets.find(s => s.id === focusedSet.setId);
                        if (!setObj) return null;
                        
                        const rpeVal = Number(setObj.rpe) || 0;
                        const progressRatio = Math.min(10, Math.max(0, rpeVal)) / 10;
                        const progressStroke = progressRatio * 160.2;
                        
                        return (
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            className="radial-dial-progress radial-dial-glow"
                            strokeWidth="3.5"
                            fill="transparent"
                            strokeDasharray={`${progressStroke} ${213.6 - progressStroke}`}
                            strokeLinecap="round"
                            transform="rotate(135 40 40)"
                          />
                        );
                      })()}
                    </svg>
                    {/* Centered Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-1.5">
                      {focusedSet && activeWorkout ? (() => {
                        const movement = activeWorkout.movements.find(m => m.id === focusedSet.movementId);
                        const setObj = movement?.sets.find(s => s.id === focusedSet.setId);
                        if (!setObj) return <span className="font-mono text-xs text-gray-600">--</span>;
                        return (
                          <>
                            <span className="font-display text-sm font-extrabold text-gold-bright tracking-wider leading-none">
                              {Number(setObj.rpe).toFixed(1)}
                            </span>
                            <span className="text-[5px] font-mono text-gray-500 uppercase tracking-widest mt-0.5 font-bold">RPE</span>
                          </>
                        );
                      })() : (
                        <>
                          <span className="font-mono text-xs text-gray-600">--</span>
                          <span className="text-[5px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">READY</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col justify-center gap-1.5 flex-1 pl-1 min-w-0">
                    {focusedSet && activeWorkout ? (() => {
                      const movement = activeWorkout.movements.find(m => m.id === focusedSet.movementId);
                      const setObj = movement?.sets.find(s => s.id === focusedSet.setId);
                      if (!setObj) return null;
                      return (
                        <>
                          <span className="text-[7.5px] font-mono text-gold-core/70 uppercase tracking-wider text-center truncate max-w-full font-bold block">
                            {movement.name}
                          </span>
                          <div className="flex gap-1 w-full">
                            <button 
                              onClick={() => handleAdjustRpe(-0.5)}
                              className="flex-1 bg-white/[0.02] border border-white/10 hover:border-gold-core/30 hover:bg-gold-core/5 text-white font-mono text-[9px] py-1 rounded select-none transition-all flex items-center justify-center font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <button 
                              onClick={() => handleAdjustRpe(0.5)}
                              className="flex-1 bg-white/[0.02] border border-white/10 hover:border-gold-core/30 hover:bg-gold-core/5 text-white font-mono text-[9px] py-1 rounded select-none transition-all flex items-center justify-center font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </>
                      );
                    })() : (
                      <span className="text-[6.5px] font-mono text-gray-500 uppercase tracking-wider leading-relaxed text-center block">
                        Select a set to enable dial
                      </span>
                    )}
                  </div>
                </div>
              </OrnatePanel>

              {/* Rest Timer Widget */}
              <OrnatePanel className="flex flex-col justify-between h-[155px] relative overflow-hidden !p-3 fitness-panel-glass">
                <div className="flex justify-between items-center mb-1 z-10">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-mono text-gold-core/60 tracking-wider uppercase font-bold">REST TIMER</span>
                    <span className="text-[8px] font-mono text-gray-500 uppercase">Active Recovery</span>
                  </div>
                  
                  {/* Select Rest Duration */}
                  <select 
                    value={timerDuration}
                    onChange={(e) => {
                      const dur = Number(e.target.value);
                      setTimerDuration(dur);
                      if (!timerActive) setTimerSeconds(dur);
                    }}
                    className="bg-black border border-white/10 text-white font-mono text-[7px] rounded px-1 py-0.5 focus:outline-none cursor-pointer"
                  >
                    <option value={60}>60s</option>
                    <option value={90}>90s</option>
                    <option value={120}>120s</option>
                    <option value={180}>180s</option>
                    <option value={300}>300s</option>
                  </select>
                </div>

                <div className="flex items-center justify-between gap-1 z-10 flex-1">
                  {/* Circular Dial Column */}
                  <div className="flex items-center justify-center relative w-[80px] h-[80px] select-none cursor-pointer shrink-0"
                    onClick={() => {
                      if (!timerActive && timerSeconds === 0) {
                        setTimerSeconds(timerDuration);
                      }
                      setTimerActive(!timerActive);
                    }}
                  >
                    <svg className="w-full h-full -rotate-90 radial-dial-svg" viewBox="0 0 80 80">
                      {/* Background circle */}
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className="radial-dial-bg"
                        strokeWidth="3.5"
                        fill="transparent"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className="radial-dial-progress radial-dial-glow"
                        strokeWidth="3.5"
                        fill="transparent"
                        strokeDasharray={213.6}
                        strokeDashoffset={213.6 - (timerSeconds / (timerDuration || 1)) * 213.6}
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Centered Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono text-[10.5px] font-bold text-white tracking-wider leading-none">
                        {formatTime(timerSeconds)}
                      </span>
                      <span className="text-[5.5px] font-mono text-gold-core/60 uppercase tracking-widest mt-1 font-bold">
                        {timerActive ? 'PAUSE' : 'START'}
                      </span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col gap-1.5 flex-1 pl-1 min-w-0">
                    <div className="flex gap-1 w-full">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setTimerSeconds(prev => Math.max(0, prev - 30));
                        }}
                        className="flex-1 bg-white/[0.02] border border-white/10 hover:border-gold-core/30 hover:bg-gold-core/5 text-gray-400 hover:text-white font-mono text-[7px] py-1 rounded uppercase select-none transition-all cursor-pointer"
                      >
                        -30s
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setTimerSeconds(prev => prev + 30);
                        }}
                        className="flex-1 bg-white/[0.02] border border-white/10 hover:border-gold-core/30 hover:bg-gold-core/5 text-gray-400 hover:text-white font-mono text-[7px] py-1 rounded uppercase select-none transition-all cursor-pointer"
                      >
                        +30s
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTimerSeconds(timerDuration);
                        setTimerActive(false);
                      }}
                      className="w-full bg-white/[0.02] border border-white/10 hover:border-red-500/40 hover:bg-red-500/5 text-gray-400 hover:text-red-400 font-mono text-[7px] py-1 rounded uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={8} /> RESET
                    </button>
                  </div>
                </div>
              </OrnatePanel>

            </div>
          )}
        </div>

        {/* ================= CENTER COLUMN: THE PANTHEON OF IRON (Columns: 4) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <OrnatePanel className="text-center relative overflow-hidden !p-4 elite-panel-clear">
            
            {/* Background God Aura Light */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,200,128,0.12)_0%,transparent_70%)] pointer-events-none" />

            <div className="flex flex-col items-center relative z-10 pt-1 w-full">
              <span className="text-[8px] font-mono text-gold-core/60 tracking-[0.3em] uppercase font-bold mb-1">ACTIVE DEITY AVATAR</span>
              <h2 className="font-display text-2xl text-white tracking-[0.1em] uppercase mb-1">{activeDeity.name}</h2>
              <p className="text-[8.5px] font-mono text-gray-500 uppercase tracking-wider mb-4 px-2 leading-relaxed italic">"{activeDeity.desc}"</p>

              {/* Progress Slider towards next Deity (Gold Theme) - Moved Under Header */}
              <div className="w-full mb-4 px-1">
                {nextDeity ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[7.5px] font-mono text-gray-500 uppercase tracking-widest">
                      <span>NEXT TIER: {nextDeity.name.toUpperCase()}</span>
                      <span>{Math.round(totalTonnage).toLocaleString()} / {nextDeity.threshold.toLocaleString()} KG</span>
                    </div>
                    
                    {/* Slider Progress Bar */}
                    <div className="w-full h-2 bg-black border border-white/10 rounded-full overflow-hidden p-0.5">
                      <motion.div 
                        className="h-full bg-gold-core rounded-full"
                        style={{ width: `${progressPercent}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    
                    <span className="text-[7px] font-mono text-gold-core uppercase tracking-widest text-center">
                      {Math.round(nextDeity.threshold - totalTonnage).toLocaleString()} KG remaining until {nextDeity.name.toUpperCase()} unlocks
                    </span>
                  </div>
                ) : (
                  <div className="w-full text-center py-1.5 bg-gold-core/5 border border-gold-core/20 rounded">
                    <span className="text-[8.5px] font-mono text-gold-core font-extrabold tracking-widest uppercase">
                      👑 SUPREME ZEUS TIER ACHIEVED 👑
                    </span>
                  </div>
                )}
              </div>

              {/* Deity Statue Visualizer (Expanded h-[420px], no inner gray box, golden halo) */}
              <div 
                className="relative w-full h-[420px] bg-black/40 rounded flex items-end justify-center overflow-hidden mb-4 border border-white/5"
                style={{
                  background: activeTheme === 'shiva'
                    ? 'linear-gradient(to top, rgba(9, 26, 47, 0.95), rgba(27, 53, 90, 0.45)), repeating-linear-gradient(45deg, rgba(93, 173, 226, 0.03) 0px, rgba(93, 173, 226, 0.03) 2px, transparent 2px, transparent 10px)'
                    : activeTheme === 'lava'
                    ? 'linear-gradient(to top, rgba(32, 7, 0, 0.95), rgba(90, 20, 0, 0.45)), repeating-linear-gradient(45deg, rgba(255, 61, 0, 0.03) 0px, rgba(255, 61, 0, 0.03) 2px, transparent 2px, transparent 10px)'
                    : 'none'
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,200,128,0.18)_0%,transparent_65%)] pointer-events-none" />
                
                <motion.div 
                  className="w-full h-full flex items-end justify-center relative pb-12"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                >
                  {/* Glowing Divine Aura (Pulsing background light) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Outer soft glow */}
                    <motion.div 
                      className="absolute w-72 h-72 rounded-full bg-gold-core/5 filter blur-3xl"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    />
                    {/* Inner glowing halo ring */}
                    <motion.div 
                      className="absolute w-56 h-56 rounded-full border border-gold-core/10 bg-gradient-to-t from-transparent via-gold-core/[0.02] to-gold-core/[0.05] filter blur-[2px]"
                      animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    />
                  </div>

                  {/* Deity Statue Image - Full height, standing on bottom */}
                  <div className="relative z-10 w-full h-[360px] flex items-end justify-center">
                    <img 
                      src={getAssetUrl(`/deity/${activeDeity.id}.png`)} 
                      alt={activeDeity.name}
                      className="max-w-[90%] max-h-full object-contain"
                      onError={(e) => {
                        // Display clean SVG contour representation
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent && !parent.querySelector('.deity-svg-fallback')) {
                          const svgHtml = `
                            <svg viewBox="0 0 100 120" class="deity-svg-fallback w-36 h-48 text-gold-core opacity-70 mb-8" fill="currentColor">
                              <path d="M10 110 h80 v10 h-80 z M15 30 h70 v5 h-70 z M25 35 h6 v75 h-6 z M47 35 h6 v75 h-6 z M69 35 h6 v75 h-6 z M20 20 L50 5 L80 20 v10 H20 z" />
                            </svg>
                          `;
                          parent.insertAdjacentHTML('beforeend', svgHtml);
                        }
                      }}
                    />
                  </div>
                </motion.div>

                {/* Dark serif quote text strip at bottom */}
                <div className="absolute inset-x-0 bottom-0 bg-black/95 border-t border-white/5 py-2 px-3 text-center z-20">
                  <p className="font-display text-[9px] text-gold-core tracking-[0.25em] uppercase font-bold italic">
                    "STRENGTH IS WAR. THE BODY IS THE WEAPON."
                  </p>
                </div>
              </div>

              {/* Deity Buff Status - DIVINE MULTIPLIER / ACTIVE BUFF */}
              <div className="w-full bg-black/30 border border-white/5 rounded p-2.5 flex flex-col gap-1 text-left">
                <div className="flex justify-between items-center text-[7.5px] font-mono text-gray-500 uppercase tracking-widest">
                  <span>DIVINE MULTIPLIER</span>
                  <span className="text-gold-core font-bold">BUFF ACTIVE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={10} className="text-gold-core animate-pulse" fill="currentColor" />
                  <span className="font-display text-xs text-white tracking-widest font-extrabold uppercase">
                    {activeDeity.buff}
                  </span>
                </div>
              </div>

              {activeTheme === 'shiva' && (
                <div className="w-full bg-[#0d2238]/60 border border-[#5dade2]/30 rounded p-3 flex flex-col gap-1.5 text-left relative overflow-hidden mt-3 shadow-[0_0_15px_rgba(93,173,226,0.15)]">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(circle,rgba(93,173,226,0.1)_0%,transparent_70%)] pointer-events-none" />
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-[#5dade2] uppercase tracking-widest font-black">
                    <span>NANDI'S SACRED BLESSING</span>
                    <span>ACTIVE CARD</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl shrink-0 filter drop-shadow-[0_0_5px_rgba(93,173,226,0.5)]">🐂</span>
                    <div className="flex flex-col">
                      <span className="font-display text-xs text-white tracking-widest font-extrabold uppercase leading-none mb-1">
                        Devotion of Nandi
                      </span>
                      <p className="text-[8px] font-mono text-gray-400 leading-normal uppercase">
                        Active cosmetic modifier. Increases spiritual energy during lifting. Fortitude matches the mountain peaks.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTheme === 'lava' && (
                <div className="w-full bg-[#200700]/60 border border-[#ff3d00]/30 rounded p-3 flex flex-col gap-1.5 text-left relative overflow-hidden mt-3 shadow-[0_0_15px_rgba(255,61,0,0.15)]">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(circle,rgba(255,61,0,0.1)_0%,transparent_70%)] pointer-events-none" />
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-[#ff3d00] uppercase tracking-widest font-black">
                    <span>MAGMA CORE RITUAL</span>
                    <span>ACTIVE CARD</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl shrink-0 filter drop-shadow-[0_0_5px_rgba(255,61,0,0.5)]">🌋</span>
                    <div className="flex flex-col">
                      <span className="font-display text-xs text-white tracking-widest font-extrabold uppercase leading-none mb-1">
                        Volcanic Forge
                      </span>
                      <p className="text-[8px] font-mono text-gray-400 leading-normal uppercase">
                        Magma flow powers your core muscles. Heat increases stamina in high reps. Overcomes maximum inertia.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </OrnatePanel>
        </div>

        {/* ================= RIGHT COLUMN: PANTHEON PROGRESSION (Columns: 3) ================= */}
        <div className="lg:col-span-3 flex flex-col gap-4 sticky top-4">
          
          {/* Quick Metrics Widget */}
          <OrnatePanel className="fitness-panel-glass">
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="flex flex-col gap-1 border-r border-white/5 py-1">
                <span className="text-[7px] font-mono text-gray-500 uppercase tracking-wider">TOTAL VOLUME</span>
                <span className="font-display text-xs font-bold text-white tracking-wider">
                  {Math.round(totalTonnage).toLocaleString()} <span className="text-[7px] font-mono text-gray-400">KG</span>
                </span>
              </div>
              <div className="flex flex-col gap-1 border-r border-white/5 py-1">
                <span className="text-[7px] font-mono text-gray-500 uppercase tracking-wider">SESSIONS</span>
                <span className="font-display text-xs font-bold text-white tracking-wider">
                  {totalWorkouts}
                </span>
              </div>
              <div className="flex flex-col gap-1 py-1">
                <span className="text-[7px] font-mono text-gray-500 uppercase tracking-wider">STREAK</span>
                <span className="font-display text-xs font-bold text-white tracking-wider flex items-center justify-center gap-1">
                  <Flame size={10} className="text-orange-500" />
                  {Math.round(totalWorkouts > 0 ? 1 + Math.floor(totalWorkouts / 3) : 0)}
                </span>
              </div>
            </div>
          </OrnatePanel>

          {/* Ascension Path Panel */}
          <OrnatePanel className="border-gold-core/25 fitness-panel-glass">
            <div className="panel-header-custom flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-gold-core/60 tracking-widest uppercase font-bold">ASCENSION PATH</span>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg text-white tracking-wider uppercase">PANTHEON TIER</h3>
                  <button 
                    type="button"
                    onClick={() => useWarscytheStore.getState().openInfoModal('fitness')}
                    className="text-gold-core/70 hover:text-gold-bright transition-colors ml-1.5"
                    title="Fitness Info"
                  >
                    <Info size={14} />
                  </button>
                </div>
              </div>
              <Award size={16} className="text-gold-core" />
            </div>

            {/* Vertical Stack of deities with Face Previews */}
            <div className="flex flex-col gap-3">
              {deities.map((deity, idx) => {
                const isCurrent = deity.isCurrent;
                const isUnlocked = deity.unlocked;

                return (
                  <div 
                    key={deity.id}
                    className={`p-2.5 rounded border flex items-center gap-3 transition-all relative ${
                      isCurrent 
                        ? 'border-gold-core bg-gold-core/[0.03] shadow-[0_0_12px_rgba(197,160,89,0.15)]' 
                        : isUnlocked 
                          ? 'border-white/10 bg-white/[0.01] opacity-80' 
                          : 'border-white/5 bg-black/60 opacity-40'
                    }`}
                  >
                    {/* Circle Avatar Face Preview */}
                    <div className="relative shrink-0">
                      <div className={`w-9 h-9 rounded-full overflow-hidden border flex items-center justify-center bg-black/60 transition-all ${
                        isCurrent 
                          ? 'border-2 border-gold-bright shadow-[0_0_10px_rgba(236,200,128,0.4)]' 
                          : isUnlocked 
                            ? 'border-gold-core/40' 
                            : 'border-white/10'
                      }`}>
                        <img 
                          src={getAssetUrl(`/deity/avatar/${deity.id}.png`)} 
                          alt={deity.name} 
                          className={`w-full h-full object-cover ${!isUnlocked ? 'grayscale opacity-30' : ''}`}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            if (parent && !parent.querySelector('.avatar-fallback')) {
                              parent.insertAdjacentHTML('beforeend', `<span class="avatar-fallback text-[10px] font-mono font-bold text-gray-500">${deity.name[0].toUpperCase()}</span>`);
                            }
                          }}
                        />
                      </div>
                      
                      {/* Checkmark indicator for unlocked non-active tiers */}
                      {isUnlocked && !isCurrent && (
                        <div className="absolute -bottom-0.5 -right-0.5 bg-gold-core text-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-black shadow">
                          <Check size={8} strokeWidth={4} />
                        </div>
                      )}
                    </div>

                    {/* Deity Info Block */}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-display text-xs text-white tracking-wider font-extrabold uppercase truncate">
                          {deity.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[6.5px] font-mono font-black text-gold-core tracking-widest uppercase">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between text-[7.5px] font-mono text-gray-400">
                        <span className="uppercase">REQ: {deity.threshold.toLocaleString()} KG</span>
                        <span className="text-gold-core font-bold uppercase">{deity.buff}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </OrnatePanel>

          {/* Historical Logs List */}
          <OrnatePanel className="border-white/5 fitness-panel-glass">
            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block mb-3 border-b border-white/5 pb-2">
              RECENT WORKOUTS HISTORY
            </span>

            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
              {gymLog.length === 0 ? (
                <span className="text-[8px] font-mono text-gray-600 uppercase text-center py-4 tracking-wider block">
                  No sessions archived.
                </span>
              ) : (
                gymLog.slice(0, 5).map((log) => (
                  <div key={log.id} className="border border-white/5 bg-white/[0.01] p-2 rounded flex flex-col gap-1.5 hover:border-gold-core/20 transition-all">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-white font-extrabold uppercase tracking-wide truncate max-w-[70%]">{log.split}</span>
                      <span className="text-gray-500 text-[8px] flex items-center gap-1 font-mono">
                        <Calendar size={8} /> {new Date(log.date).toLocaleDateString(undefined, {month: 'numeric', day: 'numeric'})}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono text-gray-400 border-t border-white/[0.03] pt-1">
                      <span>TONNAGE LOAD:</span>
                      <span className="text-gold-core font-bold">{Math.round(getSessionTonnage(log)).toLocaleString()} KG</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {gymLog.length > 0 && (
              <button
                onClick={() => setShowHistoryModal(true)}
                className="w-full mt-3 border border-white/10 hover:border-gold-core/40 bg-white/[0.02] hover:bg-gold-core/5 text-gray-300 hover:text-gold-core font-mono text-[8px] py-1.5 rounded uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ClipboardList size={10} /> VIEW FULL DETAILED HISTORY
              </button>
            )}
          </OrnatePanel>
        </div>

      </div>

      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4" style={{ zIndex: 2500 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-4xl border border-gold-core/20 p-6 bg-[#08080a]/95 rounded-lg max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-6 shadow-[0_0_40px_rgba(197,160,89,0.1),_inset_0_0_25px_rgba(0,0,0,0.85)]"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList size={18} className="text-gold-core" />
                  <h2 className="font-display text-sm text-white tracking-widest uppercase">THE IRON ARCHIVES // WORKOUT HISTORY</h2>
                </div>
                <button 
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center transition-all"
                  onClick={() => setShowHistoryModal(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-mono text-[9px] text-gold-core uppercase tracking-widest">HISTORICAL TRAINING LOGS // READ ONLY</span>
                
                <div className="overflow-x-auto border border-white/5 rounded bg-black/40">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-[8px] font-mono text-gray-400 uppercase tracking-widest">
                        <th className="p-3 w-[20%]">DATE & SPLIT</th>
                        <th className="p-3 w-[40%]">EXERCISE DETAILS</th>
                        <th className="p-3 w-[15%]">VOLUME</th>
                        <th className="p-3 w-[25%] font-bold">NOTES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03] text-[10px] font-mono">
                      {gymLog.map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.01] transition-all align-top">
                          <td className="p-3">
                            <div className="text-white font-extrabold uppercase tracking-wide">{log.split}</div>
                            <div className="text-gray-500 text-[8px] mt-1 flex items-center gap-1">
                              <Calendar size={8} /> {new Date(log.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-3">
                            {log.movements ? (
                              <div className="flex flex-col gap-2">
                                {log.movements.map((m, idx) => (
                                  <div key={idx} className="border-b border-white/[0.03] pb-1 last:border-0 last:pb-0">
                                    <span className="text-gold-core font-bold uppercase">{m.name}:</span>
                                    <div className="pl-2 flex flex-col gap-0.5 mt-0.5 text-gray-400 text-[9px]">
                                      {(m.sets || []).map((s, sIdx) => (
                                        <div key={sIdx} className={s.completed ? "text-gray-300" : "text-gray-500 line-through"}>
                                          SET {sIdx + 1} ({s.type.toUpperCase()}): {s.weight} KG × {s.reps} REPS {s.rpe ? `@ ${s.rpe}` : ''} {s.completed ? '✓' : '✗'}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : log.exercises ? (
                              <div className="flex flex-col gap-1.5">
                                {log.exercises.map((ex, idx) => (
                                  <div key={idx} className="border-b border-white/[0.03] pb-1 last:border-0 last:pb-0">
                                    <span className="text-white font-bold uppercase">{ex.name}:</span>
                                    <div className="pl-2 text-gray-400 text-[9px] mt-0.5">
                                      {ex.sets} SETS × {ex.reps} REPS {ex.weight > 0 ? `@ ${ex.weight} KG` : ''}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-600 text-[8px] uppercase">NO DETAILS</span>
                            )}
                          </td>
                          <td className="p-3 text-gold-core font-bold">
                            {Math.round(getSessionTonnage(log)).toLocaleString()} KG
                          </td>
                          <td className="p-3 text-gray-400 whitespace-pre-wrap uppercase break-words leading-relaxed text-[9px]">
                            {log.notes || <span className="text-gray-600">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
