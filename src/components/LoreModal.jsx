import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock, X } from 'lucide-react';
import { useWarscytheStore, getLore } from '../store/useWarscytheStore';
import { REGIONS } from '../store/constants';

export default function LoreModal({ onClose }) {
  const { level, unlockedLore } = useWarscytheStore();
  const maxRegion = Math.max(0, Math.min(9, level - 1));
  const [regionIdx, setRegionIdx] = useState(maxRegion);
  const [pageIdx, setPageIdx] = useState(0);
  const lore = getLore(regionIdx);
  const unlocked = Math.min(5, unlockedLore[regionIdx]?.length || 0);
  const pageOpen = pageIdx < unlocked;
  const changeRegion = delta => {
    setRegionIdx(value => Math.max(0, Math.min(maxRegion, value + delta)));
    setPageIdx(0);
  };

  return (
    <div className="lore-backdrop" onClick={onClose}>
      <motion.article initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="lore-sheet" onClick={e => e.stopPropagation()}>
        <button id="lore-close" className="lore-close" onClick={onClose}><X size={20}/></button>
        <header>
          <button id="lore-region-prev" onClick={() => changeRegion(-1)} disabled={regionIdx === 0}><ChevronLeft/></button>
          <div><small>REGION {regionIdx + 1}</small><h2>{REGIONS[regionIdx]?.name}</h2></div>
          <button id="lore-region-next" onClick={() => changeRegion(1)} disabled={regionIdx === maxRegion}><ChevronRight/></button>
        </header>
        <nav id="lore-page-tabs">
          {[0,1,2,3,4].map(i => <button key={i} className={i === pageIdx ? 'active' : ''} onClick={() => setPageIdx(i)}>{i < unlocked ? ['I','II','III','IV','V'][i] : <Lock size={12}/>}</button>)}
        </nav>
        <main>
          <AnimatePresence mode="wait">
            <motion.section key={`${regionIdx}-${pageIdx}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
              {pageOpen ? <p>{lore[pageIdx]}</p> : <div className="sealed"><Lock size={34}/><strong>This page remains sealed.</strong><span>Complete another operation in this region.</span></div>}
            </motion.section>
          </AnimatePresence>
        </main>
        <footer>
          <button onClick={() => setPageIdx(i => Math.max(0, i - 1))} disabled={pageIdx === 0}><ChevronLeft size={18}/></button>
          <b>{pageIdx + 1} / 5</b>
          <button onClick={() => setPageIdx(i => Math.min(4, i + 1))} disabled={pageIdx === 4}><ChevronRight size={18}/></button>
        </footer>
      </motion.article>
      <style jsx global>{`
        .lore-backdrop{position:fixed;inset:0;z-index:3000;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.9);backdrop-filter:blur(10px)}
        .lore-sheet{position:relative;width:min(96vw,1500px);height:min(90vh,844px);padding:clamp(50px,6vw,90px) clamp(58px,8vw,130px);display:flex;flex-direction:column;color:#ecebea;background:url('/lore-codex-wide.png') center/100% 100% no-repeat;filter:drop-shadow(0 24px 45px #000);box-sizing:border-box}
        .lore-close{position:absolute;z-index:5;right:3.5%;top:5%;width:40px;height:40px;display:grid;place-items:center;border:1px solid #c7c9cc99;border-radius:50%;background:#050607dd;color:#f4f5f6;cursor:pointer;box-shadow:0 0 16px #bfc4cc22}
        .lore-sheet header{display:grid;grid-template-columns:42px 1fr 42px;align-items:center;text-align:center;border-bottom:1px solid #bbc0c655;padding-bottom:12px}
        .lore-sheet header button,.lore-sheet footer button{display:grid;place-items:center;border:1px solid #bbc0c666;background:#dce1e611;color:#e6e8eb;cursor:pointer}
        .lore-sheet button:disabled{opacity:.25}.lore-sheet header small{font:800 9px var(--font-mono);letter-spacing:.3em;color:#aeb3ba}.lore-sheet h2{margin:4px 0 0;font:900 clamp(18px,3vw,30px) var(--font-display);text-transform:uppercase;color:#f5f5f3}
        .lore-sheet nav{display:flex;justify-content:center;gap:8px;margin:18px 0}.lore-sheet nav button{width:38px;height:32px;display:grid;place-items:center;border:1px solid #bbc0c666;background:#dce1e60b;color:#cfd2d6;font:bold 12px Georgia;cursor:pointer}.lore-sheet nav button.active{background:#dadddf;color:#090a0b;box-shadow:0 0 14px #fff3}
        .lore-sheet main{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:3% 5%;scrollbar-color:#c7cbd055 transparent}.lore-sheet main section{min-height:100%;display:flex;align-items:flex-start;justify-content:center;box-sizing:border-box;padding:clamp(20px,4vh,52px) 0}
        .lore-sheet main p{width:100%;margin:0;max-width:900px;color:#e7e5df;font:700 clamp(16px,1.6vw,22px)/1.75 Georgia,serif;text-align:left;text-wrap:pretty;text-shadow:0 2px 7px #000}.lore-sheet main p::first-letter{float:left;margin:4px 8px 0 0;font:900 3.2em/0.8 var(--font-display);color:#f2f3f4}
        .sealed{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;color:#aeb3b9}.sealed strong{font:800 20px Georgia;color:#eceef0}.sealed span{font:700 9px var(--font-mono);letter-spacing:.15em;text-transform:uppercase}
        .lore-sheet footer{display:grid;grid-template-columns:42px 1fr 42px;align-items:center;border-top:1px solid #bbc0c655;padding-top:14px;text-align:center}.lore-sheet footer button{height:34px}.lore-sheet footer b{font:900 11px var(--font-mono);letter-spacing:.22em;color:#e6e8eb}
        @media(max-width:700px),(max-aspect-ratio:3/4){.lore-backdrop{padding:6px}.lore-sheet{width:min(96vw,520px);height:min(94vh,924px);padding:64px 42px 46px;background-image:url('/lore-codex-mobile.png')}.lore-sheet header{grid-template-columns:34px 1fr 34px}.lore-sheet h2{font-size:17px}.lore-sheet nav{gap:5px;margin:12px 0}.lore-sheet nav button{width:31px;height:29px}.lore-sheet main{padding:3% 1%}.lore-sheet main p{font-size:15px;line-height:1.58}.lore-close{right:7%;top:3%;width:36px;height:36px}}
      `}</style>
    </div>
  );
}
