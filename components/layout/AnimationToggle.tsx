'use client';

import { Sparkles, Sparkle } from 'lucide-react';
import { useAnimationSettings } from '@/hooks/use-animation-settings';
import { cn } from '@/lib/utils';

export function AnimationToggle({ className }: { className?: string }) {
  const { animationEnabled, toggleAnimation } = useAnimationSettings();
  const Icon = animationEnabled ? Sparkles : Sparkle;

  return (
    <button
      type="button"
      onClick={toggleAnimation}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full transition-colors',
        animationEnabled
          ? 'text-app-accent hover:bg-app-accent-soft'
          : 'text-app-text-muted hover:bg-app-surface-muted',
        className
      )}
      aria-label={animationEnabled ? '페이지 넘김 애니메이션 끄기' : '페이지 넘김 애니메이션 켜기'}
      aria-pressed={animationEnabled}
      title={animationEnabled ? '애니메이션: 켬' : '애니메이션: 끔'}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}
