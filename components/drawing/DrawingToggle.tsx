'use client';

import { Pen, PenOff } from 'lucide-react';
import { useDrawingStore } from '@/stores/drawingStore';
import { cn } from '@/lib/utils';

interface DrawingToggleProps {
  className?: string;
}

/** 필기 모드 ON/OFF 토글 (P4-01) */
export function DrawingToggle({ className }: DrawingToggleProps) {
  const isDrawingMode = useDrawingStore((s) => s.isDrawingMode);
  const toggleDrawingMode = useDrawingStore((s) => s.toggleDrawingMode);

  return (
    <button
      type="button"
      onClick={toggleDrawingMode}
      className={cn(
        'flex h-10 min-w-[44px] items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold uppercase tracking-wider transition-colors sm:px-3',
        isDrawingMode
          ? 'bg-app-accent text-white shadow-sm'
          : 'text-app-text-muted hover:bg-app-surface hover:text-app-text',
        className
      )}
      aria-label={isDrawingMode ? '필기 모드 끄기' : '필기 모드 켜기'}
      aria-pressed={isDrawingMode}
      title={isDrawingMode ? '필기 모드 끄기 (N)' : '필기 모드 (N)'}
    >
      {isDrawingMode ? (
        <PenOff className="h-4 w-4 shrink-0" aria-hidden />
      ) : (
        <Pen className="h-4 w-4 shrink-0" aria-hidden />
      )}
      <span className="hidden sm:inline">필기</span>
    </button>
  );
}
