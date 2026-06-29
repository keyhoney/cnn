'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import type { TableOfContents } from '@/lib/content';
import { useBookmarkList } from '@/hooks/useBookmarks';

interface BookBookmarkSectionProps {
  toc: TableOfContents;
}

/** 교재 목차 페이지 북마크 요약 (P6-02) */
export function BookBookmarkSection({ toc }: BookBookmarkSectionProps) {
  const { bookmarks, isLoading } = useBookmarkList(toc.bookId);

  const items = useMemo(() => {
    const pageMap = new Map(
      toc.chapters.flatMap((chapter) =>
        chapter.sections.flatMap((section) =>
          section.pages.map((page) => [page.id, page] as const)
        )
      )
    );

    return bookmarks
      .map((bookmark) => {
        const page = pageMap.get(bookmark.pageId);
        if (!page) return null;
        return { ...bookmark, page };
      })
      .filter((item): item is NonNullable<typeof item> => item != null);
  }, [bookmarks, toc]);

  if (isLoading || items.length === 0) return null;

  return (
    <section className="border-b border-app-border px-6 py-4 sm:px-8">
      <div className="mb-3 flex items-center gap-2">
        <Bookmark className="h-4 w-4 text-bookmark" />
        <h3 className="text-sm font-bold text-app-heading">북마크 ({items.length})</h3>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.page.href}
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-app-accent-soft"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-app-surface-muted font-mono text-[10px]">
                {item.page.pageNumber}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-app-text">{item.page.title}</p>
                {item.memo && (
                  <p className="truncate text-[10px] text-app-text-muted">{item.memo}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
