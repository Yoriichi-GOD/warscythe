import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT" }) {
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = `/scythe/${safeLevel}.png`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ minHeight: 0 }}>
      
      {/* GOLDEN AURA */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full bg-gold-core/5 blur-[100px]" />
      </div>

      {/* THE SCYTHE ASSET */}
      <motion.div
        key={safeLevel}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 w-full flex items-center justify-center p-6 min-h-0"
      >
        <img 
          src={imagePath}
          alt={`${safeLevel} Scythe`}
          className="max-w-full max-h-full object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          onLoad={() => console.log("SCYTHE RENDERED SUCCESS")}
          onError={(e) => {
             console.error("SCYTHE RENDER FAILED", imagePath);
             e.target.style.display = 'none';
             e.target.nextSibling.style.display = 'flex';
          }}
        />

        {/* FALLBACK */}
        <div style={{ display: 'none' }} className="w-full h-full flex flex-col items-center justify-center text-gold-core/30">
           <div className="w-32 h-32 border border-gold-core/20 rounded-xl flex items-center justify-center">
              <span className="text-[9px] font-mono tracking-[0.4em] uppercase">NO ASSET</span>
           </div>
        </div>
      </motion.div>

      {/* INFO FOOTER (Matching Masterpiece) */}
      <div className="w-full px-6 py-5 border-t border-white/5 bg-black/30 flex flex-col items-center gap-1.5 shrink-0">
        <h4 className="text-white font-display text-sm tracking-[0.25em] uppercase">{safeLevel} Scythe</h4>
        <p className="text-[8px] font-mono text-gray-500 tracking-[0.15em] uppercase text-center">
          Complete operations to awaken<br/>its true potential.
        </p>
        <span className="text-[8px] font-mono text-gold-core/40 tracking-[0.4em] uppercase mt-1">0 PWR</span>
      </div>
    </div>
  );
}
