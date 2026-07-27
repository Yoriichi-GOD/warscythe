import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, MessageSquare, ExternalLink } from 'lucide-react';
import { useWarscytheStore } from '../store/useWarscytheStore';
import { VIDEO_GUIDE_MAP } from '../store/constants';

const TITLE_MAP = {
  global_intro: "WHAT IS WARSCYTHE? — GENERAL TRANSMISSION",
  operations: "TACTICAL STRIKES — OPERATIONS DIRECTIVES GUIDE",
  fitness: "IRON PHYSICS — TRAINING LOGBOOK GUIDE",
  rituals: "STEADY CONDITIONING — HABITS & RITUALS GUIDE",
  forge: "MONETARY REQUISITIONS — THE WEAPON FORGE",
  quest_map: "COGNITIVE COMPASS — QUEST MAP & LORE SCROLLS",
  ledger: "CHRONOLOGY LOG — PERFORMANCE LEDGER GUIDE",
  legion: "GARRISON COOPERATIVE — LEGION COMMAND GUIDE",
};

export default function VideoGuideModal() {
  const showVideoModal = useWarscytheStore(state => state.showVideoModal);
  const videoKey = useWarscytheStore(state => state.videoKey);
  const closeVideoModal = useWarscytheStore(state => state.closeVideoModal);

  const videoId = VIDEO_GUIDE_MAP[videoKey] || "M82FvdLRKik";
  const title = TITLE_MAP[videoKey] || "TACTICAL SYSTEM WALKTHROUGH";
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;

  return (
    <AnimatePresence>
      {showVideoModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6 overflow-x-hidden overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideoModal}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-3xl bg-zinc-950/95 border border-gold-core/20 rounded shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(197,160,89,0.05)] overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-5 py-4">
              <div className="flex items-center gap-2">
                <Play size={14} className="text-gold-core animate-pulse" />
                <h3 className="text-[11px] md:text-xs font-mono font-bold tracking-widest text-gold-core uppercase">
                  {title}
                </h3>
              </div>
              <button
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Video Player Section */}
            <div className="relative w-full aspect-video bg-black border-b border-white/5">
              <iframe
                src={embedUrl}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>

            {/* Footer / Feedback Protocol */}
            <div className="bg-black/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <MessageSquare size={16} className="text-gold-core/60 shrink-0 hidden sm:block" />
                <div className="font-mono text-[9px] uppercase tracking-wide leading-relaxed max-w-md text-gray-400">
                  <span className="text-white font-bold block mb-0.5">FEEDBACK LOOP INITIATED</span>
                  Have suggestions or questions? Leave a comment directly on the YouTube video to reach the developers.
                </div>
              </div>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2 border border-gold-core/30 bg-gold-core/5 hover:bg-gold-core/10 text-gold-core text-[9px] font-mono rounded font-bold tracking-widest transition-all flex items-center gap-1.5 cursor-pointer uppercase shadow-[0_0_10px_rgba(197,160,89,0.02)]"
              >
                <span>Write Feedback</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
