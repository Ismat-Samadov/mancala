'use client';

import { motion } from 'framer-motion';
import { SEED_COLORS } from '@/lib/constants';

interface PitProps {
  index: number;
  count: number;
  isClickable: boolean;
  isLastMove: boolean;
  isCaptured: boolean;
  player: 1 | 2;
  onClick: () => void;
}

/**
 * Returns a deterministic seed color based on pit index and seed position.
 */
function getSeedColor(pitIndex: number, seedPos: number): string {
  return SEED_COLORS[(pitIndex + seedPos) % SEED_COLORS.length];
}

/**
 * Renders up to 12 seeds as colored dots arranged in a grid.
 */
function SeedDots({ count, pitIndex }: { count: number; pitIndex: number }) {
  if (count === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-0.5 w-full px-1">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rounded-full shrink-0"
          style={{
            width: count <= 4 ? '9px' : count <= 9 ? '7px' : '5px',
            height: count <= 4 ? '9px' : count <= 9 ? '7px' : '5px',
            backgroundColor: getSeedColor(pitIndex, i),
            boxShadow: `0 0 4px ${getSeedColor(pitIndex, i)}`,
          }}
        />
      ))}
    </div>
  );
}

export default function Pit({
  index,
  count,
  isClickable,
  isLastMove,
  isCaptured,
  player,
  onClick,
}: PitProps) {
  // Display label: P1 pits 0-5 shown as 1-6, P2 pits 7-12 shown as 1-6
  const displayLabel = player === 1 ? index + 1 : index - 6;

  const borderColor = isLastMove
    ? 'border-cyan-400'
    : isCaptured
    ? 'border-orange-400'
    : player === 1
    ? 'border-cyan-700'
    : 'border-purple-700';

  const glowClass = isLastMove
    ? 'pit-active'
    : isCaptured
    ? 'pit-active'
    : '';

  const clickableClasses = isClickable
    ? 'cursor-pointer pit-hover'
    : 'opacity-50 cursor-not-allowed';

  return (
    <motion.button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      whileHover={isClickable ? { scale: 1.05 } : undefined}
      whileTap={isClickable ? { scale: 0.95 } : undefined}
      animate={
        isCaptured
          ? { borderColor: ['#f97316', '#ef4444', '#7c3aed'], transition: { duration: 0.5 } }
          : {}
      }
      className={[
        'relative flex flex-col items-center justify-center',
        'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20',
        'rounded-full border-2',
        'bg-gray-950',
        borderColor,
        glowClass,
        clickableClasses,
        'no-select touch-feedback',
        'transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
      ].join(' ')}
      aria-label={`Pit ${displayLabel} — ${count} seed${count !== 1 ? 's' : ''}`}
    >
      {/* Small pit label in corner */}
      <span
        className={[
          'absolute top-0.5 left-1 text-[9px] font-bold leading-none',
          player === 1 ? 'text-cyan-600' : 'text-purple-600',
        ].join(' ')}
        aria-hidden="true"
      >
        {displayLabel}
      </span>

      {/* Seeds */}
      <div className="flex flex-col items-center justify-center w-full h-full pb-3 pt-2 px-1">
        {count > 12 ? (
          <span
            className={[
              'text-lg sm:text-xl font-bold',
              player === 1 ? 'neon-cyan' : 'neon-purple',
            ].join(' ')}
          >
            {count}
          </span>
        ) : (
          <SeedDots count={count} pitIndex={index} />
        )}
      </div>

      {/* Seed count label below dots */}
      <span
        className={[
          'absolute bottom-0.5 text-[9px] sm:text-[10px] font-semibold leading-none',
          player === 1 ? 'text-cyan-400' : 'text-purple-400',
        ].join(' ')}
        aria-hidden="true"
      >
        {count}
      </span>
    </motion.button>
  );
}
