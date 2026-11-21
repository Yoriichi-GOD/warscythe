import { useReducedMotionPreference } from '../../motion/useMotionEnvironment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, BookOpen, Check, ChevronRight, Droplets, Flame, Landmark, Utensils, X } from 'lucide-react';
import { buildFitnessRewardPreview } from './domain/rewardEngine.js';
import { DEITY_ROSTER, getBlessingAssets, getDeityAssets } from './domain/deityRoster.js';
import { calculateWorkoutEvidence } from './domain/workoutEvidence.js';
import { normalizeWorkoutHistory } from './domain/workoutNormalization.js';
import DeityTitleCard from './DeityTitleCard.jsx';
import './fitnessOlympusExperience.css';

const ROOT = '/fitness-v2/olympus';
const ENV = `${ROOT}/environments`;
const PANTHEON = `${ROOT}/pantheon`;

function SceneImage({ desktop, mobile, mobileMedia = '(max-width: 720px)', alt = '' }) {
  return <picture className="fitness-experience-bg"><source media={mobileMedia} srcSet={mobile || desktop}/><img src={desktop} alt={alt}/></picture>;
}

function calculateAverageRpe(workout) {
  const rpes = (workout?.movements || []).flatMap(m => (m.sets || []).filter(s => s.completed && Number(s.rpe) > 0).map(s => Number(s.rpe)));
  return rpes.length ? rpes.reduce((sum, value) => sum + value, 0) / rpes.length : 0;
}

function ReportScene({ report }) {
  const improvement = report.previousVolume ? ((report.volume - report.previousVolume) / report.previousVolume) * 100 : null;
  return <div className="fitness-report-layout">
    <small>IRON CODEX // SESSION DEBRIEF</small>
    <h2>{report.split}</h2>
    <p>The body has spoken. The Ledger records what changed.</p>
    <div className="fitness-report-metrics">
      <div><span>VOLUME MOVED</span><strong>{Math.round(report.volume).toLocaleString()} KG</strong></div>
      <div><span>AVERAGE RPE</span><strong>{report.averageRpe ? report.averageRpe.toFixed(1) : '—'}</strong></div>
      <div><span>SETS EXECUTED</span><strong>{report.completedSets} / {report.totalSets}</strong></div>
      <div><span>LAST COMPARABLE</span><strong>{report.previousVolume ? `${Math.round(report.previousVolume).toLocaleString()} KG` : 'FIRST RECORD'}</strong></div>
    </div>
    <div className="fitness-report-verdict">
      <span>PROGRESS SINCE LAST RECORD</span>
      <strong>{improvement === null ? 'A NEW BASELINE HAS BEEN FORGED' : `${improvement >= 0 ? '+' : ''}${improvement.toFixed(1)}% VOLUME`}</strong>
      <p>{report.affinityGain} Affinity recognized · {report.fragmentReason || 'No rare Fragment event this session'}</p>
    </div>
  </div>;
}

function ResourceScene({ type }) {
  const ambrosia = type === 'ambrosia';
  return <div className="fitness-resource-layout">
    <small>{ambrosia ? 'AMBROSIA // THE BODY CONSUMES' : 'NECTAR // THE BODY ENDURES'}</small>
    <h2>{ambrosia ? 'THE AMBROSIA SANCTUM' : 'THE NECTAR FOUNTAIN'}</h2>
    <p>{ambrosia ? 'Record nourishment with precision. Olympus rewards adherence to the chosen physical trial—not deprivation.' : 'Replenish what training takes. Hydration remains simple, visible and accountable.'}</p>
    <div className="fitness-resource-cards">
      <article><span>{ambrosia ? 'DAILY OFFERING' : 'DAILY VESSEL'}</span><strong>{ambrosia ? '1,840 / 2,400 KCAL' : '2.1 / 3.4 L'}</strong><i style={{width: ambrosia ? '77%' : '62%'}}/></article>
      <article><span>{ambrosia ? 'SACRED BALANCE' : 'CONSISTENCY'}</span><strong>{ambrosia ? '142P · 196C · 61F' : '5 / 7 DAYS'}</strong><i style={{width: ambrosia ? '71%' : '71%'}}/></article>
    </div>
    <div className="fitness-resource-entry"><input placeholder={ambrosia ? 'SEARCH OR RECORD AMBROSIA…' : 'RECORD NECTAR…'}/><button type="button">{ambrosia ? 'ADD OFFERING' : '+ 250 ML'}</button></div>
    <div className="fitness-resource-log"><span>TODAY'S RECORD</span>{(ambrosia ? ['Oats, whey and berries · 612 kcal','Rice, lentils and paneer · 748 kcal','Banana and curd · 286 kcal'] : ['Morning vessel · 500 ml','Training vessel · 1,000 ml','Recovery vessel · 600 ml']).map(item => <div key={item}><Check size={14}/>{item}</div>)}</div>
  </div>;
}

