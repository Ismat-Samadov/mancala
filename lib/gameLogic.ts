/**
 * Core Mancala game logic
 *
 * Board layout (indices 0-13):
 *   P2 store (13) | P2 pits [12,11,10,9,8,7] | P1 pits [0,1,2,3,4,5] | P1 store (6)
 *
 * Seeds move counter-clockwise:
 *   P1: 0 → 1 → 2 → 3 → 4 → 5 → 6(store) → 7 → 8 → ... → 12 → (skip 13) → 0
 *   P2: 7 → 8 → ... → 12 → 13(store) → 0 → 1 → ... → 5 → (skip 6) → 7
 */

import {
  TOTAL_PITS,
  P1_STORE,
  P2_STORE,
  P1_PITS,
  P2_PITS,
  PLAYER_1,
  PLAYER_2,
  INITIAL_SEEDS,
  PITS_PER_SIDE,
} from './constants';

export type Player = 1 | 2;

export interface GameBoard {
  /** Array of 14 pit counts: [P1 pits 0-5, P1 store 6, P2 pits 7-12, P2 store 13] */
  pits: number[];
  /** Current player's turn */
  currentPlayer: Player;
  /** Whether the game is over */
  isGameOver: boolean;
  /** Winner (null if draw or game not over) */
  winner: Player | null | 'draw';
  /** Last pit index moved (for highlighting) */
  lastMove: number | null;
  /** Indices of pits that were captured */
  capturedPits: number[];
  /** Extra turn bonus triggered */
  extraTurn: boolean;
}

/**
 * Creates the initial game board state
 */
export function createInitialBoard(): GameBoard {
  const pits = new Array(TOTAL_PITS).fill(INITIAL_SEEDS);
  // Stores start empty
  pits[P1_STORE] = 0;
  pits[P2_STORE] = 0;
  return {
    pits,
    currentPlayer: PLAYER_1,
    isGameOver: false,
    winner: null,
    lastMove: null,
    capturedPits: [],
    extraTurn: false,
  };
}

/**
 * Returns whether a pit index belongs to the given player
 */
export function pitBelongsToPlayer(pitIndex: number, player: Player): boolean {
  if (player === PLAYER_1) return P1_PITS.includes(pitIndex);
  return P2_PITS.includes(pitIndex);
}

/**
 * Returns the store index for a given player
 */
export function getStoreIndex(player: Player): number {
  return player === PLAYER_1 ? P1_STORE : P2_STORE;
}

/**
 * Returns the opposite pit index (used for captures)
 * Opposite of pit i is pit (12 - i) for i in [0..5] and [7..12]
 */
export function getOppositePit(pitIndex: number): number {
  // P1 pits 0-5, P2 pits 7-12 are mirrors
  if (pitIndex <= 5) return 12 - pitIndex;
  if (pitIndex >= 7 && pitIndex <= 12) return 12 - pitIndex;
  return -1; // stores have no opposite
}

/**
 * Gets the next pit index in sowing direction, skipping the opponent's store
 */
export function getNextPit(current: number, currentPlayer: Player): number {
  const next = (current + 1) % TOTAL_PITS;
  // Skip opponent's store
  if (currentPlayer === PLAYER_1 && next === P2_STORE) {
    return (next + 1) % TOTAL_PITS;
  }
  if (currentPlayer === PLAYER_2 && next === P1_STORE) {
    return (next + 1) % TOTAL_PITS;
  }
  return next;
}

/**
 * Checks if one side is completely empty (game end condition)
 */
export function isSideEmpty(pits: number[], player: Player): boolean {
  const side = player === PLAYER_1 ? P1_PITS : P2_PITS;
  return side.every((i) => pits[i] === 0);
}

/**
 * Performs the "sweep" move at game end: remaining seeds go to their owner's store
 */
export function sweepRemainingSeeds(pits: number[]): number[] {
  const newPits = [...pits];
  // Sweep P1 pits
  P1_PITS.forEach((i) => {
    newPits[P1_STORE] += newPits[i];
    newPits[i] = 0;
  });
  // Sweep P2 pits
  P2_PITS.forEach((i) => {
    newPits[P2_STORE] += newPits[i];
    newPits[i] = 0;
  });
  return newPits;
}

/**
 * Determines the winner based on store counts
 */
export function determineWinner(pits: number[]): Player | 'draw' {
  const p1Score = pits[P1_STORE];
  const p2Score = pits[P2_STORE];
  if (p1Score > p2Score) return PLAYER_1;
  if (p2Score > p1Score) return PLAYER_2;
  return 'draw';
}

/**
 * Validates whether a move is legal for the current player
 */
export function isValidMove(board: GameBoard, pitIndex: number): boolean {
  if (board.isGameOver) return false;
  if (!pitBelongsToPlayer(pitIndex, board.currentPlayer)) return false;
  return board.pits[pitIndex] > 0;
}

