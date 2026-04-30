import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT" }) {
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = `/scythe/${safeLevel}.png`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative pointer-events-none overflow-hidden">
      
      {/* 🌫️ ATMOSPHERIC MIST */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.06, 0.03]
        }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="absolute w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(197,160,89,0.08)_0%,transparent_70%)] blur-[60px]"
      />

      {/* 🗡️ THE SCYTHE ASSET (CONTAINED) */}
      <motion.div
        key={safeLevel}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 0.9 }} /* Reduced scale for containment */
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-full flex items-center justify-center p-12 z-10"
      >
        <img 
          src={imagePath}
          alt={`${safeLevel} Scythe`}
          className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_60px_rgba(0,0,0,0.9)]"
        />
      </motion.div>

      {/* 📜 INFO FOOTER */}
      <div className="absolute bottom-8 w-full flex flex-col items-center gap-1.5 shrink-0 z-20">
        <h4 className="text-white font-decorative text-sm tracking-[0.3em] uppercase">{safeLevel} SCYTHE</h4>
        <p className="text-[8px] font-mono text-gray-500 tracking-[0.2em] uppercase text-center">
          Complete operations to awaken<br/>its true potential.
        </p>
        <span className="text-[8px] font-mono text-gold-core/60 tracking-[0.4em] uppercase mt-1 font-bold">0 PWR</span>
      </div>
    </div>
  );
}