function WarLedgerScene({ templates, onInitialize }) {
  return <div className="fitness-war-ledger-layout">
    <small>WAR LEDGER // REUSABLE IRON DECREES</small><h2>THE IRON CODEX</h2>
    <p>Plans live here. Today’s execution becomes an editable copy; completed truth belongs only to Workout History.</p>
    <div className="fitness-decree-grid">{templates.map(template => <article key={template.id}>
      <span>{template.movements?.length || 0} MOVEMENTS</span><h3>{template.split}</h3>
      <p>{(template.movements || []).slice(0,3).map(m => m.name).join(' · ') || 'Unwritten decree'}</p>
      <button type="button" onClick={() => onInitialize(template)}>INITIALIZE IN IRON LEDGER <ChevronRight size={14}/></button>
    </article>)}</div>
  </div>;
}

function ChamberScene({ preview, deityId, onScene }) {
  const deity = preview.deities.find(item => item.id === deityId) || preview.deities[0];
  return <div className={`fitness-chamber-layout deity-${deity.id}`} style={{'--deity-color': deity.palette, '--deity-ring': deity.ringColor || deity.palette}}>
    <div className="fitness-chamber-evidence">
      <span className="fitness-chamber-sigil" aria-hidden="true">{String(deity.workouts).padStart(2, '0')}</span>
      <div><small>WORKOUTS COMPLETED</small><em>UNDER {deity.name.toUpperCase()}</em></div>
    </div>
    <section className="fitness-chamber-identity">
      <DeityTitleCard deity={deity}/>
    </section>
    <div className="fitness-chamber-rewards">{deity.blessings.map((blessing, index) => {
      const art = getBlessingAssets(deity.id, blessing.id);
      const percentage = Math.min(100, Math.round((blessing.fragments / blessing.fragmentsRequired) * 100));
      const state = blessing.completed ? 'complete' : index === deity.activeBlessingIndex ? 'progress' : 'locked';
      return <button type="button" key={blessing.id} className={`is-${state}`} style={{'--blessing-progress': `${percentage * 3.6}deg`}} onClick={() => onScene(blessing.completed ? 'ceremony' : 'reward', {deityId:deity.id, blessingId:blessing.id})}>
        <span className="fitness-blessing-dial"><i/><img src={blessing.completed ? art.blessing : art.fragment} alt=""/></span>
        <span className="fitness-blessing-name">{blessing.name}</span>
        <small>FRAGMENTS</small>
        <strong>{blessing.fragments} / {blessing.fragmentsRequired}</strong>
        <em>{state === 'complete' ? 'COMPLETE' : state === 'progress' ? 'IN PROGRESS' : 'LOCKED'}</em>
      </button>;
    })}</div>
    <blockquote className="fitness-chamber-doctrine"><span>“</span><p>{deity.doctrine}</p><span>”</span></blockquote>
  </div>;
}

function PantheonScene({ preview, onChamber }) {
  const activeId = preview.activeJourney?.deity?.id;
  // Visual chamber centres, not pedestal-edge coordinates. This keeps each
  // marker inside its alcove when cover-cropping shifts across viewports.
  const positions = {
    hermes: { dx:'12.5%', dy:'54%', cdy:'78%', mx:'21%', my:'79%', cmy:'91%', scale:1 },
    apollo: { dx:'29.5%', dy:'55%', cdy:'78%', mx:'77%', my:'79%', cmy:'91%', scale:1 },
    ares: { dx:'50%', dy:'55%', cdy:'78%', mx:'51%', my:'55%', cmy:'66%', scale:1.04 },
    hercules: { dx:'70.5%', dy:'55%', cdy:'78%', mx:'23%', my:'29%', cmy:'40%', scale:1 },
    zeus: { dx:'88.5%', dy:'54%', cdy:'78%', mx:'67%', my:'22%', cmy:'27%', scale:1.05 },
  };
  return <div className="fitness-pantheon-map" aria-label="Hall of Olympus">
    <div className="fitness-pantheon-title"><small>THE BODY REMEMBERED</small><strong>HALL OF OLYMPUS</strong><span>Completed ages occupy their rightful thrones.</span></div>
    {preview.deities.map(deity => {
      const position = positions[deity.id];
      const completed = Boolean(deity.ascended);
      const active = deity.id === activeId;
      const activeBlessing = deity.blessings[deity.activeBlessingIndex] || deity.blessings[0];
      const image = completed ? getDeityAssets(deity.id).statue : getBlessingAssets(deity.id, activeBlessing.id).fragment;
      return <button type="button"
        key={deity.id}
        onClick={() => onChamber(deity.id)}
        className={`fitness-pantheon-marker ${completed ? 'is-completed' : 'is-fragment'} ${active ? 'is-active' : ''}`}
        style={{'--map-x':position.dx,'--map-y':position.dy,'--map-cy':position.cdy,'--map-mx':position.mx,'--map-my':position.my,'--map-cmy':position.cmy,'--map-scale':position.scale,'--marker-color':deity.ringColor || deity.palette}}
        aria-label={`${deity.name}: ${completed ? 'ascended' : active ? 'current trial' : 'unoccupied pedestal'}`}
      >
        <span className="fitness-pantheon-aura"/>
        <img src={image} alt=""/>
        <span className="fitness-pantheon-marker-label"><b>{deity.name}</b><small>{completed ? 'ASCENDED' : active ? 'CURRENT TRIAL' : 'UNREACHED'}</small></span>
      </button>;
    })}
  </div>;
}

