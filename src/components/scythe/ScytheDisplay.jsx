import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT" }) {
  // Ensure the image path is correct and fallback is reliable
  const imagePath = `/scythe/${level}.png`;

  return (
    <div className="relative flex flex-col justify-center items-center w-full h-full min-h-[500px] overflow-visible">
      
      {/* 🔮 CINEMATIC AMBIANCE - Reacts to the Scythe */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        style={{ 
          background: level === 'PLATINUM' 
            ? 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)' 
            : 'radial-gradient(circle, rgba(197,160,89,0.15) 0%, transparent 70%)'
        }}
      />

      {/* 🗡️ THE SCYTHE ASSET */}
      <motion.div
        key={level}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full h-full max-h-[600px] flex items-center justify-center p-12"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={imagePath}
            alt={`${level} Scythe`}
            className="w-full h-full object-contain filter drop-shadow-[0_10px_60px_rgba(0,0,0,0.9)]"
            onError={(e) => {
               // If the PNG fails, we show the fallback styling
               e.target.parentElement.classList.add('scythe-fallback-active');
               e.target.style.display = 'none';
            }}
          />

          {/* FALLBACK SKELETON (Only visible if image fails) */}
          <div className="hidden scythe-fallback-box w-full h-full flex flex-col items-center justify-center opacity-20">
             <svg viewBox="0 0 100 100" className="w-64 h-64">
                <path d="M 85,95 C 75,70 65,40 60,10 L 55,10 C 60,40 70,70 80,95 Z" fill="#fff" />
                <path d="M 60,15 C 30,5 5,30 5,60 C 15,40 35,25 55,25 Z" fill="#fff" />
             </svg>
             <span className="text-[10px] font-mono text-gray-500 mt-4 tracking-[0.5em] uppercase italic">
               Asset Syncing...
             </span>
          </div>
        </div>
      </motion.div>

      {/* 📜 STAGE FOOTER */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 flex flex-col items-center gap-2"
      >
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-core/40 to-transparent mb-2" />
        <h4 className="text-white font-display text-lg tracking-[0.3em] uppercase">{level} SCYTHE</h4>
        <p className="text-[9px] font-mono text-gray-500 tracking-[0.2em] uppercase">
          Current Execution Potential: {level === 'DORMANT' ? 'DORMANT' : 'AWAKENED'}
        </p>
      </motion.div>

      <style jsx>{`
        .scythe-fallback-active .scythe-fallback-box {
          display: flex !important;
        }
      `}</style>
    </div>
  );
}
