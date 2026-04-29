import { motion } from "framer-motion";

export default function ObjectiveRitual({ onClick }) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex flex-col items-center gap-1 mb-4">
        <h3 className="text-[11px] font-display tracking-[0.2em] text-white">WHAT WILL YOU EXECUTE TODAY?</h3>
        <p className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">Every task is a strike. Every strike shapes your legend.</p>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="relative flex items-center justify-center cursor-pointer group"
      >
        {/* Glow Circle */}
        <div className="w-80 h-80 rounded-full border border-gold-core/20 
                        shadow-[0_0_80px_rgba(197,160,89,0.05)] flex items-center justify-center relative bg-black/20 backdrop-blur-sm">
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="absolute inset-0 border border-gold-core/10 rounded-full border-dashed"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
            className="absolute inset-4 border border-gold-core/5 rounded-full"
          />

          <div className="z-10 flex flex-col items-center gap-6">
            <div className="bg-black/60 border border-gold-core/40 px-8 py-3 rounded group-hover:bg-gold-core/10 transition-all">
               <span className="text-gold-bright text-xs font-mono tracking-[0.3em] uppercase">
                 + Initiate New Objective
               </span>
            </div>
          </div>
          
          {/* Internal Pulse */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute inset-0 bg-gold-core/5 rounded-full blur-2xl"
          />
        </div>
      </motion.div>
    </div>
  );
}
