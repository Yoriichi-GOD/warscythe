import React from 'react';
import { motion } from 'framer-motion';
import { Compass, ChevronRight } from 'lucide-react';

export default function TitleUnlockFlash({ data, onClose }) {
  const title = data?.title || 'Curious Explorer';
  const description = data?.description || 'Awarded for liberating your first region and opening the road beyond.';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[3100] grid place-items-center bg-black/90 backdrop-blur-lg p-4"
    >
      <motion.section
        initial={{ scale: 0.86, y: 34, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 1.04, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 170, damping: 20 }}
        className="title-unlock-card relative w-full max-w-4xl aspect-[1.536/1] max-h-[88vh] overflow-hidden border border-gold-core/40 bg-black shadow-[0_0_90px_rgba(197,160,89,0.24)]"
      >
        <picture>
          <source media="(max-width: 700px), (max-aspect-ratio: 3/4)" srcSet="/title-unlocks/curious-explorer-mobile.png" />
          <img
            src="/title-unlocks/curious-explorer.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25 pointer-events-none" />

        <div className="title-unlock-copy absolute inset-x-[20%] top-[50%] bottom-[7%] flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.65, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.28, type: 'spring' }}
            className="mb-2 text-gold-bright"
          >
            <Compass size={26} />
          </motion.div>
          <p className="font-mono text-[8px] sm:text-[10px] tracking-[0.42em] uppercase text-gold-core">
            Title Unlocked · Milestone {data?.milestone || 5}
          </p>
          <h2 className="mt-2 font-display text-2xl sm:text-4xl md:text-5xl tracking-[0.13em] uppercase text-[#f3d895] drop-shadow-[0_2px_16px_rgba(236,200,128,0.35)]">
            {title}
          </h2>
          <p className="mt-2 max-w-md font-serif text-[10px] sm:text-sm italic leading-relaxed text-stone-300">
            {description}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 flex items-center gap-2 border border-gold-core/50 bg-black/70 px-5 py-2 font-mono text-[8px] sm:text-[9px] font-bold tracking-[0.22em] uppercase text-gold-core transition-all hover:bg-gold-core hover:text-black"
          >
            Wear the title
            <ChevronRight size={12} />
          </button>
        </div>
      </motion.section>
      <style jsx>{`
        @media (max-width: 700px), (max-aspect-ratio: 3/4) {
          .title-unlock-card {
            width: min(94vw, 470px);
            height: min(90vh, 835px);
            max-height: 90vh;
            aspect-ratio: 9 / 16;
          }
          .title-unlock-copy {
            left: 13%;
            right: 13%;
            top: 36%;
            bottom: 8%;
          }
        }
      `}</style>
    </motion.div>
  );
}
