'use client';

import { Bookmark, List } from 'lucide-react';
import { DrawingToggle } from '@/components/drawing/DrawingToggle';
import { NotepadToggle } from '@/components/drawing/NotepadPanel';
import { BookmarkListToggle } from '@/components/navigation/BookmarkPanel';
import { cn } from '@/lib/utils';

interface BottomBarProps {
  progressPercent: number;
  pageNumber: number;
  totalPages: number;
  isBookmarked: boolean;
  isBookmarkLoading?: boolean;
  bookmarkCount?: number;
  isBookmarkPanelOpen?: boolean;
  onToggleBookmark: () => void;
  onToggleBookmarkPanel: () => void;
  onToggleTOC: () => void;
  isTOCOpen: boolean;
  className?: string;
}

export function BottomBar({
  progressPercent,
  pageNumber,
  totalPages,
  isBookmarked,
  isBookmarkLoading,
  bookmarkCount = 0,
  isBookmarkPanelOpen = false,
  onToggleBookmark,
  onToggleBookmarkPanel,
  onToggleTOC,
  isTOCOpen,
  className,
}: BottomBarProps) {
  return (
    <footer
      data-print-hide
      className={cn(
        'glass-bar z-20 flex h-12 shrink-0 items-center justify-between gap-2 border-t px-2 sm:h-14 sm:gap-4 sm:px-4',
        className
      )}
    >
      <button
        type="button"
        onClick={onToggleTOC}
        className={cn(
          'flex h-10 min-w-[44px] items-center justify-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-all duration-200 sm:px-3',
          isTOCOpen
            ? 'spectrum-border bg-app-accent text-white shadow-app-sm'
            : 'text-app-text-muted hover:bg-app-surface-muted hover:text-app-text'
        )}
        aria-label="목차"
        aria-expanded={isTOCOpen}
      >
        <List className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">목차</span>
      </button>

      <DrawingToggle />

      <NotepadToggle />

      <div className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-md sm:gap-3">
        <div className="progress-track min-w-0 flex-1">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`학습 진도 ${progressPercent}%`}
          />
        </div>
        <span className="hidden shrink-0 font-mono text-[11px] font-semibold text-app-text-muted sm:inline">
          {progressPercent}%
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={onToggleBookmark}
          disabled={isBookmarkLoading}
          className={cn(
            'btn-icon h-10 w-10 rounded-xl',
            isBookmarked && 'bg-bookmark-soft text-bookmark ring-1 ring-bookmark/30 hover:bg-bookmark-soft'
          )}
          aria-label={isBookmarked ? '북마크 해제 (B)' : '북마크 추가 (B)'}
          aria-pressed={isBookmarked}
          title={isBookmarked ? '북마크 해제 (B)' : '북마크 (B)'}
        >
          <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
        </button>

        <BookmarkListToggle
          count={bookmarkCount}
          isOpen={isBookmarkPanelOpen}
          onToggle={onToggleBookmarkPanel}
        />
      </div>

      <div className="shrink-0 font-mono text-[11px] font-semibold tabular-nums text-app-text-muted sm:text-xs">
        <span className="text-app-accent">{pageNumber}</span>
        <span className="mx-0.5 text-app-border">/</span>
        {totalPages}
      </div>
    </footer>
  );
}
