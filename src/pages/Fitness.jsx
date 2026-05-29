import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { 
  Dumbbell, Play, Square, Plus, Trash2, Check, 
  RotateCcw, ShieldAlert, Award, Star, TrendingUp, 
  Calendar, Flame, Sparkles, ChevronDown, CheckSquare, SquareSquare
} from 'lucide-react';

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
    getDeityProgress
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

  // Timer loop
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            clearInterval(timerRef.current);
            // Trigger haptics / sound if available
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timerSeconds]);

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
        
        {/* ================= LEFT COLUMN: THE IRON LEDGER (Columns: 3) ================= */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="elite-panel border-gold-core/25">
            <div className="panel-header-custom flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-gold-core/60 tracking-widest uppercase font-bold">SESSION CONTROL</span>
                <h3 className="font-display text-lg text-white tracking-wider uppercase">THE IRON LEDGER</h3>
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
          </div>

          {/* Training Controls widgets: RPE Dial and Rest Timer */}
          {activeWorkout && (
            <div className="grid grid-cols-2 gap-4">
              
              {/* RPE Dial Widget */}
              <div className="elite-panel border-gold-core/20 bg-black/70 flex flex-col justify-between h-[155px]">
                <div className="flex flex-col">
                  <span className="text-[7px] font-mono text-gold-core/60 tracking-wider uppercase font-bold">RPE DIAL</span>
                  <span className="text-[9px] font-mono text-gray-500 uppercase">Focused Set Fatigue</span>
                </div>

                {focusedSet ? (
                  (() => {
                    const movement = activeWorkout.movements.find(m => m.id === focusedSet.movementId);
                    const setObj = movement?.sets.find(s => s.id === focusedSet.setId);
                    if (!setObj) return null;

                    return (
                      <div className="flex flex-col items-center justify-center gap-1.5 my-1">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleAdjustRpe(-0.5)}
                            className="w-6 h-6 rounded border border-white/10 hover:border-gold-core text-white font-mono text-[11px] flex items-center justify-center bg-black/80 hover:bg-gold-core/10 transition-all select-none"
                          >
                            -
                          </button>
                          <div className="flex flex-col items-center">
                            <span className="font-display text-2xl font-extrabold text-gold-bright tracking-widest leading-none">
                              {Number(setObj.rpe).toFixed(1)}
                            </span>
                            <span className="text-[6px] font-mono text-gray-500 uppercase tracking-widest">rating</span>
                          </div>
                          <button 
                            onClick={() => handleAdjustRpe(0.5)}
                            className="w-6 h-6 rounded border border-white/10 hover:border-gold-core text-white font-mono text-[11px] flex items-center justify-center bg-black/80 hover:bg-gold-core/10 transition-all select-none"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[7px] font-mono text-gold-core/70 uppercase tracking-widest text-center truncate max-w-full px-1">
                          {movement.name} (SET)
                        </span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center justify-center text-center py-4">
                    <span className="text-[7px] font-mono text-gray-600 uppercase max-w-[120px] tracking-wider leading-relaxed">
                      Select a set to activate RPE dial controls
                    </span>
                  </div>
                )}
                <div className="text-[6px] font-mono text-center text-gray-600 uppercase tracking-widest">
                  Powerlifting RPE Scale
                </div>
              </div>

              {/* Rest Timer Widget */}
              <div className="elite-panel border-gold-core/20 bg-black/70 flex flex-col justify-between h-[155px] relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-mono text-gold-core/60 tracking-wider uppercase font-bold">REST TIMER</span>
                    <span className="text-[9px] font-mono text-gray-500 uppercase">Active Recovery</span>
                  </div>
                  {/* Select Rest Duration */}
                  <select 
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(Number(e.target.value))}
                    className="bg-black border border-white/10 text-white font-mono text-[7px] rounded px-1 py-0.5 focus:outline-none"
                  >
                    <option value={60}>60s</option>
                    <option value={90}>90s</option>
                    <option value={120}>120s</option>
                    <option value={180}>180s</option>
                    <option value={300}>300s</option>
                  </select>
                </div>

                <div className="flex items-center justify-center gap-3 my-1 z-10">
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-xl font-extrabold text-white tracking-widest leading-none">
                      {formatTime(timerSeconds)}
                    </span>
                    <span className="text-[6px] font-mono text-gray-500 uppercase tracking-widest mt-1">countdown</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setTimerActive(!timerActive)}
                      className={`w-6 h-6 rounded flex items-center justify-center border transition-all ${
                        timerActive 
                          ? 'border-gold-core text-black bg-gold-core'
                          : 'border-white/10 text-white hover:border-gold-core hover:bg-gold-core/10'
                      }`}
                    >
                      <Play size={10} fill={timerActive ? "#000" : "transparent"} />
                    </button>
                    <button
                      onClick={() => {
                        setTimerSeconds(0);
                        setTimerActive(false);
                      }}
                      className="w-6 h-6 rounded border border-white/10 hover:border-red-500 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all"
                    >
                      <RotateCcw size={10} />
                    </button>
                  </div>
                </div>

                {/* Adjust rest time buttons */}
                <div className="flex justify-between gap-1 z-10">
                  <button 
                    onClick={() => setTimerSeconds(prev => Math.max(0, prev - 30))}
                    className="flex-1 bg-white/[0.02] border border-white/10 hover:border-white/20 text-gray-400 font-mono text-[7px] py-1 rounded uppercase select-none transition-all"
                  >
                    -30s
                  </button>
                  <button 
                    onClick={() => setTimerSeconds(prev => prev + 30)}
                    className="flex-1 bg-white/[0.02] border border-white/10 hover:border-white/20 text-gray-400 font-mono text-[7px] py-1 rounded uppercase select-none transition-all"
                  >
                    +30s
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ================= CENTER COLUMN: THE PANTHEON OF IRON (Columns: 6) ================= */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="elite-panel border-gold-core/25 text-center relative overflow-hidden bg-gradient-to-b from-black via-black/90 to-[#0e0c0a]">
            
            {/* Background God Aura Light */}
            <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-gold-glow)_0%,transparent_70%)] opacity-35 pointer-events-none`} />

            <div className="flex flex-col items-center relative z-10 pt-2">
              <span className="text-[9px] font-mono text-gold-core/60 tracking-[0.4em] uppercase font-bold mb-1">Active Deity Avatar</span>
              <h2 className="font-display text-2xl text-white tracking-[0.1em] uppercase mb-4">{activeDeity.name}</h2>

              {/* Deity Statue Visualizer */}
              <div className="relative w-full h-96 border border-white/5 bg-black/60 rounded-lg flex items-center justify-center shadow-inner group overflow-hidden mb-4">
                <div className="absolute inset-0 border border-gold-core/10 rounded-lg pointer-events-none" />
                <motion.div 
                  className="w-full h-full flex flex-col items-center justify-center p-4 relative"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                >
                  {/* Dynamic Particle Sparkles */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Sparkles className="text-gold-core/15 w-32 h-32 animate-pulse" />
                  </div>

                  {/* Fallback Deity Icon / Image */}
                  <div className="relative z-10 w-52 h-72 flex items-center justify-center bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.04] rounded shadow-xl">
                    <img 
                      src={`/deity/${activeDeity.id}.png`} 
                      alt={activeDeity.name}
                      className="w-full h-full object-contain mix-blend-lighten"
                      onError={(e) => {
                        // Display clean SVG contour representation
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent && !parent.querySelector('.deity-svg-fallback')) {
                          const svgHtml = `
                            <svg viewBox="0 0 100 120" class="deity-svg-fallback w-24 h-32 text-gold-core opacity-70" fill="currentColor">
                              <!-- Stylized temple pillars or God contour -->
                              <path d="M10 110 h80 v10 h-80 z M15 30 h70 v5 h-70 z M25 35 h6 v75 h-6 z M47 35 h6 v75 h-6 z M69 35 h6 v75 h-6 z M20 20 L50 5 L80 20 v10 H20 z" />
                            </svg>
                          `;
                          parent.insertAdjacentHTML('beforeend', svgHtml);
                        }
                      }}
                    />
                  </div>
                </motion.div>

                {/* Hover Buff Stats Layer */}
                <div className="absolute inset-x-0 bottom-0 bg-black/90 border-t border-white/10 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-[9px] font-mono text-gold-bright uppercase tracking-wider italic">"{activeDeity.desc}"</p>
                </div>
              </div>

              {/* Deity Buff Status */}
              <div className="w-full bg-white/[0.02] border border-white/5 rounded p-3 flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-center text-[9px] font-mono text-gray-400">
                  <span>ACTIVE MULTIPLIER</span>
                  <span className="text-gold-core font-bold uppercase tracking-widest">BUFF UNLOCKED</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Star size={12} className="text-gold-core" fill="currentColor" />
                  <span className="font-display text-md text-white tracking-widest font-extrabold uppercase">{activeDeity.buff}</span>
                </div>
              </div>

              {/* Progress Slider towards next Deity (Gold Theme) */}
              {nextDeity ? (
                <div className="w-full flex flex-col gap-2">
                  <div className="flex justify-between text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                    <span>NEXT TIER: {nextDeity.name.toUpperCase()}</span>
                    <span>{Math.round(totalTonnage)} / {nextDeity.threshold} KG</span>
                  </div>
                  
                  {/* Slider Progress Bar */}
                  <div className="w-full h-2.5 bg-black border border-white/10 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      className="h-full bg-gold-core rounded-full"
                      style={{ width: `${progressPercent}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  
                  <span className="text-[7px] font-mono text-gold-core uppercase tracking-widest text-center mt-1">
                    {Math.round(nextDeity.threshold - totalTonnage)} KG remaining until {nextDeity.name} unlocks
                  </span>
                </div>
              ) : (
                <div className="w-full text-center py-2 bg-gold-core/5 border border-gold-core/20 rounded">
                  <span className="text-[9px] font-mono text-gold-core font-extrabold tracking-widest uppercase">
                    👑 SUPREME ZEUS TIER ACHIEVED 👑
                  </span>
                </div>
              )}

            </div>
          </div>

          {/* Quick Metrics widget */}
          <div className="elite-panel border-white/5 bg-black/40">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col gap-1 border-r border-white/5 py-1">
                <span className="text-[7px] font-mono text-gray-500 uppercase tracking-wider">TOTAL VOLUME</span>
                <span className="font-display text-sm font-bold text-white tracking-wider">{Math.round(totalTonnage).toLocaleString()} <span className="text-[7px] font-mono text-gray-400">KG</span></span>
              </div>
              <div className="flex flex-col gap-1 border-r border-white/5 py-1">
                <span className="text-[7px] font-mono text-gray-500 uppercase tracking-wider">SESSIONS</span>
                <span className="font-display text-sm font-bold text-white tracking-wider">{totalWorkouts}</span>
              </div>
              <div className="flex flex-col gap-1 py-1">
                <span className="text-[7px] font-mono text-gray-500 uppercase tracking-wider">WEEKLY STREAK</span>
                <span className="font-display text-sm font-bold text-white tracking-wider flex items-center justify-center gap-1">
                  <Flame size={12} className="text-orange-500" />
                  {Math.round(totalWorkouts > 0 ? 1 + Math.floor(totalWorkouts / 3) : 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: PANTHEON PROGRESSION (Columns: 3) ================= */}
        <div className="lg:col-span-3 flex flex-col gap-4 sticky top-4">
          <div className="elite-panel border-gold-core/25">
            <div className="panel-header-custom flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-gold-core/60 tracking-widest uppercase font-bold">ASCENSION PATH</span>
                <h3 className="font-display text-lg text-white tracking-wider uppercase">PANTHEON TIER</h3>
              </div>
              <Award size={16} className="text-gold-core" />
            </div>

            {/* Vertical Stack of deities */}
            <div className="flex flex-col gap-3">
              {deities.map((deity, idx) => {
                const isCurrent = deity.isCurrent;
                const isUnlocked = deity.unlocked;

                return (
                  <div 
                    key={deity.id}
                    className={`p-3 rounded border flex flex-col gap-1.5 transition-all relative ${
                      isCurrent 
                        ? 'border-gold-core bg-gold-core/[0.03] shadow-[0_0_12px_rgba(197,160,89,0.15)]' 
                        : isUnlocked 
                          ? 'border-white/10 bg-white/[0.01] opacity-70' 
                          : 'border-white/5 bg-black/60 opacity-40'
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute top-2 right-2 bg-gold-core text-black text-[7px] font-mono font-black uppercase px-1 py-0.5 rounded tracking-widest">
                        CURRENT
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border text-[8px] font-mono font-bold ${
                        isUnlocked 
                          ? 'border-gold-core/40 text-gold-core bg-gold-core/5' 
                          : 'border-white/15 text-gray-500 bg-transparent'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="font-display text-xs text-white tracking-widest font-extrabold uppercase">
                        {deity.name}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 pl-6">
                      <div className="flex justify-between text-[8px] font-mono text-gray-400">
                        <span>REQUIREMENT:</span>
                        <span>{deity.threshold.toLocaleString()} KG</span>
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-gray-400">
                        <span>PASSIVE MULTIPLIER:</span>
                        <span className="text-gold-core font-bold">{deity.buff}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Logs List */}
          <div className="elite-panel border-white/5 bg-black/40">
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
          </div>
        </div>

      </div>
    </div>
  );
}
