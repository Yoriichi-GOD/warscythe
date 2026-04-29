import { motion } from "framer-motion";

export default function ObjectiveRitual({ onClick }) {
  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <h3 className="text-sm font-mono tracking-[0.3em] text-gold-core opacity-60">WHAT WILL YOU EXECUTE TODAY?</h3>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="relative flex items-center justify-center cursor-pointer group"
      >
        {/* Glow Circle */}
        <div className="w-64 h-64 rounded-full border border-gold-core/40 
                        shadow-[0_0_60px_rgba(197,160,89,0.1)] flex items-center justify-center relative bg-black/40 backdrop-blur-sm">
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute inset-0 border border-gold-core/10 rounded-full border-dashed"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="absolute inset-2 border border-gold-core/5 rounded-full"
          />

          <div className="z-10 flex flex-col items-center gap-2">
            <span className="text-gold-bright text-xl font-display tracking-[0.2em] group-hover:text-white transition-colors">
              INITIATE
            </span>
            <span className="text-[10px] font-mono text-gold-core/60 tracking-widest">NEW OBJECTIVE</span>
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
