import { motion } from "framer-motion";

export default function ObjectiveRitual({ onClick }) {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="flex flex-col items-center gap-1 mb-2">
        <h3 className="text-[11px] font-display tracking-[0.2em] text-white">WHAT WILL YOU EXECUTE TODAY?</h3>
        <p className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">Every task is a strike. Every strike shapes your legend.</p>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="relative flex items-center justify-center cursor-pointer group w-full aspect-video max-w-[400px]"
      >
        {/* THE RITUAL PLATFORM ASSET */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src="/ritual-platform.png" 
            alt="Ritual Platform" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(197,160,89,0.3)] transition-all group-hover:drop-shadow-[0_0_50px_rgba(197,160,89,0.5)]"
          />

          {/* THE ASCENDING BEAM (Animated) */}
          <motion.div 
            animate={{ 
              height: [80, 160, 80],
              opacity: [0.3, 0.7, 0.3],
              width: [2, 4, 2]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute bottom-[45%] w-1 bg-gradient-to-t from-gold-bright via-gold-core to-transparent blur-[1px] shadow-[0_0_20px_#c5a059]"
          />

          {/* RADIATING PULSE */}
          <motion.div 
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute bottom-[40%] w-40 h-20 bg-gold-core/20 rounded-full blur-3xl pointer-events-none"
          />

          {/* FLOATING ACTION TEXT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 translate-y-[-10px]">
            <motion.div 
               whileHover={{ y: -2 }}
               className="bg-black/60 backdrop-blur-md border border-gold-core/40 px-6 py-2 rounded-sm group-hover:bg-gold-core group-hover:text-black transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
               <span className="text-[10px] font-mono tracking-[0.4em] uppercase font-black">
                 + Initiate Objective
               </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
