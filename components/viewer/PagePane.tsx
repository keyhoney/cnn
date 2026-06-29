'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { getPageTypeLabel, type PageType } from '@/lib/page-utils';
import { ProblemPageProvider } from '@/components/problem/ProblemPageContext';
import { PageCompleteButton } from '@/components/progress/PageCompleteButton';
import { HighlightLayer } from '@/components/highlight/HighlightLayer';
import { DrawingToolbar } from '@/components/drawing/DrawingToolbar';
import { DrawingSaveIndicator } from '@/components/drawing/DrawingSaveIndicator';
import { DRAWING_TOOL_LABELS } from '@/hooks/use-drawing-gestures';
import { useDrawingPersistence } from '@/hooks/use-drawing-persistence';
import { useDrawingStore } from '@/stores/drawingStore';
import { cn } from '@/lib/utils';

const DrawingCanvas = dynamic(() => import('@/components/drawing/DrawingCanvas'), {
  ssr: false,
});

interface PagePaneProps {
  bookId: string;
  chapterId: string;
  pageId: string;
  pageNumber: number;
  title: string;
  type: PageType;
  side: 'left' | 'right';
  isActive?: boolean;
  children: React.ReactNode;
}

export function PagePane({
  bookId,
  chapterId,
  pageId,
  pageNumber,
  title,
  type,
  side,
  isActive = false,
  children,
}: PagePaneProps) {
  const isDrawingMode = useDrawingStore((s) => s.isDrawingMode);
  const currentTool = useDrawingStore((s) => s.currentTool);
  const setPageStrokes = useDrawingStore((s) => s.setPageStrokes);
  const recordPageHistory = useDrawingStore((s) => s.recordPageHistory);
  const articleRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { saveStatus } = useDrawingPersistence({ bookId, pageId });

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const update = () => {
      setDimensions({
        width: el.clientWidth,
        height: el.scrollHeight,
      });
    };

    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);
    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(el, { childList: true, subtree: true, attributes: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const clearStrokes = useCallback(() => {
    const prev = useDrawingStore.getState().getPageStrokes(pageId);
    if (prev.length === 0) return;
    recordPageHistory(pageId, prev);
    setPageStrokes(pageId, []);
  }, [pageId, recordPageHistory, setPageStrokes]);

  return (
    <article
      ref={articleRef}
      data-page-id={pageId}
      data-side={side}
      className={cn(
        'relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain touch-pan-y scrollbar-subtle page-card',
        isActive && 'ring-2 ring-app-accent/30 ring-offset-2 ring-offset-app-bg'
      )}
      aria-label={`${title} (${getPageTypeLabel(type)})`}
    >
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-app-border-subtle bg-app-surface/80 px-4 py-2.5 backdrop-blur-md" data-print-hide>
        <span className="chip-muted font-mono">{pageNumber}p</span>
        <div className="flex min-w-0 items-center gap-2">
          <PageCompleteButton bookId={bookId} pageId={pageId} />
          <span className="chip">{getPageTypeLabel(type)}</span>
        </div>
      </header>

      {isDrawingMode && (
        <div
          className="pointer-events-none sticky top-12 z-30 flex flex-col items-start gap-1 px-4 print:hidden"
          data-no-flip
        >
          <div
            className="rounded-md bg-app-accent/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
            aria-live="polite"
          >
            {DRAWING_TOOL_LABELS[currentTool] ?? '필기 중'}
          </div>
          <DrawingSaveIndicator status={saveStatus} />
        </div>
      )}

      <div ref={contentRef} className="relative">
        <div
          className={cn(
            'prose-app p-4 sm:p-5 md:p-6',
            'prose-p:leading-relaxed prose-li:leading-relaxed'
          )}
        >
          <HighlightLayer bookId={bookId} pageId={pageId}>
            <ProblemPageProvider bookId={bookId} chapterId={chapterId} pageId={pageId}>
              {children}
            </ProblemPageProvider>
          </HighlightLayer>
        </div>

        {dimensions.width > 0 && dimensions.height > 0 && (
          <DrawingCanvas
            width={dimensions.width}
            height={dimensions.height}
            bookId={bookId}
            pageId={pageId}
            scrollContainerRef={articleRef}
          />
        )}
      </div>

      {isDrawingMode && (
        <div
          className="sticky bottom-0 z-40 flex justify-center px-2 pb-3 pt-2 print:hidden"
          data-no-flip
        >
          <DrawingToolbar pageId={pageId} onClear={clearStrokes} className="pointer-events-auto" />
        </div>
      )}
    </article>
  );
}

/** 스프레드 가운데 책등 효과 */
export function BookSpine() {
  return (
    <div className="relative z-10 w-3 shrink-0 self-stretch" aria-hidden data-book-spine>
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-app-border" />
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-black/10 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-l from-black/10 to-transparent" />
    </div>
  );
}
