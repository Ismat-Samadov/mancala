'use client';

import { motion } from 'framer-motion';
import type { GameBoard as GameBoardState } from '@/lib/gameLogic';
import type { GameMode } from '@/lib/constants';
import { PLAYER_1, PLAYER_2 } from '@/lib/constants';
import Pit from './Pit';
import Store from './Store';

interface GameBoardProps {
  board: GameBoardState;
  gameMode: GameMode;
  isAIThinking: boolean;
  onPitClick: (pitIndex: number) => void;
}

/**
 * Renders the full Mancala board:
 *   [P2 store] [P2 pits: 12,11,10,9,8,7] [P1 pits: 0,1,2,3,4,5] [P1 store]
 * P2 pits run right-to-left from P2's perspective (indices 12→7 shown left→right).
 */
export default function GameBoard({ board, gameMode, isAIThinking, onPitClick }: GameBoardProps) {
  const { pits, currentPlayer, isGameOver, capturedPits, lastMove } = board;

  // P2 pits displayed left→right as 12, 11, 10, 9, 8, 7
  const p2DisplayOrder = [12, 11, 10, 9, 8, 7];
  // P1 pits displayed left→right as 0, 1, 2, 3, 4, 5
  const p1DisplayOrder = [0, 1, 2, 3, 4, 5];

  /**
   * A pit is clickable when:
   * - Game is not over
   * - It is the current player's pit
   * - It has seeds
   * - If PvC, P2's pits are never directly clickable (AI controls P2)
   * - Not waiting for AI
   */
  function isPitClickable(pitIndex: number, pitPlayer: 1 | 2): boolean {
    if (isGameOver) return false;
    if (currentPlayer !== pitPlayer) return false;
    if (pits[pitIndex] === 0) return false;
    if (isAIThinking) return false;
    if (gameMode === 'pvc' && pitPlayer === PLAYER_2) return false;
    return true;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="glass-card board-glow rounded-2xl p-3 sm:p-4 md:p-6 no-select w-full"
    >
      {/* Board inner grid: stores on sides, pits in center */}
      <div className="flex items-stretch gap-2 sm:gap-3 md:gap-4">

        {/* P2 Store (left side) */}
        <Store
          count={pits[13]}
          player={PLAYER_2}
          isCurrentPlayer={currentPlayer === PLAYER_2 && !isGameOver}
          label={gameMode === 'pvc' ? 'AI' : 'P2'}
        />

        {/* Center: two rows of pits */}
        <div className="flex-1 flex flex-col gap-2 sm:gap-3">
          {/* AI thinking indicator */}
          {isAIThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 py-0.5"
            >
              <span className="text-xs neon-purple tracking-widest uppercase animate-pulse">
                AI Thinking…
              </span>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </motion.div>
          )}

          {/* P2 pits (top row) — displayed 12→7 left to right */}
          <div
            className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3"
            aria-label="Player 2 pits"
          >
            {p2DisplayOrder.map((pitIdx) => (
              <Pit
                key={pitIdx}
                index={pitIdx}
                count={pits[pitIdx]}
                player={PLAYER_2}
                isClickable={isPitClickable(pitIdx, PLAYER_2)}
                isLastMove={lastMove === pitIdx}
                isCaptured={capturedPits.includes(pitIdx)}
                onClick={() => onPitClick(pitIdx)}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-900 to-transparent opacity-60" />

          {/* P1 pits (bottom row) — displayed 0→5 left to right */}
          <div
            className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3"
            aria-label="Player 1 pits"
          >
            {p1DisplayOrder.map((pitIdx) => (
              <Pit
                key={pitIdx}
                index={pitIdx}
                count={pits[pitIdx]}
                player={PLAYER_1}
                isClickable={isPitClickable(pitIdx, PLAYER_1)}
                isLastMove={lastMove === pitIdx}
                isCaptured={capturedPits.includes(pitIdx)}
                onClick={() => onPitClick(pitIdx)}
              />
            ))}
          </div>
        </div>

        {/* P1 Store (right side) */}
        <Store
          count={pits[6]}
          player={PLAYER_1}
          isCurrentPlayer={currentPlayer === PLAYER_1 && !isGameOver}
          label="YOU"
        />
      </div>

      {/* Board legend */}
      <div className="flex justify-between mt-2 sm:mt-3 px-2">
        <span className="text-[9px] sm:text-[10px] text-purple-600 tracking-widest uppercase">
          ← {gameMode === 'pvc' ? 'AI' : 'P2'} moves right to left
        </span>
        <span className="text-[9px] sm:text-[10px] text-cyan-600 tracking-widest uppercase">
          YOU move left to right →
        </span>
      </div>
    </motion.div>
  );
}
