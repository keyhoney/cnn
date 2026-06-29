'use client';

import { useCallback, useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

const MOBILE_MAX = 767;
const TABLET_MIN = 768;
const TABLET_MAX = 1023;
const DESKTOP_MIN = 1024;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${MOBILE_MAX}px)`);
}

export function useIsTablet(): boolean {
  return useMediaQuery(`(min-width: ${TABLET_MIN}px) and (max-width: ${TABLET_MAX}px)`);
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${DESKTOP_MIN}px)`);
}

export function useIsPortrait(): boolean {
  return useMediaQuery('(orientation: portrait)');
}

export function useBreakpoint(): Breakpoint {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
}
