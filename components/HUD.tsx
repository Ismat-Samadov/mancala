'use client';

import { motion } from 'framer-motion';
import type { GameBoard } from '@/lib/gameLogic';
import type { GameMode, Difficulty } from '@/lib/constants';

interface HUDProps {
  board: GameBoard;
  gameMode: GameMode;
  difficulty: Difficulty;
  highScore: { p1: number; p2: number };
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
}

/** Displays scores, current turn indicator, and control buttons. */
export default function HUD({
  board,
  gameMode,
  difficulty,
  highScore,
  isMuted,
  onToggleMute,
  onPause,
}: HUDProps) {
  const { currentPlayer, pits, isGameOver, extraTurn } = board;
  const p1Score = pits[6];
  const p2Score = pits[13];
  const p2Label = gameMode === 'pvc' ? 'AI' : 'P2';

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Score row */}
      <div className="flex items-center justify-between gap-3 glass-card rounded-xl px-4 py-2">
        {/* P2 score */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] sm:text-xs text-purple-500 tracking-widest uppercase font-bold">
            {p2Label}
          </span>
          <motion.span
            key={p2Score}
            initial={{ scale: 1.3, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl sm:text-3xl font-bold neon-purple tabular-nums"
          >
            {p2Score}
          </motion.span>
          <span className="text-[9px] text-purple-700">Best: {highScore.p2}</span>
        </div>

        {/* Center status */}
        <div className="flex-1 flex flex-col items-center gap-1">
          {isGameOver ? (
            <span className="text-xs sm:text-sm neon-gold tracking-widest font-bold">
              GAME OVER
            </span>
          ) : (
            <>
              <motion.div
                key={`${currentPlayer}-${extraTurn}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-0.5"
              >
                <span
                  className={[
                    'text-[10px] sm:text-xs tracking-widest uppercase font-semibold',
                    currentPlayer === 1 ? 'text-cyan-400' : 'text-purple-400',
                  ].join(' ')}
                >
                  {currentPlayer === 1 ? "YOUR TURN" : `${p2Label}'S TURN`}
                </span>
                {extraTurn && (
                  <span className="text-[9px] neon-gold tracking-wider animate-pulse">
                    EXTRA TURN!
                  </span>
                )}
              </motion.div>

              {/* Turn indicator dots */}
              <div className="flex gap-1.5">
                <div
                  className={[
                    'w-2 h-2 rounded-full transition-all duration-300',
                    currentPlayer === 1
                      ? 'bg-cyan-400 shadow-[0_0_6px_#00f5ff] scale-125'
                      : 'bg-cyan-900',
                  ].join(' ')}
                />
                <div
                  className={[
                    'w-2 h-2 rounded-full transition-all duration-300',
                    currentPlayer === 2
                      ? 'bg-purple-400 shadow-[0_0_6px_#bf00ff] scale-125'
                      : 'bg-purple-900',
                  ].join(' ')}
                />
              </div>
            </>
          )}

          {/* Difficulty badge */}
          {gameMode === 'pvc' && (
            <span className="text-[9px] sm:text-[10px] text-gray-600 uppercase tracking-widest">
              {difficulty}
            </span>
          )}
        </div>

        {/* P1 score */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] sm:text-xs text-cyan-500 tracking-widest uppercase font-bold">
            YOU
          </span>
          <motion.span
            key={p1Score}
            initial={{ scale: 1.3, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl sm:text-3xl font-bold neon-cyan tabular-nums"
          >
            {p1Score}
          </motion.span>
          <span className="text-[9px] text-cyan-700">Best: {highScore.p1}</span>
        </div>
      </div>

      {/* Control buttons row */}
      <div className="flex justify-center gap-3">
        {/* Pause button */}
        <button
          onClick={onPause}
          className="btn-neon glass-card rounded-lg px-4 py-1.5 text-xs sm:text-sm text-cyan-400 border border-cyan-800 hover:border-cyan-500 hover:text-cyan-300 transition-colors touch-feedback focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Pause game"
        >
          ⏸ PAUSE
        </button>

        {/* Mute toggle */}
        <button
          onClick={onToggleMute}
          className={[
            'btn-neon glass-card rounded-lg px-4 py-1.5 text-xs sm:text-sm border transition-colors',
            'touch-feedback focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
            isMuted
              ? 'text-gray-600 border-gray-900'
              : 'neon-cyan border-cyan-900 hover:border-cyan-700',
          ].join(' ')}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
        >
          {isMuted ? '🔇 MUTED' : '🔊 SOUND'}
        </button>
      </div>
    </div>
  );
}