function GateScene({ destination, deity }) {
  const passages = {
    hall: { icon:<Landmark/>, lead:'YOU ARE ENTERING THE', title:'HALL OF OLYMPUS', subtitle:'THE DOMAIN OF THE GODS', body:'Beyond these gates lies the eternal assembly. Every age of the body that you conquer will be remembered here.' },
    ambrosia: { icon:<Utensils/>, lead:'YOU ARE ENTERING', title:'AMBROSIA SANCTUM', subtitle:'THE BODY IS NOURISHED', body:'Record what sustains the trial. Olympus rewards disciplined nourishment, not deprivation.' },
    nectar: { icon:<Droplets/>, lead:'YOU ARE ENTERING', title:'NECTAR FOUNTAIN', subtitle:'THE BODY IS RESTORED', body:'Replenish what training takes. Recovery begins with what the body receives.' },
    chamber: { icon:<Flame/>, lead:'YOU ARE ENTERING THE CHAMBER OF', title:deity.name.toUpperCase(), subtitle:deity.domain.toUpperCase(), body:deity.doctrine },
  };
  const passage = passages[destination] || passages.chamber;
  return <motion.div
    className={`fitness-gate-copy gate-${destination || 'chamber'} deity-${deity.id}`}
    style={{'--gate-color':deity.ringColor || deity.palette}}
    initial={{ opacity: 0, x: -72 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -34 }}
    transition={{ duration: .82, delay: .3, ease: [.22, 1, .36, 1] }}
  >
    <small>THE GATES OF OLYMPUS</small><span className="fitness-gate-emblem" aria-hidden="true">{passage.icon}</span>
    <p className="fitness-gate-lead">{passage.lead}</p>
    {destination === 'chamber' ? <DeityTitleCard deity={deity}/> : <><h2>{passage.title}</h2><strong>{passage.subtitle}</strong></>}
    <i className="fitness-gate-progress" aria-hidden="true"><b/></i>
    <p className="fitness-gate-body">{passage.body}</p>
  </motion.div>;
}

