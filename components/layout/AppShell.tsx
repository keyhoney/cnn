import { AppShellHeader } from '@/components/layout/AppShellHeader';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  headerExtra?: ReactNode;
  mainClassName?: string;
}

export function AppShell({
  children,
  title,
  subtitle,
  backHref,
  backLabel = '뒤로',
  headerExtra,
  mainClassName,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col font-sans text-app-text">
      <AppShellHeader
        title={title}
        subtitle={subtitle}
        backHref={backHref}
        backLabel={backLabel}
        headerExtra={headerExtra}
      />

      <main
        id="main-content"
        className={cn('app-container flex-1 py-6 sm:py-8 md:py-12', mainClassName)}
      >
        {children}
      </main>
    </div>
  );
}
