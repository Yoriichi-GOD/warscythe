import { motion, AnimatePresence } from "framer-motion";
import { useWarscytheStore } from "../../store/useWarscytheStore";

export default function DashboardLayout({ children, activeTab }) {
  const level = useWarscytheStore(state => state.level) || 1;
  const storeViewedRegionNumber = useWarscytheStore(state => state.viewedRegionNumber) || level;
  
  const viewedRegionNumber = activeTab === 'map' ? storeViewedRegionNumber : level;
  const regionIndex = ((viewedRegionNumber - 1) % 10) + 1;

  const bgImage = activeTab === 'fitness' 
    ? '/olympus-bg.png' 
    : `/bg/bg-region-${regionIndex}.png`;

  const bgAlt = activeTab === 'fitness' 
    ? 'Olympus Temple' 
    : `Region ${regionIndex} Background`;

  const isRepetition = viewedRegionNumber > 10;
  const cycleIndex = isRepetition ? Math.floor((viewedRegionNumber - 1) / 10) : 0;

  const regionThemes = [
    { hue: 20, sepia: 0.8, saturate: 1.5 },   // Cycle 1: Autumn Gold
    { hue: 200, sepia: 0.3, saturate: 0.8 },  // Cycle 2: Ice / Blue Shift
    { hue: 100, sepia: 0.5, saturate: 1.2 },  // Cycle 3: Forest Green / Decay
    { hue: 280, sepia: 0.6, saturate: 2 },    // Cycle 4: Purple Void Shift
  ];

  const currentTheme = isRepetition ? regionThemes[(cycleIndex - 1) % regionThemes.length] : null;

  const bgFilterStyle = currentTheme 
    ? `hue-rotate(${currentTheme.hue}deg) sepia(${currentTheme.sepia}) saturate(${currentTheme.saturate})`
    : 'none';

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      
      {/* 1. THE CINEMATIC BACKGROUND (Direct Image) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.img 
            key={bgImage}
            src={bgImage} 
            alt={bgAlt} 
            style={{ filter: bgFilterStyle }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover object-[center_15%]"
          />
        </AnimatePresence>
        {/* 2. THE ELITE GRADIENT OVERLAY (Pro-Tip) */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" 
        />
        {/* 3. VIGNETTE FOR FOCUS */}
        <div 
          className="absolute inset-0 bg-radial-vignette pointer-events-none" 
        />
      </div>

      {/* 4. THE CONTENT LAYER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 w-full min-h-[100dvh] lg:h-screen p-0 flex flex-col"
      >
        {children}
      </motion.div>

      <style jsx>{`
        .bg-radial-vignette {
          background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%);
        }
      `}</style>
    </div>
  );
}
