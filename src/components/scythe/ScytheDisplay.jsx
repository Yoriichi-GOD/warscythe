import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT" }) {
  const safeLevel = level ? level.toUpperCase() : "DORMANT";
  const imagePath = `/scythe/${safeLevel}.png`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
      
      {/* AMBIENT GLOW */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-gold-core/5 blur-[80px]" />
      </div>

      {/* 🗡️ THE SCYTHE — Simple image, same pattern as Ultimate Artifact */}
      <motion.img
        key={safeLevel}
        src={imagePath}
        alt={`${safeLevel} Scythe`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="w-full max-h-[500px] object-contain drop-shadow-[0_20px_80px_rgba(0,0,0,1)] scale-[1.1]"
        onLoad={() => console.log("SCYTHE RENDERED IN CENTER")}
        onError={(e) => {
          console.error("SCYTHE FAILED", imagePath);
          e.target.src = '/scythe/DORMANT.png';
        }}
      />

      {/* INFO TEXT */}
      <div className="flex flex-col items-center gap-1 mt-2">
        <h4 className="text-white font-display text-sm tracking-[0.3em] uppercase">
          {safeLevel} Scythe
        </h4>
        <p className="text-[9px] font-mono text-gray-500 tracking-[0.2em] uppercase text-center leading-relaxed">
          Complete operations to awaken<br />its true potential.
        </p>
        <span className="text-[8px] font-mono text-gold-core/60 tracking-[0.4em] uppercase font-bold mt-1">0 PWR</span>
      </div>
    </div>
  );
}
