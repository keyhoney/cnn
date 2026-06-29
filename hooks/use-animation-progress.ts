'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAnimationProgressOptions {
  durationMs?: number;
  speed?: number;
  autoPlay?: boolean;
}

/** 재생/일시정지 + progress(0~1) 스크럽 (P5-04) */
export function useAnimationProgress({
  durationMs = 10000,
  speed = 1,
  autoPlay = true,
}: UseAnimationProgressOptions = {}) {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const rafRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
    lastTimeRef.current = undefined;
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      stop();
      return;
    }

    const tick = (time: number) => {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = time;
      }

      const deltaMs = time - lastTimeRef.current;
      lastTimeRef.current = time;
      const deltaProgress = (deltaMs / durationMs) * speed;

      setProgress((prev) => {
        const next = prev + deltaProgress;
        return next >= 1 ? next - 1 : next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return stop;
  }, [isPlaying, durationMs, speed, stop]);

  const scrub = useCallback(
    (value: number) => {
      stop();
      setProgress(Math.max(0, Math.min(1, value)));
    },
    [stop]
  );

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return { progress, isPlaying, setIsPlaying, scrub, toggle };
}
