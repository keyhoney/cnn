'use client';

import { EternaFooter } from '@/components/eterna/EternaFooter';
import { EternaNavbar } from '@/components/eterna/EternaNavbar';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface EternaShellProps {
  children: ReactNode;
  mainClassName?: string;
  withTopPadding?: boolean;
  /** 홈 히어로 등 풀블리드 섹션 (main 바깥, navbar 아래) */
  hero?: ReactNode;
  /** EternaCloud 홈 다크 배경 */
  homeDark?: boolean;
}

export function EternaShell({
  children,
  mainClassName,
  withTopPadding = true,
  hero,
  homeDark = false,
}: EternaShellProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen flex-col font-sans',
        homeDark ? 'home-dark-shell text-white/80' : 'text-app-text'
      )}
    >
      <EternaNavbar />
      {hero}
      <main
        id="main-content"
        className={cn(
          'app-container flex-1 pb-8',
          withTopPadding && !hero && 'pt-24 sm:pt-28',
          hero && 'pt-10 sm:pt-12',
          mainClassName
        )}
      >
        {children}
      </main>
      <EternaFooter />
    </div>
  );
}
