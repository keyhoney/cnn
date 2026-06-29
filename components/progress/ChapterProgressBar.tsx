'use client';

import { cn } from '@/lib/utils';

interface ChapterProgressBarProps {
  percent: number;
  completed: number;
  total: number;
  className?: string;
  size?: 'sm' | 'md';
}

export function ChapterProgressBar({
  percent,
  completed,
  total,
  className,
  size = 'md',
}: ChapterProgressBarProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between gap-2 text-[11px] text-app-text-muted">
        <span className="font-medium">진행률</span>
        <span className="font-mono font-semibold tabular-nums">
          {completed}/{total} · {percent}%
        </span>
      </div>
      <div
        className={cn('progress-track', size === 'sm' ? 'h-1' : 'h-1.5')}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`챕터 진행률 ${percent}%`}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
