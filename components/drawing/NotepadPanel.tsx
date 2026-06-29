'use client';

import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { GripHorizontal, NotebookPen, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useViewerStore } from '@/stores/viewerStore';
import { useNotepadStore } from '@/stores/notepadStore';
import { getNotepadPageId, NOTEPAD_BACKGROUNDS, type NotepadBackground } from '@/lib/notepad';
import { cn } from '@/lib/utils';

const NotepadCanvas = dynamic(
  () => import('@/components/drawing/NotepadCanvas').then((m) => m.NotepadCanvas),
  { ssr: false }
);

interface NotepadPanelProps {
  bookId: string;
  pageId: string;
}

/** 슬라이드업 필기 노트패드 (P4-06) */
export function NotepadPanel({ bookId, pageId }: NotepadPanelProps) {
  const isOpen = useViewerStore((s) => s.isNotepadOpen);
  const setNotepadOpen = useViewerStore((s) => s.setNotepadOpen);
  const panelRef = useRef<HTMLElement>(null);
  useFocusTrap(panelRef, isOpen);

  const notepadKey = useMemo(() => getNotepadPageId(bookId, pageId), [bookId, pageId]);
  const background = useNotepadStore((s) => s.getBackground(notepadKey));
  const setBackground = useNotepadStore((s) => s.setBackground);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => setNotepadOpen(false);

  const handleBackgroundChange = (value: NotepadBackground) => {
    setBackground(notepadKey, value);
  };

  if (!isOpen) return null;

  const panel = (
    <>
      <button
        type="button"
        data-print-hide
        className="fixed inset-0 z-[55] bg-black/30 backdrop-blur-[1px]"
        aria-label="노트패드 닫기"
        onClick={handleClose}
      />

      <section
        ref={panelRef}
        data-print-hide
        className={cn(
          'spectrum-border fixed inset-x-0 bottom-0 z-[60] flex h-[min(70vh,560px)] flex-col',
          'border-t border-app-border bg-app-surface shadow-[0_-8px_30px_rgba(0,0,0,0.12)]',
          'pb-[env(safe-area-inset-bottom,0px)]'
        )}
        aria-label="필기 노트패드"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-app-border px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <GripHorizontal className="h-4 w-4 shrink-0 text-app-text-muted" aria-hidden />
            <h2 className="truncate text-sm font-bold text-app-text">풀이 노트패드</h2>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <div className="segmented-control" role="group" aria-label="배경 선택">
              {NOTEPAD_BACKGROUNDS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleBackgroundChange(value)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors',
                    background === value
                      ? 'bg-app-accent text-white'
                      : 'text-app-text-muted hover:bg-app-surface hover:text-app-text'
                  )}
                  aria-pressed={background === value}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-app-text-muted transition-colors hover:bg-app-surface-muted hover:text-app-text"
              aria-label="노트패드 닫기"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <NotepadCanvas
          bookId={bookId}
          pageId={notepadKey}
          notepadKey={pageId}
          background={background}
        />
      </section>
    </>
  );

  return createPortal(panel, document.body);
}

/** 하단바용 노트패드 토글 */
export function NotepadToggle() {
  const isNotepadOpen = useViewerStore((s) => s.isNotepadOpen);
  const toggleNotepad = useViewerStore((s) => s.toggleNotepad);
  const setTOCOpen = useViewerStore((s) => s.setTOCOpen);
  const setSearchOpen = useViewerStore((s) => s.setSearchOpen);

  const handleToggle = () => {
    setTOCOpen(false);
    setSearchOpen(false);
    useViewerStore.getState().setBookmarkPanelOpen(false);
    toggleNotepad();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        'flex h-10 min-w-[44px] items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold uppercase tracking-wider transition-colors sm:px-3',
        isNotepadOpen
          ? 'bg-app-accent text-white shadow-sm'
          : 'text-app-text-muted hover:bg-app-surface hover:text-app-text'
      )}
      aria-label={isNotepadOpen ? '노트패드 닫기' : '노트패드 열기'}
      aria-pressed={isNotepadOpen}
      title="풀이 노트패드"
    >
      <NotebookPen className="h-4 w-4 shrink-0" aria-hidden />
      <span className="hidden sm:inline">노트</span>
    </button>
  );
}
