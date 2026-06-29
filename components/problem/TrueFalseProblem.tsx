'use client';

import { ProblemQuestion } from '@/components/problem/ProblemQuestion';
import { cn } from '@/lib/utils';

interface TrueFalseProblemProps {
  question: string;
  value: boolean | null;
  answer: boolean;
  submitted: boolean;
  isCorrect: boolean | null;
  onChange: (value: boolean) => void;
}

export function TrueFalseProblem({
  question,
  value,
  answer,
  submitted,
  isCorrect,
  onChange,
}: TrueFalseProblemProps) {
  const isTrue = value === true;
  const isFalse = value === false;

  return (
    <>
      <ProblemQuestion question={question} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div
          className={cn(
            'segmented-control',
            submitted && isCorrect === false && 'border-status-error/40',
            submitted && isCorrect && 'border-status-success/40'
          )}
          role="group"
          aria-label="참 또는 거짓 선택"
        >
          <button
            type="button"
            role="radio"
            aria-checked={isTrue}
            disabled={submitted}
            onClick={() => onChange(true)}
            className={cn(
              'min-h-[44px] min-w-[88px] rounded-lg px-6 text-sm font-bold transition-all',
              isTrue
                ? 'bg-app-accent text-white shadow-sm'
                : 'text-app-text-muted hover:bg-app-surface hover:text-app-text',
              submitted && answer === true && 'ring-2 ring-status-success ring-offset-1',
              submitted && isTrue && !isCorrect && 'bg-status-error text-white'
            )}
          >
            O 참
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={isFalse}
            disabled={submitted}
            onClick={() => onChange(false)}
            className={cn(
              'min-h-[44px] min-w-[88px] rounded-lg px-6 text-sm font-bold transition-all',
              isFalse
                ? 'bg-app-accent text-white shadow-sm'
                : 'text-app-text-muted hover:bg-app-surface hover:text-app-text',
              submitted && answer === false && 'ring-2 ring-status-success ring-offset-1',
              submitted && isFalse && !isCorrect && 'bg-status-error text-white'
            )}
          >
            X 거짓
          </button>
        </div>

        <p className="text-xs text-app-text-muted">
          {value === null ? '참 또는 거짓을 선택하세요.' : value ? '참을 선택했습니다.' : '거짓을 선택했습니다.'}
        </p>
      </div>
    </>
  );
}
