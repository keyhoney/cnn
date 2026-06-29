'use client';

import { ProblemQuestion } from '@/components/problem/ProblemQuestion';
import { cn } from '@/lib/utils';

interface NumericInputProps {
  question: string;
  value: string;
  tolerance?: number;
  submitted: boolean;
  isCorrect: boolean | null;
  onChange: (value: string) => void;
}

export function NumericInput({
  question,
  value,
  tolerance = 0,
  submitted,
  isCorrect,
  onChange,
}: NumericInputProps) {
  return (
    <>
      <ProblemQuestion question={question} />

      <div className="mt-4 max-w-sm space-y-2">
        <label htmlFor="numeric-answer" className="block text-xs font-medium text-app-text-muted">
          답 (숫자 · 분수 · 소수)
        </label>
        <input
          id="numeric-answer"
          type="text"
          inputMode="decimal"
          className={cn(
            'input-field tabular-nums',
            submitted && isCorrect && 'border-status-success bg-status-success-soft',
            submitted && isCorrect === false && 'border-status-error bg-status-error-soft'
          )}
          placeholder="예: 243, 0.5, 1/2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={submitted}
          aria-describedby={tolerance > 0 ? 'numeric-tolerance-hint' : undefined}
        />
        {tolerance > 0 && (
          <p id="numeric-tolerance-hint" className="text-xs text-app-text-muted">
            허용 오차: ±{tolerance}
          </p>
        )}
      </div>
    </>
  );
}