function AffinityRewardScene({ deity, blessing, report, payload, onReady }) {
  const reduceMotion = useReducedMotionPreference();
  const evidenceResult = useMemo(() => calculateWorkoutEvidence(report), [report]);
  const gain = evidenceResult.affinity;
  const after = Math.min(100, Math.max(0, Math.round(Number(payload.nextAffinity ?? blessing.affinity) || 0)));
  const before = Math.min(after, Math.max(0, Math.round(Number(payload.previousAffinity ?? (after - gain)) || 0)));
  const gainValue = useMotionValue(0);
  const progressValue = useMotionValue(before);
  const displayGain = useTransform(gainValue, current => `+${Math.round(current)}`);
  const displayProgress = useTransform(progressValue, current => Math.round(current));
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const sigil = `${ROOT}/sigils/olympus-${deity.id}-sigil.webp`;

  useEffect(() => {
    gainValue.set(reduceMotion ? gain : 0);
    progressValue.set(reduceMotion ? after : before);
    if (reduceMotion) {
      onReadyRef.current?.();
      return undefined;
    }
    const gainAnimation = animate(gainValue, gain, { duration: .85, ease: 'linear' });
    const progressAnimation = animate(progressValue, after, { duration: 1.05, delay: .85, ease: 'linear' });
    const readyTimer = window.setTimeout(() => onReadyRef.current?.(), 2350);
    return () => {
      gainAnimation.stop();
      progressAnimation.stop();
      clearTimeout(readyTimer);
    };
  }, [after, before, gain, gainValue, progressValue, reduceMotion]);

  const remaining = Math.max(0, 100 - after);
  return <div className={`fitness-affinity-reward deity-${deity.id}`} style={{'--affinity-color':deity.ringColor || deity.palette}}>
    <motion.div className="fitness-affinity-heading" initial={{opacity:0,x:-70}} animate={{opacity:1,x:0}} transition={{duration:.85,ease:[.22,1,.36,1]}}>
      <img src={sigil} alt=""/><div className="fitness-affinity-flow" aria-hidden="true"><b /></div>
    </motion.div>
    <section className="fitness-affinity-focus">
      <div className="fitness-affinity-award">
        <motion.div className="fitness-affinity-gem" data-ambient-motion initial={{opacity:0,y:12,scale:.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:reduceMotion ? 0 : .24}}>
          <img src={`${ROOT}/rewards/gem.webp`} alt="Olympian affinity crystal"/>
        </motion.div>
        <small>AFFINITY GAINED</small><motion.strong>{displayGain}</motion.strong>
      </div>
      <div className="fitness-affinity-breakdown">{evidenceResult.evidence.map((record, index) => <motion.div key={record.label} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:.75+(index*.16),duration:.42}}><span>{record.label}</span><em>{record.value}</em><b>+{record.affinity}</b></motion.div>)}</div>
    </section>
    <motion.aside className="fitness-affinity-outcome" initial={{opacity:0,x:32}} animate={{opacity:1,x:0}} transition={{delay:1.35,duration:.65}}>
      <small>AFFINITY PROGRESS</small><div className="fitness-affinity-values"><span>{before}</span><i>→</i><motion.strong>{displayProgress}</motion.strong><em>/ 100</em></div>
      <div className="fitness-affinity-bar"><motion.i initial={{transform:`scaleX(${before / 100})`}} animate={{transform:`scaleX(${after / 100})`}} style={{width:'100%',transformOrigin:'left'}} transition={{duration:reduceMotion ? 0 : 1.05,delay:reduceMotion ? 0 : .85,ease:'linear'}}/></div>
      <p>{remaining ? `${remaining} AFFINITY UNTIL RECOGNITION` : 'THE DEITY RECOGNIZES YOUR EFFORT'}</p>
      <article><img src={getBlessingAssets(deity.id, blessing.id).fragment} alt=""/><div><small>ACTIVE BLESSING</small><strong>{blessing.name}</strong><span>{blessing.fragments} / {blessing.fragmentsRequired} FRAGMENTS RECOVERED</span></div></article>
      <blockquote>Significant execution recovers Fragments. Every true session deepens Affinity.</blockquote>
    </motion.aside>
  </div>;
}

function buildAscensionCreed(gymLog = [], deity) {
  const { workouts } = normalizeWorkoutHistory(gymLog);
  const movements = workouts.flatMap(workout => workout.movements);
  const sets = movements.flatMap(movement => movement.sets.map(set => ({ ...set, movement: movement.name })));
  const best = sets.reduce((record, set) => !record || set.weight > record.weight ? set : record, null);
  return [
    ['WORKOUTS COMPLETED', deity.workouts.toLocaleString()],
    ['TOTAL VOLUME FORGED', `${Math.round(workouts.reduce((sum, workout) => sum + workout.totalVolume, 0)).toLocaleString()} KG`],
    ['TOTAL REPS EXECUTED', workouts.reduce((sum, workout) => sum + workout.totalReps, 0).toLocaleString()],
    ['DAYS JOURNEYED', `${new Set(workouts.map(workout => workout.date.slice(0, 10))).size} DAYS`],
    ['BEST LIFT ACHIEVED', best ? `${best.movement} — ${best.weight.toLocaleString()} KG` : 'NO LIFT RECORDED'],
    ['CONSISTENCY MAINTAINED', workouts.length ? '100%' : '0%'],
    ['BLESSINGS ACHIEVED', `${deity.blessings.length} / ${deity.blessings.length}`, true],
  ];
}

function AnimatedAscensionValue({ value, index, resolvesToTick = false }) {
  const reduceMotion = useReducedMotionPreference();
  const progress = useMotionValue(reduceMotion ? 1 : 0);
  const [showTick, setShowTick] = useState(false);
  const animated = useTransform(progress, current => String(value).replace(/\d[\d,.]*/g, token => {
    const numeric = Number(token.replace(/,/g, ''));
    const decimals = token.includes('.') ? token.split('.')[1].length : 0;
    return decimals ? (numeric * current).toFixed(decimals) : Math.floor(numeric * current).toLocaleString();
  }));
  useEffect(() => {
    progress.set(reduceMotion ? 1 : 0);
    if (reduceMotion) return undefined;
    const delay = .24 + index * .15;
    const duration = resolvesToTick ? 2.4 : 1.35;
    const animation = animate(progress, 1, { delay, duration, ease: [0.23, 1, 0.32, 1] });
    const tickTimer = resolvesToTick ? window.setTimeout(() => setShowTick(true), (delay + duration + .52) * 1000) : null;
    return () => { animation.stop(); clearTimeout(tickTimer); };
  }, [index, progress, reduceMotion, resolvesToTick]);

  if ((reduceMotion || showTick) && resolvesToTick) return <span className="fitness-ascension-tick" aria-label="All Blessings achieved">✓</span>;
  return <motion.span>{animated}</motion.span>;
}

