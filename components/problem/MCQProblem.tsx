'use client';

import { ProblemQuestion } from '@/components/problem/ProblemQuestion';
import { MathText } from '@/components/math/MathText';
import { cn } from '@/lib/utils';

interface MCQProblemProps {
  problemId: string;
  question: string;
  options: string[];
  selected: number | null;
  answer: number;
  submitted: boolean;
  isCorrect: boolean | null;
  onSelect: (index: number) => void;
}

const OPTION_LABELS = '①②③④⑤⑥⑦⑧⑨⑩';

export function MCQProblem({
  problemId,
  question,
  options,
  selected,
  answer,
  submitted,
  isCorrect,
  onSelect,
}: MCQProblemProps) {
  const groupName = `mcq-${problemId}`;

  return (
    <>
      <ProblemQuestion question={question} />

      <fieldset className="space-y-3" disabled={submitted}>
        <legend className="sr-only">선택지</legend>
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const showCorrect = submitted && i === answer;
          const showWrong = submitted && isCorrect === false && isSelected;

          return (
            <label
              key={i}
              className={cn(
                'group flex w-full cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all',
                isSelected
                  ? 'border-app-accent bg-app-accent-soft'
                  : 'border-app-border hover:border-app-accent/50 hover:bg-app-accent-soft/50',
                showCorrect && 'border-status-success bg-status-success-soft',
                showWrong && 'border-status-error bg-status-error-soft',
                submitted && 'cursor-default'
              )}
            >
              <input
                type="radio"
                name={groupName}
                value={i}
                checked={isSelected}
                onChange={() => onSelect(i)}
                className="sr-only"
                aria-label={`선택지 ${i + 1}`}
              />
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                  isSelected
                    ? 'border-app-accent bg-app-accent text-white'
                    : 'border-app-border bg-app-surface text-app-text-muted group-hover:border-app-accent'
                )}
                aria-hidden
              >
                {OPTION_LABELS[i] ?? i + 1}
              </span>
              <span
                className={cn(
                  'min-w-0 flex-1 text-sm',
                  isSelected ? 'font-semibold text-app-text' : 'text-app-text-muted group-hover:text-app-text'
                )}
              >
                <MathText text={opt} />
              </span>
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                  isSelected ? 'border-app-accent bg-app-accent' : 'border-app-border'
                )}
                aria-hidden
              >
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-app-surface" />
                )}
              </span>
            </label>
          );
        })}
      </fieldset>
    </>
  );
}
