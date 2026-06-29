'use client';

import { MathText } from '@/components/math/MathText';
import { cn } from '@/lib/utils';

interface ProblemQuestionProps {
  question: string;
  className?: string;
}

export function ProblemQuestion({ question, className }: ProblemQuestionProps) {
  return (
    <h3 className={cn('mb-6 font-serif text-lg text-app-heading', className)}>
      <span className="mr-2 font-bold text-app-accent">Q.</span>
      <MathText text={question} />
    </h3>
  );
}
