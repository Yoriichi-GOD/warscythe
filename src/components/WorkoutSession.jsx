import { useState } from 'react';
import { Plus, Trash2, Check, ChevronDown } from 'lucide-react';
import './workoutSession.css';

export default function WorkoutSession({ workout, history, presets, addMovement, removeMovement, addSet, updateSet, deleteSet, toggleComplete, notes, archive, discard, advance, focusedSet, setFocusedSet }) {
  const [name, setName] = useState('');
  const [suggestions, setSuggestions] = useState(false);
  const [error, setError] = useState('');
  const allSets = workout.movements.flatMap(m => m.sets || []);
  const completed = allSets.filter(s => s.completed).length;
  const add = value => { const clean = value.trim(); if (!clean) return; addMovement(clean); setName(''); setSuggestions(false); };
  const finish = () => {
    if (!allSets.length || !allSets.some(s => s.completed)) { setError('Complete at least one set before finishing.'); return; }
    if (allSets.some(s => !Number.isFinite(Number(s.weight)) || Number(s.weight) < 0 || !Number.isInteger(Number(s.reps)) || Number(s.reps) < 1 || Number(s.rpe) < 1 || Number(s.rpe) > 10)) { setError('Check each set: load 0 kg or more, whole reps above 0, and RPE 1–10.'); return; }
    if (allSets.some(s => !s.completed)) { setError('Complete or remove unfinished sets before finishing. Your session is still saved.'); return; }
    setError(''); archive();
  };
  return <section className="workout-session" aria-label="Active workout log">
    <div className="workout-session-heading"><div><span className="workout-eyebrow">ACTIVE SESSION · {completed}/{allSets.length} SETS</span><h4>{workout.split}</h4></div><button type="button" onClick={() => { if (window.confirm('Discard this active workout? Its unarchived sets and notes will be lost.')) discard(); }} className="workout-discard">Discard</button></div>
    <div id="fitness-movement-selector" className="workout-add-movement">
      <label htmlFor="workout-movement">Add exercise</label>
      <form onSubmit={e => { e.preventDefault(); add(name); }}><input id="workout-movement" autoComplete="off" value={name} placeholder="Exercise name" onChange={e => setName(e.target.value)} /><button type="submit" aria-label="Add exercise"><Plus size={18}/></button><button type="button" aria-label="Choose exercise" aria-expanded={suggestions} onClick={() => setSuggestions(v => !v)}><ChevronDown size={18}/></button></form>
      {suggestions && <div className="workout-exercise-options">{presets.filter(x => x.toLowerCase().includes(name.toLowerCase())).map(x => <button type="button" key={x} onClick={() => add(x)}>{x}</button>)}</div>}
    </div>
    {workout.movements.map((movement, movementIndex) => {
      const previous = history.find(w => w.movements?.some(m => m.name.toLowerCase() === movement.name.toLowerCase()))?.movements.find(m => m.name.toLowerCase() === movement.name.toLowerCase());
      return <section className="workout-exercise" key={movement.id} aria-label={movement.name}>
        <div className="workout-exercise-heading"><h5>{movement.name}</h5><button type="button" aria-label={`Remove ${movement.name}`} onClick={() => { if (!movement.sets?.length || window.confirm(`Remove ${movement.name} and its sets?`)) removeMovement(movement.id); }}><Trash2 size={17}/></button></div>
        {(movement.sets || []).map((set, index) => {
          const first = movementIndex === 0 && index === 0;
          const label = `${movement.name}, set ${index + 1}`;
          const selected = focusedSet?.setId === set.id;
          const previousSet = previous?.sets?.[index];
          return <div key={set.id} className={`workout-set ${set.completed ? 'is-complete' : ''} ${selected ? 'is-selected' : ''}`} onFocus={() => setFocusedSet({movementId:movement.id,setId:set.id})}>
            <div className="workout-set-meta"><strong>SET {index + 1}</strong><label>Type<select aria-label={`${label}, type`} value={set.type || 'working'} onChange={e => updateSet(movement.id,set.id,{type:e.target.value})}><option value="warmup">Warm-up</option><option value="working">Working</option><option value="topset">Top set</option><option value="amrap">AMRAP</option></select></label><span className="workout-previous">Previous: {previousSet ? `${previousSet.weight} kg × ${previousSet.reps} · RPE ${previousSet.rpe || '—'}` : 'First recorded set'}</span></div>
            <div className="workout-set-fields">
              <label>Load · kg<input id={first ? 'fitness-weight-input' : undefined} aria-label={`${label}, load in kilograms`} type="number" inputMode="decimal" min="0" step="0.25" value={set.weight || ''} placeholder="0" onChange={e => { updateSet(movement.id,set.id,{weight:e.target.value}); if (Number(e.target.value) > 0) advance(3); }}/></label>
              <label>Reps<input id={first ? 'fitness-reps-input' : undefined} aria-label={`${label}, reps`} type="number" inputMode="numeric" min="1" step="1" value={set.reps || ''} placeholder="0" onChange={e => { updateSet(movement.id,set.id,{reps:e.target.value}); if (Number(e.target.value) > 0) advance(4); }}/></label>
              <label>RPE<input aria-label={`${label}, RPE`} type="number" inputMode="decimal" min="1" max="10" step="0.5" value={set.rpe || ''} onChange={e => updateSet(movement.id,set.id,{rpe:e.target.value})}/></label>
              <button type="button" id={first ? 'fitness-complete-set' : undefined} aria-label={`${set.completed ? 'Uncomplete' : 'Complete'} ${label}`} aria-pressed={!!set.completed} className="workout-complete" onClick={() => { if (!set.completed && (!(Number(set.reps) > 0) || Number(set.weight) < 0)) { setError('Enter a valid load and rep count before completing the set.'); return; } setFocusedSet({movementId:movement.id,setId:set.id}); toggleComplete(movement.id,set.id,set.completed); setError(''); if (!set.completed) advance(5); }}><Check size={19}/><span>Done</span></button>
              <button type="button" aria-label={`Delete ${label}`} onClick={() => deleteSet(movement.id,set.id)}><Trash2 size={16}/></button>
            </div>
          </div>;
        })}
        <button type="button" id={movementIndex === 0 ? 'fitness-add-set' : undefined} className="workout-add-set" onClick={() => { const last = movement.sets?.at(-1); addSet(movement.id,{weight:last?.weight || 0,reps:last?.reps || 0,rpe:last?.rpe || 8,type:last?.type || 'working'}); }}><Plus size={16}/> Add set</button>
      </section>;
    })}
    <details className="workout-notes" open={!!workout.notes || undefined}><summary>Session notes</summary><label htmlFor="workout-notes">Sleep, technique, how the session felt</label><textarea id="workout-notes" value={workout.notes || ''} onChange={e => notes(e.target.value)} placeholder="Add a note…" /></details>
    {error && <p className="workout-error" role="alert">{error}</p>}
    <button type="button" id="fitness-archive" className="workout-finish" onClick={finish}>Finish & archive session</button>
  </section>;
}
