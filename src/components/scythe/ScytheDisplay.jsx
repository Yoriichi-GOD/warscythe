import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT" }) {
  const imagePath = `/scythe/${level}.png`;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-visible">
      
      {/* 🔮 MASTERPIECE AMBIANCE */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10 pointer-events-none" />
      
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        style={{ 
          background: 'radial-gradient(circle, rgba(197,160,89,0.2) 0%, transparent 70%)'
        }}
      />

      {/* 🗡️ THE MASSIVE SCYTHE ASSET (Masterpiece Scale) */}
      <motion.div
        key={level}
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1.15, rotate: -8 }} // MENACING TILT & SCALE
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-20 w-full h-full flex items-center justify-center p-0"
      >
        <div className="relative w-[120%] h-[120%] flex items-center justify-center translate-x-10 translate-y-10">
          <img 
            src={imagePath}
            alt={`${level} Scythe`}
            className="w-full h-full object-contain filter drop-shadow-[0_20px_80px_rgba(0,0,0,1)]"
            onError={(e) => {
               e.target.parentElement.classList.add('scythe-fallback-active');
               e.target.style.display = 'none';
            }}
          />

          {/* FALLBACK (Only if image missing) */}
          <div className="hidden scythe-fallback-box w-full h-full flex flex-col items-center justify-center opacity-10">
             <svg viewBox="0 0 100 100" className="w-80 h-80">
                <path d="M 85,95 C 75,70 65,40 60,10 L 55,10 C 60,40 70,70 80,95 Z" fill="#fff" />
                <path d="M 60,15 C 30,5 5,30 5,60 C 15,40 35,25 55,25 Z" fill="#fff" />
             </svg>
          </div>
        </div>
      </motion.div>

      {/* 📜 ETCHED INFO BOX (Bottom Center) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-0 w-[90%] bg-black/40 border-t border-white/5 p-6 flex flex-col items-center z-30 backdrop-blur-sm"
      >
        <h4 className="text-white font-display text-[11px] tracking-[0.4em] uppercase mb-1">{level} SCYTHE</h4>
        <p className="text-[8px] font-mono text-gray-500 tracking-[0.2em] uppercase text-center leading-relaxed">
          Complete operations to awaken<br/>its true potential.
        </p>
        <div className="mt-4 text-[7px] font-mono text-gold-core/40 tracking-[0.5em] uppercase">0 PWR</div>
      </motion.div>

      <style jsx>{`
        .scythe-fallback-active .scythe-fallback-box {
          display: flex !important;
        }
      `}</style>
    </div>
  );
}
