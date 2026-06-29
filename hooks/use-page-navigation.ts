'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDrag } from '@use-gesture/react';
import { useAnimationSettings } from '@/hooks/use-animation-settings';
import { useViewerStore } from '@/stores/viewerStore';
import type { FlipDirection } from '@/lib/types/stores';

const FLIP_DURATION_MS = 480;

interface UsePageNavigationOptions {
  prevHref?: string;
  nextHref?: string;
}

export function usePageNavigation({ prevHref, nextHref }: UsePageNavigationOptions) {
  const router = useRouter();
  const { animationEnabled } = useAnimationSettings();
  const startFlip = useViewerStore((s) => s.startFlip);
  const endFlip = useViewerStore((s) => s.endFlip);
  const isFlipping = useViewerStore((s) => s.isFlipping);
  const flipDirection = useViewerStore((s) => s.flipDirection);

  const [exitRequested, setExitRequested] = useState(false);
  const pendingHrefRef = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string | undefined, direction: FlipDirection) => {
      if (!href || isFlipping || exitRequested) return;

      if (!animationEnabled) {
        router.push(href);
        return;
      }

      pendingHrefRef.current = href;
      startFlip(direction);
      setExitRequested(true);
    },
    [animationEnabled, exitRequested, isFlipping, router, startFlip]
  );

  const navigatePrev = useCallback(() => navigate(prevHref, 'backward'), [navigate, prevHref]);
  const navigateNext = useCallback(() => navigate(nextHref, 'forward'), [navigate, nextHref]);

  const handleExitComplete = useCallback(() => {
    const href = pendingHrefRef.current;
    if (!href) return;

    pendingHrefRef.current = null;
    setExitRequested(false);
    router.push(href);
  }, [router]);

  useEffect(() => {
    endFlip();
    setExitRequested(false);
    pendingHrefRef.current = null;
  }, [prevHref, nextHref, endFlip]);

  const bindGestures = useDrag(
    ({ swipe: [swipeX], event }) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          'button, a, input, textarea, [data-no-flip], [data-highlight-root], mark.hl-mark'
        )
      ) {
        return;
      }

      const selection = window.getSelection();
      if (selection?.toString().trim()) return;

      if (swipeX === 1) navigatePrev();
      else if (swipeX === -1) navigateNext();
    },
    {
      swipe: { distance: 60, velocity: 0.25 },
      filterTaps: true,
      axis: 'x',
      preventDefault: false,
      threshold: 32,
    }
  );

  return {
    navigatePrev,
    navigateNext,
    handleExitComplete,
    exitRequested,
    flipDirection,
    animationEnabled,
    flipDuration: animationEnabled ? FLIP_DURATION_MS / 1000 : 0,
    bindGestures,
    hasPrev: Boolean(prevHref),
    hasNext: Boolean(nextHref),
  };
}
