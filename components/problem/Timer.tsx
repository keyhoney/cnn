'use client';

import { useEffect, useState } from 'react';
import { Timer, Eye, EyeOff } from 'lucide-react';
import { useCountdown } from '@/hooks/use-countdown';
import {
  formatCountdown,
  getTimerHiddenPreference,
  setTimerHiddenPreference,
} from '@/lib/timer-utils';
import { cn } from '@/lib/utils';

interface ProblemTimerProps {
  /** 제한 시간 (초) */
  totalSeconds: number;
  /** false이면 카운트다운 일시정지 */
  running?: boolean;
  className?: string;
}

/**
 * 문제별 카운트다운 타이머 + 숨기기 토글 (P3-06)
 */
export function ProblemTimer({
  totalSeconds,
  running = true,
  className,
}: ProblemTimerProps) {
  const [hidden, setHidden] = useState(false);
  const [showExpiredNotice, setShowExpiredNotice] = useState(false);

  const { remaining, expired } = useCountdown({
    totalSeconds,
    running,
    onExpire: () => setShowExpiredNotice(true),
  });

  useEffect(() => {
    setHidden(getTimerHiddenPreference());
  }, []);

  useEffect(() => {
    if (!expired) setShowExpiredNotice(false);
  }, [expired, totalSeconds]);

  const toggleHidden = () => {
    const next = !hidden;
    setHidden(next);
    setTimerHiddenPreference(next);
  };

  const isUrgent = remaining > 0 && remaining <= 30;
  const progress = totalSeconds > 0 ? remaining / totalSeconds : 0;

  if (hidden) {
    return (
      <button
        type="button"
        onClick={toggleHidden}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg border border-app-border bg-app-surface-muted px-2.5 py-1',
          'text-xs text-app-text-muted transition-colors hover:bg-app-surface hover:text-app-text',
          className
        )}
        title={`남은 시간 ${formatCountdown(remaining)}`}
        aria-label={`타이머 보이기 (남은 ${formatCountdown(remaining)})`}
      >
        <Eye className="h-3.5 w-3.5" aria-hidden />
        <span className="font-mono tabular-nums">{formatCountdown(remaining)}</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border px-2.5 py-1',
        expired
          ? 'border-status-error bg-status-error-soft text-status-error'
          : isUrgent
            ? 'border-status-warning bg-status-warning-soft text-status-warning'
            : 'border-app-border bg-app-surface-muted text-app-text',
        className
      )}
      role="timer"
      aria-live="polite"
      aria-label={`남은 시간 ${formatCountdown(remaining)}`}
    >
      <Timer className="h-3.5 w-3.5 shrink-0" aria-hidden />

      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-xs font-semibold tabular-nums leading-none">
          {expired ? '00:00' : formatCountdown(remaining)}
        </span>
        <div className="h-0.5 w-14 overflow-hidden rounded-full bg-black/10">
          <div
            className={cn(
              'h-full transition-all duration-1000',
              expired ? 'bg-status-error' : isUrgent ? 'bg-status-warning' : 'bg-app-accent'
            )}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={toggleHidden}
        className="ml-0.5 flex h-6 w-6 items-center justify-center rounded text-app-text-muted transition-colors hover:bg-black/5 hover:text-app-text"
        aria-label="타이머 숨기기"
        title="타이머 숨기기"
      >
        <EyeOff className="h-3.5 w-3.5" />
      </button>

      {showExpiredNotice && expired && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-status-error">
          종료
        </span>
      )}
    </div>
  );
}
