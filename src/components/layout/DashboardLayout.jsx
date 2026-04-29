import { motion } from "framer-motion";

export default function DashboardLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-black text-gold-200 overflow-hidden">
      
      {/* Background Layering (Dead Accurate Pro Tip) */}
      <div 
        className="absolute inset-0 bg-cover no-repeat opacity-60" 
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.3)), url('/castle-bg.png')`,
          backgroundPosition: 'center 15%'
        }} 
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 p-6 h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