/**
 * Executes a move and returns the new board state
 * This is a pure function — does not mutate the input
 */
export function makeMove(board: GameBoard, pitIndex: number): GameBoard {
  if (!isValidMove(board, pitIndex)) return board;

  const newPits = [...board.pits];
  let seeds = newPits[pitIndex];
  newPits[pitIndex] = 0;

  let currentIndex = pitIndex;
  let capturedPits: number[] = [];
  let extraTurn = false;

  // Sow seeds
  while (seeds > 0) {
    currentIndex = getNextPit(currentIndex, board.currentPlayer);
    newPits[currentIndex]++;
    seeds--;
  }

  const lastPit = currentIndex;

  // Check extra turn: last seed landed in own store
  if (lastPit === getStoreIndex(board.currentPlayer)) {
    extraTurn = true;
  }

  // Check capture: last seed landed in empty pit on own side,
  // and the opposite pit has seeds
  if (
    !extraTurn &&
    pitBelongsToPlayer(lastPit, board.currentPlayer) &&
    newPits[lastPit] === 1
  ) {
    const oppositePit = getOppositePit(lastPit);
    if (oppositePit >= 0 && newPits[oppositePit] > 0) {
      // Capture both pits
      const store = getStoreIndex(board.currentPlayer);
      newPits[store] += newPits[lastPit] + newPits[oppositePit];
      capturedPits = [lastPit, oppositePit];
      newPits[lastPit] = 0;
      newPits[oppositePit] = 0;
    }
  }

  // Determine next player
  const nextPlayer: Player = extraTurn
    ? board.currentPlayer
    : board.currentPlayer === PLAYER_1
    ? PLAYER_2
    : PLAYER_1;

  // Check game over
  let isGameOver = false;
  let winner: Player | null | 'draw' = null;
  let finalPits = newPits;

  if (isSideEmpty(newPits, PLAYER_1) || isSideEmpty(newPits, PLAYER_2)) {
    isGameOver = true;
    finalPits = sweepRemainingSeeds(newPits);
    winner = determineWinner(finalPits);
  }

  return {
    pits: finalPits,
    currentPlayer: nextPlayer,
    isGameOver,
    winner,
    lastMove: pitIndex,
    capturedPits,
    extraTurn,
  };
}

/**
 * Returns all valid moves for the current player
 */
export function getValidMoves(board: GameBoard): number[] {
  const pits = board.currentPlayer === PLAYER_1 ? P1_PITS : P2_PITS;
  return pits.filter((i) => board.pits[i] > 0);
}

/**
 * Returns a score heuristic for the board (positive = good for P1, negative = good for P2)
 */
export function evaluateBoard(board: GameBoard): number {
  if (board.isGameOver) {
    if (board.winner === PLAYER_1) return 1000;
    if (board.winner === PLAYER_2) return -1000;
    return 0;
  }
  // Heuristic: store difference + positional bonuses
  const storeDiff = board.pits[P1_STORE] - board.pits[P2_STORE];

  // Bonus for seeds on your own side (mobility)
  const p1Side = P1_PITS.reduce((sum, i) => sum + board.pits[i], 0);
  const p2Side = P2_PITS.reduce((sum, i) => sum + board.pits[i], 0);
  const mobilityBonus = (p1Side - p2Side) * 0.1;

  // Bonus for extra turn opportunities
  let extraTurnBonus = 0;
  P1_PITS.forEach((i) => {
    const seeds = board.pits[i];
    // Seeds that would land exactly in P1 store
    if (seeds === P1_STORE - i) extraTurnBonus += 2;
  });
  P2_PITS.forEach((i) => {
    const seeds = board.pits[i];
    // Seeds that would land exactly in P2 store
    if (seeds === P2_STORE - i) extraTurnBonus -= 2;
  });

  return storeDiff + mobilityBonus + extraTurnBonus;
}

/**
 * Returns total seeds on the board (should always be 48)
 */
export function totalSeeds(pits: number[]): number {
  return pits.reduce((sum, n) => sum + n, 0);
}

/**
 * Returns player scores (store counts)
 */
export function getScores(pits: number[]): { p1: number; p2: number } {
  return { p1: pits[P1_STORE], p2: pits[P2_STORE] };
}

/**
 * Returns the total seeds (pits + store) for each player
 */
export function getTotalSeeds(pits: number[]): { p1: number; p2: number } {
  const p1Total = P1_PITS.reduce((s, i) => s + pits[i], pits[P1_STORE]);
  const p2Total = P2_PITS.reduce((s, i) => s + pits[i], pits[P2_STORE]);
  return { p1: p1Total, p2: p2Total };
}
