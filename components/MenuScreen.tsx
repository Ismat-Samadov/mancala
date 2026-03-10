'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GameMode, Difficulty } from '@/lib/constants';

interface MenuScreenProps {
  highScore: { p1: number; p2: number };
  onStart: (mode: GameMode, difficulty: Difficulty) => void;
}

const DIFFICULTIES: { value: Difficulty; label: string; desc: string; color: string }[] = [
  { value: 'easy', label: 'EASY', desc: 'Casual play', color: 'text-green-400 border-green-700 hover:border-green-400' },
  { value: 'medium', label: 'MEDIUM', desc: 'Balanced', color: 'text-yellow-400 border-yellow-700 hover:border-yellow-400' },
  { value: 'hard', label: 'HARD', desc: 'Merciless AI', color: 'text-red-400 border-red-700 hover:border-red-400' },
];

/** Main menu screen — pick mode and difficulty, see high scores. */
export default function MenuScreen({ highScore, onStart }: MenuScreenProps) {
  const [mode, setMode] = useState<GameMode>('pvc');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  return (
    <motion.div
      key="menu"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-md mx-auto px-4"
    >
      {/* Title */}
      <div className="flex flex-col items-center gap-1">
        <motion.h1
          className="text-5xl sm:text-7xl font-bold neon-cyan tracking-widest"
          animate={{ textShadow: [
            '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 40px #00f5ff',
            '0 0 20px #00f5ff, 0 0 40px #00f5ff, 0 0 80px #00f5ff',
            '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 40px #00f5ff',
          ]}}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          MANCALA
        </motion.h1>
        <p className="text-xs sm:text-sm text-gray-500 tracking-widest uppercase">
          Neon Pits — Ancient Strategy
        </p>
      </div>

      {/* Mode selection */}
      <div className="w-full glass-card rounded-xl p-4 flex flex-col gap-3">
        <h2 className="text-xs text-gray-500 tracking-widest uppercase text-center">Game Mode</h2>
        <div className="flex gap-3">
          {[
            { value: 'pvc' as GameMode, label: 'VS AI', icon: '🤖', desc: 'Challenge the computer' },
            { value: 'pvp' as GameMode, label: 'VS HUMAN', icon: '👤', desc: '2 players, same screen' },
          ].map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={[
                'flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all duration-200',
                'btn-neon touch-feedback focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                mode === m.value
                  ? 'border-cyan-400 bg-cyan-950 text-cyan-300'
                  : 'border-gray-800 text-gray-500 hover:border-gray-600',
              ].join(' ')}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="text-xs font-bold tracking-wider">{m.label}</span>
              <span className="text-[9px] text-center opacity-70">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty selection (only shown for PvC) */}
      <motion.div
        className="w-full"
        animate={{ opacity: mode === 'pvc' ? 1 : 0.3, y: mode === 'pvc' ? 0 : -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="glass-card rounded-xl p-4 flex flex-col gap-3">
          <h2 className="text-xs text-gray-500 tracking-widest uppercase text-center">
            AI Difficulty
          </h2>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => mode === 'pvc' && setDifficulty(d.value)}
                disabled={mode !== 'pvc'}
                className={[
                  'flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl border-2 transition-all duration-200',
                  'btn-neon touch-feedback focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                  difficulty === d.value && mode === 'pvc'
                    ? `border-current ${d.color} bg-opacity-10`
                    : 'border-gray-800 text-gray-600',
                  mode !== 'pvc' ? 'cursor-not-allowed' : 'cursor-pointer',
                  d.color,
                ].join(' ')}
              >
                <span className="text-[11px] font-bold tracking-wider">{d.label}</span>
                <span className="text-[9px] opacity-70">{d.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* How to play */}
      <div className="glass-card rounded-xl p-4 w-full text-xs text-gray-500 flex flex-col gap-1.5">
        <h2 className="text-[10px] text-gray-400 tracking-widest uppercase mb-1 text-center">
          How to Play
        </h2>
        <p>• Pick a pit on your side (bottom row) to sow seeds counter-clockwise.</p>
        <p>• Land your last seed in your store → earn an <span className="text-yellow-400">extra turn</span>.</p>
        <p>• Land in an empty pit on your side → <span className="text-orange-400">capture</span> opposite seeds.</p>
        <p>• When one side is empty, game ends. Most seeds in store <span className="text-cyan-400">wins</span>.</p>
      </div>

      {/* High scores */}
      {(highScore.p1 > 0 || highScore.p2 > 0) && (
        <div className="glass-card rounded-xl px-6 py-3 w-full flex justify-around items-center">
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-purple-500 tracking-widest uppercase">Best AI</span>
            <span className="text-xl font-bold neon-purple">{highScore.p2}</span>
          </div>
          <span className="text-gray-700 text-xs tracking-widest">HIGH SCORES</span>
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-cyan-500 tracking-widest uppercase">Best YOU</span>
            <span className="text-xl font-bold neon-cyan">{highScore.p1}</span>
          </div>
        </div>
      )}

      {/* Start button */}
      <motion.button
        onClick={() => onStart(mode, difficulty)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={[
          'btn-neon w-full py-4 rounded-xl border-2 border-cyan-500',
          'text-lg sm:text-xl font-bold neon-cyan tracking-widest',
          'bg-cyan-950 hover:bg-cyan-900 transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
          'touch-feedback',
        ].join(' ')}
      >
        ▶ START GAME
      </motion.button>

      {/* Keyboard hint */}
      <p className="text-[9px] text-gray-700 tracking-widest uppercase text-center">
        Keyboard: 1–6 = pick pit · Space = pause · M = mute
      </p>
    </motion.div>
  );
}
