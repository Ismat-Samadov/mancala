'use client';

import { motion } from 'framer-motion';
import type { Player } from '@/lib/gameLogic';
import type { GameMode } from '@/lib/constants';

interface GameOverScreenProps {
  winner: Player | 'draw' | null;
  p1Score: number;
  p2Score: number;
  gameMode: GameMode;
  onRestart: () => void;
  onMenu: () => void;
}

/** Animated game-over overlay shown after the game ends. */
export default function GameOverScreen({
  winner,
  p1Score,
  p2Score,
  gameMode,
  onRestart,
  onMenu,
}: GameOverScreenProps) {
  const p2Label = gameMode === 'pvc' ? 'AI' : 'Player 2';

  const headline =
    winner === 'draw'
      ? "IT'S A DRAW!"
      : winner === 1
      ? '🏆 YOU WIN!'
      : `💀 ${p2Label.toUpperCase()} WINS!`;

  const subtext =
    winner === 'draw'
      ? 'Equal seeds — a perfect match.'
      : winner === 1
      ? 'Masterful strategy!'
      : 'Better luck next time.';

  const headlineColor =
    winner === 'draw' ? 'neon-gold' : winner === 1 ? 'neon-cyan' : 'neon-purple';

  return (
    <motion.div
      key="gameover"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <div className="glass-card rounded-2xl p-8 sm:p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        {/* Winner headline */}
        <motion.h2
          className={`text-3xl sm:text-4xl font-bold tracking-widest text-center ${headlineColor} winner-glow`}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {headline}
        </motion.h2>

        <p className="text-sm text-gray-400 text-center tracking-wide">{subtext}</p>

        {/* Score comparison */}
        <div className="flex items-center gap-6 w-full justify-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-purple-500 tracking-widest uppercase">{p2Label}</span>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold neon-purple tabular-nums"
            >
              {p2Score}
            </motion.span>
          </div>

          <span className="text-gray-600 text-sm font-bold">vs</span>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-cyan-500 tracking-widest uppercase">YOU</span>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold neon-cyan tabular-nums"
            >
              {p1Score}
            </motion.span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 w-full">
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={[
              'btn-neon w-full py-3 rounded-xl border-2 border-cyan-500',
              'text-base font-bold neon-cyan tracking-widest',
              'bg-cyan-950 hover:bg-cyan-900 transition-colors',
              'touch-feedback focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
            ].join(' ')}
          >
            ↺ PLAY AGAIN
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
      </div>
    </motion.div>
  );
}
