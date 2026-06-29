'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  addBookmark as persistAddBookmark,
  loadBookBookmarks,
  removeBookmark as persistRemoveBookmark,
  updateBookmarkMemo as persistUpdateMemo,
  type BookmarkWithId,
} from '@/lib/bookmarks';
import { getOrCreateUserId } from '@/lib/user';

interface BookmarkState {
  activeBookId: string | null;
  bookmarks: BookmarkWithId[];
  isHydrated: boolean;
}

interface BookmarkActions {
  hydrateBook: (bookId: string) => Promise<void>;
  addBookmark: (bookId: string, pageId: string, memo?: string) => Promise<void>;
  removeBookmark: (bookId: string, pageId: string) => Promise<void>;
  updateMemo: (bookId: string, pageId: string, memo: string) => Promise<void>;
  isBookmarked: (bookId: string, pageId: string) => boolean;
  getBookmarkMemo: (bookId: string, pageId: string) => string | undefined;
}

export type BookmarkStore = BookmarkState & BookmarkActions;

const initialState: BookmarkState = {
  activeBookId: null,
  bookmarks: [],
  isHydrated: false,
};

export const useBookmarkStore = create<BookmarkStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      hydrateBook: async (bookId) => {
        try {
          const userId = getOrCreateUserId();
          const bookmarks = await loadBookBookmarks(userId, bookId);
          set({ activeBookId: bookId, bookmarks, isHydrated: true }, false, 'bookmark/hydrate');
        } catch {
          set({ activeBookId: bookId, isHydrated: true }, false, 'bookmark/hydrateFailed');
        }
      },

      addBookmark: async (bookId, pageId, memo) => {
        try {
          const userId = getOrCreateUserId();
          const created = await persistAddBookmark(userId, bookId, pageId, memo);
          if (!created) return;

          set(
            (state) => {
              const filtered = state.bookmarks.filter((item) => item.pageId !== pageId);
              return { bookmarks: [created, ...filtered] };
            },
            false,
            'bookmark/add'
          );
        } catch {
          // ignore
        }
      },

      removeBookmark: async (bookId, pageId) => {
        set(
          (state) => ({
            bookmarks: state.bookmarks.filter((item) => item.pageId !== pageId),
          }),
          false,
          'bookmark/remove'
        );

        try {
          const userId = getOrCreateUserId();
          await persistRemoveBookmark(userId, bookId, pageId);
        } catch {
          // ignore
        }
      },

      updateMemo: async (bookId, pageId, memo) => {
        set(
          (state) => ({
            bookmarks: state.bookmarks.map((item) =>
              item.pageId === pageId ? { ...item, memo: memo.trim() || undefined } : item
            ),
          }),
          false,
          'bookmark/updateMemo'
        );

        try {
          const userId = getOrCreateUserId();
          await persistUpdateMemo(userId, bookId, pageId, memo);
        } catch {
          // ignore
        }
      },

      isBookmarked: (bookId, pageId) => {
        const { activeBookId, bookmarks } = get();
        if (activeBookId !== bookId) return false;
        return bookmarks.some((item) => item.pageId === pageId);
      },

      getBookmarkMemo: (bookId, pageId) => {
        const { activeBookId, bookmarks } = get();
        if (activeBookId !== bookId) return undefined;
        return bookmarks.find((item) => item.pageId === pageId)?.memo;
      },

      reset: () => set({ ...initialState }, false, 'bookmark/reset'),
    }),
    { name: 'bookmark-store' }
  )
);
