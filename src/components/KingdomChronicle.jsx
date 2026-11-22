import { useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { KINGDOM_CHAPTERS } from '../data/kingdomChapters';
import './kingdomChronicle.css';
import WorldDivider from './frames/WorldDivider';

export default function KingdomChronicle({ progress, onContinue, onOpenGuide }) {
  const available = Math.min(10, Math.max(1, progress));
  const [selected, setSelected] = useState(available);
  const chapter = KINGDOM_CHAPTERS[Math.min(selected, available) - 1];
  const reduce = useReducedMotion();
  const nextChapter = KINGDOM_CHAPTERS[Math.min(9, progress)];
  return <section className="kingdom-chronicle" aria-label="Kingdom Chronicle">
    <nav aria-label="Story chapters">{KINGDOM_CHAPTERS.map(c => <button type="button" key={c.id} disabled={c.id > available} aria-current={chapter.id === c.id ? 'step' : undefined} aria-label={`Chapter ${c.id}${c.id > available ? ', sealed' : ': ' + c.title}`} onClick={() => setSelected(c.id)}>{c.id > available ? '◇' : c.id}</button>)}</nav>
    <AnimatePresence mode="wait" initial={false}><Motion.article key={chapter.id} initial={{opacity:0,y:reduce ? 0 : 5}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:reduce ? 0 : .16}}>
      <span className="chronicle-kicker">CHAPTER {chapter.id} OF 10 · {chapter.concept}</span>
      <h3>{chapter.title}</h3><WorldDivider/><p>{chapter.story}</p>
      <aside><strong>Your next step</strong><p>{nextChapter.action}</p><small>Guidance is optional. Real Operations advance these ten victories.</small></aside>
      <button type="button" className="chronicle-continue" onClick={onContinue}>Return to the journey</button><button type="button" className="chronicle-continue" onClick={onOpenGuide}>Choose or resume a guide</button>
    </Motion.article></AnimatePresence>
    <p className="chronicle-footnote">Read at your pace. Chapters open alongside your existing roadmap; no extra progress is required.</p>
  </section>;
}
