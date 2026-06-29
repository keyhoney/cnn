'use client';

import { useEffect } from 'react';
import { BADGE_DEFINITIONS, type BadgeId } from '@/lib/types/badges';
import { useBadgeStore } from '@/stores/badgeStore';
import { cn } from '@/lib/utils';
import { RevealStagger } from '@/components/eterna/Reveal';

interface BadgeGalleryProps {
  className?: string;
}

function formatEarnedDate(date?: Date) {
  if (!date) return null;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/** 뱃지 갤러리 UI — card-elevated + earned ring */
export function BadgeGallery({ className }: BadgeGalleryProps) {
  const hydrate = useBadgeStore((s) => s.hydrate);
  const isHydrated = useBadgeStore((s) => s.isHydrated);
  const earnedBadgeIds = useBadgeStore((s) => s.earnedBadgeIds);
  const earnedAtMap = useBadgeStore((s) => s.earnedAtMap);

  useEffect(() => {
    if (!isHydrated) void hydrate();
  }, [isHydrated, hydrate]);

  const earnedCount = earnedBadgeIds.size;
  const totalCount = BADGE_DEFINITIONS.length;

  return (
    <section className={cn('surface-card p-5 sm:p-6', className)}>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="section-header">성취 뱃지</p>
          <h2 className="heading-display-sm font-serif">뱃지 갤러리</h2>
        </div>
        <p className="font-mono text-sm font-semibold text-app-accent">
          {earnedCount}/{totalCount}
        </p>
      </div>

      {!isHydrated ? (
        <p className="py-8 text-center text-sm text-app-text-muted">불러오는 중…</p>
      ) : (
        <RevealStagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {BADGE_DEFINITIONS.map((badge) => {
              const earned = earnedBadgeIds.has(badge.id as BadgeId);
              const earnedAt = earnedAtMap[badge.id as BadgeId];

              return (
                <article
                  key={badge.id}
                  className={cn(
                    'card-elevated rounded-xl p-4 transition-all',
                    earned
                      ? 'tab-card-active border-bookmark/40 bg-bookmark-soft/50'
                      : 'opacity-60 grayscale'
                  )}
                >
                  <div
                    className={cn(
                      'mb-3 flex h-12 w-12 items-center justify-center rounded-full text-2xl',
                      earned
                        ? 'bg-app-surface shadow-app-md ring-2 ring-bookmark/50 ring-offset-2 ring-offset-app-surface'
                        : 'bg-app-surface-muted'
                    )}
                  >
                    {badge.emoji}
                  </div>
                  <h3 className="text-sm font-bold text-app-text">{badge.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-app-text-muted">
                    {badge.description}
                  </p>
                  {earned && earnedAt && (
                    <p className="mt-2 text-[10px] font-semibold text-bookmark">
                      {formatEarnedDate(earnedAt)} 획득
                    </p>
                  )}
                  {!earned && (
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-app-text-muted">
                      미획득
                    </p>
                  )}
                </article>
              );
            })}
        </RevealStagger>
      )}
    </section>
  );
}
