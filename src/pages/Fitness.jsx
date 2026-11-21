import { WorkoutModeBar } from '../components/WorkoutStatus';
import './fitnessFrames.css';
import MobileDisplayToggle from '../components/MobileDisplay';
import { useMobileDisplay } from '../components/useMobileDisplay';
import WorkoutSession from '../components/WorkoutSession';
import { useWorkoutUi, useRestTimer } from '../store/workoutUi';
import OrnateFrame from '../components/frames/OrnateFrame';
import { revealUiTarget } from '../utils/revealUiTarget';
import { useAmbientMotion } from '../motion/useMotionEnvironment';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { getAssetUrl } from '../utils/assetResolver';
import UnlockCeremonyModal from '../components/UnlockCeremonyModal';
import FitnessOlympusExperience, { calculateAverageRpe, FitnessOlympusRecognition } from '../features/fitness-v2/FitnessOlympusExperience';
import DeityTitleCard from '../features/fitness-v2/DeityTitleCard';
import { calculateWorkoutEvidence } from '../features/fitness-v2/domain/workoutEvidence';
import { isFitnessV2PreviewEnabled } from '../features/fitness-v2/featureGate';
import { 
  Dumbbell, Play, Square, Plus, Trash2, Check, 
  RotateCcw, ShieldAlert, Award, Star, TrendingUp, 
  Calendar, Flame, Sparkles, ChevronDown, CheckSquare, SquareSquare,
  ClipboardList, X, Info, CloudDownload, Loader2
} from 'lucide-react';


