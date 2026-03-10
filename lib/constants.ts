/**
 * Game constants for Mancala
 */

/** Number of pits per player (excluding store) */
export const PITS_PER_SIDE = 6;

/** Initial number of seeds in each pit */
export const INITIAL_SEEDS = 4;

/** Total pits on board (6 pits per side + 2 stores) */
export const TOTAL_PITS = 14;

/** Index of Player 1's store (bottom player) */
export const P1_STORE = 6;

/** Index of Player 2's store (top player) */
export const P2_STORE = 13;

/** Player indices */
export const PLAYER_1 = 1;
export const PLAYER_2 = 2;

/** Pit indices for each player */
export const P1_PITS = [0, 1, 2, 3, 4, 5]; // bottom row (left to right)
export const P2_PITS = [7, 8, 9, 10, 11, 12]; // top row (right to left in board view)

/** Difficulty levels */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** Game modes */
export type GameMode = 'pvp' | 'pvc';

/** Game states */
export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

/** AI think depth per difficulty */
export const AI_DEPTH: Record<Difficulty, number> = {
  easy: 2,
  medium: 4,
  hard: 7,
};

/** Neon color palette for seeds */
export const SEED_COLORS = [
  '#00f5ff', // cyan
  '#bf00ff', // purple
  '#ffd700', // gold
  '#00ff88', // green
  '#ff0080', // pink
  '#ff6600', // orange
  '#00aaff', // blue
];

/** Animation durations in ms */
export const ANIM = {
  seedMove: 400,
  turnChange: 600,
  capture: 500,
  gameOver: 800,
};
