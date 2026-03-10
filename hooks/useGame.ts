'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type GameBoard,
  createInitialBoard,
  isValidMove,
  makeMove,
} from '@/lib/gameLogic';
import { getBestMove } from '@/lib/aiPlayer';
import {
  type Difficulty,
  type GameMode,
  type GameState,
  PLAYER_2,
} from '@/lib/constants';
import { useSound } from '@/hooks/useSound';

const HIGH_SCORE_KEY = 'mancala-highscore';

interface HighScore {
  p1: number;
  p2: number;
}

interface Config {
  mode: GameMode;
  difficulty: Difficulty;
}

interface UseGameReturn {
  board: GameBoard;
  gameState: GameState;
  config: Config;
  highScore: HighScore;
  isAIThinking: boolean;
  startGame: (mode: GameMode, difficulty: Difficulty) => void;
  makePlayerMove: (pitIndex: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  goToMenu: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  playSeedDrop: () => void;
}

export function useGame(): UseGameReturn {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [config, setConfig] = useState<Config>({ mode: 'pvp', difficulty: 'medium' });
  const [board, setBoard] = useState<GameBoard>(createInitialBoard);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [highScore, setHighScore] = useState<HighScore>({ p1: 0, p2: 0 });

  const configRef = useRef(config);
  configRef.current = config;

  const {
    isMuted,
    toggleMute,
    playSeedDrop,
    playCapture,
    playExtraTurn,
    playWin,
    playLose,
  } = useSound({ enabled: true });

  // Load high score from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(HIGH_SCORE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as HighScore;
        setHighScore(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const persistHighScore = useCallback((updated: HighScore) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(updated));
    } catch {
      // ignore write errors
    }
    setHighScore(updated);
  }, []);

  const handleGameOver = useCallback(
    (finalBoard: GameBoard, currentHighScore: HighScore) => {
      const p1Score = finalBoard.pits[6];
      const p2Score = finalBoard.pits[13];

      const updated: HighScore = {
        p1: Math.max(currentHighScore.p1, p1Score),
        p2: Math.max(currentHighScore.p2, p2Score),
      };
      persistHighScore(updated);

      // Play win/lose based on P1 result
      if (finalBoard.winner === 1) {
        playWin();
      } else {
        playLose();
      }

      setGameState('gameover');
    },
    [persistHighScore, playWin, playLose],
  );

  /**
   * Recursively execute AI moves (handles extra turns) with delays between each.
   */
  const runAIMoves = useCallback(
    (currentBoard: GameBoard, currentHighScore: HighScore, delay: number) => {
      if (currentBoard.isGameOver) {
        setIsAIThinking(false);
        handleGameOver(currentBoard, currentHighScore);
        return;
      }
      if (currentBoard.currentPlayer !== PLAYER_2) {
        setIsAIThinking(false);
        return;
      }

      setTimeout(() => {
        const aiPit = getBestMove(currentBoard, configRef.current.difficulty, PLAYER_2);
        if (aiPit === -1) {
          setIsAIThinking(false);
          return;
        }

        const afterAI = makeMove(currentBoard, aiPit);

        playSeedDrop();
        if (afterAI.capturedPits.length > 0) playCapture();
        if (afterAI.extraTurn) playExtraTurn();

        setBoard(afterAI);

        if (afterAI.isGameOver) {
          setIsAIThinking(false);
          handleGameOver(afterAI, currentHighScore);
          return;
        }

        if (afterAI.extraTurn && afterAI.currentPlayer === PLAYER_2) {
          // AI gets another turn — recurse with shorter delay
          runAIMoves(afterAI, currentHighScore, 400);
        } else {
          setIsAIThinking(false);
        }
      }, delay);
    },
    [handleGameOver, playCapture, playExtraTurn, playSeedDrop],
  );

  const startGame = useCallback((mode: GameMode, difficulty: Difficulty) => {
    setConfig({ mode, difficulty });
    setBoard(createInitialBoard());
    setIsAIThinking(false);
    setGameState('playing');
  }, []);

  const makePlayerMove = useCallback(
    (pitIndex: number) => {
      if (gameState !== 'playing') return;

      setBoard((prev) => {
        if (!isValidMove(prev, pitIndex)) return prev;

        const next = makeMove(prev, pitIndex);

        playSeedDrop();
        if (next.capturedPits.length > 0) playCapture();
        if (next.extraTurn) playExtraTurn();

        if (next.isGameOver) {
          // handleGameOver is called outside setState via a queued effect
          return next;
        }

        // If PvC and it's now AI's turn, schedule AI thinking
        const currentCfg = configRef.current;
        if (
          currentCfg.mode === 'pvc' &&
          next.currentPlayer === PLAYER_2 &&
          !next.isGameOver
        ) {
          setIsAIThinking(true);
        }

        return next;
      });
    },
    [gameState, playCapture, playExtraTurn, playSeedDrop],
  );

  // Watch board changes to trigger game-over handling and AI moves
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (board.isGameOver) {
      handleGameOver(board, highScore);
      return;
    }

    if (
      config.mode === 'pvc' &&
      board.currentPlayer === PLAYER_2 &&
      isAIThinking
    ) {
      runAIMoves(board, highScore, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, isAIThinking]);

  const pauseGame = useCallback(() => {
    setGameState((prev) => (prev === 'playing' ? 'paused' : prev));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState((prev) => (prev === 'paused' ? 'playing' : prev));
  }, []);

  const restartGame = useCallback(() => {
    setBoard(createInitialBoard());
    setIsAIThinking(false);
    setGameState('playing');
  }, []);

  const goToMenu = useCallback(() => {
    setBoard(createInitialBoard());
    setIsAIThinking(false);
    setGameState('menu');
  }, []);

  return {
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
    playSeedDrop,
  };
}
