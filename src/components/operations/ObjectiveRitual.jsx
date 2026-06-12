import { motion } from "framer-motion";

export default function ObjectiveRitual({ onClick }) {
  return (
    <div className="flex flex-col items-center gap-2 py-0">
      <div className="flex flex-col items-center gap-1 mb-0 text-center relative z-20">
        <h3 className="text-[11px] font-decorative tracking-[0.4em] text-white">WHAT WILL YOU EXECUTE TODAY?</h3>
        <p className="text-[9px] font-mono text-white tracking-[0.3em] uppercase italic opacity-100">Every task is a strike. Every strike shapes your legend.</p>
      </div>
      
      <div className="relative flex flex-col items-center justify-center w-full max-w-[400px] mt-[-30px] ritual-platform-container">
        {/* THE RITUAL PLATFORM ASSET */}
        <div className="relative w-full aspect-video flex items-center justify-center">
          <img 
            src="/ritual-platform.png" 
            alt="Ritual Platform" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(197,160,89,0.3)]"
          />

          {/* ⚡ THE RADIANT BEAM (Masterpiece Rebuild) */}
          <div className="absolute bottom-[40%] flex flex-col items-center">
             {/* Core Inner Beam */}
             <motion.div 
               animate={{ 
                 height: [100, 180, 100],
                 opacity: [0.6, 1, 0.6],
                 filter: ['blur(1px)', 'blur(3px)', 'blur(1px)']
               }}
               transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
               className="w-[2px] bg-white shadow-[0_0_20px_#fff]"
             />
             {/* Radiant Outer Glow */}
             <motion.div 
               animate={{ 
                 scaleX: [1, 2.5, 1],
                 opacity: [0.2, 0.4, 0.2]
               }}
               transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
               className="absolute top-0 w-8 h-full bg-gradient-to-t from-gold-bright via-gold-core to-transparent blur-[15px]"
             />
          </div>
        </div>

        {/* INITIATE BUTTON (Pill Shape Masterpiece) */}
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="mt-[-45px] z-20 cursor-pointer group ritual-initiate-btn"
        >
          <div className="bg-black/80 backdrop-blur-xl border border-gold-core/30 px-10 py-2.5 rounded-full group-hover:bg-gold-core transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-3">
             <div className="w-1 h-1 rounded-full bg-gold-core group-hover:bg-black" />
             <span className="text-[10px] font-mono tracking-[0.5em] uppercase font-black text-white group-hover:text-black">
               Initiate Objective
             </span>
             <div className="w-1 h-1 rounded-full bg-gold-core group-hover:bg-black" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
