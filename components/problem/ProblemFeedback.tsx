'use client';

import { FeedbackBadge } from '@/components/problem/FeedbackBadge';
import { StarRating } from '@/components/problem/StarRating';
import { cn } from '@/lib/utils';

interface ProblemFeedbackProps {
  isCorrect: boolean;
  stars: number;
  hintsUsed?: number;
  className?: string;
}

/** 제출 후 상단 피드백 — 정오답 배지 + 별점 (P3-03) */
export function ProblemFeedback({
  isCorrect,
  stars,
  hintsUsed = 0,
  className,
}: ProblemFeedbackProps) {
  return (
    <div className={cn('flex flex-col items-end gap-1', className)}>
      <FeedbackBadge isCorrect={isCorrect} />
      {isCorrect && stars > 0 && <StarRating stars={stars} hintsUsed={hintsUsed} />}
    </div>
  );
}
