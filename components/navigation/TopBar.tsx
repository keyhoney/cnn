'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Printer, QrCode, Search, Settings } from 'lucide-react';
import { AnimationToggle } from '@/components/layout/AnimationToggle';
import { cn } from '@/lib/utils';

interface TopBarProps {
  bookId: string;
  bookTitle?: string;
  chapterTitle?: string;
  sectionTitle?: string;
  pageTitle?: string;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onSearch: () => void;
  onShareQR?: () => void;
  onPrint?: () => void;
  settingsHref?: string;
  className?: string;
}

export function TopBar({
  bookId,
  bookTitle,
  chapterTitle,
  sectionTitle,
  pageTitle,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onSearch,
  onShareQR,
  onPrint,
  settingsHref = '/settings',
  className,
}: TopBarProps) {
  return (
    <header
      data-print-hide
      className={cn('glass-bar z-20 flex h-12 shrink-0 items-center justify-between gap-2 px-2 sm:h-14 sm:gap-3 sm:px-4', className)}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className="btn-icon h-10 w-10 shrink-0 sm:h-11 sm:w-11"
          aria-label="이전 페이지"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <Link
          href={`/${bookId}`}
          className="btn-icon h-10 w-10 shrink-0 sm:h-11 sm:w-11"
          aria-label="목차로 돌아가기"
        >
          <ArrowLeft className="h-5 w-5 text-app-text-muted" />
        </Link>

        <div className="hidden h-6 w-px shrink-0 bg-app-border sm:block" />

        <div className="min-w-0 flex-1 flex-col px-1">
          {(bookTitle || chapterTitle) && (
            <span className="truncate text-[11px] font-medium leading-none text-app-text-muted">
              {[bookTitle, chapterTitle].filter(Boolean).join(' · ')}
            </span>
          )}
          <span className="truncate text-xs font-semibold tracking-tight text-app-text sm:text-sm">
            {sectionTitle && (
              <span className="text-app-text-muted">{sectionTitle} — </span>
            )}
            {pageTitle}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <button
          type="button"
          onClick={onSearch}
          className="btn-icon h-10 w-10 sm:h-11 sm:w-11"
          aria-label="검색 (Ctrl+F)"
          title="검색 (Ctrl+F)"
        >
          <Search className="h-5 w-5" />
        </button>

        {onShareQR && (
          <button
            type="button"
            onClick={onShareQR}
            className="btn-icon h-10 w-10 sm:h-11 sm:w-11"
            aria-label="이 페이지 QR 공유"
            title="QR 공유"
          >
            <QrCode className="h-5 w-5" />
          </button>
        )}

        {onPrint && (
          <button
            type="button"
            onClick={onPrint}
            className="btn-icon h-10 w-10 sm:h-11 sm:w-11"
            aria-label="페이지 인쇄 (Ctrl+P)"
            title="인쇄 (Ctrl+P)"
          >
            <Printer className="h-5 w-5" />
          </button>
        )}

        <AnimationToggle className="hidden sm:flex" />

        <Link
          href={settingsHref}
          className="btn-icon h-10 w-10 sm:h-11 sm:w-11"
          aria-label="설정"
        >
          <Settings className="h-5 w-5" />
        </Link>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="btn-icon h-10 w-10 shrink-0 hover:text-app-accent sm:h-11 sm:w-11"
          aria-label="다음 페이지"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
