'use client';

import { useEffect } from 'react';
import type { HighlightWithId } from '@/lib/highlights';
import { useHighlightStore } from '@/stores/highlightStore';

const EMPTY_HIGHLIGHTS: HighlightWithId[] = [];

/** 페이지 하이라이트 hydrate (P6-03) */
export function usePageHighlights(bookId: string, pageId: string) {
  const key = `${bookId}:${pageId}`;
  const hydratePage = useHighlightStore((s) => s.hydratePage);
  const highlights = useHighlightStore((s) =>
    s.activeKey === key ? s.highlights : EMPTY_HIGHLIGHTS
  );
  const isHydrated = useHighlightStore((s) => s.activeKey === key && s.isHydrated);
  const activeKey = useHighlightStore((s) => s.activeKey);
  const addHighlight = useHighlightStore((s) => s.addHighlight);
  const removeHighlight = useHighlightStore((s) => s.removeHighlight);
  const updateColor = useHighlightStore((s) => s.updateColor);

  useEffect(() => {
    if (!bookId || !pageId) return;
    if (activeKey === key && isHydrated) return;
    void hydratePage(bookId, pageId);
  }, [bookId, pageId, activeKey, isHydrated, hydratePage, key]);

  return {
    highlights,
    isHydrated,
    addHighlight: (selector: string, color: string) =>
      addHighlight(bookId, pageId, selector, color),
    removeHighlight,
    updateColor,
  };
}
