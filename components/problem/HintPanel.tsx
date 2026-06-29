'use client';

import { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { MathText } from '@/components/math/MathText';
import { registerHintShortcutHandler } from '@/lib/hint-shortcut';
import { getHintLevelLabel, normalizeHints } from '@/lib/problem-hints';
import { recordHintUsage } from '@/lib/problem-results';
import { useProblemPage } from '@/components/problem/ProblemPageContext';
import { useProblemStore } from '@/stores/problemStore';
import { cn } from '@/lib/utils';

interface HintPanelProps {
  problemId: string;
  hints?: string[];
  tags?: string[];
  submitted?: boolean;
  className?: string;
}

/**
 * 3단계 순차 힌트 패널 (P3-04)
 * 힌트 1 → 개념 상기 / 2 → 접근 방향 / 3 → 풀이 힌트
 */
export function HintPanel({
  problemId,
  hints: rawHints,
  tags,
  submitted = false,
  className,
}: HintPanelProps) {
  const page = useProblemPage();
  const hints = normalizeHints(rawHints);
  const hintLevel = useProblemStore((s) => s.revealedHints[problemId] ?? 0);
  const revealNextHint = useProblemStore((s) => s.revealNextHint);

  const maxHints = hints.length;
  const canRevealMore = hints.length > 0 && !submitted && hintLevel < maxHints;

  const handleRevealNext = useCallback(async () => {
    if (!canRevealMore) return;

    const nextLevel = hintLevel + 1;
    revealNextHint(problemId, maxHints);

    if (page) {
      await recordHintUsage({
        problemId,
        bookId: page.bookId,
        pageId: page.pageId,
        hintsUsed: nextLevel,
        tags,
      });
    }
  }, [canRevealMore, hintLevel, maxHints, page, problemId, revealNextHint, tags]);

  useEffect(() => {
    if (hints.length === 0) return undefined;
    return registerHintShortcutHandler(problemId, () => {
      if (!canRevealMore) return false;
      void handleRevealNext();
      return true;
    });
  }, [canRevealMore, handleRevealNext, hints.length, problemId]);

  if (hints.length === 0) return null;

  return (
    <div className={cn('mt-6', className)} data-no-flip>
      <AnimatePresence>
        {hintLevel > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden rounded-xl border border-violet-200/80 bg-violet-50/60"
          >
            <ul className="divide-y divide-violet-200/50">
              {hints.slice(0, hintLevel).map((hint, i) => {
                const level = i + 1;
                return (
                  <motion.li
                    key={level}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                    className="px-4 py-3"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                        {level}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-violet-700">
                        {getHintLevelLabel(level)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-violet-950">
                      <MathText text={hint} />
                    </p>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {canRevealMore && (
        <button
          type="button"
          onClick={handleRevealNext}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border border-violet-200/80 bg-violet-50/40 px-3 py-1.5',
            'text-xs font-medium text-violet-700 transition-colors',
            'hover:border-violet-300 hover:bg-violet-100/80'
          )}
          aria-label={`힌트 ${hintLevel + 1} 보기`}
        >
          <Lightbulb className="h-3.5 w-3.5" aria-hidden />
          힌트 {hintLevel + 1} 보기
          <span className="text-[10px] text-violet-500">(별점 -1)</span>
        </button>
      )}

      {hintLevel >= maxHints && !submitted && (
        <p className="text-[10px] text-app-text-muted">모든 힌트를 확인했습니다.</p>
      )}

      {hintLevel > 0 && submitted && (
        <p className="mt-1 text-[10px] text-app-text-muted">
          힌트 {hintLevel}회 사용
        </p>
      )}
    </div>
  );
}
