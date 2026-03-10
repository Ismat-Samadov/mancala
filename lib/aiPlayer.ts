/**
 * AI player using Minimax algorithm with Alpha-Beta pruning
 * Supports easy, medium, and hard difficulty levels
 */

import {
  GameBoard,
  makeMove,
  getValidMoves,
  evaluateBoard,
  Player,
} from './gameLogic';
import { Difficulty, AI_DEPTH, PLAYER_1, PLAYER_2 } from './constants';

/**
 * Returns the best move for the AI player using Minimax + Alpha-Beta pruning
 * @param board - Current game board
 * @param difficulty - AI difficulty level
 * @param aiPlayer - Which player the AI is (usually PLAYER_2)
 */
export function getBestMove(
  board: GameBoard,
  difficulty: Difficulty,
  aiPlayer: Player = PLAYER_2
): number {
  const depth = AI_DEPTH[difficulty];
  const validMoves = getValidMoves(board);

  if (validMoves.length === 0) return -1;

  // Easy mode: sometimes pick random move (40% random)
  if (difficulty === 'easy' && Math.random() < 0.4) {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  // Medium mode: sometimes pick random move (15% random)
  if (difficulty === 'medium' && Math.random() < 0.15) {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  const isMaximizing = aiPlayer === PLAYER_1;
  let bestMove = validMoves[0];
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const move of validMoves) {
    const newBoard = makeMove(board, move);
    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, !isMaximizing, aiPlayer);

    if (isMaximizing ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Minimax algorithm with Alpha-Beta pruning
 */
function minimax(
  board: GameBoard,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  // Terminal conditions
  if (depth === 0 || board.isGameOver) {
    return evaluateBoard(board);
  }

  const validMoves = getValidMoves(board);

  // If no valid moves (shouldn't happen normally)
  if (validMoves.length === 0) {
    return evaluateBoard(board);
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of validMoves) {
      const newBoard = makeMove(board, move);
      // If extra turn granted, same player still maximizing
      const nextIsMaximizing =
        newBoard.currentPlayer === (aiPlayer === PLAYER_1 ? PLAYER_1 : PLAYER_2)
          ? isMaximizing
          : !isMaximizing;
      const score = minimax(newBoard, depth - 1, alpha, beta, nextIsMaximizing, aiPlayer);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Alpha-Beta pruning
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of validMoves) {
      const newBoard = makeMove(board, move);
      const nextIsMaximizing =
        newBoard.currentPlayer === (aiPlayer === PLAYER_1 ? PLAYER_1 : PLAYER_2)
          ? isMaximizing
          : !isMaximizing;
      const score = minimax(newBoard, depth - 1, alpha, beta, nextIsMaximizing, aiPlayer);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha-Beta pruning
    }
    return minScore;
  }
}
