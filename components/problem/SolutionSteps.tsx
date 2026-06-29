'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ListOrdered } from 'lucide-react';
import { MathText } from '@/components/math/MathText';
import type { SolutionStep } from '@/lib/types/solution';
import { cn } from '@/lib/utils';

interface SolutionStepsProps {
  steps: SolutionStep[];
  title?: string;
  revealedCount: number;
  onRevealNext?: () => void;
  onRevealAll?: () => void;
  /** 접힌 상태에서 단계 제목 미리보기 */
  showCollapsedPreview?: boolean;
  className?: string;
}

function SolutionStepItem({ step, index }: { step: SolutionStep; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-app-accent font-mono text-xs font-bold text-white">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1 pb-4">
        <p className="mb-1 text-sm font-semibold text-app-heading">
          <MathText text={step.step} />
        </p>
        <div className="text-sm leading-relaxed text-app-text">
          <MathText text={step.content} />
        </div>
        {step.image && (
          <figure className="mt-3 overflow-hidden rounded-lg border border-app-border-subtle">
            <Image
              src={step.image}
              alt={step.step}
              width={480}
              height={320}
              className="h-auto w-full object-contain"
            />
          </figure>
        )}
      </div>
    </motion.div>
  );
}

export function SolutionSteps({
  steps,
  title = '단계별 풀이',
  revealedCount,
  onRevealNext,
  onRevealAll,
  showCollapsedPreview = true,
  className,
}: SolutionStepsProps) {
  const [expanded, setExpanded] = useState(false);

  if (!steps.length) return null;

  const visibleSteps = steps.slice(0, revealedCount);
  const hasMore = revealedCount < steps.length;
  const allRevealed = revealedCount >= steps.length;

  const handleToggle = () => {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);
    if (nextExpanded && revealedCount === 0 && onRevealNext) {
      onRevealNext();
    }
  };

  return (
    <div
      className={cn(
        'surface-card overflow-hidden border-app-accent/20 bg-app-accent-soft/30',
        !expanded && 'ring-1 ring-inset ring-app-accent/10',
        className
      )}
      data-no-flip
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'group flex w-full cursor-pointer flex-col text-left transition-colors',
          'hover:bg-app-accent-soft/50 active:bg-app-accent-soft/60',
          !expanded && 'pb-0'
        )}
        aria-expanded={expanded}
        aria-label={expanded ? `${title} 접기` : `${title} 펼치기 (${steps.length}단계)`}
      >
        <span className="flex w-full items-center justify-between gap-3 px-4 py-3">
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-app-accent">
              <ListOrdered className="h-4 w-4 shrink-0" aria-hidden />
              <MathText text={title} />
              <span className="chip">{steps.length}단계</span>
              {allRevealed && expanded && <span className="chip-muted">전체 공개</span>}
            </span>
            <span className="mt-1 block text-xs text-app-text-muted group-hover:text-app-text">
              {expanded ? '클릭하여 접기' : '클릭하여 단계별 내용 펼치기'}
            </span>
          </span>
          <span
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
              'border border-app-accent/25 bg-app-surface/80 text-app-accent',
              'transition-transform duration-200 group-hover:border-app-accent/40 group-hover:bg-app-accent-soft'
            )}
            aria-hidden
          >
            <ChevronDown
              className={cn('h-4 w-4 transition-transform duration-200', expanded && 'rotate-180')}
            />
          </span>
        </span>

        {!expanded && showCollapsedPreview && (
          <span className="block w-full border-t border-dashed border-app-accent/25 px-4 py-3">
            <ol className="list-none space-y-2">
              {steps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-xs text-app-text-muted group-hover:text-app-text"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-app-accent/15 font-mono text-[10px] font-bold text-app-accent">
                    {i + 1}
                  </span>
                  <span className="min-w-0 truncate">
                    <MathText text={step.step} />
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-center text-[11px] font-medium text-app-accent/90">
              ↑ 탭하여 각 단계의 설명 보기
            </p>
          </span>
        )}

        {!expanded && !showCollapsedPreview && (
          <span className="block w-full border-t border-dashed border-app-accent/25 px-4 py-3 text-center text-xs text-app-text-muted group-hover:text-app-text">
            {steps.length}개의 풀이 단계 · 탭하여 순서대로 확인
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-app-accent/15 px-4 pb-4 pt-2">
              {visibleSteps.length > 0 ? (
                <ol className="list-none divide-y divide-app-border-subtle">
                  {visibleSteps.map((step, i) => (
                    <li key={i} className="py-3 first:pt-1">
                      <SolutionStepItem step={step} index={i} />
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="py-2 text-sm text-app-text-muted">단계를 불러오는 중…</p>
              )}

              {(hasMore || (!allRevealed && onRevealAll)) && (
                <div className="mt-2 flex flex-wrap gap-2 border-t border-app-border-subtle pt-3">
                  {hasMore && onRevealNext && (
                    <button type="button" onClick={onRevealNext} className="btn-primary text-xs">
                      다음 단계 ({revealedCount + 1}/{steps.length})
                    </button>
                  )}
                  {hasMore && onRevealAll && (
                    <button
                      type="button"
                      onClick={onRevealAll}
                      className="rounded-xl border border-app-accent/30 bg-app-surface px-4 py-2 text-xs font-semibold text-app-accent transition-colors hover:bg-app-accent-soft"
                    >
                      전체 보기
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SolutionStepsStandalone({
  steps,
  title,
  showCollapsedPreview,
  className,
}: {
  steps: SolutionStep[];
  title?: string;
  showCollapsedPreview?: boolean;
  className?: string;
}) {
  const [revealedCount, setRevealedCount] = useState(0);

  return (
    <SolutionSteps
      steps={steps}
      title={title}
      revealedCount={revealedCount}
      onRevealNext={() => setRevealedCount((c) => Math.min(c + 1, steps.length))}
      onRevealAll={() => setRevealedCount(steps.length)}
      showCollapsedPreview={showCollapsedPreview}
      className={className}
    />
  );
}
