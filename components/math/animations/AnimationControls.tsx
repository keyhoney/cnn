'use client';

import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimationControlsProps {
  progress: number;
  isPlaying: boolean;
  onToggle: () => void;
  onScrub: (value: number) => void;
  speed?: number;
  className?: string;
}

export function AnimationControls({
  progress,
  isPlaying,
  onToggle,
  onScrub,
  speed = 1,
  className,
}: AnimationControlsProps) {
  return (
    <div className={cn('flex flex-col gap-2 border-t border-app-border px-3 py-2.5', className)}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-app-accent text-white transition-opacity hover:opacity-90"
          aria-label={isPlaying ? '일시정지' : '재생'}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(e) => onScrub(Number(e.target.value) / 1000)}
          className="h-2 min-w-0 flex-1 cursor-pointer accent-app-accent"
          aria-label="애니메이션 위치"
        />

        <span className="w-10 shrink-0 text-right font-mono text-[10px] text-app-text-muted">
          {Math.round(progress * 100)}%
        </span>
      </div>

      <p className="text-[10px] text-app-text-muted">
        속도 {speed}x · 슬라이더로 특정 프레임 탐색
      </p>
    </div>
  );
}