function AscensionBlessings({ deity, mobile = false }) {
  return <aside className={`fitness-ascension-blessings${mobile ? ' is-mobile' : ''}`}>
    <h3>BLESSINGS ACHIEVED</h3>
    {deity.blessings.map(item => {
      const art = getBlessingAssets(deity.id, item.id);
      return <article key={item.id} className="is-complete">
        <span><img src={art.blessing} alt=""/></span>
        <div><strong>{item.name}</strong><small>BLESSING COMPLETE</small></div>
      </article>;
    })}
  </aside>;
}

function AscensionScene({ deity, gymLog }) {
  const creed = useMemo(() => buildAscensionCreed(gymLog, deity), [gymLog, deity]);
  return <div className={`fitness-ascension-layout deity-${deity.id}`} style={{'--ascension-color': deity.ringColor || deity.palette}}>
    <section className="fitness-ascension-record">
      <div className="fitness-ascension-identity">
        <DeityTitleCard deity={deity}/>
        <h2>ASCENSION COMPLETE</h2>
        <div className="fitness-ascension-rule" aria-hidden="true"><i/></div>
      </div>
      <AscensionBlessings deity={deity} mobile/>
      <small>ASCENSION CREED</small>
      <div className="fitness-ascension-creed">{creed.map(([label, value, resolvesToTick], index) => <div key={label}><span>{label}</span><i/><strong><AnimatedAscensionValue value={value} index={index} resolvesToTick={resolvesToTick}/></strong></div>)}</div>
      <blockquote>“THE AGE IS COMPLETE. THE BODY CARRIES ITS PROOF FORWARD.”</blockquote>
    </section>
    <AscensionBlessings deity={deity}/>
  </div>;
}

function formatCeremonyDate(value) {
  if (!value) return 'NOT RECORDED';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'NOT RECORDED';
  return new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(date).toUpperCase();
}

