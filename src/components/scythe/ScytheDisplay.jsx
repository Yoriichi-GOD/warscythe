import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT" }) {
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = `/scythe/${safeLevel}.png`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">

      {/* GOLDEN AMBIENT AURA */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-80 h-80 rounded-full bg-gold-core blur-[80px]"
        />
      </div>

      {/* 🗡️ THE SCYTHE — HEARTBEAT LEVITATION */}
      <motion.img
        key={safeLevel}
        src={imagePath}
        alt={`${safeLevel} Scythe`}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: [0, -18, 0],           /* Levitate up and back */
          scale: [1, 1.02, 1],      /* Subtle heartbeat pulse */
          filter: [
            'drop-shadow(0 30px 60px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(197,160,89,0.0))',
            'drop-shadow(0 40px 80px rgba(0,0,0,0.9)) drop-shadow(0 0 40px rgba(197,160,89,0.15))',
            'drop-shadow(0 30px 60px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(197,160,89,0.0))',
          ]
        }}
        transition={{
          opacity: { duration: 1.5 },
          y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          scale: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          filter: { repeat: Infinity, duration: 4, ease: "easeInOut" },
        }}
        className="w-[85%] max-h-[75%] object-contain z-10"
        onLoad={() => console.log("SCYTHE IN CENTER ✓")}
        onError={(e) => { e.target.src = '/scythe/DORMANT.png'; }}
      />

      {/* INFO FOOTER */}
      <div className="absolute bottom-6 w-full flex flex-col items-center gap-1 z-20">
        <h4 className="text-white font-display text-[11px] tracking-[0.3em] uppercase">{safeLevel} Scythe</h4>
        <p className="text-[8px] font-mono text-gray-500 tracking-[0.15em] uppercase text-center leading-relaxed">
          Complete operations to awaken its true potential.
        </p>
        <span className="text-[8px] font-mono text-gold-core/50 tracking-[0.4em] uppercase font-bold mt-1">0 PWR</span>
      </div>
    </div>
  );
}
