'use client';

import { useEffect } from 'react';
import { useProgressStore } from '@/stores/progressStore';
import type { TableOfContents } from '@/lib/content';

/** 교재 진도 hydrate + 완료율 조회 (P6-01) */
export function useBookProgress(bookId: string, toc?: TableOfContents | null) {
  const hydrateBook = useProgressStore((s) => s.hydrateBook);
  const isHydrated = useProgressStore((s) => s.isHydrated);
  const activeBookId = useProgressStore((s) => s.activeBookId);
  const completedPageIds = useProgressStore((s) => s.completedPageIds);
  const getBookProgressPercent = useProgressStore((s) => s.getBookProgressPercent);
  const getChapterProgressMap = useProgressStore((s) => s.getChapterProgressMap);

  useEffect(() => {
    if (!bookId) return;
    if (activeBookId === bookId && isHydrated) return;
    void hydrateBook(bookId);
  }, [bookId, activeBookId, isHydrated, hydrateBook]);

  const bookProgressPercent = toc && isHydrated ? getBookProgressPercent(toc) : 0;
  const chapterProgress = toc && isHydrated ? getChapterProgressMap(toc) : {};

  return {
    isHydrated,
    bookProgressPercent,
    chapterProgress,
    completedCount: completedPageIds.size,
  };
}
