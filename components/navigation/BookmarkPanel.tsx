'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Pencil, Trash2, X } from 'lucide-react';
import type { TableOfContents } from '@/lib/content';
import type { PageMeta } from '@/lib/content';
import { getPageTypeLabel } from '@/lib/page-utils';
import { useBookmarkList } from '@/hooks/useBookmarks';
import { BookmarkMemoDialog } from '@/components/navigation/BookmarkMemoDialog';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { cn } from '@/lib/utils';

interface BookmarkPanelProps {
  toc: TableOfContents;
  bookId: string;
  currentPageId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface EnrichedBookmark {
  id: number;
  pageId: string;
  memo?: string;
  createdAt: Date;
  title: string;
  pageNumber: number;
  href: string;
  chapterId: string;
  type: PageMeta['type'];
}

function enrichBookmarks(
  toc: TableOfContents,
  bookmarks: Array<{ id: number; pageId: string; memo?: string; createdAt: Date }>
): EnrichedBookmark[] {
  const pageMap = new Map<
    string,
    { title: string; pageNumber: number; href: string; chapterId: string; type: PageMeta['type'] }
  >();

  for (const chapter of toc.chapters) {
    for (const section of chapter.sections) {
      for (const page of section.pages) {
        pageMap.set(page.id, {
          title: page.title,
          pageNumber: page.pageNumber,
          href: page.href,
          chapterId: page.chapterId,
          type: page.type,
        });
      }
    }
  }

  return bookmarks
    .map((bookmark) => {
      const meta = pageMap.get(bookmark.pageId);
      if (!meta) return null;
      return { ...bookmark, ...meta };
    })
    .filter((item): item is EnrichedBookmark => item != null);
}

/** 북마크 목록 사이드 패널 (P6-02) */
export function BookmarkPanel({ toc, bookId, currentPageId, isOpen, onClose }: BookmarkPanelProps) {
  const { bookmarks, isLoading, removeBookmark, updateMemo } = useBookmarkList(bookId);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  useFocusTrap(panelRef, isOpen);

  const enriched = useMemo(() => enrichBookmarks(toc, bookmarks), [toc, bookmarks]);
  const editingBookmark = enriched.find((item) => item.pageId === editingPageId);

  useEffect(() => {
    if (!isOpen) {
      setEditingPageId(null);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
        aria-label="북마크 패널 닫기"
        onClick={onClose}
      />

      <aside
        ref={panelRef}
        className="modal-panel fixed inset-y-0 right-0 z-50 flex w-[min(22rem,92vw)] flex-col border-l border-app-border-subtle"
        role="dialog"
        aria-modal="true"
        aria-label="북마크 목록"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-app-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-bookmark" />
            <div>
              <p className="section-header">북마크</p>
              <h2 className="font-serif text-base text-app-heading">{enriched.length}개 저장됨</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-app-text-muted transition-colors hover:bg-app-surface-muted"
            aria-label="북마크 패널 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-3">
          {isLoading && (
            <p className="py-8 text-center text-sm text-app-text-muted">불러오는 중…</p>
          )}

          {!isLoading && enriched.length === 0 && (
            <div className="rounded-xl border border-dashed border-app-border bg-app-surface-muted px-4 py-10 text-center">
              <Bookmark className="mx-auto mb-2 h-8 w-8 text-app-border" />
              <p className="text-sm font-medium text-app-text">저장된 북마크가 없습니다</p>
              <p className="mt-1 text-xs text-app-text-muted">
                하단 바 북마크 아이콘(B)으로 페이지를 저장하세요.
              </p>
            </div>
          )}

          <ul className="space-y-2">
            {enriched.map((item) => {
              const isActive = item.pageId === currentPageId;

              return (
                <li
                  key={item.id}
                  className={cn(
                    'rounded-xl border p-3 transition-colors',
                    isActive
                      ? 'border-app-accent/40 bg-app-accent-soft'
                      : 'hover:border-app-accent/20 border-app-border bg-app-surface'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <Link href={item.href} onClick={onClose} className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-app-surface-muted font-mono text-xs text-app-text-muted">
                          {item.pageNumber}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-app-text">
                            {item.title}
                          </p>
                          <p className="text-xs text-app-text-muted">
                            {getPageTypeLabel(item.type)}
                          </p>
                        </div>
                      </div>
                      {item.memo && (
                        <p className="mt-2 line-clamp-2 rounded-md bg-app-surface-muted px-2 py-1.5 text-xs text-app-text-muted">
                          {item.memo}
                        </p>
                      )}
                    </Link>

                    <div className="flex shrink-0 flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingPageId(item.pageId)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-app-text-muted hover:bg-app-surface-muted hover:text-app-accent"
                        aria-label="메모 수정"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeBookmark(item.pageId)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-app-text-muted hover:bg-status-error-soft hover:text-status-error"
                        aria-label="북마크 삭제"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <BookmarkMemoDialog
        isOpen={editingPageId != null}
        pageTitle={editingBookmark?.title}
        initialMemo={editingBookmark?.memo ?? ''}
        mode="edit"
        onClose={() => setEditingPageId(null)}
        onSave={(memo) => {
          if (editingPageId) {
            void updateMemo(editingPageId, memo);
          }
          setEditingPageId(null);
        }}
      />
    </>
  );
}

/** 하단 바 북마크 목록 토글 */
export function BookmarkListToggle({
  count,
  isOpen,
  onToggle,
}: {
  count: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'relative flex h-10 min-w-[36px] items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors',
        isOpen
          ? 'bg-bookmark-soft text-bookmark'
          : 'text-app-text-muted hover:bg-app-surface hover:text-app-text'
      )}
      aria-label="북마크 목록"
      aria-expanded={isOpen}
      title="북마크 목록"
    >
      <Bookmark className="h-4 w-4" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-bookmark px-1 text-[9px] font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
