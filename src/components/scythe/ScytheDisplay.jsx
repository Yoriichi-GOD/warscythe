import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT" }) {
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = `/scythe/${safeLevel}.png`;

  return (
    /* position:absolute + inset:0 fills the parent regardless of h-full chain */
    <div className="absolute inset-0 flex flex-col items-center justify-center">

      {/* GOLDEN AMBIENT AURA */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.09, 0.04] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute w-96 h-96 rounded-full bg-gold-core blur-[100px] pointer-events-none"
      />

      {/* 🗡️ HEARTBEAT LEVITATION */}
      <motion.img
        key={safeLevel}
        src={imagePath}
        alt={`${safeLevel} Scythe`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          y: [0, -20, 0],
          scale: [1, 1.025, 1],
          filter: [
            'drop-shadow(0 30px 60px rgba(0,0,0,0.9)) drop-shadow(0 0 15px rgba(197,160,89,0.0))',
            'drop-shadow(0 40px 80px rgba(0,0,0,0.9)) drop-shadow(0 0 35px rgba(197,160,89,0.18))',
            'drop-shadow(0 30px 60px rgba(0,0,0,0.9)) drop-shadow(0 0 15px rgba(197,160,89,0.0))',
          ]
        }}
        transition={{
          opacity: { duration: 1.5 },
          y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          scale: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          filter: { repeat: Infinity, duration: 4, ease: "easeInOut" },
        }}
        style={{ maxWidth: '85%', maxHeight: '70%', objectFit: 'contain' }}
        className="z-10"
        onLoad={() => console.log("✅ SCYTHE VISIBLE IN CENTER")}
        onError={(e) => { e.target.src = '/scythe/DORMANT.png'; }}
      />

      {/* INFO FOOTER */}
      <div className="absolute bottom-8 flex flex-col items-center gap-1.5 z-20">
        <h4 className="text-white font-display text-[11px] tracking-[0.3em] uppercase">{safeLevel} Scythe</h4>
        <p className="text-[8px] font-mono text-gray-500 tracking-[0.15em] uppercase text-center leading-relaxed">
          Complete operations to awaken its true potential.
        </p>
        <span className="text-[8px] font-mono text-gold-core/50 tracking-[0.4em] uppercase font-bold mt-1">0 PWR</span>
      </div>
    </div>
  );
}
