import { motion } from "framer-motion";

export default function ScytheDisplay({ level = "DORMANT", auraColor = "rgba(197, 160, 89, 0.25)" }) {
  return (
    <div className="relative flex flex-col justify-center items-center w-full h-full min-h-[400px]">
      
      {/* Cinematic Aura */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-gold-core/10 blur-[100px]"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        style={{ backgroundColor: auraColor }}
      />

      {/* Scythe Asset Layer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[300px] aspect-[1/2] flex items-center justify-center"
      >
        {/* If user has /scythe/DORMANT.png etc, this will load it */}
        {/* Falling back to our high-fidelity SVG for now if image missing */}
        <div className="w-full h-full flex items-center justify-center filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <motion.img
            src={`/scythe/${level}.png`}
            alt={`${level} Scythe`}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          
          <div style={{ display: 'none' }} className="w-full h-full">
             <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
                <path d="M 85,95 C 75,70 65,40 60,10 L 55,10 C 60,40 70,70 80,95 Z" fill="#1a1a1a" />
                <path d="M 60,15 C 30,5 5,30 5,60 C 15,40 35,25 55,25 Z" fill={level === 'DORMANT' ? '#0d0d0d' : '#c5a059'} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
             </svg>
          </div>
        </div>
      </motion.div>

      {/* Floating Physics */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Stage Info */}
      <div className="absolute bottom-4 text-center">
        <h4 className="text-gold-core font-display text-xl tracking-[0.2em]">{level} SCYTHE</h4>
        <p className="text-[10px] font-mono text-gray-500 mt-2 tracking-widest uppercase">
          Complete operations to awaken true potential
        </p>
      </div>

    </div>
  );
}
