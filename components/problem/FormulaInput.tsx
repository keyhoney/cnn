'use client';

import { useMemo } from 'react';
import { MathText } from '@/components/math/MathText';
import { renderKatexHtml } from '@/lib/katex-utils';
import { cn } from '@/lib/utils';

interface FormulaInputProps {
  question: string;
  value: string;
  submitted: boolean;
  isCorrect: boolean | null;
  onChange: (value: string) => void;
}

export function FormulaInput({
  question,
  value,
  submitted,
  isCorrect,
  onChange,
}: FormulaInputProps) {
  const previewHtml = useMemo(() => {
    if (!value.trim()) return '';
    try {
      return renderKatexHtml(value, { display: 'inline', throwOnError: false });
    } catch {
      return '';
    }
  }, [value]);

  return (
    <>
      <h3 className="mb-6 font-serif text-lg text-app-heading">
        <span className="mr-2 font-bold text-app-accent">Q.</span>
        <MathText text={question} />
      </h3>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-app-text-muted">
          LaTeX 수식 입력
        </label>
        <input
          type="text"
          className={cn(
            'input-field max-w-md font-mono',
            submitted && isCorrect && 'border-status-success bg-status-success-soft',
            submitted && isCorrect === false && 'border-status-error bg-status-error-soft'
          )}
          placeholder="예: a^7, \frac{1}{2}"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={submitted}
          aria-label="수식 답안"
        />
        {previewHtml && (
          <div
            className="rounded-lg border border-app-border bg-app-surface-muted px-4 py-3"
            aria-label="수식 미리보기"
          >
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-app-text-muted">
              미리보기
            </p>
            <span dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        )}
      </div>
    </>
  );
}
