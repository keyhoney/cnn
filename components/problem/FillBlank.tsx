'use client';

import { Fragment } from 'react';
import { MathText } from '@/components/math/MathText';
import { normalizeLatex } from '@/lib/problem-grading';
import { cn } from '@/lib/utils';

const BLANK_PLACEHOLDER = '___';

interface FillBlankProps {
  question: string;
  blankCount: number;
  values: string[];
  submitted: boolean;
  isCorrect: boolean | null;
  expectedAnswers?: string[];
  onChange: (index: number, value: string) => void;
}

export function FillBlank({
  question,
  blankCount,
  values,
  submitted,
  isCorrect,
  expectedAnswers,
  onChange,
}: FillBlankProps) {
  const parts = question.split(BLANK_PLACEHOLDER);
  const blankIndices = Math.max(blankCount, parts.length - 1);

  const renderBlank = (idx: number) => {
    const blankCorrect =
      submitted &&
      expectedAnswers &&
      normalizeLatex(values[idx] ?? '') === normalizeLatex(expectedAnswers[idx] ?? '');
    const blankWrong = submitted && isCorrect === false && !blankCorrect;

    return (
      <span key={`blank-${idx}`} className="inline-flex items-baseline">
        <input
          type="text"
          value={values[idx] ?? ''}
          onChange={(e) => onChange(idx, e.target.value)}
          disabled={submitted}
          className={cn(
            'mx-1 inline-block min-w-[3.5rem] max-w-[10rem] border-0 border-b-2 bg-transparent px-1 py-0 text-center font-mono text-sm text-app-text',
            'border-app-accent focus:border-app-accent focus:outline-none focus:ring-0',
            'placeholder:text-app-text-muted/50',
            submitted && blankCorrect && 'border-status-success text-status-success',
            blankWrong && 'border-status-error text-status-error'
          )}
          placeholder={`(${idx + 1})`}
          aria-label={`빈칸 ${idx + 1}`}
        />
      </span>
    );
  };

  return (
    <>
      <p className="mb-3 text-xs font-medium text-app-text-muted">
        빈칸 <span className="font-mono">___</span> 에 알맞은 답을 입력하세요.
      </p>

      <div
        className="mb-6 surface-card bg-app-surface-muted/50 px-4 py-5 text-base leading-loose text-app-text"
        role="group"
        aria-label="빈칸 채우기"
      >
        <div className="flex flex-wrap items-baseline gap-y-2">
          {parts.map((part, i) => (
            <Fragment key={i}>
              {part && (
                <span className="inline">
                  <MathText text={part} />
                </span>
              )}
              {i < parts.length - 1 && renderBlank(i)}
            </Fragment>
          ))}
          {blankIndices > parts.length - 1 &&
            Array.from({ length: blankIndices - (parts.length - 1) }).map((_, i) =>
              renderBlank(parts.length - 1 + i)
            )}
        </div>
      </div>
    </>
  );
}
