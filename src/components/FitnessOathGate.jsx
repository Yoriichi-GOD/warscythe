import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Shield } from 'lucide-react';

export default function FitnessOathGate({ onComplete }) {
  const [stage, setStage] = useState('gate');

  return (
    <div className="absolute inset-x-0 top-0 min-h-[200%] lg:min-h-full lg:inset-0 z-[1000] bg-black/80 backdrop-blur-[3px] lg:bg-black/55 lg:backdrop-blur-[1.5px] overflow-hidden">
      <img src="/gate.webp" alt="" className="hidden lg:block absolute inset-0 w-full h-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_5%,rgba(0,0,0,.72)_82%)] pointer-events-none" />
      <AnimatePresence mode="wait">
        {stage === 'gate' && (
          <motion.section key="gate" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="relative h-full grid items-start lg:place-items-center p-3 pt-[5vh] lg:p-5">
            <div className="max-w-lg text-center border border-gold-core/30 bg-black/90 p-6 md:p-7 shadow-[0_0_70px_#000]">
              <img src="/lock.webp" alt="Iron Ledger sealed" className="lg:hidden mx-auto w-20 h-20 object-contain mb-2 drop-shadow-[0_0_18px_rgba(197,160,89,.35)]" />
              <Shield className="mx-auto text-gold-core mb-4" size={34}/>
              <small className="font-mono text-[9px] tracking-[.35em] text-stone-500">THE IRON LEDGER // OLYMPIAN SEAL</small>
              <h2 className="font-display text-2xl md:text-4xl text-gold-core mt-3">THE BODY IS ALSO A KINGDOM</h2>
              <p className="font-serif italic text-stone-300 mt-4">Beyond this gate, intention carries no weight. Only the strong and the curious may enter.</p>
              <button onClick={()=>setStage('goddess')} className="mt-6 w-full border border-gold-core bg-gold-core/10 py-3 font-mono text-[10px] font-black tracking-[.2em] text-gold-core hover:bg-gold-core hover:text-black">
                ONLY THE STRONG AND CURIOUS MAY ENTER
              </button>
            </div>
          </motion.section>
        )}
        {stage === 'goddess' && (
          <motion.section key="goddess" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="relative h-full grid items-start lg:place-items-center p-3 pt-[5vh] lg:p-5">
            <div className="w-full max-w-4xl max-h-[94dvh] overflow-y-auto border border-gold-core/25 bg-zinc-950/94 shadow-[0_0_80px_#000] grid grid-cols-[118px_minmax(0,1fr)] md:grid-cols-[minmax(260px,0.9fr)_1.1fr]">
              <div className="relative min-h-[360px] md:min-h-[620px] overflow-hidden border-r border-gold-core/20">
                <img
                  src="/deity/fitness-goddess.png"
                  alt="Arete, Keeper of the Iron Oath"
                  className="absolute inset-0 w-full h-full object-contain object-center md:object-cover md:object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-2 md:p-5 text-center">
                  <span className="inline-block border border-gold-core/50 bg-black/80 px-2 md:px-4 py-2 font-mono text-[6px] md:text-[9px] font-black tracking-[.18em] md:tracking-[.28em] text-gold-core">
                    ARETE
                  </span>
                </div>
              </div>
              <div className="p-4 md:p-9 flex flex-col justify-center text-left md:text-center">
                <Flame size={24} className="text-gold-core md:mx-auto"/>
                <small className="block mt-3 font-mono text-[7px] md:text-[9px] tracking-[.18em] md:tracking-[.3em] text-gold-core">KEEPER OF THE IRON OATH</small>
                <h2 className="mt-3 font-display text-lg md:text-4xl text-white">MORTAL, CHOOSE YOUR ASCENSION</h2>
                <p className="mt-4 font-serif italic text-xs md:text-lg leading-relaxed text-stone-200">Turn back unless you are prepared to become more than the body that arrived here. The Iron Ledger shelters no pretenders. To survive among the gods, you must train until discipline itself knows your name.</p>
                <div className="grid gap-2 md:grid-cols-2 mt-5 md:mt-7">
                  <button onClick={onComplete} className="border border-gold-core bg-gold-core text-black p-2.5 md:p-3 font-mono text-[7px] md:text-[9px] font-black tracking-widest">TAKE THE OATH</button>
                  <button onClick={()=>setStage('gate')} className="border border-white/15 bg-black text-stone-400 p-2.5 md:p-3 font-mono text-[7px] md:text-[9px] font-black tracking-widest">LEAVE THE KINGDOM</button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
