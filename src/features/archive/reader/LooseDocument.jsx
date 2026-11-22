import { useState } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { MailOpen } from 'lucide-react';
import DocumentText from './DocumentText';

export default function LooseDocument({ document, previouslyRead, onRead }) {
  const [open, setOpen] = useState(previouslyRead);
  const [unfolding, setUnfolding] = useState(false);
  const reduce = useReducedMotion();
  if (!open) return <div className="archive-sealed-letter"><div className={`archive-envelope archive-envelope--${document.material}`} aria-hidden="true"><span className="archive-envelope-flap"/><span className="archive-wax-seal">W</span></div><h2>{document.title}</h2><p>A {document.kind} from {document.author}.</p><button type="button" onClick={() => { setUnfolding(!reduce); setOpen(true); onRead(); }}><MailOpen size={18}/>Unfold this document</button></div>;
  return <div className="archive-loose-stage"><Motion.article initial={reduce ? false : { opacity: .7, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2, ease: [.16, 1, .3, 1] }} className={`archive-paper archive-loose-paper archive-material-${document.material}`}>
    <header className="archive-original-heading"><p>{document.date}</p><h2>{document.title}</h2><p>{document.author}</p></header>
    <DocumentText paragraphs={document.paragraphs}/>
    <div className="archive-fold-mark" aria-hidden="true"/>
    {unfolding && !reduce && <div className="archive-unfold" aria-hidden="true"><Motion.span className="archive-unfold-top" initial={{rotateX:0}} animate={{rotateX:178}} transition={{duration:.44,ease:[.22,1,.36,1]}}/><Motion.span className="archive-unfold-bottom" initial={{rotateX:0}} animate={{rotateX:-178}} transition={{duration:.48,delay:.15,ease:[.22,1,.36,1]}} onAnimationComplete={()=>setUnfolding(false)}/></div>}
  </Motion.article></div>;
}
