'use client';

import { getProblemLabel } from '@/lib/dashboard-content';
import type { WrongAnswerItem } from '@/lib/dashboard-stats';
import { formatDuration } from '@/lib/dashboard-stats';
import { hasProblemDefinition } from '@/lib/problem-registry';
import { cn } from '@/lib/utils';
import { AlertCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/eterna/Reveal';
import { staggerDelay } from '@/lib/eterna-motion';

interface WrongNotesListProps {
  items: WrongAnswerItem[];
  selectedId: string | null;
  isLoading?: boolean;
  onSelect: (problemId: string) => void;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

const GRADIENTS = [
  'linear-gradient(135deg, #1b4dfe 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #fe881b 0%, #ffd600 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #1b4dfe 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #1b4dfe 100%)',
];

function gradientForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % GRADIENTS.length;
  return GRADIENTS[hash];
}

/** 오답 노트 목록 — Insights 카드 패턴 */
export function WrongNotesList({
  items,
  selectedId,
  isLoading,
  onSelect,
}: WrongNotesListProps) {
  if (isLoading) {
    return (
      <div className="surface-card p-6">
        <p className="py-12 text-center text-sm text-app-text-muted">불러오는 중…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="surface-card p-6">
        <div className="rounded-lg border border-dashed border-app-border bg-app-surface-muted px-4 py-12 text-center">
          <AlertCircle className="mx-auto mb-2 h-10 w-10 text-app-border" />
          <p className="text-sm font-medium text-app-text">오답이 없습니다</p>
          <p className="mt-1 text-xs text-app-text-muted">
            첫 시도에 틀린 문제가 여기에 모입니다.
          </p>
          <Link href="/math-grade1/ch01/page03" className="btn-primary mt-4 text-sm">
            연습 문제 풀러 가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-app-border px-4 py-3">
        <p className="section-header">Insights</p>
        <h2 className="heading-display-sm font-serif">{items.length}개 오답</h2>
      </div>

      <ul className="max-h-[min(70vh,640px)] space-y-3 overflow-y-auto p-3">
        {items.map((item, index) => {
          const isSelected = item.problemId === selectedId;
          const canRetryInline = hasProblemDefinition(item.problemId);
          const primaryTag = item.tags[0] ?? '오답';

          return (
            <Reveal key={item.problemId} as="li" delay={staggerDelay(index)}>
              <button
                  type="button"
                  onClick={() => onSelect(item.problemId)}
                  className={cn(
                    'card-elevated w-full overflow-hidden text-left transition-all',
                    isSelected && 'tab-card-active'
                  )}
                >
                  <div
                    className="relative flex h-14 items-end px-4 pb-2"
                    style={{ background: gradientForId(item.problemId) }}
                  >
                    <span className="chip-muted border-0 bg-white/20 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      {primaryTag}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 p-4">
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        isSelected ? 'bg-app-accent text-white' : 'bg-app-accent-soft text-app-accent'
                      )}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-app-text">{getProblemLabel(item.problemId)}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-app-text-muted">
                        <BookOpen className="h-3 w-3" />
                        {item.pageTitle}
                      </p>
                      {item.tags.length > 1 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.tags.slice(1).map((tag) => (
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
                        {formatDuration(item.timeSpentMs)}
                      </p>
                      <p className="text-[10px] text-app-text-muted">{formatDate(item.lastAttemptAt)}</p>
                      {canRetryInline && (
                        <span className="mt-2 inline-block rounded bg-app-accent-soft px-2 py-0.5 text-[10px] font-bold text-app-accent">
                          앱에서 재풀이 가능
                        </span>
                      )}
                    </div>
                  </div>
                </button>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
