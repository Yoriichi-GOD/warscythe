import { motion } from "framer-motion";

export default function ObjectiveRitual({ onClick }) {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="flex flex-col items-center gap-1 mb-2 text-center">
        <h3 className="text-[11px] font-display tracking-[0.2em] text-white">WHAT WILL YOU EXECUTE TODAY?</h3>
        <p className="text-[9px] font-mono text-gray-500 tracking-widest uppercase italic">Every task is a strike. Every strike shapes your legend.</p>
      </div>
      
      <div className="relative flex flex-col items-center justify-center w-full max-w-[400px]">
        {/* THE RITUAL PLATFORM ASSET */}
        <div className="relative w-full aspect-video flex items-center justify-center">
          <img 
            src="/ritual-platform.png" 
            alt="Ritual Platform" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(197,160,89,0.3)] transition-all"
          />

          {/* THE ASCENDING BEAM (Animated) */}
          <motion.div 
            animate={{ 
              height: [80, 180, 80],
              opacity: [0.3, 0.8, 0.3],
              width: [2, 6, 2]
            }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute bottom-[45%] w-1 bg-gradient-to-t from-gold-bright via-gold-core to-transparent blur-[1px] shadow-[0_0_30px_#c5a059]"
          />

          {/* RADIATING PULSE */}
          <motion.div 
            animate={{ 
              scale: [0.8, 1.3, 0.8],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute bottom-[40%] w-48 h-24 bg-gold-core/20 rounded-full blur-3xl pointer-events-none"
          />
        </div>

        {/* INITIATE BUTTON - REPOSITIONED BELOW AS PER FEEDBACK */}
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="mt-[-20px] z-20 cursor-pointer group"
        >
          <div className="bg-black/80 backdrop-blur-md border border-gold-core/40 px-8 py-3 rounded-sm group-hover:bg-gold-core group-hover:text-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-4">
             <div className="w-1 h-1 rounded-full bg-gold-core group-hover:bg-black animate-pulse" />
             <span className="text-[10px] font-mono tracking-[0.5em] uppercase font-black">
               Initiate Objective
             </span>
             <div className="w-1 h-1 rounded-full bg-gold-core group-hover:bg-black animate-pulse" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
