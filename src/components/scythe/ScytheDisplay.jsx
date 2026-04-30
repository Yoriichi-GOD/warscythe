import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT" }) {
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = `/scythe/${safeLevel}.png`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative min-h-[500px]">
      
      {/* 🗡️ THE SCYTHE ASSET (FORCE RENDER - NO FILTERS) */}
      <motion.div
        key={safeLevel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full h-full flex items-center justify-center p-4 relative z-50"
      >
        <img 
          src={imagePath}
          alt={`${safeLevel} Scythe`}
          className="w-full h-full object-contain block relative z-50"
          style={{ minHeight: '400px' }}
          onLoad={() => console.log("SCYTHE RENDERED SUCCESS")}
          onError={(e) => {
             console.error("SCYTHE RENDER FAILED", imagePath);
             e.target.style.display = 'none';
             e.target.nextSibling.style.display = 'flex';
          }}
        />

        {/* FAIL-SAFE FALLBACK (Visible if image fails) */}
        <div style={{ display: 'none' }} className="w-full h-full flex flex-col items-center justify-center text-gold-core">
           <div className="w-40 h-40 border border-gold-core/40 rounded flex items-center justify-center">
              <span className="text-[10px] font-mono tracking-[0.5em] uppercase">NO ASSET</span>
           </div>
        </div>
      </motion.div>

      {/* 📜 INFO BOX */}
      <div className="absolute bottom-4 w-full flex flex-col items-center z-[60]">
        <h4 className="text-white font-display text-[10px] tracking-[0.4em] uppercase">{safeLevel} SCYTHE</h4>
        <div className="w-10 h-[1px] bg-gold-core/20 mt-2" />
      </div>
    </div>
  );
}
