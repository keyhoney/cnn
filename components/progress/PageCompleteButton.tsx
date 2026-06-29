'use client';

import { Check, Circle } from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { cn } from '@/lib/utils';

interface PageCompleteButtonProps {
  bookId: string;
  pageId: string;
  className?: string;
}

/** 페이지 완료 수동 마킹 (P6-01) */
export function PageCompleteButton({ bookId, pageId, className }: PageCompleteButtonProps) {
  const isCompleted = useProgressStore((s) => s.isPageCompleted(bookId, pageId));
  const markPageCompleted = useProgressStore((s) => s.markPageCompleted);
  const markPageIncomplete = useProgressStore((s) => s.markPageIncomplete);

  const handleToggle = () => {
    if (isCompleted) {
      void markPageIncomplete(bookId, pageId);
    } else {
      void markPageCompleted(bookId, pageId);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors',
        isCompleted
          ? 'bg-status-success-soft text-status-success hover:opacity-90'
          : 'bg-app-surface-muted text-app-text-muted hover:bg-app-accent-soft hover:text-app-accent',
        className
      )}
      aria-pressed={isCompleted}
      aria-label={isCompleted ? '페이지 완료 취소' : '이 페이지 완료'}
      title={isCompleted ? '완료 취소' : '이 페이지 완료'}
    >
      {isCompleted ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{isCompleted ? '완료됨' : '완료'}</span>
    </button>
  );
}
