import React from 'react';
import { motion } from 'framer-motion';
import { X, CloudDownload, Loader2 } from 'lucide-react';
import { getAssetUrl } from '../utils/assetResolver';

const SCYTHE_PROPHECIES = {
  NEOPHYTE: 'Five dawns answered your command. The blade no longer doubts the hand that calls it.',
  ACOLYTE: 'Fifteen returns have tempered intention into ritual. What once required force now recognizes your footsteps.',
  REAPER: 'Thirty days have given your discipline an edge. Resistance knows your name and has begun to fear it.',
  EXECUTIONER: 'Sixty victories stand without interruption. The weapon now falls with the certainty of judgment.',
  SOVEREIGN: 'One hundred and twenty dawns bow before your vow. You no longer borrow momentum. You command it.',
  'VOID-WALKER': 'Two hundred days have carried you beyond the noise of lesser promises. Even the void makes room for your passage.',
  ETERNAL: 'Three hundred returns have made constancy indistinguishable from nature. The weapon remembers you between worlds.'
};

export default function UnlockCeremonyModal({
  kind = 'scythe',
  name,
  days,
  image,
  prophecy,
  onClose,
  onAcquire,
  requiresDownload = false,
  downloadState = 'idle',
  onDownload
}) {
  const isScythe = kind === 'scythe';
  const isMedal = kind === 'ritual-medal';
  const resolvedProphecy = prophecy || SCYTHE_PROPHECIES[name] || 'The old powers have witnessed your ascent. Carry what has awakened here with honor.';

  return (
    <div className={`ceremony-backdrop fixed inset-0 z-[6500] flex items-center justify-center p-3 ${isScythe ? 'ceremony-backdrop--scythe' : 'bg-black/95 backdrop-blur-xl'}`}>
      <motion.section
        initial={{ opacity: 0, scale: .88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
        className={`ceremony-shell relative bg-black shadow-[0_0_90px_rgba(197,160,89,.28)] ${isScythe ? 'ceremony-shell--scythe' : 'overflow-hidden border border-gold-core/45'}`}
      >
        {isScythe && (
          <span className="ceremony-screen-frame" aria-hidden="true">
            <img className="ceremony-screen-frame__corner ceremony-screen-frame__corner--tl" src="/frames/screen/corner.webp" alt="" />
            <img className="ceremony-screen-frame__corner ceremony-screen-frame__corner--tr" src="/frames/screen/corner.webp" alt="" />
            <img className="ceremony-screen-frame__corner ceremony-screen-frame__corner--bl" src="/frames/screen/corner.webp" alt="" />
            <img className="ceremony-screen-frame__corner ceremony-screen-frame__corner--br" src="/frames/screen/corner.webp" alt="" />
            <img className="ceremony-screen-frame__top-center" src="/frames/screen/top-center.webp" alt="" />
            <img className="ceremony-screen-frame__bottom-center" src="/frames/screen/bottom-center.webp" alt="" />
          </span>
        )}
        <picture className="absolute inset-0">
          <source media="(max-width: 639px)" srcSet="/ascension-sanctum-phone.webp" />
          <img src="/ascension-sanctum-desktop.webp" alt="" className="w-full h-full object-cover" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95" />
        <button onClick={onClose} className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full border border-white/15 bg-black/70 text-white/60 hover:text-white flex items-center justify-center">
          <X size={16} />
        </button>

        <div className="absolute inset-0 z-10 flex flex-col items-center px-[7%] pt-[4%] pb-[3%] sm:px-[9%] sm:pt-[3%] sm:pb-[3%] text-center">
          <div className="font-mono text-[8px] sm:text-[10px] tracking-[.35em] text-gold-core uppercase">
            {isScythe ? 'Streak Armament Acquired' : (isMedal ? 'Ritual Medal Achieved' : 'Olympian Tier Ascended')}
          </div>
          <h2 className="mt-1 sm:mt-2 font-display text-2xl sm:text-4xl lg:text-5xl tracking-[.14em] text-white uppercase drop-shadow-[0_0_14px_#000]">
            {name}
          </h2>
          {isScythe && (
            <div className="mt-2 px-4 py-1 border-y border-gold-core/30 font-mono text-[8px] sm:text-[10px] tracking-[.25em] text-gold-bright uppercase">
              {days} Day Vow
            </div>
          )}
          {isMedal && (
            <div className="mt-2 px-4 py-1 border-y border-gold-core/30 font-mono text-[8px] sm:text-[10px] tracking-[.25em] text-gold-bright uppercase">
              31 Day Vow Cycle
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
            {requiresDownload && (
              <button
                type="button"
                onClick={onDownload}
                disabled={downloadState === 'downloading'}
                className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-gold-bright bg-black/90 text-gold-bright shadow-[0_0_30px_rgba(236,200,128,.65)]"
                aria-label={`Download ${name} assets`}
              >
                {downloadState === 'downloading'
                  ? <Loader2 size={23} className="animate-spin" />
                  : <CloudDownload size={23} />}
              </button>
            )}
          </div>

          <div className={`ceremony-quotation w-full max-w-4xl bg-black/78 px-4 py-3 sm:px-8 sm:py-4 backdrop-blur-sm ${isScythe ? 'ceremony-quotation--scythe' : 'border border-white/10'}`}>
            {isScythe && <>
              <img className="ceremony-quotation__corner ceremony-quotation__corner--tr" src="/frames/quotation/quotation-corner.webp" alt="" />
              <img className="ceremony-quotation__corner ceremony-quotation__corner--bl" src="/frames/quotation/quotation-corner.webp" alt="" />
              <img className="ceremony-quotation__mark ceremony-quotation__mark--tl" src="/frames/quotation/quotation-mark.webp" alt="" />
              <img className="ceremony-quotation__mark ceremony-quotation__mark--br" src="/frames/quotation/quotation-mark.webp" alt="" />
              <img className="ceremony-quotation__gem" src="/frames/dividers/sapphire-gem.webp" alt="" />
            </>}
            <p className={`italic text-[10px] sm:text-sm leading-relaxed text-stone-200 ${isScythe ? 'ceremony-quotation__copy' : 'font-serif'}`}>
              “{resolvedProphecy}”
            </p>
          </div>

          <button
            onClick={isScythe ? onAcquire : onClose}
            disabled={requiresDownload}
            className={`ceremony-acquire mt-2 sm:mt-3 w-full max-w-4xl py-3 sm:py-4 bg-black/65 text-gold-bright font-mono text-[9px] sm:text-[11px] font-black tracking-[.32em] uppercase shadow-[0_0_24px_rgba(236,200,128,.35)] hover:bg-gold-core hover:text-black motion-control ${isScythe ? 'ceremony-acquire--scythe' : 'border border-gold-bright'}`}
          >
            {isScythe && <span className="ceremony-acquire__frame" aria-hidden="true">
              <img className="ceremony-acquire__scythe-rail" src="/frames/special/scythe-rail.webp" alt="" />
              <img className="ceremony-acquire__scythe-gem" src="/frames/special/scythe-rail-gem.webp" alt="" />
            </span>}
            <span className="ceremony-acquire__copy">
            {requiresDownload
              ? (downloadState === 'error' ? 'Download Failed — Try the Sigil Again' : 'Download This Form to Continue')
              : (isScythe ? 'Acquire Armament' : (isMedal ? 'Seal Medal in the Ledger' : 'Embody New Tier'))}
            </span>
          </button>
        </div>
      </motion.section>
      <style>{`
        .ceremony-shell {
          width: min(96vw, 1500px);
          aspect-ratio: 16 / 9;
          max-height: calc(100dvh - 20px);
        }
        .ceremony-backdrop--scythe { background:rgba(0,0,0,.68); backdrop-filter:blur(5px); }
        .ceremony-shell--scythe { border:0; overflow:visible; isolation:isolate; }
        .ceremony-screen-frame { position:absolute; inset:0; z-index:20; pointer-events:none; overflow:visible; }
        .ceremony-screen-frame img { position:absolute; display:block; object-fit:contain; filter:drop-shadow(0 3px 8px #000d); }
        .ceremony-screen-frame__corner { width:clamp(105px,9vw,150px); aspect-ratio:2/3; }
        .ceremony-screen-frame__corner--tl { left:-25px; top:-38px; }
        .ceremony-screen-frame__corner--tr { right:-25px; top:-38px; transform:scaleX(-1); }
        .ceremony-screen-frame__corner--bl { left:-25px; bottom:-38px; transform:scaleY(-1); }
        .ceremony-screen-frame__corner--br { right:-25px; bottom:-38px; transform:scale(-1); }
        .ceremony-screen-frame__top-center,.ceremony-screen-frame__bottom-center { left:50%; width:clamp(210px,24vw,380px); height:150px; }
        .ceremony-screen-frame__top-center { transform:translateX(-50%); }
        .ceremony-screen-frame__bottom-center { transform:translateX(-50%) scaleY(-1); }
        .ceremony-screen-frame__top-center { top:-108px; }
        .ceremony-screen-frame__bottom-center { bottom:-108px; }
        .ceremony-quotation--scythe { position:relative; border:0; isolation:isolate; padding:22px 18px 30px!important; }
        .ceremony-quotation__corner,.ceremony-quotation__mark,.ceremony-quotation__gem { position:absolute; z-index:2; pointer-events:none; object-fit:contain; }
        .ceremony-quotation__corner { width:95px; height:64px; }
        .ceremony-quotation__corner--tr { right:-20px; top:-18px; transform:scaleX(-1); }
        .ceremony-quotation__corner--bl { left:-20px; bottom:-18px; transform:scaleY(-1); }
        .ceremony-quotation__mark { width:24px; height:36px; }
        .ceremony-quotation__mark--tl { left:18px; top:8px; }
        .ceremony-quotation__mark--br { right:18px; bottom:8px; transform:scale(-1); }
        .ceremony-quotation__gem { left:50%; top:-25px; width:64px; height:50px; transform:translateX(-50%); filter:drop-shadow(0 0 9px #386fd066); }
        .ceremony-quotation__copy { position:relative; z-index:3; padding-inline:22px; font-family:"Source Serif 4",Georgia,serif; font-style:italic; font-size:clamp(12px,1.2vw,17px)!important; transform:translateY(-7px); }
        .ceremony-acquire--scythe { position:relative; border:1px solid rgba(236,200,128,.58); border-radius:999px; isolation:isolate; overflow:visible; }
        .ceremony-acquire__frame { position:absolute; inset:0; z-index:3; pointer-events:none; }
        .ceremony-acquire__frame img { position:absolute; display:block; object-fit:contain; }
        .ceremony-acquire__scythe-rail { left:18%; top:-38px; width:64%; height:70px; object-fit:fill!important; }
        .ceremony-acquire__scythe-gem { left:50%; top:-48px; width:68px; height:82px; transform:translateX(-50%); filter:drop-shadow(0 0 10px rgba(236,200,128,.45)); }
        .ceremony-acquire__copy { position:relative; z-index:5; }
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
