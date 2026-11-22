import { useEffect, useRef, useState } from 'react';
import { BookOpen, Dumbbell, Flame, Swords, X } from 'lucide-react';
import { useWarscytheStore } from '../../store/useWarscytheStore';
import { GOALS, guideKey, guideStep, initialGuide } from './journey';
import { revealUiTarget } from '../../utils/revealUiTarget';
import './journey.css';

export default function JourneyGuide(props) {
  const userId = useWarscytheStore(state => state.user?.id);
  return <GuideSession key={userId || 'local'} storageKey={guideKey(userId)} {...props}/>;
}

function GuideSession({ storageKey, activeTab, onNavigate, onOpenTask, onOpenHabit, onChronicle, onPractice, busy }) {
  const state = useWarscytheStore();
  const [guide, setGuide] = useState(() => {
    let saved; try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch { /* A guide can work without storage. */ }
    return initialGuide(saved, useWarscytheStore.getState());
  });
  const [chooser, setChooser] = useState(false);
  const dialog = useRef(null);
  const step = guide.status === 'active' ? guideStep(guide, state) : null;
  const elsewhere = guide.goal && activeTab !== GOALS[guide.goal].tab;
  const paused = guide.paused || elsewhere;
  useEffect(() => {
    // Learning controls is separate from completing an Operation or earning a chapter.
    useWarscytheStore.setState({ hasCompletedTutorial: true, tutorialStep: 'completed', postGuardianTutorial: null, guideBannerDismissed: true });
  }, []);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(guide)); } catch { /* Optional local reading preference. */ } }, [guide, storageKey]);
  useEffect(() => {
    const open = () => { setChooser(true); setGuide(before => ({ ...before, status: before.status === 'welcome' ? 'idle' : before.status })); };
    window.addEventListener('warscythe:open-guide', open);
    return () => window.removeEventListener('warscythe:open-guide', open);
  }, []);
  useEffect(() => {
    if (!step?.target || paused || busy) return;
    const timer = window.setTimeout(() => document.getElementById(step.target)?.classList.add('journey-highlight'), 250);
    return () => { window.clearTimeout(timer); document.getElementById(step.target)?.classList.remove('journey-highlight'); };
  }, [step?.target, paused, busy]);
  useEffect(() => {
    if (guide.status !== 'welcome' || busy) return;
    const previous = document.activeElement;
    dialog.current?.querySelector('button')?.focus();
    const key = event => {
      if (event.key === 'Escape') setGuide(before => ({...before,status:'idle'}));
      if (event.key !== 'Tab') return;
      const buttons = [...dialog.current.querySelectorAll('button')];
      if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0]?.focus(); }
    };
    document.addEventListener('keydown',key);
    return () => { document.removeEventListener('keydown',key); if(previous?.isConnected) previous.focus(); };
  }, [guide.status, busy]);
  const start = goal => {
    const current = useWarscytheStore.getState();
    const before = goal === 'operation' ? [...current.tasks, ...current.completedTasks].map(item=>item.id) : goal === 'habit' ? current.rituals.map(item=>item.id) : current.gymLog.map(item=>item.id);
    setGuide({version:1,status:'active',goal,before,paused:false}); setChooser(false);
    onNavigate(GOALS[goal].tab);
    if (goal === 'operation') onOpenTask();
    if (goal === 'habit') onOpenHabit();
  };
  const icons = {operation:<Swords/>,workout:<Dumbbell/>,habit:<Flame/>};
  const choices = <div className="journey-goals">{Object.entries(GOALS).map(([id,goal])=><button type="button" key={id} aria-label={goal.label} onClick={()=>start(id)}>{icons[id]}<span>{goal.label}<small>{goal.detail}</small></span></button>)}</div>;
  if (guide.status === 'welcome' && !busy) return <div className="journey-welcome-backdrop"><section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="journey-welcome-title" className="journey-welcome"><span className="journey-kicker">A place to begin</span><h1 id="journey-welcome-title">One promise.<br/><em>The rest can wait.</em></h1><p>The sages say a dragon carries this kingdom through the stars. The baker says her oven stands on ordinary ground. For now, both need the road repaired.</p><p>Start with what brought you here. We will explain the next tool when it becomes useful.</p>{choices}<button type="button" className="journey-quiet" onClick={()=>setGuide(before=>({...before,status:'idle'}))}>Explore freely</button><p className="journey-footnote">You can pause guidance and return through the Chronicle at any time.</p></section></div>;
  if (busy) return null;
  if (guide.status === 'idle' && !chooser) return null;
  return <aside className={`journey-guide ${step ? 'journey-guide--active' : ''}`} aria-label="Journey guidance">
    {step ? <><div><span className="journey-kicker">{paused ? 'Guidance paused' : GOALS[guide.goal].label}</span><h2>{paused ? 'Your place is kept.' : step.title}</h2>{!paused && <p>{step.text}</p>}</div><div className="journey-actions">{paused ? <button type="button" onClick={()=>{onNavigate(GOALS[guide.goal].tab);setGuide(before=>({...before,paused:false}));}}>Resume guide</button> : step.done ? <button type="button" onClick={()=>setGuide(before=>({...before,status:'done'}))}>Got it — keep going</button> : <button type="button" onClick={()=>{if(guide.goal==='operation')onOpenTask();else if(guide.goal==='habit')onOpenHabit();else revealUiTarget(document.getElementById(step.target));}}>Show me</button>}{!paused && <button type="button" className="journey-quiet" onClick={()=>setGuide(before=>({...before,paused:true}))}>Later</button>}<button type="button" className="journey-quiet" onClick={()=>{setGuide(before=>({...before,status:'idle'}));setChooser(true);}}>Choose another goal</button></div></> : <><p><BookOpen size={16}/> {guide.status === 'done' ? 'Your next step is yours.' : 'Begin wherever you need to.'}</p><button type="button" className="journey-quiet" aria-expanded={chooser} onClick={()=>setChooser(!chooser)}>Choose a guide</button><button type="button" className="journey-quiet" onClick={onChronicle}>Chronicle</button></>}
    {chooser && <div className="journey-chooser"><button type="button" className="journey-chooser-close" aria-label="Close guide choices" onClick={()=>setChooser(false)}><X size={18}/></button>{choices}<button type="button" className="journey-quiet" onClick={()=>{setChooser(false);onPractice();}}>Optional workout rehearsal</button></div>}
  </aside>;
}