const OrnatePanel = ({ children, className = '', frameSize = 'panel', ...props }) => {
  return (
    <div className={`elite-panel ornate-surface fitness-framed-panel fitness-framed-panel--${frameSize} ${className}`} {...props}>
      <OrnateFrame family="hercules" className="fitness-panel-frame" />
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

const FITNESS_GUIDE = [
  { id:'fitness-split-select', title:'CHOOSE YOUR DISCIPLINE', text:'Open the training split and choose the kind of session you are about to perform. A split gives the Iron Ledger context for the work ahead.' },
  { id:'fitness-movement-selector', title:'NAME THE MOVEMENT', text:'Choose any preset movement or type one of your own, then add it. In this oathbound rehearsal, nothing touches your real training history.' },
  { id:'fitness-add-set', title:'FORGE A SET', text:'Add a set beneath your movement. Each set carries its own weight, repetitions, effort, type, and completion state.' },
  { id:'fitness-weight-input', title:'DECLARE THE LOAD', text:'Enter the weight you intend to move. Use the true load. Honest numbers build a useful Ledger.' },
  { id:'fitness-reps-input', title:'DECLARE THE REPS', text:'Enter how many controlled repetitions you completed with that load.' },
  { id:'fitness-complete-set', title:'CONFIRM THE SET', text:'Tick the set only after it is performed. Confirmation counts its tonnage and automatically begins your recovery timer.' },
  { id:'fitness-rest-timer', title:'RESPECT RECOVERY', text:'The Rest Timer protects the quality of the next set. Choose a duration, pause or resume the dial, and adjust it by thirty seconds when the movement demands more or less recovery.', manual:true },
  { id:'fitness-rpe-dial', title:'READ YOUR RPE', text:'RPE is Rate of Perceived Exertion from 1 to 10. RPE 8 means roughly two good repetitions remained; 9 means one remained; 10 means none remained. Your set is focused now. Use minus or plus once to record its difficulty.' },
  { id:'fitness-archive', title:'ARCHIVE THE SESSION', text:'When the session is complete, archive it. The real Iron Ledger preserves the movements, completed sets, tonnage, and notes. This rehearsal will be erased.' }
];

function FitnessWalkthrough({ step, onNext }) {
  const ambientMotion = useAmbientMotion();
  const [rect, setRect] = useState(null);
  const guide = FITNESS_GUIDE[step];
  useEffect(() => {
    if (!guide) return undefined;
    const update = () => {
      const el = document.getElementById(guide.id);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ top:r.top, left:r.left, right:r.right, bottom:r.bottom, width:r.width, height:r.height });
    };
    const reveal = window.setTimeout(() => {
      revealUiTarget(document.getElementById(guide.id));
      window.setTimeout(update, 240);
    }, 80);
    const timer = window.setInterval(update, 160);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.clearTimeout(reveal);
      window.clearInterval(timer);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [guide?.id]);
  if (!guide || !rect) return null;
  const placeRight = rect.right + 360 < window.innerWidth;
  const top = Math.max(82, Math.min(window.innerHeight - 270, rect.top + rect.height / 2 - 110));
  return (
    <>
      <motion.div
        key={guide.id}
        className="fixed z-[2200] pointer-events-none rounded"
        style={{top:rect.top-5,left:rect.left-5,width:rect.width+10,height:rect.height+10}}
        animate={{boxShadow:['0 0 0 2px #e8c675,0 0 18px #e8c67555','0 0 0 4px #e8c675,0 0 35px #e8c67588','0 0 0 2px #e8c675,0 0 18px #e8c67555']}}
        transition={{duration:ambientMotion ? 1.3 : 0,repeat:ambientMotion ? Infinity : 0}}
      />
      <motion.aside
        initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
        className="fixed z-[2201] w-[min(340px,calc(100vw-24px))] border border-gold-core/35 bg-zinc-950/98 p-5 shadow-[0_20px_70px_#000]"
        style={window.innerWidth < 760
          ? {left:12,bottom:88}
          : {left:placeRight ? rect.right+18 : Math.max(12,rect.left-358),top}}
      >
        <small className="font-mono text-[8px] tracking-[.28em] text-gold-core">ARETE // OATHBOUND LESSON {step+1}/{FITNESS_GUIDE.length}</small>
        <h3 className="motion-heading font-display text-lg text-white mt-2">{guide.title}</h3>
        <p className="font-serif italic text-sm leading-relaxed text-stone-300 mt-2">{guide.text}</p>
        {guide.manual && (
          <button onClick={onNext} className="mt-4 w-full border border-gold-core/40 bg-gold-core/10 py-2 font-mono text-[8px] font-black tracking-widest text-gold-core">
            {step === FITNESS_GUIDE.length-1 ? 'ARCHIVE THE REHEARSAL' : 'UNDERSTOOD, CONTINUE'}
          </button>
        )}
      </motion.aside>
    </>
  );
}

export default function Fitness({ tutorialActive = false, onTutorialComplete }) {
  const {
    gymLog,
    activeWorkout: storedActiveWorkout,
    startWorkout: storeStartWorkout,
    cancelWorkout: storeCancelWorkout,
    addMovement: storeAddMovement,
    removeMovement: storeRemoveMovement,
    addSetToMovement: storeAddSetToMovement,
    updateSetInMovement: storeUpdateSetInMovement,
    deleteSetFromMovement: storeDeleteSetFromMovement,
    logWorkout: storeLogWorkout,
    getTotalTonnage,
    getDeityProgress,
    updateActiveWorkoutNotes,
    activeTheme,
    downloadedRegions,
    downloadRegionBundle
  } = useWarscytheStore();
  const [sandboxWorkout, setSandboxWorkout] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorialFarewell, setShowTutorialFarewell] = useState(false);
  const activeWorkout = tutorialActive ? sandboxWorkout : storedActiveWorkout;
  const focusedId = useWorkoutUi(state => state.focusedId);
  const workoutMode = !tutorialActive && !!activeWorkout && focusedId === activeWorkout.id;
  const deityDisplay = useMobileDisplay('fitness-deity', tutorialActive);
  const advanceTutorial = (expected) => {
    if (tutorialActive && tutorialStep === expected) setTutorialStep(value => Math.min(FITNESS_GUIDE.length - 1, value + 1));
  };
  const startWorkout = (split) => {
    if (!tutorialActive) return storeStartWorkout(split);
    setSandboxWorkout({ id:'oathbound-session', date:new Date().toISOString(), split:split || 'Oathbound Split', movements:[], notes:'' });
    advanceTutorial(0);
  };
  const cancelWorkout = () => tutorialActive ? setSandboxWorkout(null) : storeCancelWorkout();
  const addMovement = (name) => {
    if (!tutorialActive) return storeAddMovement(name);
    setSandboxWorkout(workout => ({...workout, movements:[...workout.movements,{id:crypto.randomUUID(),name:name || 'Chosen Movement',sets:[]}]}));
    advanceTutorial(1);
  };
  const removeMovement = (movementId) => tutorialActive
    ? setSandboxWorkout(workout => ({...workout,movements:workout.movements.filter(m=>m.id!==movementId)}))
    : storeRemoveMovement(movementId);
  const addSetToMovement = (movementId, detail={}) => {
    if (!tutorialActive) return storeAddSetToMovement(movementId, detail);
    const newSet = {id:crypto.randomUUID(),weight:Number(detail.weight)||0,reps:Number(detail.reps)||0,rpe:Number(detail.rpe)||8,type:detail.type||'working',completed:false};
    setSandboxWorkout(workout => ({...workout,movements:workout.movements.map(m=>m.id===movementId?{...m,sets:[...m.sets,newSet]}:m)}));
    setFocusedSet({movementId,setId:newSet.id});
    advanceTutorial(2);
  };
  const updateSetInMovement = (movementId,setId,updates) => {
    if (!tutorialActive) return storeUpdateSetInMovement(movementId,setId,updates);
    setSandboxWorkout(workout => ({...workout,movements:workout.movements.map(m=>m.id===movementId?{...m,sets:m.sets.map(s=>s.id===setId?{...s,...updates,weight:updates.weight!==undefined?Number(updates.weight):s.weight,reps:updates.reps!==undefined?Number(updates.reps):s.reps,rpe:updates.rpe!==undefined?Number(updates.rpe):s.rpe}:s)}:m)}));
  };
  const deleteSetFromMovement = (movementId,setId) => tutorialActive
    ? setSandboxWorkout(workout => ({...workout,movements:workout.movements.map(m=>m.id===movementId?{...m,sets:m.sets.filter(s=>s.id!==setId)}:m)}))
    : storeDeleteSetFromMovement(movementId,setId);
  const logWorkout = () => {
    if (!tutorialActive) return storeLogWorkout();
    setShowTutorialFarewell(true);
  };
  const finishTutorial = () => {
    setShowTutorialFarewell(false);
    window.setTimeout(() => {
      setSandboxWorkout(null);
      setTutorialStep(0);
      onTutorialComplete?.();
    }, 650);
  };
  const updateWorkoutNotes = (value) => tutorialActive
    ? setSandboxWorkout(workout => ({...workout, notes:value}))
    : updateActiveWorkoutNotes(value);

  const deityState = getDeityProgress();
  const totalTonnage = deityState.totalTonnage;
  const activeDeity = deityState.activeDeity;
  const nextDeity = deityState.nextDeity;
  const progressPercent = deityState.progressPercent;
  const deities = deityState.deities;
  const [deityCeremony, setDeityCeremony] = useState(null);
  const [deityDownloadState, setDeityDownloadState] = useState({});
  const isMobileApp = typeof window !== 'undefined'
    && window.Capacitor
    && typeof window.Capacitor.isNativePlatform === 'function'
    && window.Capacitor.isNativePlatform();
  const deityBundleId = (deityId) => `deity_${deityId}`;
  const isDeityDownloaded = (deityId) => !isMobileApp || (downloadedRegions || []).includes(deityBundleId(deityId));
  const downloadDeity = async (deityId) => {
    const bundleId = deityBundleId(deityId);
    setDeityDownloadState(state => ({ ...state, [deityId]: 'downloading' }));
    try {
      await downloadRegionBundle(bundleId);
      setDeityDownloadState(state => ({ ...state, [deityId]: 'completed' }));
    } catch {
      setDeityDownloadState(state => ({ ...state, [deityId]: 'error' }));
    }
  };

  useEffect(() => {
    if (isFitnessV2PreviewEnabled() || tutorialActive || !activeDeity?.id || !activeDeity?.threshold || totalTonnage < activeDeity.threshold) return;
    let claimed = [];
    try { claimed = JSON.parse(localStorage.getItem('warscythe-claimed-deity-tiers') || '[]'); } catch { claimed = []; }
    if (!claimed.includes(activeDeity.id)) setDeityCeremony(activeDeity);
  }, [activeDeity?.id, activeDeity?.threshold, totalTonnage, tutorialActive]);

  const acceptDeityTier = () => {
    let claimed = [];
    try { claimed = JSON.parse(localStorage.getItem('warscythe-claimed-deity-tiers') || '[]'); } catch { claimed = []; }
    localStorage.setItem('warscythe-claimed-deity-tiers', JSON.stringify([...new Set([...claimed, deityCeremony.id])]));
    setDeityCeremony(null);
  };

  // Split template dropdown state
  const [splitDropdownOpen, setSplitDropdownOpen] = useState(false);
  const [customSplitName, setCustomSplitName] = useState('');
  const [showCustomSplitInput, setShowCustomSplitInput] = useState(false);

  // New Movement state


  // Selected/Focused set for the RPE Dial
  const [focusedSet, setFocusedSet] = useState(null); // { movementId, setId }

  const { timerDuration, timerSeconds, timerActive, setTimerDuration, setTimerSeconds, setTimerActive } = useRestTimer(activeWorkout?.id || null);
  const [timerDurationOpen, setTimerDurationOpen] = useState(false);

  // Detailed History Modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [ironReport, setIronReport] = useState(null);
  const [archiveDropdownOpen, setArchiveDropdownOpen] = useState(false);

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    const handleCaptureScene = event => {
      if (event.detail?.tab !== 'fitness') return;
      setShowHistoryModal(Boolean(event.detail.fitnessHistory));
    };
    window.addEventListener('warscythe:capture-scene', handleCaptureScene);
    return () => window.removeEventListener('warscythe:capture-scene', handleCaptureScene);
  }, []);

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

  const handleStartWorkout = (split) => {
    startWorkout(split);
    if (!tutorialActive) useWorkoutUi.getState().begin(useWarscytheStore.getState().activeWorkout.id);
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
    advanceTutorial(7);
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
  const fitnessV2PreviewEnabled = isFitnessV2PreviewEnabled() && !tutorialActive;
  const workoutTemplates = useMemo(() => {
    const seen = new Set();
    return (gymLog || []).filter(workout => {
      const key = String(workout.split || '').trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);
  }, [gymLog]);

  const initializeWorkoutTemplate = (template) => {
    if (!template) return;
    if (activeWorkout && !window.confirm('Replace the current unarchived session with this Iron Decree?')) return;
    if (activeWorkout) storeCancelWorkout();
    storeStartWorkout(template.split || 'Archived Iron Decree');
    const state = useWarscytheStore.getState();
    (template.movements || []).forEach(movement => {
      state.addMovement(movement.name);
      const active = useWarscytheStore.getState().activeWorkout;
      const created = active?.movements?.[active.movements.length - 1];
      if (!created) return;
      (movement.sets || []).forEach(setItem => state.addSetToMovement(created.id, {
        weight: Number(setItem.weight) || 0,
        reps: Number(setItem.reps) || 0,
        rpe: Number(setItem.rpe) || 8,
        type: setItem.type || 'working',
        completed: false,
      }));
    });
    setArchiveDropdownOpen(false);
    useWorkoutUi.getState().begin(useWarscytheStore.getState().activeWorkout.id);
  };

  const archiveWorkoutWithReport = () => {
    if (!activeWorkout) return;
    if (tutorialActive) {
      // Practice must never enter the real reward ceremony when the lesson ends.
      setIronReport(null);
      logWorkout();
      setFocusedSet(null);
      return;
    }
    const volume = getSessionTonnage(activeWorkout);
    const comparable = (gymLog || []).find(item => String(item.split || '').toLowerCase() === String(activeWorkout.split || '').toLowerCase());
    const totalSets = (activeWorkout.movements || []).reduce((sum, movement) => sum + (movement.sets || []).length, 0);
    const completedSets = (activeWorkout.movements || []).reduce((sum, movement) => sum + (movement.sets || []).filter(setItem => setItem.type !== 'warmup' && (setItem.completed || (Number(setItem.weight) > 0 && Number(setItem.reps) > 0))).length, 0);
    const totalReps = (activeWorkout.movements || []).reduce((sum, movement) => sum + (movement.sets || [])
      .filter(setItem => setItem.type !== 'warmup' && (setItem.completed || (Number(setItem.weight) > 0 && Number(setItem.reps) > 0)))
      .reduce((setSum, setItem) => setSum + (Number(setItem.reps) || 0), 0), 0);
    const movementCount = (activeWorkout.movements || []).filter(movement => (movement.sets || []).some(setItem => setItem.completed || (Number(setItem.weight) > 0 && Number(setItem.reps) > 0))).length;
    const averageRpe = calculateAverageRpe(activeWorkout);
    const affinityGain = calculateWorkoutEvidence({ completedSets, totalReps, volume }).affinity;
    setIronReport({
      split: activeWorkout.split || 'Completed Session',
      volume,
      previousVolume: comparable ? getSessionTonnage(comparable) : 0,
      averageRpe,
      totalSets,
      completedSets,
      totalReps,
      movementCount,
      affinityGain,
      fragmentReason: volume >= 5000 ? 'Volume execution examined for Fragment recovery' : null,
      id: Date.now(),
    });
    logWorkout();
    if (!tutorialActive) useWorkoutUi.getState().clear();
    setFocusedSet(null);
  };

  return (
    <div className={`fitness-realm w-full pt-4 pb-32 ${workoutMode ? 'workout-mode' : ''}`}>
      {activeWorkout && !tutorialActive && <WorkoutModeBar focused={workoutMode} seconds={timerSeconds} time={formatTime(timerSeconds)} running={timerActive} onToggleRest={() => setTimerActive(!timerActive)} onToggleMode={() => workoutMode ? useWorkoutUi.getState().minimize() : useWorkoutUi.getState().focus(activeWorkout.id)} />}
      {fitnessV2PreviewEnabled && (
        <FitnessOlympusExperience
          gymLog={gymLog}
          report={ironReport}
          templates={workoutTemplates}
          onInitializeTemplate={initializeWorkoutTemplate}
          showRecognition={false}
        />
      )}
      {deityCeremony && !fitnessV2PreviewEnabled && (
        <UnlockCeremonyModal
          kind="deity"
          name={deityCeremony.name}
          image={`/deity/${deityCeremony.id}.webp`}
          prophecy={`The iron you lifted has crossed the threshold of ${deityCeremony.threshold.toLocaleString()} kilograms. ${deityCeremony.name} now walks within your discipline. ${deityCeremony.buff}`}
          onClose={acceptDeityTier}
          requiresDownload={!isDeityDownloaded(deityCeremony.id)}
          downloadState={deityDownloadState[deityCeremony.id] || 'idle'}
          onDownload={() => downloadDeity(deityCeremony.id)}
        />
      )}
      {tutorialActive && (
        <FitnessWalkthrough
          step={tutorialStep}
          onNext={() => setTutorialStep(value => Math.min(FITNESS_GUIDE.length - 1, value + 1))}
        />
      )}
      <AnimatePresence>
        {showTutorialFarewell && (
          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0,filter:'blur(10px)'}}
            transition={{duration:.2}}
            className="fixed inset-x-0 top-[72px] bottom-[82px] z-[2500] grid place-items-center bg-black/75 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{opacity:0,y:30,scale:.96}}
              animate={{opacity:1,y:0,scale:1}}
              exit={{opacity:0,y:-25,scale:1.03}}
              transition={{duration:.24}}
              className="w-full max-w-4xl max-h-full overflow-y-auto border border-gold-core/30 bg-zinc-950/96 grid md:grid-cols-[.8fr_1.2fr] shadow-[0_0_90px_#000]"
            >
              <div className="relative aspect-[2/3] md:aspect-auto md:min-h-[560px] bg-black">
                <img src="/deity/fitness-goddess.webp" alt="Arete" className="absolute inset-0 w-full h-full object-contain md:object-cover md:object-center"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"/>
              </div>
              <div className="p-7 md:p-10 flex flex-col justify-center text-center">
                <small className="font-mono text-[8px] tracking-[.32em] text-gold-core">ARETE // THE PROPHECY REMEMBERS</small>
                <h2 className="motion-heading font-display text-2xl md:text-4xl text-white mt-4">THE THUNDERED THRONE AWAITS</h2>
                <p className="font-serif italic text-base md:text-lg leading-relaxed text-stone-200 mt-5">
                  I have seen your name written where mortal sinew meets divine will. You are the promised bearer who will raise iron without worshipping pride, endure fire without becoming cruel, and climb until Olympus can no longer call you stranger. Go now. Let every honest repetition become thunder. If you remain faithful to the oath, the road will not merely lead toward Zeus. One day, the heavens will speak your name beside his.
                </p>
                <button onClick={finishTutorial} className="mt-7 border border-gold-core bg-gold-core/10 py-3 font-mono text-[9px] font-black tracking-[.2em] text-gold-core hover:bg-gold-core hover:text-black">
                  CONTINUE TOWARD OLYMPUS
                </button>
                <span className="mt-3 font-mono text-[7px] tracking-widest text-stone-600">ARETE WILL DEPART WHEN THE PROPHECY IS ACCEPTED</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN: THE IRON LEDGER (Columns: 5) ================= */}
        <div className="fitness-workout-column lg:col-span-5 flex flex-col gap-4 relative" style={{ zIndex: splitDropdownOpen ? 500 : 1 }}>
          <OrnatePanel className="border-gold-core/25 !overflow-visible fitness-panel-glass" style={{ position:'relative', zIndex: splitDropdownOpen ? 500 : 1 }}>
            <div className="panel-header-custom flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-gold-core/60 tracking-widest uppercase font-bold">SESSION CONTROL</span>
                <div className="flex items-center gap-2">
                  <h3 className="motion-heading font-display text-lg text-white tracking-wider uppercase">THE IRON LEDGER</h3>
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
                  {fitnessV2PreviewEnabled && (
                    <div className="relative ml-2">
                      <button
                        type="button"
                        onClick={() => setArchiveDropdownOpen(value => !value)}
                        className="flex items-center gap-1.5 border border-gold-core/30 bg-black/75 px-2.5 py-1.5 font-mono text-[8px] font-black tracking-widest text-gold-core"
                      >
                        CHOOSE DECREE <ChevronDown size={11}/>
                      </button>
                      {archiveDropdownOpen && (
                        <div className="absolute left-0 top-full z-[700] mt-1 w-64 max-h-64 overflow-y-auto border border-gold-core/30 bg-[#020203] shadow-2xl custom-scrollbar">
                          {workoutTemplates.length ? workoutTemplates.map(template => (
                            <button key={template.id} type="button" onClick={() => initializeWorkoutTemplate(template)} className="block w-full border-b border-white/5 bg-[#020203] px-3 py-3 text-left hover:bg-gold-core/10">
                              <strong className="block font-display text-[10px] tracking-wider text-white uppercase">{template.split}</strong>
                              <span className="mt-1 block font-mono text-[7px] text-stone-500">{template.movements?.length || 0} MOVEMENTS · EDITABLE COPY</span>
                            </button>
                          )) : <span className="block p-3 font-mono text-[8px] text-stone-500">ARCHIVE A SESSION TO FORGE YOUR FIRST DECREE.</span>}
                        </div>
                      )}
                    </div>
                  )}
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
                    id="fitness-split-select"
                    onClick={() => setSplitDropdownOpen(!splitDropdownOpen)}
                    className="w-full bg-black border border-white/10 hover:border-gold-core text-white px-4 py-2.5 rounded font-mono text-[10px] tracking-widest uppercase flex justify-between items-center motion-control"
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
                        className="absolute left-0 right-0 mt-1.5 border border-white/15 rounded z-[300] max-h-[220px] overflow-y-auto custom-scrollbar shadow-[0_18px_55px_rgba(0,0,0,.98)] isolate"
                        style={{ backgroundColor: '#020203', opacity: 1 }}
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
                            className="w-full text-left font-mono text-[9px] text-gray-300 hover:text-white px-4 py-2 border-b border-white/5 motion-control"
                            style={{ backgroundColor: '#020203' }}
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
              <WorkoutSession workout={activeWorkout} history={gymLog || []} presets={movementPresets}
                addMovement={addMovement} removeMovement={removeMovement} addSet={addSetToMovement}
                updateSet={updateSetInMovement} deleteSet={deleteSetFromMovement} toggleComplete={handleToggleSetComplete}
                notes={updateWorkoutNotes} archive={archiveWorkoutWithReport} advance={advanceTutorial}
                discard={() => { cancelWorkout(); if (!tutorialActive) useWorkoutUi.getState().clear(); }}
                focusedSet={focusedSet} setFocusedSet={setFocusedSet} />
            )}
          </OrnatePanel>

          {/* Training Controls widgets: RPE Dial and Rest Timer */}
          {activeWorkout && (
            <div className="workout-controls grid grid-cols-2 gap-4">
              
              {/* RPE Dial Widget */}
              <OrnatePanel frameSize="compact" id="fitness-rpe-dial" className="flex flex-col justify-between h-[155px] relative overflow-hidden !p-3 fitness-panel-glass">
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
                              className="flex-1 bg-white/[0.02] border border-white/10 hover:border-gold-core/30 hover:bg-gold-core/5 text-white font-mono text-[9px] py-1 rounded select-none motion-control flex items-center justify-center font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <button 
                              onClick={() => handleAdjustRpe(0.5)}
                              className="flex-1 bg-white/[0.02] border border-white/10 hover:border-gold-core/30 hover:bg-gold-core/5 text-white font-mono text-[9px] py-1 rounded select-none motion-control flex items-center justify-center font-bold cursor-pointer"
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
              <OrnatePanel frameSize="compact" id="fitness-rest-timer" className="flex flex-col justify-between h-[155px] relative overflow-hidden !p-3 fitness-panel-glass">
                <div className={`relative flex justify-between items-center mb-1 ${timerDurationOpen ? 'z-[320]' : 'z-10'}`}>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-mono text-gold-core/60 tracking-wider uppercase font-bold">REST TIMER</span>
                    <span className="text-[8px] font-mono text-gray-500 uppercase">Active Recovery</span>
                  </div>
                  
                  {/* App-native Rest Duration */}
                  <div
                    className="relative"
                    onBlur={event => {
                      if (!event.currentTarget.contains(event.relatedTarget)) setTimerDurationOpen(false);
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setTimerDurationOpen(open => !open)}
                      className={`flex min-w-[54px] items-center justify-between gap-2 rounded border px-2 py-1 font-mono text-[8px] font-bold tracking-wider transition-colors ${
                        timerDurationOpen
                          ? 'border-gold-core/60 bg-gold-core/10 text-gold-bright'
                          : 'border-white/10 bg-black/70 text-white hover:border-gold-core/35'
                      }`}
                      aria-haspopup="listbox"
                      aria-expanded={timerDurationOpen}
                    >
                      <span>{timerDuration}s</span>
                      <ChevronDown size={10} className={`text-gold-core transition-transform ${timerDurationOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {timerDurationOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.96 }}
                          className="absolute right-0 top-[calc(100%+4px)] z-[300] isolate w-[76px] overflow-hidden rounded border border-gold-core/30 shadow-[0_14px_32px_rgba(0,0,0,.95),inset_0_0_18px_rgba(197,160,89,.04)]"
                          style={{ backgroundColor: '#020203', opacity: 1 }}
                          role="listbox"
                        >
                          {[60, 90, 120, 180, 300].map(duration => (
                            <button
                              type="button"
                              key={duration}
                              role="option"
                              aria-selected={timerDuration === duration}
                              onClick={() => {
                                setTimerDuration(duration);
                                if (!timerActive) setTimerSeconds(duration);
                                setTimerDurationOpen(false);
                              }}
                              className={`flex w-full items-center justify-between border-b border-white/5 px-2.5 py-1.5 font-mono text-[8px] tracking-wider last:border-0 ${
                                timerDuration === duration
                                  ? 'text-gold-bright'
                                  : 'text-gray-400 hover:text-white'
                              }`}
                              style={{
                                backgroundColor: timerDuration === duration ? '#17130c' : '#020203',
                                opacity: 1,
                              }}
                            >
                              <span>{duration}s</span>
                              {timerDuration === duration && <Check size={9} className="text-gold-core" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 z-10 flex-1">
                  {/* Circular Dial Column */}
                  <div role="button" tabIndex={0} aria-label={timerActive ? "Pause rest timer" : "Start rest timer"} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!timerActive && timerSeconds === 0) setTimerSeconds(timerDuration); setTimerActive(!timerActive); } }} className="flex items-center justify-center relative w-[80px] h-[80px] select-none cursor-pointer shrink-0"
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
                        className="flex-1 bg-white/[0.02] border border-white/10 hover:border-gold-core/30 hover:bg-gold-core/5 text-gray-400 hover:text-white font-mono text-[7px] py-1 rounded uppercase select-none motion-control cursor-pointer"
                      >
                        -30s
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setTimerSeconds(prev => prev + 30);
                        }}
                        className="flex-1 bg-white/[0.02] border border-white/10 hover:border-gold-core/30 hover:bg-gold-core/5 text-gray-400 hover:text-white font-mono text-[7px] py-1 rounded uppercase select-none motion-control cursor-pointer"
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
                      className="w-full bg-white/[0.02] border border-white/10 hover:border-red-500/40 hover:bg-red-500/5 text-gray-400 hover:text-red-400 font-mono text-[7px] py-1 rounded uppercase motion-control flex items-center justify-center gap-1 cursor-pointer"
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
        <div className="fitness-deity-column lg:col-span-4 flex flex-col gap-4">
          <OrnatePanel className="text-center relative overflow-hidden !p-4 elite-panel-clear">
            
            {/* Background God Aura Light */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,200,128,0.12)_0%,transparent_70%)] pointer-events-none" />

            <div data-display-collapsed={deityDisplay.collapsed} className="flex flex-col items-center relative z-10 pt-1 w-full">
              <MobileDisplayToggle id="fitness-deity-decoration" label="Deity display" display={deityDisplay} />
              <div id="fitness-deity-decoration" className="mobile-display-content w-full flex flex-col items-center">
              <span className="text-[8px] font-mono text-gold-core/60 tracking-[0.3em] uppercase font-bold mb-1">ACTIVE DEITY AVATAR</span>
              <DeityTitleCard deity={activeDeity} className="fitness-dashboard-title-card" />

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
                        style={{ width: '100%', transformOrigin: 'left' }}
                        initial={false}
                        animate={{ transform: `scaleX(${Math.max(0, Math.min(1, progressPercent / 100))})` }}
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
                data-ambient-motion className="relative w-full h-[420px] bg-black/40 rounded flex items-end justify-center overflow-hidden mb-4 border border-white/5"
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
                  className="motion-deity-float w-full h-full flex items-end justify-center relative pb-12"
                >
                  {/* Glowing Divine Aura (Pulsing background light) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Outer soft glow */}
                    <motion.div 
                      className="motion-deity-aura absolute w-72 h-72 rounded-full bg-gold-core/5 filter blur-3xl"
                    />
                    {/* Inner glowing halo ring */}
                    <motion.div 
                      className="motion-deity-halo absolute w-56 h-56 rounded-full border border-gold-core/10 bg-gradient-to-t from-transparent via-gold-core/[0.02] to-gold-core/[0.05] filter blur-[2px]"
                    />
                  </div>

                  {/* Deity Statue Image - Full height, standing on bottom */}
                  <div className="relative z-10 w-full h-[360px] flex items-end justify-center">
                    <img 
                      src={`/fitness-v2/olympus/statues/olympus-${activeDeity.id}-statue.webp`}
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

              </div>
              {fitnessV2PreviewEnabled && <FitnessOlympusRecognition gymLog={gymLog} />}

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
        <div className="fitness-secondary-column lg:col-span-3 flex flex-col gap-4 sticky top-4">
          
          {/* Quick Metrics Widget */}
          <OrnatePanel frameSize="metrics" className="fitness-panel-glass">
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
                  <h3 className="motion-heading font-display text-lg text-white tracking-wider uppercase">PANTHEON TIER</h3>
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
                const deityDownloaded = isDeityDownloaded(deity.id);
                const downloadState = deityDownloadState[deity.id] || 'idle';

                return (
                  <div 
                    key={deity.id}
                    className={`p-2.5 rounded border flex items-center gap-3 motion-control relative ${
                      isCurrent 
                        ? 'border-gold-core bg-gold-core/[0.03] shadow-[0_0_12px_rgba(197,160,89,0.15)]' 
                        : isUnlocked 
                          ? 'border-white/10 bg-white/[0.01] opacity-80' 
                          : 'border-white/5 bg-black/60 opacity-40'
                    }`}
                  >
                    {isUnlocked && !deityDownloaded && (
                      <button
                        type="button"
                        onClick={() => downloadDeity(deity.id)}
                        disabled={downloadState === 'downloading'}
                        className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-gold-core/45 bg-black/90 text-gold-core shadow-[0_0_14px_rgba(236,200,128,.3)]"
                        aria-label={`Download ${deity.name}`}
                      >
                        {downloadState === 'downloading'
                          ? <Loader2 size={12} className="animate-spin" />
                          : <CloudDownload size={12} />}
                      </button>
                    )}
                    {/* Circle Avatar Face Preview */}
                    <div className="relative shrink-0">
                      <div className={`w-9 h-9 rounded-full overflow-hidden border flex items-center justify-center bg-black/60 motion-control ${
                        isCurrent 
                          ? 'border-2 border-gold-bright shadow-[0_0_10px_rgba(236,200,128,0.4)]' 
                          : isUnlocked 
                            ? 'border-gold-core/40' 
                            : 'border-white/10'
                      }`}>
                        <img 
                          src={getAssetUrl(`/deity/avatar/${deity.id}.webp`)}
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
            {fitnessV2PreviewEnabled && (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('warscythe:fitness-scene', { detail: { scene:'hall' } }))}
                className="mt-3 w-full border border-gold-core/40 bg-black/70 py-3 font-mono text-[8px] font-black tracking-[.18em] text-gold-core hover:bg-gold-core hover:text-black"
              >
                EXPLORE HALL OF OLYMPUS
              </button>
            )}
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
                  <div key={log.id} className="border border-white/5 bg-white/[0.01] p-2 rounded flex flex-col gap-1.5 hover:border-gold-core/20 motion-control">
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
                className="w-full mt-3 border border-white/10 hover:border-gold-core/40 bg-white/[0.02] hover:bg-gold-core/5 text-gray-300 hover:text-gold-core font-mono text-[8px] py-1.5 rounded uppercase tracking-widest motion-control flex items-center justify-center gap-1.5 cursor-pointer"
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
              className="w-full max-w-4xl border border-gold-core/20 p-3 sm:p-6 bg-[#08080a]/95 rounded-lg max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-4 sm:gap-6 shadow-[0_0_40px_rgba(197,160,89,0.1),_inset_0_0_25px_rgba(0,0,0,0.85)]"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList size={18} className="text-gold-core" />
                  <h2 className="motion-heading font-display text-[11px] sm:text-sm text-white tracking-widest uppercase">THE IRON ARCHIVES // WORKOUT HISTORY</h2>
                </div>
                <button 
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center motion-control"
                  onClick={() => setShowHistoryModal(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-mono text-[9px] text-gold-core uppercase tracking-widest">HISTORICAL TRAINING LOGS // READ ONLY</span>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                  <div className="border border-gold-core/20 bg-gold-core/[0.04] p-2 sm:p-4">
                    <small className="font-mono text-[7px] tracking-widest text-gray-500">SESSIONS ARCHIVED</small>
                    <strong className="mt-1 block font-display text-base sm:text-2xl text-white">{totalWorkouts}</strong>
                  </div>
                  <div className="border border-gold-core/20 bg-gold-core/[0.04] p-2 sm:p-4">
                    <small className="font-mono text-[7px] tracking-widest text-gray-500">TOTAL IRON MOVED</small>
                    <strong className="mt-1 block font-display text-base sm:text-2xl text-gold-core">{Math.round(totalTonnage).toLocaleString()} KG</strong>
                  </div>
                  <div className="border border-gold-core/20 bg-gold-core/[0.04] p-2 sm:p-4">
                    <small className="font-mono text-[7px] tracking-widest text-gray-500">ACTIVE ASCENSION</small>
                    <strong className="mt-1 block font-display text-sm sm:text-lg text-white">{activeDeity?.name || 'MORTAL'}</strong>
                  </div>
                </div>

                <div className="sm:hidden flex flex-col gap-2">
                  {gymLog.map(log => {
                    const expanded = expandedHistoryId === log.id;
                    return (
                      <article key={log.id} className="border border-gold-core/15 bg-black/40">
                        <button
                          type="button"
                          className="w-full flex items-center justify-between gap-3 p-3 text-left"
                          onClick={() => setExpandedHistoryId(expanded ? null : log.id)}
                          aria-expanded={expanded}
                        >
                          <span className="min-w-0">
                            <span className="block text-[10px] font-display font-bold text-white tracking-wider uppercase truncate">{log.split}</span>
                            <span className="mt-1 flex items-center gap-1 text-[8px] font-mono text-gray-500">
                              <Calendar size={9} /> {new Date(log.date).toLocaleDateString()}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <strong className="text-[9px] font-mono text-gold-bright">{Math.round(getSessionTonnage(log)).toLocaleString()} KG</strong>
                            <ChevronDown size={14} className={`text-gold-core transition-transform ${expanded ? 'rotate-180' : ''}`} />
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-white/5 p-3 flex flex-col gap-3">
                                {(log.movements || []).map((movement, movementIndex) => (
                                  <div key={movementIndex}>
                                    <strong className="text-[9px] font-mono text-gold-core uppercase">{movement.name}</strong>
                                    <div className="mt-1.5 flex flex-col gap-1">
                                      {(movement.sets || []).map((set, setIndex) => (
                                        <div key={setIndex} className="flex items-start justify-between gap-2 text-[8px] font-mono">
                                          <span className={set.completed ? 'text-gray-300' : 'text-gray-600 line-through'}>
                                            Set {setIndex + 1} ({set.type.toUpperCase()}): {set.weight} KG × {set.reps} reps {set.rpe ? `@ ${set.rpe} RPE` : ''}
                                          </span>
                                          <span className={set.completed ? 'text-emerald-400' : 'text-red-400'}>
                                            {set.completed ? 'COMPLETE' : 'MISSED'}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                                {!log.movements && (log.exercises || []).map((exercise, exerciseIndex) => (
                                  <div key={exerciseIndex}>
                                    <strong className="text-[9px] font-mono text-gold-core uppercase">{exercise.name}</strong>
                                    <p className="mt-1 text-[8px] font-mono text-gray-300">
                                      {exercise.sets} sets × {exercise.reps} reps {exercise.weight > 0 ? `@ ${exercise.weight} KG` : ''}
                                    </p>
                                  </div>
                                ))}
                                {log.notes && (
                                  <div className="border-t border-white/5 pt-2">
                                    <span className="text-[7px] font-mono text-gray-500 tracking-widest">SESSION NOTES</span>
                                    <p className="mt-1 text-[9px] font-mono text-gray-300 uppercase">{log.notes}</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </article>
                    );
                  })}
                </div>

                <div className="hidden sm:block overflow-x-auto border border-white/5 rounded bg-black/40">
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
                        <tr key={log.id} className="hover:bg-white/[0.01] motion-control align-top">
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
