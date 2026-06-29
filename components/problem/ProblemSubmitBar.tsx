'use client';

import { cn } from '@/lib/utils';

interface ProblemSubmitBarProps {
  submitted: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
  onRetry: () => void;
}

export function ProblemSubmitBar({
  submitted,
  canSubmit,
  onSubmit,
  onRetry,
}: ProblemSubmitBarProps) {
  return (
    <div className="mt-8 flex justify-end border-t border-app-border pt-6">
      {!submitted ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          제출하기
        </button>
      ) : (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'btn-icon rounded-xl border border-app-border-subtle px-6 py-2.5 text-sm font-semibold text-app-text'
          )}
        >
          다시 풀기
        </button>
      )}
    </div>
  );
}
