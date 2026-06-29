'use client';

import { SolutionSteps } from '@/components/problem/SolutionSteps';
import type { SolutionStep } from '@/lib/types/solution';
import { useProblemStore } from '@/stores/problemStore';
import { cn } from '@/lib/utils';

interface SolutionPanelProps {
  problemId: string;
  solution?: SolutionStep[];
  submitted?: boolean;
  className?: string;
}

/**
 * 문제 제출 후 단계별 풀이 패널 (P3-05)
 * 접기/펼치기 + 순차 공개 + KaTeX 렌더링
 */
export function SolutionPanel({
  problemId,
  solution,
  submitted = false,
  className,
}: SolutionPanelProps) {
  const revealedCount = useProblemStore(
    (s) => s.revealedSolutionSteps[problemId] ?? 0
  );
  const revealNext = useProblemStore((s) => s.revealNextSolutionStep);
  const revealAll = useProblemStore((s) => s.revealAllSolutionSteps);

  if (!submitted || !solution?.length) return null;

  const maxSteps = solution.length;

  return (
    <SolutionSteps
      steps={solution}
      title="단계별 풀이"
      revealedCount={revealedCount}
      onRevealNext={() => revealNext(problemId, maxSteps)}
      onRevealAll={() => revealAll(problemId, maxSteps)}
      showCollapsedPreview={false}
      className={cn('mt-6', className)}
    />
  );
}
