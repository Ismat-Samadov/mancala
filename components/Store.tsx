'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface StoreProps {
  count: number;
  player: 1 | 2;
  isCurrentPlayer: boolean;
  label?: string;
}

export default function Store({ count, player, isCurrentPlayer, label }: StoreProps) {
  const isP1 = player === 1;

  const borderClass = isP1
    ? isCurrentPlayer
      ? 'border-cyan-400'
      : 'border-cyan-800'
    : isCurrentPlayer
    ? 'border-purple-400'
    : 'border-purple-800';

  const playerLabel = label ?? (isP1 ? 'YOU' : 'P2');

  const countColorClass = isP1 ? 'neon-cyan' : 'neon-purple';
  const labelColorClass = isP1 ? 'text-cyan-500' : 'text-purple-500';

  return (
    <div
      className={[
        'flex flex-col items-center justify-center',
        'w-14 sm:w-16 md:w-24',
        'h-full min-h-[9rem] sm:min-h-[11rem] md:min-h-[14rem]',
        'rounded-2xl border-2',
        'bg-gray-950',
        borderClass,
        isCurrentPlayer ? 'winner-glow' : '',
        'transition-colors duration-300',
        'no-select',
        'gap-2',
      ].join(' ')}
      aria-label={`${playerLabel} store: ${count} seeds`}
    >
      {/* Player name */}
      <span
        className={[
          'text-[10px] sm:text-xs font-bold tracking-widest uppercase',
          labelColorClass,
        ].join(' ')}
      >
        {playerLabel}
      </span>

      {/* STORE label */}
      <span
        className={[
          'text-[8px] sm:text-[10px] tracking-widest uppercase opacity-60',
          labelColorClass,
        ].join(' ')}
      >
        STORE
      </span>

      {/* Animated seed count */}
      <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={count}
            initial={{ opacity: 0, scale: 0.5, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.4, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={[
              'absolute text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums',
              countColorClass,
            ].join(' ')}
            aria-live="polite"
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Active turn indicator dot */}
      <div
        className={[
          'w-2 h-2 rounded-full transition-all duration-300',
          isCurrentPlayer
            ? isP1
              ? 'bg-cyan-400 shadow-[0_0_6px_#00f5ff]'
              : 'bg-purple-400 shadow-[0_0_6px_#bf00ff]'
            : 'bg-transparent',
        ].join(' ')}
        aria-hidden="true"
      />
    </div>
  );
}
