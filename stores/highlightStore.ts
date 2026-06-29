'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  addPageHighlight,
  loadPageHighlights,
  removePageHighlight,
  updatePageHighlightColor,
  updatePageHighlightMemo,
  type HighlightWithId,
} from '@/lib/highlights';
import { getOrCreateUserId, initializeUser } from '@/lib/user';

interface HighlightState {
  activeKey: string | null;
  highlights: HighlightWithId[];
  isHydrated: boolean;
}

interface HighlightActions {
  hydratePage: (bookId: string, pageId: string) => Promise<void>;
  addHighlight: (
    bookId: string,
    pageId: string,
    selector: string,
    color: string,
    memo?: string
  ) => Promise<HighlightWithId | undefined>;
  removeHighlight: (highlightId: number) => Promise<void>;
  updateMemo: (highlightId: number, memo: string) => Promise<void>;
  updateColor: (highlightId: number, color: string) => Promise<void>;
  getHighlights: (bookId: string, pageId: string) => HighlightWithId[];
}

function pageKey(bookId: string, pageId: string) {
  return `${bookId}:${pageId}`;
}

export type HighlightStore = HighlightState & HighlightActions;

const initialState: HighlightState = {
  activeKey: null,
  highlights: [],
  isHydrated: false,
};

export const useHighlightStore = create<HighlightStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      hydratePage: async (bookId, pageId) => {
        const key = pageKey(bookId, pageId);
        try {
          const userId = getOrCreateUserId();
          const highlights = await loadPageHighlights(userId, bookId, pageId);
          set({ activeKey: key, highlights, isHydrated: true }, false, 'highlight/hydrate');
        } catch {
          set({ activeKey: key, isHydrated: true }, false, 'highlight/hydrateFailed');
        }
      },

      addHighlight: async (bookId, pageId, selector, color, memo) => {
        try {
          const userId = getOrCreateUserId();
          await initializeUser();
          const created = await addPageHighlight(userId, {
            bookId,
            pageId,
            selector,
            color,
            memo,
          });
          if (!created) return undefined;

          set(
            (state) => ({
              highlights: [...state.highlights, created],
            }),
            false,
            'highlight/add'
          );
          return created;
        } catch {
          return undefined;
        }
      },

      removeHighlight: async (highlightId) => {
        set(
          (state) => ({
            highlights: state.highlights.filter((item) => item.id !== highlightId),
          }),
          false,
          'highlight/remove'
        );

        try {
          const userId = getOrCreateUserId();
          await removePageHighlight(userId, highlightId);
        } catch {
          // ignore
        }
      },

      updateMemo: async (highlightId, memo) => {
        set(
          (state) => ({
            highlights: state.highlights.map((item) =>
              item.id === highlightId ? { ...item, memo: memo.trim() || undefined } : item
            ),
          }),
          false,
          'highlight/updateMemo'
        );

        try {
          const userId = getOrCreateUserId();
          await updatePageHighlightMemo(userId, highlightId, memo);
        } catch {
          // ignore
        }
      },

      updateColor: async (highlightId, color) => {
        set(
          (state) => ({
            highlights: state.highlights.map((item) =>
              item.id === highlightId ? { ...item, color } : item
            ),
          }),
          false,
          'highlight/updateColor'
        );

        try {
          const userId = getOrCreateUserId();
          await updatePageHighlightColor(userId, highlightId, color);
        } catch {
          // ignore
        }
      },

      getHighlights: (bookId, pageId) => {
        const { activeKey, highlights } = get();
        if (activeKey !== pageKey(bookId, pageId)) return [];
        return highlights;
      },
    }),
    { name: 'highlight-store' }
  )
);
