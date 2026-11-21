import { ArrowUpRight, Dumbbell, Maximize2, Minimize2, Pause, Play } from 'lucide-react';

export function WorkoutResumeDock({ workout, onResume }) {
  return <aside className="workout-resume-dock" aria-label="Active workout">
    <span className="workout-resume-icon" aria-hidden="true"><Dumbbell size={20} strokeWidth={1.5} /></span>
    <div className="workout-resume-copy"><span className="workout-resume-caption">Workout in progress</span><strong title={workout.split}>{workout.split}</strong></div>
    <button type="button" aria-label="Resume workout" onClick={onResume}><span className="workout-resume-action-long">Resume workout</span><span className="workout-resume-action-short" aria-hidden="true">Resume</span> <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" /></button>
  </aside>;
}

export function WorkoutModeBar({ focused, seconds, time, running, onToggleRest, onToggleMode }) {
  const ModeIcon = focused ? Minimize2 : Maximize2;
  const RestIcon = running ? Pause : Play;
  return <div className="workout-mode-bar">
    <div className="workout-mode-copy"><strong>{focused ? 'Workout mode' : 'Workout in progress'}</strong><span className="workout-mode-description">{focused ? 'Your session is saved as you go.' : 'Return to your session whenever you are ready.'}</span></div>
    <div className="workout-mode-actions">
      {seconds > 0 && <div className="workout-rest-status"><span role="timer" aria-label="Rest remaining">Rest <strong>{time}</strong></span><button type="button" onClick={onToggleRest}><RestIcon size={14} aria-hidden="true" /><span>{running ? 'Pause rest' : 'Resume rest'}</span></button></div>}
      <button type="button" className="workout-mode-toggle" onClick={onToggleMode}><ModeIcon size={16} aria-hidden="true" /><span>{focused ? 'Minimize workout' : 'Enter workout mode'}</span></button>
    </div>
  </div>;
}
