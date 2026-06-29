'use client';

import { Problem } from '@/components/problem/Problem';
import { ProblemPageProvider } from '@/components/problem/ProblemPageContext';
import { getProblemDefinition, hasProblemDefinition } from '@/lib/problem-registry';
import { getProblemLabel } from '@/lib/dashboard-content';
import type { WrongAnswerItem } from '@/lib/dashboard-stats';
import { ExternalLink, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface WrongNoteRetryPanelProps {
  item: WrongAnswerItem | null;
  retryKey: number;
  onRestart: () => void;
  onSubmitted?: () => void;
}

/** 선택한 오답 문제 인라인 재풀이 (P6-06) */
export function WrongNoteRetryPanel({
  item,
  retryKey,
  onRestart,
  onSubmitted,
}: WrongNoteRetryPanelProps) {
  if (!item) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-app-border bg-app-surface-muted px-6 text-center">
        <p className="text-sm font-medium text-app-text">왼쪽에서 문제를 선택하세요</p>
        <p className="mt-1 text-xs text-app-text-muted">
          오답 노트에서 바로 재풀이할 수 있습니다.
        </p>
      </div>
    );
  }

  const definition = getProblemDefinition(item.problemId);

  return (
    <div className="surface-card">
      <header className="flex items-start justify-between gap-3 border-b border-app-border bg-app-surface-muted/60 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-app-accent">
            재풀이
          </p>
          <h2 className="truncate font-serif text-lg text-app-heading">
            {getProblemLabel(item.problemId)}
          </h2>
          <p className="text-xs text-app-text-muted">{item.pageTitle}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onRestart}
            className="flex h-9 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-app-text-muted hover:bg-app-surface hover:text-app-text"
            title="다시 풀기"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">초기화</span>
          </button>
          <Link
            href={item.href}
            className="flex h-9 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-app-text-muted hover:bg-app-surface hover:text-app-accent"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">교재</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {!hasProblemDefinition(item.problemId) || !definition ? (
          <div className="surface-card border-status-warning/30 bg-status-warning-soft px-4 py-6 text-center text-sm text-app-text">
            <p>이 문제는 아직 앱 내 재풀이를 지원하지 않습니다.</p>
            <Link
              href={item.href}
              className="mt-2 inline-block font-semibold text-app-accent hover:underline"
            >
              교재 페이지에서 풀기
            </Link>
          </div>
        ) : (
          <ProblemPageProvider
            bookId={item.bookId}
            chapterId={item.chapterId}
            pageId={item.pageId}
          >
            <Problem
              key={`${item.problemId}-${retryKey}`}
              {...definition}
              onAfterSubmit={onSubmitted}
            />
          </ProblemPageProvider>
        )}
      </div>
    </div>
  );
}
