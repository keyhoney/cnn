'use client';

import { useEffect, useRef } from 'react';
import { addPageTimeSpent, recordPageVisit } from '@/lib/progress';
import { getOrCreateUserId } from '@/lib/user';

/** 페이지 방문·체류 시간 기록 (P6-01) */
export function usePageVisit(bookId: string, pageId: string) {
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    startRef.current = Date.now();

    try {
      const userId = getOrCreateUserId();
      void recordPageVisit(userId, bookId, pageId);
    } catch {
      // ignore
    }

    return () => {
      const deltaMs = Date.now() - startRef.current;
      if (deltaMs < 500) return;

      try {
        const userId = getOrCreateUserId();
        void addPageTimeSpent(userId, bookId, pageId, deltaMs);
      } catch {
        // ignore
      }
    };
  }, [bookId, pageId]);
}
