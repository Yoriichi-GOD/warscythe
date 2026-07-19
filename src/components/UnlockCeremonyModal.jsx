import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { getAssetUrl } from '../utils/assetResolver';

const SCYTHE_PROPHECIES = {
  NEOPHYTE: 'Five dawns answered your command. The blade no longer doubts the hand that calls it.',
  ACOLYTE: 'Fifteen returns have tempered intention into ritual. What once required force now recognizes your footsteps.',
  REAPER: 'Thirty days have given your discipline an edge. Resistance knows your name and has begun to fear it.',
  EXECUTIONER: 'Sixty victories stand without interruption. The weapon now falls with the certainty of judgment.',
  SOVEREIGN: 'One hundred and twenty dawns bow before your vow. You no longer borrow momentum. You command it.',
  'VOID-WALKER': 'Two hundred days have carried you beyond the noise of lesser promises. Even the void makes room for your passage.',
  ETERNAL: 'Three hundred returns have made constancy indistinguishable from nature. The weapon remembers you between worlds.',
  'DEATH-LORD': 'A full cycle has failed to break you. Time itself has become the whetstone of your final form.'
};

export default function UnlockCeremonyModal({
  kind = 'scythe',
  name,
  days,
  image,
  prophecy,
  onClose,
  onAcquire
}) {
  const isScythe = kind === 'scythe';
  const resolvedProphecy = prophecy || SCYTHE_PROPHECIES[name] || 'The old powers have witnessed your ascent. Carry what has awakened here with honor.';

  return (
    <div className="fixed inset-0 z-[6500] bg-black/95 backdrop-blur-xl flex items-center justify-center p-3">
      <motion.section
        initial={{ opacity: 0, scale: .88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
        className="ceremony-shell relative overflow-hidden border border-gold-core/45 bg-black shadow-[0_0_90px_rgba(197,160,89,.28)]"
      >
        <picture className="absolute inset-0">
          <source media="(max-width: 639px)" srcSet="/ascension-sanctum-phone.png" />
          <img src="/ascension-sanctum-desktop.png" alt="" className="w-full h-full object-cover" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95" />
        <button onClick={onClose} className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full border border-white/15 bg-black/70 text-white/60 hover:text-white flex items-center justify-center">
          <X size={16} />
        </button>

        <div className="absolute inset-0 z-10 flex flex-col items-center px-[7%] pt-[4%] pb-[3%] sm:px-[9%] sm:pt-[3%] sm:pb-[3%] text-center">
          <div className="font-mono text-[8px] sm:text-[10px] tracking-[.35em] text-gold-core uppercase">
            {isScythe ? 'Streak Armament Acquired' : 'Olympian Tier Ascended'}
          </div>
          <h2 className="mt-1 sm:mt-2 font-display text-2xl sm:text-4xl lg:text-5xl tracking-[.14em] text-white uppercase drop-shadow-[0_0_14px_#000]">
            {name}
          </h2>
          {isScythe && (
            <div className="mt-2 px-4 py-1 border-y border-gold-core/30 font-mono text-[8px] sm:text-[10px] tracking-[.25em] text-gold-bright uppercase">
              {days} Day Vow
            </div>
          )}

          <div className="flex-1 min-h-0 w-full flex items-center justify-center py-1 sm:py-2">
            <motion.img
              initial={{ opacity: 0, scale: .7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: .2, duration: .65 }}
              src={getAssetUrl(image)}
              alt={name}
              className="w-[78%] h-[64%] sm:w-[62%] sm:h-[68%] lg:w-[68%] lg:h-[72%] object-contain scale-125 sm:scale-110 drop-shadow-[0_0_34px_rgba(236,200,128,.9)]"
            />
          </div>

          <div className="w-full max-w-4xl bg-black/78 border border-white/10 px-4 py-3 sm:px-8 sm:py-4 backdrop-blur-sm">
            <Sparkles size={13} className="mx-auto mb-2 text-gold-core" />
            <p className="font-serif italic text-[10px] sm:text-sm leading-relaxed text-stone-200">
              “{resolvedProphecy}”
            </p>
          </div>

          <button
            onClick={isScythe ? onAcquire : onClose}
            className="mt-2 sm:mt-3 w-full max-w-4xl py-3 sm:py-4 border border-gold-bright bg-black/65 text-gold-bright font-mono text-[9px] sm:text-[11px] font-black tracking-[.32em] uppercase shadow-[0_0_24px_rgba(236,200,128,.35)] hover:bg-gold-core hover:text-black transition-all"
          >
            {isScythe ? 'Acquire Armament' : 'Embody New Tier'}
          </button>
        </div>
      </motion.section>
      <style jsx>{`
        .ceremony-shell {
          width: min(96vw, 1500px);
          aspect-ratio: 16 / 9;
          max-height: calc(100dvh - 20px);
        }
        @media (max-width: 639px) {
          .ceremony-shell {
            width: min(96vw, calc((100dvh - 16px) * 9 / 16));
            aspect-ratio: 9 / 16;
            max-height: calc(100dvh - 16px);
          }
        }
      `}</style>
    </div>
  );
}
