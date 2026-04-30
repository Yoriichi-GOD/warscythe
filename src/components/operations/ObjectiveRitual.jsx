import { motion } from "framer-motion";

export default function ObjectiveRitual({ onClick }) {
  return (
    <div className="flex flex-col items-center gap-2 py-0">
      <div className="flex flex-col items-center gap-1 mb-0 text-center relative z-20">
        <h3 className="text-[11px] font-display tracking-[0.2em] text-white">WHAT WILL YOU EXECUTE TODAY?</h3>
        <p className="text-[9px] font-mono text-gray-500 tracking-widest uppercase italic">Every task is a strike. Every strike shapes your legend.</p>
      </div>
      
      <div className="relative flex flex-col items-center justify-center w-full max-w-[400px] mt-[-20px]">
        {/* THE RITUAL PLATFORM ASSET - MOVED UP */}
        <div className="relative w-full aspect-video flex items-center justify-center">
          <img 
            src="/ritual-platform.png" 
            alt="Ritual Platform" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all"
          />

          {/* THE ASCENDING BEAM (Animated) */}
          <motion.div 
            animate={{ 
              height: [60, 140, 60],
              opacity: [0.3, 0.7, 0.3],
              width: [2, 4, 2]
            }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute bottom-[45%] w-1 bg-gradient-to-t from-gold-bright via-gold-core to-transparent blur-[1px] shadow-[0_0_20px_#c5a059]"
          />
        </div>

        {/* INITIATE BUTTON - REPOSITIONED BELOW */}
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="mt-[-30px] z-20 cursor-pointer group"
        >
          <div className="bg-black/70 backdrop-blur-md border border-gold-core/25 px-8 py-3 rounded-full group-hover:bg-gold-core group-hover:text-black transition-all shadow-[0_5px_20px_rgba(0,0,0,0.5)] flex items-center gap-2">
             <span className="text-[9px] font-mono tracking-[0.3em] uppercase font-bold text-white group-hover:text-black">
               + Initiate New Objective
             </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
