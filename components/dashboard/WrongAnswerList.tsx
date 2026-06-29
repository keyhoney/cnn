'use client';

import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { getProblemLabel } from '@/lib/dashboard-content';
import type { WrongAnswerItem } from '@/lib/dashboard-stats';
import { formatDuration } from '@/lib/dashboard-stats';
import { cn } from '@/lib/utils';

interface WrongAnswerListProps {
  items: WrongAnswerItem[];
  isLoading?: boolean;
  className?: string;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** 오답 노트 목록 (P6-05) */
export function WrongAnswerList({ items, isLoading, className }: WrongAnswerListProps) {
  return (
    <section className={cn('rounded-xl border border-app-border-subtle p-5 sm:p-6', className)}>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-app-text-muted">
            오답 노트
          </p>
          <h2 className="font-serif text-xl text-app-heading">다시 풀어볼 문제</h2>
        </div>
        <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
          {items.length}개
        </span>
      </div>

      {items.length > 0 && (
        <div className="mb-3 text-right">
          <Link
            href="/wrong-notes"
            className="text-xs font-semibold text-app-accent hover:underline"
          >
            오답 노트 전체 보기 →
          </Link>
        </div>
      )}

      {isLoading ? (
        <p className="py-8 text-center text-sm text-app-text-muted">불러오는 중…</p>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-app-border bg-app-surface-muted px-4 py-10 text-center">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-app-border" />
          <p className="text-sm font-medium text-app-text">오답이 없습니다</p>
          <p className="mt-1 text-xs text-app-text-muted">첫 시도에 틀린 문제가 여기에 모입니다.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.problemId}>
              <Link
                href={`/wrong-notes?problem=${item.problemId}`}
                className="group flex items-start gap-3 rounded-lg border border-app-border px-3 py-3 transition-colors hover:border-orange-200 hover:bg-orange-50/60"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-app-text group-hover:text-orange-700">
                    {getProblemLabel(item.problemId)}
                  </p>
                  <p className="mt-0.5 text-xs text-app-text-muted">{item.pageTitle}</p>
                  {item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-app-surface-muted px-1.5 py-0.5 text-[10px] font-semibold text-app-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-[10px] text-app-text-muted">
                    시도 {item.attempts}회 · 힌트 {item.hintsUsed}회 ·{' '}
                    {formatDuration(item.timeSpentMs)} · {formatDate(item.lastAttemptAt)}
                  </p>
                </div>

                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-app-border group-hover:text-orange-600" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