function BlessingCeremonyScene({ deity, blessing, onReady, onExit }) {
  const [acquired, setAcquired] = useState(false);
  const journey = blessing.journey || {};
  const start = journey.startedAt ? new Date(journey.startedAt) : null;
  const end = blessing.completedAt ? new Date(blessing.completedAt) : null;
  const elapsedDays = start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
    ? Math.max(1, Math.floor((end - start) / 86400000) + 1)
    : journey.workouts || 0;
  const records = [
    ['FIRST FRAGMENT RECOVERED', formatCeremonyDate(journey.firstFragmentAt)],
    ['BLESSING RECOGNIZED', formatCeremonyDate(blessing.completedAt)],
    ['WEIGHT LIFTED', `${Math.round(journey.volume || 0).toLocaleString()} KG`],
    ['SETS EXECUTED', Number(journey.completedSets || 0).toLocaleString()],
    ['TRAINING DAYS', `${Number(journey.workouts || 0).toLocaleString()} DAYS`],
    ['JOURNEY SPAN', `${elapsedDays.toLocaleString()} DAYS`],
  ];
  const bestLift = journey.bestLift;
  const completedBlessings = Math.max(1, deity.blessings?.filter(item => item.completed).length || 0);
  const blessingTotal = Math.max(1, deity.blessings?.length || 3);
  const blessingProgress = Math.min(100, (completedBlessings / blessingTotal) * 100);

  const acquire = () => {
    if (acquired) return;
    setAcquired(true);
    window.setTimeout(() => onReady?.(), 650);
  };
  const divineRoot = `/frames/divine/${deity.id}`;
  const divider = <span className="fitness-blessing-divider" aria-hidden="true">
    <img src="/frames/dividers/sapphire-line.webp" alt=""/>
    <img src="/frames/dividers/sapphire-gem.webp" alt=""/>
  </span>;

  return <div className={`fitness-blessing-modal deity-${deity.id} ${acquired ? 'is-acquired' : ''}`} style={{'--ceremony-color': deity.ringColor || deity.palette}}>
    <span className="fitness-blessing-frame" aria-hidden="true">
      <img className="fitness-blessing-frame-corner is-tl" src={`${divineRoot}/corner.webp`} alt=""/>
      <img className="fitness-blessing-frame-corner is-tr" src={`${divineRoot}/corner.webp`} alt=""/>
      <img className="fitness-blessing-frame-corner is-bl" src={`${divineRoot}/corner.webp`} alt=""/>
      <img className="fitness-blessing-frame-corner is-br" src={`${divineRoot}/corner.webp`} alt=""/>
      <img className="fitness-blessing-frame-center" src={`${divineRoot}/top-ornament.webp`} alt=""/>
      <img className="fitness-blessing-frame-gem" src={`${divineRoot}/top-gem.webp`} alt=""/>
    </span>
    <div className="fitness-blessing-modal-actions">
      <button type="button" onClick={onExit} aria-label="Close blessing"><X/></button>
    </div>
    <section className="fitness-blessing-visual">
      <img src={getBlessingAssets(deity.id, blessing.id).ceremony} alt={`${blessing.name} ceremony`}/>
      <div className="fitness-blessing-title"><img src="/frames/dividers/sapphire-gem.webp" alt=""/><span>MYTHIC BLESSING</span></div>
    </section>
    <section className="fitness-blessing-dossier">
      <header><DeityTitleCard deity={deity}/></header>
      <div className="fitness-blessing-showcase">
      <div className="fitness-blessing-seal" aria-label={acquired ? 'Blessing acquired' : 'Blessing awaiting acquisition'}>
        <img className="fitness-blessing-ring" src={`/frames/circular/blessing-${acquired ? 'complete' : 'incomplete'}.webp`} alt=""/>
        <span><img src={getBlessingAssets(deity.id, blessing.id).blessing} alt=""/></span>
      </div>
      <div className="fitness-blessing-summary">
        <h2>{blessing.name}</h2><strong>LEGENDARY BLESSING</strong>
        <p>Forged through disciplined effort. Your training history now carries divine proof.</p>
        <div className="fitness-blessing-acquire-row">
          <button type="button" className="fitness-blessing-acquire" onClick={acquire} disabled={acquired} aria-hidden={acquired}>
            <img className="is-tl" src="/frames/buttons/button-corner.webp" alt=""/><span>ACQUIRE</span><img className="is-br" src="/frames/buttons/button-corner.webp" alt=""/>
          </button>
        </div>
        <div className="fitness-blessing-progress-copy"><span>COMPLETED BLESSINGS</span><b>{completedBlessings} / {blessingTotal}</b></div>
        <div className="fitness-blessing-rose-progress" style={{'--blessing-fill':`${blessingProgress}%`}}><i/><img src="/frames/progress/rose-pro.webp" alt=""/></div>
      </div>
      </div>
    </section>
    <section className="fitness-blessing-record">
      {divider}
      <motion.div className="fitness-blessing-history" initial={false} animate={acquired ? {opacity:1} : {opacity:.14}} transition={{duration:.55,delay:.22}} aria-hidden={!acquired}>
        <small>THE RECORD THAT EARNED THIS BLESSING</small>
        <div>{records.map(([label, value]) => <article key={label}><span>{label}</span><i/><strong>{value}</strong></article>)}</div>
        {bestLift && <p><span>HEAVIEST LIFT</span><strong>{bestLift.movement} // {bestLift.weight.toLocaleString()} KG</strong></p>}
      </motion.div>
      {divider}
      <button type="button" className="fitness-blessing-continue" disabled={!acquired} onClick={onExit}>CONTINUE <ChevronRight/></button>
    </section>
  </div>;
}

function TransitionScene({ type, deity, blessing, destination, gymLog, onReady, onExit }) {
  const blessingAssets = blessing ? getBlessingAssets(deity.id, blessing.id) : null;
  if (type === 'gates') return <GateScene destination={destination} deity={deity}/>;
  if (type === 'reward') return <div className="fitness-transition-copy"><img className="fitness-reward-object" src={blessingAssets.fragment} alt=""/><small>FRAGMENT RECOVERED</small><h2>{blessing.name}</h2><p>Meaningful execution has restored another piece. {blessing.fragments} of {blessing.fragmentsRequired} fragments now answer your call.</p></div>;
  if (type === 'ceremony') return <BlessingCeremonyScene deity={deity} blessing={blessing} onReady={onReady} onExit={onExit}/>;
  return <AscensionScene deity={deity} gymLog={gymLog}/>;
}

export function FitnessOlympusRecognition({ gymLog }) {
  const preview = useMemo(() => buildFitnessRewardPreview(gymLog), [gymLog]);
  const active = preview.activeJourney?.deity || preview.deities.find(deity => deity.workouts > 0) || preview.deities[0];
  const activeBlessing = active.blessings[active.activeBlessingIndex] || active.blessings[0];
  const art = getBlessingAssets(active.id, activeBlessing.id);
  const affinityProgress = Math.min(100, activeBlessing.affinity || 0);
  const fragmentProgress = Math.min(100, (activeBlessing.fragments / activeBlessing.fragmentsRequired) * 100);
  const open = (scene, detail = {}) => window.dispatchEvent(new CustomEvent('warscythe:fitness-scene', { detail: { scene, ...detail } }));

  return <section className="fitness-olympus-recognition" style={{'--deity-color':active.palette, '--deity-ring': active.ringColor || active.palette}}>
    <div className="fitness-recognition-heading"><small>OLYMPUS RECOGNITION</small><strong>{active.name} // {activeBlessing.name}</strong></div>
    <div className="fitness-recognition-metrics">
      <article><span>AFFINITY</span><strong>{activeBlessing.affinity} / 100</strong><i><b style={{width:`${affinityProgress}%`}}/></i></article>
      <article className="is-fragment"><img src={art.fragment} alt=""/><div><span>FRAGMENTS</span><strong>{activeBlessing.fragments} / {activeBlessing.fragmentsRequired}</strong><i><b style={{width:`${fragmentProgress}%`}}/></i></div></article>
    </div>
    <div className="fitness-recognition-actions"><button type="button" onClick={() => open('gates',{destination:'chamber',deityId:active.id})}>EXPLORE CHAMBER</button><button type="button" onClick={() => open('gates',{destination:'hall'})}>ENTER THE HALL</button></div>
  </section>;
}

export default function FitnessOlympusExperience({ gymLog, report, templates = [], onInitializeTemplate, showRecognition = true, allowResourcePreview = false }) {
  const preview = useMemo(() => buildFitnessRewardPreview(gymLog), [gymLog]);
  const [scene, setScene] = useState(null); const [payload, setPayload] = useState({}); const [transitionReady, setTransitionReady] = useState(true);
  const active = preview.activeJourney?.deity || preview.deities.find(d => d.workouts > 0) || preview.deities[0];
  const activeBlessing = active.blessings[active.activeBlessingIndex] || active.blessings[0];
  const open = (next, detail={}) => { setTransitionReady(next !== 'affinity' && next !== 'ceremony'); setPayload(detail); setScene(next); };
  useEffect(() => {
    const handler = event => { if (event.detail?.scene) open(event.detail.scene, event.detail); };
    window.addEventListener('warscythe:fitness-scene', handler); return () => window.removeEventListener('warscythe:fitness-scene', handler);
  }, []);
  useEffect(() => {
    if (!report) return;
    const gain = Math.max(0, Math.round(Number(report.affinityGain) || 0));
    const after = Math.min(100, activeBlessing.affinity || gain);
    open('affinity', {
      deityId: active.id,
      blessingId: activeBlessing.id,
      affinityGain: gain,
      previousAffinity: Math.max(0, after - gain),
      nextAffinity: after,
      nextScene: report.fragmentReason ? 'reward' : null,
    });
  }, [report]);
  const selectedDeity = preview.deities.find(d => d.id === payload.deityId) || active;
  const selectedBlessingBase = selectedDeity.blessings.find(b => b.id === payload.blessingId) || selectedDeity.blessings[selectedDeity.activeBlessingIndex] || selectedDeity.blessings[0];
  const selectedBlessing = Number.isFinite(payload.fragmentCount) ? { ...selectedBlessingBase, fragments: payload.fragmentCount } : selectedBlessingBase;
  const resourceGateLocked = scene === 'gates' && ['ambrosia', 'nectar'].includes(payload.destination) && !allowResourcePreview;
  const visibleReport = report || { split:'SBD POWERLIFTING DAY', volume:12840, previousVolume:11970, averageRpe:8.1, completedSets:17, totalSets:18, totalReps:96, affinityGain:12, fragmentReason:'New squat performance record examined' };
  const backgrounds = {
    report:[`${ENV}/fitness-iron-codex-desktop.webp`,`${ENV}/fitness-iron-codex-mobile.webp`], warLedger:[`${ENV}/fitness-iron-codex-desktop.webp`,`${ENV}/fitness-iron-codex-mobile.webp`],
    ambrosia:[`${ENV}/fitness-ambrosia-sanctum-desktop.webp`,`${ENV}/fitness-ambrosia-sanctum-mobile.webp`], nectar:[`${ENV}/fitness-nectar-fountain-desktop.webp`,`${ENV}/fitness-nectar-fountain-mobile.webp`],
    hall:[`${PANTHEON}/olympus-pantheon-complete-desktop.webp`,`${PANTHEON}/olympus-pantheon-complete-mobile.webp`], gates:[`${PANTHEON}/olympus-gates-desktop.webp`,`${PANTHEON}/olympus-gates-mobile.webp`],
    affinity:[`${ROOT}/rewards/olympus-bg.webp`,`${ROOT}/rewards/olympus-bg.webp`], reward:[`${ROOT}/rewards/reward-olympus-fragment-recovery.webp`,`${ROOT}/rewards/reward-olympus-fragment-recovery.webp`], ceremony:[getBlessingAssets(selectedDeity.id,selectedBlessing.id).ceremony,getBlessingAssets(selectedDeity.id,selectedBlessing.id).ceremony], ascension:[getDeityAssets(selectedDeity.id).ascension,getDeityAssets(selectedDeity.id).ascension], chamber:[getDeityAssets(selectedDeity.id).chamberDesktop,getDeityAssets(selectedDeity.id).chamberMobile]
  };
  useEffect(() => {
    if (scene !== 'gates') return;
    const destination = payload.destination || 'chamber';
    const assets = backgrounds[destination] || backgrounds.chamber;
    assets.filter(Boolean).forEach(src => { const image = new Image(); image.src = src; });
  }, [scene, payload.destination, payload.deityId]);
  return <>
    {showRecognition && <section className="fitness-olympus-integrated" style={{'--deity-color':active.palette}}>
      <div><small>OLYMPUS RECOGNITION</small><strong>{activeBlessing.affinity} / 100 AFFINITY</strong><span>{activeBlessing.fragments} / {activeBlessing.fragmentsRequired} {activeBlessing.name} fragments</span></div>
      <button type="button" onClick={() => open('gates',{destination:'chamber',deityId:active.id})}>EXPLORE CHAMBER</button><button type="button" onClick={() => open('gates',{destination:'hall'})}>ENTER THE HALL</button>
    </section>}
    <div className="fitness-subrealm-links"><button type="button" onClick={()=>open('warLedger')}><BookOpen/>WAR LEDGER</button><button type="button" onClick={()=>open('gates',{destination:'ambrosia'})}><Utensils/>AMBROSIA</button><button type="button" onClick={()=>open('gates',{destination:'nectar'})}><Droplets/>NECTAR</button></div>
    {typeof document !== 'undefined' && createPortal(<AnimatePresence mode="sync">{scene && <motion.div
      key={`${scene}-${scene === 'gates' ? (payload.destination || 'chamber') : ''}`}
      className={`fitness-experience fitness-scene-${scene}`}
      style={scene === 'ascension' ? {'--ascension-bg': `url("${backgrounds.ascension[1]}")`} : undefined}
      initial={{opacity:scene === 'gates' ? 1 : 0}}
      animate={{opacity:1}}
      exit={scene === 'gates' ? {opacity:[1,1,0]} : {opacity:0}}
      transition={scene === 'gates'
        ? {duration:1.25,times:[0,.24,1],ease:[.22,1,.36,1]}
        : {duration:payload.fromGate ? .68 : .38,ease:[.22,1,.36,1]}}
    >
      <SceneImage desktop={backgrounds[scene]?.[0]} mobile={backgrounds[scene]?.[1]} mobileMedia={scene === 'hall' ? '(max-width: 720px), ((orientation: portrait) and (max-width: 900px))' : undefined}/><div className="fitness-experience-shade"/>
      {resourceGateLocked && <button type="button" className="fitness-gate-close" onClick={()=>setScene(null)} aria-label="Close"><X/></button>}
      <header><button type="button" onClick={()=>setScene(null)}><ArrowLeft/> BACK TO FITNESS</button><span>WARSCYTHE // OLYMPUS</span><button type="button" onClick={()=>setScene(null)} aria-label="Close"><X/></button></header>
      <main>{scene==='report'&&<ReportScene report={visibleReport}/>} {scene==='warLedger'&&<WarLedgerScene templates={templates} onInitialize={t=>{onInitializeTemplate(t);setScene(null);}}/>} {(scene==='ambrosia'||scene==='nectar')&&<ResourceScene type={scene}/>} {scene==='hall'&&<PantheonScene preview={preview} onChamber={id=>open('gates',{destination:'chamber',deityId:id})}/>} {scene==='chamber'&&<ChamberScene preview={preview} deityId={selectedDeity.id} onScene={open}/>} {scene==='affinity'&&<AffinityRewardScene deity={selectedDeity} blessing={selectedBlessing} report={visibleReport} payload={payload} onReady={()=>setTransitionReady(true)}/>} {['gates','reward','ceremony','ascension'].includes(scene)&&<TransitionScene type={scene} deity={selectedDeity} blessing={selectedBlessing} destination={payload.destination} gymLog={gymLog} onReady={()=>setTransitionReady(true)} onExit={()=>setScene(null)}/>}</main>
      {['gates','affinity','reward','ascension'].includes(scene)&&<button type="button" className={`fitness-transition-continue${resourceGateLocked ? ' is-coming-soon' : ''}`} disabled={!transitionReady || resourceGateLocked} onClick={()=>scene==='gates'?open(payload.destination||'chamber',{...payload,fromGate:true}):payload.nextScene?open(payload.nextScene,payload):setScene(null)}>{resourceGateLocked ? 'COMING SOON' : <><span>CONTINUE</span> <ChevronRight/></>}</button>}
    </motion.div>}</AnimatePresence>, document.body)}
  </>;
}

export { calculateAverageRpe };
