'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AppShellHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  headerExtra?: ReactNode;
}

export function AppShellHeader({
  title,
  subtitle,
  backHref,
  backLabel = '뒤로',
  headerExtra,
}: AppShellHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'glass-bar sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between px-4 transition-all duration-300 sm:px-6',
        scrolled && 'glass-bar-scrolled'
      )}
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {backHref && (
          <>
            <Link
              href={backHref}
              className="btn-icon h-11 w-11 shrink-0"
              aria-label={backLabel}
            >
              <ArrowLeft className="h-5 w-5 text-app-text-muted" />
            </Link>
            <div className="hidden h-6 w-px bg-app-border sm:block" />
          </>
        )}
        <div className="min-w-0 flex-col">
          {subtitle && <span className="section-header truncate leading-none">{subtitle}</span>}
          <span className="truncate text-sm font-semibold tracking-tight text-app-text sm:text-base">
            {title}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {headerExtra}
        <ThemeToggle />
      </div>
    </header>
  );
}
