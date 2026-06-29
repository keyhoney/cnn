'use client';

import { useEffect, useState } from 'react';
import { useAnimationProgress } from '@/hooks/use-animation-progress';
import { useAnimationSettings } from '@/hooks/use-animation-settings';
import type { AnimationProps } from '@/lib/types/mdx';
import {
  ANIMATION_LABELS,
  isConceptAnimationId,
} from '@/lib/math-animation';
import { AnimationControls } from '@/components/math/animations/AnimationControls';
import { UnitCircleAnimation } from '@/components/math/animations/UnitCircleAnimation';
import { QuadraticTransformAnimation } from '@/components/math/animations/QuadraticTransformAnimation';

const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const;

/** 개념 시각화 애니메이션 (P5-04) */
export default function ConceptAnimation({
  animationId,
  speed: speedProp = 1,
  title,
}: AnimationProps) {
  const { animationEnabled } = useAnimationSettings();
  const [speed, setSpeed] = useState(speedProp);
  const { progress, isPlaying, setIsPlaying, scrub, toggle } = useAnimationProgress({
    durationMs: animationId === 'quadratic-transform' ? 12000 : 10000,
    speed,
    autoPlay: animationEnabled,
  });

  useEffect(() => {
    setSpeed(speedProp);
  }, [speedProp]);

  useEffect(() => {
    if (!animationEnabled) {
      setIsPlaying(false);
    }
  }, [animationEnabled, setIsPlaying]);

  const stopPageGestures = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  if (!isConceptAnimationId(animationId)) {
    return (
      <div className="my-4 rounded-xl border border-dashed border-app-border bg-app-surface-muted px-4 py-6 text-center text-sm text-app-text-muted">
        알 수 없는 <code>animationId</code>: {animationId}
      </div>
    );
  }

  const displayTitle = title ?? ANIMATION_LABELS[animationId];

  return (
    <section
      className="surface-card"
      onPointerDown={stopPageGestures}
      onTouchStart={stopPageGestures}
      data-no-flip
      aria-label={displayTitle}
    >
      <header className="border-b border-app-border bg-app-surface-muted/60 px-4 py-2.5">
        <h3 className="text-sm font-bold text-app-text">{displayTitle}</h3>
      </header>

      {animationId === 'unit-circle' && <UnitCircleAnimation progress={progress} />}
      {animationId === 'quadratic-transform' && (
        <QuadraticTransformAnimation progress={progress} />
      )}

      <div className="border-t border-app-border px-3 py-2">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-app-text-muted">속도</span>
          {SPEED_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSpeed(option)}
              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                speed === option
                  ? 'bg-app-accent text-white'
                  : 'bg-app-surface-muted text-app-text-muted hover:text-app-text'
              }`}
            >
              {option}x
            </button>
          ))}
        </div>
      </div>

      <AnimationControls
        progress={progress}
        isPlaying={isPlaying}
        onToggle={toggle}
        onScrub={scrub}
        speed={speed}
      />
    </section>
  );
}
