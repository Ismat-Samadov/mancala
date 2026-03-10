/**
 * Sound management hook using Web Audio API
 * Creates synthesized sound effects without external audio files
 */

import { useCallback, useRef, useState } from 'react';

interface SoundOptions {
  enabled: boolean;
}

export function useSound(options: SoundOptions) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(!options.enabled);
  const bgIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Lazily create AudioContext (must be triggered by user gesture) */
  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  /** Play a short beep / seed drop sound */
  const playSeedDrop = useCallback(() => {
    if (isMuted) return;
    const ctx = getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }, [isMuted, getCtx]);

  /** Play capture sound */
  const playCapture = useCallback(() => {
    if (isMuted) return;
    const ctx = getCtx();
    if (!ctx) return;

    // Exciting ascending arpeggio
    const notes = [330, 440, 550, 660];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.2);

      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.2);
    });
  }, [isMuted, getCtx]);

  /** Play extra turn sound */
  const playExtraTurn = useCallback(() => {
    if (isMuted) return;
    const ctx = getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523, ctx.currentTime);
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  }, [isMuted, getCtx]);

  /** Play win/game over fanfare */
  const playWin = useCallback(() => {
    if (isMuted) return;
    const ctx = getCtx();
    if (!ctx) return;

    const melody = [
      { freq: 523, time: 0 },
      { freq: 659, time: 0.15 },
      { freq: 784, time: 0.3 },
      { freq: 1047, time: 0.45 },
      { freq: 784, time: 0.6 },
      { freq: 1047, time: 0.75 },
    ];

    melody.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.25);
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + 0.25);
    });
  }, [isMuted, getCtx]);

  /** Play lose sound */
  const playLose = useCallback(() => {
    if (isMuted) return;
    const ctx = getCtx();
    if (!ctx) return;

    const notes = [400, 350, 300, 250];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.25);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.25);
    });
  }, [isMuted, getCtx]);

  /** Play click sound */
  const playClick = useCallback(() => {
    if (isMuted) return;
    const ctx = getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }, [isMuted, getCtx]);

  /** Toggle mute state */
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return {
    isMuted,
    toggleMute,
    playSeedDrop,
    playCapture,
    playExtraTurn,
    playWin,
    playLose,
    playClick,
  };
}
