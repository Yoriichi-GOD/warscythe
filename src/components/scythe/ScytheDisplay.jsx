import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT", type = "standard", pwr = "10" }) {
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = type === "ultimate" 
    ? `/ultimate/${level.toLowerCase()}.png`
    : `/scythe/${safeLevel}.png`;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* GOLDEN AMBIENT AURA */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ position: 'absolute', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(197,160,89,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }}
      />

      {/* 🗡️ HEARTBEAT LEVITATION (HERO SCALING) */}
      <div className="w-full h-full flex items-center justify-center p-6 z-10">
        <motion.img
          key={`${type}-${safeLevel}`}
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
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 80px rgba(0,0,0,1))',
          }}
          onError={(e) => { e.target.src = '/scythe/DORMANT.png'; }}
        />
      </div>

      {/* INFO FOOTER */}
      <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', zIndex: 20 }}>
        <span style={{ color: '#fff', fontFamily: 'Cinzel, serif', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>{safeLevel} {type === 'ultimate' ? 'ULTIMATE' : 'SCYTHE'}</span>
        <span style={{ color: '#6b7280', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.6 }}>
          {type === 'ultimate' ? 'The ultimate weapon of a true sovereign.' : 'Complete operations to awaken its true potential.'}
        </span>
        <span style={{ color: 'rgba(197,160,89,0.5)', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '0.25rem' }}>{pwr} PWR</span>
      </div>
    </div>
  );
}
