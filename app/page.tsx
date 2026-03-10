'use client';

/**
 * Main page — orchestrates the entire Mancala game.
 * Renders the correct screen (menu / playing / paused / gameover)
 * and handles keyboard shortcuts.
 */

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { useGame } from '@/hooks/useGame';
import Starfield from '@/components/Starfield';
import MenuScreen from '@/components/MenuScreen';
import GameBoard from '@/components/GameBoard';
import HUD from '@/components/HUD';
import PauseScreen from '@/components/PauseScreen';
import GameOverScreen from '@/components/GameOverScreen';
import { PLAYER_1 } from '@/lib/constants';

export default function Home() {
  const {
    board,
    gameState,
    config,
    highScore,
    isAIThinking,
    startGame,
    makePlayerMove,
    pauseGame,
    resumeGame,
    restartGame,
    goToMenu,
    isMuted,
    toggleMute,
  } = useGame();

  // ── Keyboard controls ──────────────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Prevent browser shortcuts from interfering while game is running
      if (['1', '2', '3', '4', '5', '6', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        // Space: pause / resume
        case ' ':
          if (gameState === 'playing') pauseGame();
          else if (gameState === 'paused') resumeGame();
          break;

        // M: toggle mute
        case 'm':
        case 'M':
          toggleMute();
          break;

        // Escape: pause from playing, resume from pause
        case 'Escape':
          if (gameState === 'playing') pauseGame();
          else if (gameState === 'paused') resumeGame();
          break;

        // R: restart
        case 'r':
        case 'R':
          if (gameState === 'playing' || gameState === 'paused' || gameState === 'gameover') {
            restartGame();
          }
          break;

        // Number keys 1-6: pick P1 pit (index = key - 1)
        case '1': case '2': case '3': case '4': case '5': case '6':
          if (gameState === 'playing' && board.currentPlayer === PLAYER_1 && !isAIThinking) {
            makePlayerMove(Number(e.key) - 1);
          }
          break;

        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, board.currentPlayer, isAIThinking, pauseGame, resumeGame, restartGame, toggleMute, makePlayerMove]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background */}
      <Starfield />

      {/* Content layer */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center gap-4 px-3 py-6 sm:py-10">

        {/* Minimal brand header (visible during game) */}
        {gameState !== 'menu' && (
          <div className="flex items-center gap-2 self-start">
            <span className="text-lg sm:text-2xl font-bold neon-cyan tracking-widest">MANCALA</span>
            <span className="text-[9px] text-gray-600 tracking-widest uppercase self-end mb-0.5">
              Neon Pits
            </span>
          </div>
        )}

        {/* Screen content */}
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <MenuScreen
              key="menu"
              highScore={highScore}
              onStart={startGame}
            />
          )}

          {(gameState === 'playing' || gameState === 'paused' || gameState === 'gameover') && (
            <div key="game" className="w-full flex flex-col gap-4">
              {/* HUD: scores + controls */}
              <HUD
                board={board}
                gameMode={config.mode}
                difficulty={config.difficulty}
                highScore={highScore}
                isMuted={isMuted}
                onToggleMute={toggleMute}
                onPause={pauseGame}
              />

              {/* Game board */}
              <GameBoard
                board={board}
                gameMode={config.mode}
                isAIThinking={isAIThinking}
                onPitClick={makePlayerMove}
              />

              {/* Keyboard hint */}
              <p className="text-center text-[9px] text-gray-700 tracking-widest uppercase">
                Keys 1–6 = pits · Space = pause · M = mute · R = restart
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pause overlay */}
      <AnimatePresence>
        {gameState === 'paused' && (
          <PauseScreen
            key="pause"
            onResume={resumeGame}
            onRestart={restartGame}
            onMenu={goToMenu}
          />
        )}
      </AnimatePresence>

      {/* Game over overlay */}
      <AnimatePresence>
        {gameState === 'gameover' && (
          <GameOverScreen
            key="gameover"
            winner={board.winner}
            p1Score={board.pits[6]}
            p2Score={board.pits[13]}
            gameMode={config.mode}
            onRestart={restartGame}
            onMenu={goToMenu}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
