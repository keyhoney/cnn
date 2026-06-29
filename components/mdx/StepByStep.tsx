'use client';

import { SolutionStepsStandalone } from '@/components/problem/SolutionSteps';
import type { StepByStepProps } from '@/lib/types/mdx';

/** MDX 독립 단계별 풀이 블록 (P3-05) */
export function StepByStep({ steps, title }: StepByStepProps) {
  if (!steps?.length) return null;

  return (
    <div className="my-6">
      <SolutionStepsStandalone steps={steps} title={title ?? '단계별 풀이'} />
    </div>
  );
}
