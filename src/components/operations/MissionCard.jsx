import { motion } from "framer-motion";
import { Timer, Zap } from "lucide-react";

export default function MissionCard({ task, onComplete }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-black/60 backdrop-blur-xl border border-gold-core/20 
                 p-6 rounded-lg shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gold-core/40" />
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white font-display text-lg tracking-wide group-hover:text-gold-bright transition-colors">
          {task.title}
        </h3>
        <Zap size={16} className="text-gold-core opacity-50" />
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-gray-400 mb-6">
        <div className="flex items-center gap-1">
          <Timer size={12} />
          <span>{task.time || 15} MIN STRIKE</span>
        </div>
        <div className="h-1 w-1 rounded-full bg-gold-core/30" />
        <span>75% COMPLETE</span>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onComplete(task.id)}
          className="flex-1 px-4 py-2 bg-gold-core/10 border border-gold-core/40 
                     rounded text-gold-bright text-[10px] font-mono tracking-widest
                     hover:bg-gold-core/20 transition-all uppercase"
        >
          Execute
        </motion.button>
        <button className="px-3 py-2 bg-white/5 rounded border border-white/10 text-white/40 hover:text-white transition-colors">
           ...
        </button>
      </div>
      
      {/* Ambient background glow */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold-core/5 blur-3xl rounded-full" />
    </motion.div>
  );
}
