import { motion } from "framer-motion";

export default function DashboardLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-black text-gold-200 overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/castle-bg.png')] bg-cover bg-center opacity-30" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />

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
