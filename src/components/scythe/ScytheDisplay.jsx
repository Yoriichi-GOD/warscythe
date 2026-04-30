import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT" }) {
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = `/scythe/${safeLevel}.png`;

  return (
    <div className="w-full h-full flex items-center justify-center relative pointer-events-none overflow-hidden">
      
      {/* 🌫️ ATMOSPHERIC MIST */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
          className="w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(197,160,89,0.06)_0%,transparent_70%)] blur-[100px]"
        />
      </div>

      {/* 🗡️ THE SCYTHE ASSET (ABSOLUTE CENTERING) */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <motion.div
          key={safeLevel}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1.1, y: 0 }} /* Forced Scale & Centering */
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full flex items-center justify-center"
        >
          <img 
            src={imagePath}
            alt={`${safeLevel} Scythe`}
            className="max-w-full max-h-full object-contain filter drop-shadow-[0_30px_100px_rgba(0,0,0,1)]"
          />
        </motion.div>
      </div>

      {/* 📜 INFO FOOTER (Stays at bottom, separate from asset) */}
      <div className="absolute bottom-10 w-full flex flex-col items-center gap-1.5 shrink-0 z-20">
        <h4 className="text-white font-decorative text-base tracking-[0.3em] uppercase">{safeLevel} SCYTHE</h4>
        <p className="text-[10px] font-mono text-gray-500 tracking-[0.2em] uppercase text-center opacity-60">
          Complete operations to awaken<br/>its true potential.
        </p>
        <span className="text-[9px] font-mono text-gold-core/60 tracking-[0.4em] uppercase mt-1 font-bold">0 PWR</span>
      </div>
    </div>
  );
}
