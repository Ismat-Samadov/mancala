'use client';

import { motion } from 'framer-motion';

interface PauseScreenProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

/** Pause overlay shown when the game is paused. */
export default function PauseScreen({ onResume, onRestart, onMenu }: PauseScreenProps) {
  return (
    <motion.div
      key="pause"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-card rounded-2xl p-8 sm:p-10 flex flex-col items-center gap-6 w-full max-w-xs"
      >
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold neon-gold tracking-widest">PAUSED</h2>
        <p className="text-sm text-gray-500 tracking-widest">Game is on hold</p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <motion.button
            onClick={onResume}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={[
              'btn-neon w-full py-3 rounded-xl border-2 border-cyan-500',
              'text-base font-bold neon-cyan tracking-widest',
              'bg-cyan-950 hover:bg-cyan-900 transition-colors',
              'touch-feedback focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
            ].join(' ')}
          >
            ▶ RESUME
          </motion.button>

          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={[
              'btn-neon w-full py-3 rounded-xl border-2 border-purple-700',
              'text-base font-bold text-purple-400 tracking-widest',
              'hover:border-purple-500 hover:text-purple-300 transition-colors',
              'touch-feedback focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
            ].join(' ')}
          >
            ↺ RESTART
          </motion.button>

          <motion.button
            onClick={onMenu}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={[
              'btn-neon w-full py-3 rounded-xl border-2 border-gray-700',
              'text-base font-bold text-gray-400 tracking-widest',
              'hover:border-gray-500 hover:text-gray-300 transition-colors',
              'touch-feedback focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
            ].join(' ')}
          >
            ☰ MAIN MENU
          </motion.button>
        </div>

        <p className="text-[9px] text-gray-700 tracking-widest uppercase">
          Press Space to resume
        </p>
      </motion.div>
    </motion.div>
  );
}
