'use client';

import { useCallback, useEffect, useState } from 'react';
import { useBookmarkStore } from '@/stores/bookmarkStore';

/** 현재 페이지 북마크 상태 (P6-02) */
export function useBookmark(bookId: string, pageId: string) {
  const hydrateBook = useBookmarkStore((s) => s.hydrateBook);
  const isHydrated = useBookmarkStore((s) => s.isHydrated);
  const activeBookId = useBookmarkStore((s) => s.activeBookId);
  const isBookmarked = useBookmarkStore((s) => s.isBookmarked(bookId, pageId));
  const getBookmarkMemo = useBookmarkStore((s) => s.getBookmarkMemo);
  const addBookmark = useBookmarkStore((s) => s.addBookmark);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);
  const updateMemo = useBookmarkStore((s) => s.updateMemo);

  const [memoDialogOpen, setMemoDialogOpen] = useState(false);

  useEffect(() => {
    if (!bookId) return;
    if (activeBookId === bookId && isHydrated) return;
    void hydrateBook(bookId);
  }, [bookId, activeBookId, isHydrated, hydrateBook]);

  const openMemoDialog = useCallback(() => setMemoDialogOpen(true), []);
  const closeMemoDialog = useCallback(() => setMemoDialogOpen(false), []);

  const toggleBookmark = useCallback(() => {
    if (isBookmarked) {
      void removeBookmark(bookId, pageId);
      return;
    }
    setMemoDialogOpen(true);
  }, [isBookmarked, removeBookmark, bookId, pageId]);

  const confirmAddBookmark = useCallback(
    async (memo?: string) => {
      await addBookmark(bookId, pageId, memo);
      setMemoDialogOpen(false);
    },
    [addBookmark, bookId, pageId]
  );

  const saveMemo = useCallback(
    async (memo: string) => {
      if (isBookmarked) {
        await updateMemo(bookId, pageId, memo);
      } else {
        await addBookmark(bookId, pageId, memo);
      }
      setMemoDialogOpen(false);
    },
    [isBookmarked, updateMemo, addBookmark, bookId, pageId]
  );

  return {
    isBookmarked,
    memo: getBookmarkMemo(bookId, pageId),
    isLoading: !isHydrated,
    toggleBookmark,
    memoDialogOpen,
    openMemoDialog,
    closeMemoDialog,
    confirmAddBookmark,
    saveMemo,
  };
}

/** 교재 북마크 목록 (P6-02) */
export function useBookmarkList(bookId: string) {
  const hydrateBook = useBookmarkStore((s) => s.hydrateBook);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const isHydrated = useBookmarkStore((s) => s.isHydrated);
  const activeBookId = useBookmarkStore((s) => s.activeBookId);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);
  const updateMemo = useBookmarkStore((s) => s.updateMemo);

  useEffect(() => {
    if (!bookId) return;
    if (activeBookId === bookId && isHydrated) return;
    void hydrateBook(bookId);
  }, [bookId, activeBookId, isHydrated, hydrateBook]);

  return {
    bookmarks,
    isLoading: !isHydrated,
    removeBookmark: (pageId: string) => removeBookmark(bookId, pageId),
    updateMemo: (pageId: string, memo: string) => updateMemo(bookId, pageId, memo),
  };
}
