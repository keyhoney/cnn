'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';
import type { FlipDirection } from '@/lib/types/stores';
import { cn } from '@/lib/utils';

const FLIP_ENTER_KEY = 'cnn-howlearn:flip-enter';

export function setFlipEnterDirection(direction: FlipDirection) {
  try {
    sessionStorage.setItem(FLIP_ENTER_KEY, direction);
  } catch {
    // ignore
  }
}

interface PageFlipProps {
  spreadKey: number;
  children: ReactNode;
  animationEnabled: boolean;
  flipDuration: number;
  exitRequested: boolean;
  flipDirection: FlipDirection;
  onExitComplete: () => void;
}

export function PageFlip({
  spreadKey,
  children,
  animationEnabled,
  flipDuration,
  exitRequested,
  flipDirection,
  onExitComplete,
}: PageFlipProps) {
  const [enterDirection, setEnterDirection] = useState<FlipDirection | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(FLIP_ENTER_KEY);
      if (stored === 'forward' || stored === 'backward') {
        sessionStorage.removeItem(FLIP_ENTER_KEY);
        setEnterDirection(stored);
      }
    } catch {
      // ignore
    }
  }, [spreadKey]);

  if (!animationEnabled) {
    return (
      <div className="flex h-full min-h-0 w-full justify-center">{children}</div>
    );
  }

  const transformOrigin = flipDirection === 'forward' ? 'left center' : 'right center';

  const enterState =
    enterDirection === 'forward'
      ? { rotateY: -72, opacity: 0.85 }
      : enterDirection === 'backward'
        ? { rotateY: 72, opacity: 0.85 }
        : false;

  return (
    <div
      className={cn('relative flex h-full min-h-0 w-full justify-center')}
      style={{ perspective: 1400 }}
    >
      <motion.div
        key={spreadKey}
        className="h-full min-h-0 w-full max-w-[960px]"
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          transformOrigin,
        }}
        initial={enterState}
        animate={
          exitRequested
            ? {
                rotateY: flipDirection === 'forward' ? 72 : -72,
                opacity: 0.85,
              }
            : { rotateY: 0, opacity: 1 }
        }
        transition={{
          duration: flipDuration,
          ease: [0.45, 0.05, 0.25, 1],
        }}
        onAnimationComplete={() => {
          if (exitRequested) onExitComplete();
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
