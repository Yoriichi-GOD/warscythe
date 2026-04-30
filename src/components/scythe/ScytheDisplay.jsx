import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT" }) {
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = `/scythe/${safeLevel}.png`;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* GOLDEN AMBIENT AURA */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ position: 'absolute', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(197,160,89,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }}
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
        }}
        transition={{
          opacity: { duration: 1.5 },
          y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          scale: { repeat: Infinity, duration: 4, ease: "easeInOut" },
        }}
        style={{
          maxWidth: '85%',
          maxHeight: '65%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.95))',
          zIndex: 10,
        }}
        onLoad={() => console.log("✅ SCYTHE VISIBLE")}
        onError={(e) => { e.target.src = '/scythe/DORMANT.png'; }}
      />

      {/* INFO FOOTER */}
      <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', zIndex: 20 }}>
        <span style={{ color: '#fff', fontFamily: 'Cinzel, serif', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>{safeLevel} Scythe</span>
        <span style={{ color: '#6b7280', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.6 }}>
          Complete operations to awaken its true potential.
        </span>
        <span style={{ color: 'rgba(197,160,89,0.5)', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '0.25rem' }}>0 PWR</span>
      </div>
    </div>
  );
}
