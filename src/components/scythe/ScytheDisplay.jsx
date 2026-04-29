import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT" }) {
  // Ensure the image path is correct - forcing uppercase for matching assets
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = `/scythe/${safeLevel}.png`;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-visible z-50">
      
      {/* 🔮 MASTERPIECE AMBIANCE - Reduced Opacity */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        style={{ 
          background: 'radial-gradient(circle, rgba(197,160,89,0.15) 0%, transparent 70%)'
        }}
      />

      {/* 🗡️ THE MASSIVE SCYTHE ASSET (Force Visible) */}
      <motion.div
        key={safeLevel}
        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
        animate={{ opacity: 1, scale: 1.1, rotate: -8 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-50 w-full h-full flex items-center justify-center"
      >
        <div className="relative w-full h-full flex items-center justify-center min-h-[500px]">
          <img 
            src={imagePath}
            alt={`${safeLevel} Scythe`}
            className="w-full h-full object-contain filter drop-shadow-[0_20px_60px_rgba(0,0,0,1)] relative z-[100]"
            onLoad={() => console.log(`Scythe Loaded: ${imagePath}`)}
            onError={(e) => {
               console.error(`Scythe Load Failed: ${imagePath}`);
               e.target.parentElement.classList.add('scythe-fallback-active');
               e.target.style.display = 'none';
            }}
          />

          {/* FALLBACK (Only if image missing) */}
          <div className="hidden scythe-fallback-box w-full h-full flex flex-col items-center justify-center opacity-30">
             <svg viewBox="0 0 100 100" className="w-64 h-64">
                <path d="M 85,95 C 75,70 65,40 60,10 L 55,10 C 60,40 70,70 80,95 Z" fill="#c5a059" />
                <path d="M 60,15 C 30,5 5,30 5,60 C 15,40 35,25 55,25 Z" fill="#c5a059" />
             </svg>
             <span className="text-[10px] font-mono text-gold-core mt-4 tracking-[0.5em] uppercase font-bold">
               {safeLevel}
             </span>
          </div>
        </div>
      </motion.div>

      {/* 📜 INFO BOX (Bottom Center) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-4 w-full flex flex-col items-center z-[110]"
      >
        <h4 className="text-white font-display text-[10px] tracking-[0.4em] uppercase">{safeLevel} SCYTHE</h4>
        <div className="w-10 h-[1px] bg-gold-core/20 mt-2" />
      </motion.div>

      <style jsx>{`
        .scythe-fallback-active .scythe-fallback-box {
          display: flex !important;
        }
      `}</style>
    </div>
  );
}
