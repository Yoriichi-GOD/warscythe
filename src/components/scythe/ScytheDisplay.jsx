import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT" }) {
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = `/scythe/${safeLevel}.png`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative pointer-events-none overflow-hidden">
      
      {/* 🌫️ ATMOSPHERIC MIST LAYERS (Dynamic Masterpiece VFX) */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="absolute w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(197,160,89,0.1)_0%,transparent_60%)] blur-[80px]"
      />
      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1.2, 1, 1.2],
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
        className="absolute w-[140%] h-[140%] bg-[radial-gradient(circle,rgba(197,160,89,0.08)_0%,transparent_70%)] blur-[100px]"
      />

      {/* 🗡️ THE SCYTHE ASSET */}
      <motion.div
        key={safeLevel}
        initial={{ opacity: 0, scale: 0.95, filter: 'brightness(0)' }}
        animate={{ opacity: 1, scale: 1.15, filter: 'brightness(1)' }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-full h-full flex items-center justify-center p-8 z-10"
      >
        <img 
          src={imagePath}
          alt={`${safeLevel} Scythe`}
          className="w-full h-full object-contain filter drop-shadow-[0_20px_100px_rgba(0,0,0,1)]"
        />
      </motion.div>

      {/* 📜 INFO FOOTER (Decorative Font) */}
      <div className="absolute bottom-10 w-full flex flex-col items-center gap-2 shrink-0 z-20">
        <h4 className="text-white font-decorative text-base tracking-[0.4em] uppercase">{safeLevel} SCYTHE</h4>
        <p className="text-[9px] font-mono text-gray-500 tracking-[0.2em] uppercase text-center leading-relaxed">
          Complete operations to awaken<br/>its true potential.
        </p>
        <div className="flex items-center gap-4 mt-2">
           <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gold-core/20" />
           <span className="text-[8px] font-mono text-gold-core tracking-[0.5em] uppercase font-bold">0 PWR</span>
           <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gold-core/20" />
        </div>
      </div>
    </div>
  );
}
