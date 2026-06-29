'use client';

import { Check, Loader2 } from 'lucide-react';
import type { DrawingSaveStatus } from '@/hooks/use-drawing-persistence';
import { cn } from '@/lib/utils';

interface DrawingSaveIndicatorProps {
  status: DrawingSaveStatus;
  className?: string;
}

/** 필기 자동 저장 상태 표시 (P4-05) */
export function DrawingSaveIndicator({ status, className }: DrawingSaveIndicatorProps) {
  if (status === 'idle') return null;

  return (
    <div
      className={cn(
        'pointer-events-none flex items-center gap-1 rounded-md bg-app-surface/95 px-2 py-0.5 text-[10px] font-semibold text-app-text-muted shadow-sm backdrop-blur-sm',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {status === 'pending' && <span>저장 대기…</span>}
      {status === 'saving' && (
        <>
          <Loader2 className="h-3 w-3 animate-spin text-app-accent" aria-hidden />
          <span>저장 중…</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <Check className="h-3 w-3 text-status-success" aria-hidden />
          <span className="text-status-success">저장됨</span>
        </>
      )}
    </div>
  );
}
