import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect, useState } from 'react';

export const remainingRest = (rest, now) => rest.running
  ? Math.max(0, Math.ceil((rest.deadline - now) / 1000))
  : Math.max(0, rest.remaining || 0);

const emptyRest = id => ({ sessionId:id, duration:90, remaining:0, deadline:0, running:false });
export const useWorkoutUi = create(persist((set, get) => ({
  focusedId:null,
  rest:emptyRest(null),
  focus:id => set({ focusedId:id }),
  minimize:() => set({ focusedId:null }),
  clear:() => set({ focusedId:null, rest:emptyRest(null) }),
  begin:id => set({ focusedId:id, rest:emptyRest(id) }),
  setDuration:(id, duration) => set({ rest:{ ...(get().rest.sessionId === id ? get().rest : emptyRest(id)), duration } }),
  setSeconds:(id, value) => {
    const rest = get().rest.sessionId === id ? get().rest : emptyRest(id);
    const remaining = Math.max(0, typeof value === 'function' ? value(remainingRest(rest, Date.now())) : value);
    set({ rest:{ ...rest, remaining, deadline:Date.now() + remaining * 1000 } });
  },
  setRunning:(id, running) => {
    const rest = get().rest.sessionId === id ? get().rest : emptyRest(id);
    const remaining = remainingRest(rest, Date.now());
    set({ rest:{ ...rest, running:running && remaining > 0, remaining, deadline:Date.now() + remaining * 1000 } });
  },
}), { name:'warscythe-workout-ui', storage:createJSONStorage(() => sessionStorage) }));

export function useRestTimer(id) {
  const rest = useWorkoutUi(state => state.rest);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!rest.running || rest.sessionId !== id) return undefined;
    const tick = () => {
      const timestamp = Date.now();
      setNow(timestamp);
      const latest = useWorkoutUi.getState().rest;
      if (latest.sessionId === id && latest.running && remainingRest(latest, timestamp) === 0) {
        useWorkoutUi.getState().setRunning(id, false);
      }
    };
    const timer = setInterval(tick, 1000);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(timer); window.removeEventListener('focus', tick); document.removeEventListener('visibilitychange', tick); };
  }, [id, rest.running, rest.sessionId]);
  const current = rest.sessionId === id ? rest : emptyRest(id);
  const seconds = remainingRest(current, now);
  return {
    timerDuration:current.duration,
    timerSeconds:seconds,
    timerActive:current.running && seconds > 0,
    setTimerDuration:value => useWorkoutUi.getState().setDuration(id, value),
    setTimerSeconds:value => { useWorkoutUi.getState().setSeconds(id, value); setNow(Date.now()); },
    setTimerActive:value => { useWorkoutUi.getState().setRunning(id, value); setNow(Date.now()); },
  };
}
