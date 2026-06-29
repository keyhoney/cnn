'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  computeBookProgressPercent,
  computeChapterProgress,
  getAllPageIdsFromToc,
  loadBookProgressRecords,
  setPageCompleted as persistPageCompleted,
  type ChapterProgress,
} from '@/lib/progress';
import type { TableOfContents } from '@/lib/content';
import { getOrCreateUserId } from '@/lib/user';

interface ProgressState {
  activeBookId: string | null;
  completedPageIds: Set<string>;
  isHydrated: boolean;
}

interface ProgressActions {
  hydrateBook: (bookId: string) => Promise<void>;
  markPageCompleted: (bookId: string, pageId: string) => Promise<void>;
  markPageIncomplete: (bookId: string, pageId: string) => Promise<void>;
  isPageCompleted: (bookId: string, pageId: string) => boolean;
  getChapterProgressMap: (toc: TableOfContents) => Record<string, ChapterProgress>;
  getBookProgressPercent: (toc: TableOfContents) => number;
  reset: () => void;
}

export type ProgressStore = ProgressState & ProgressActions;

const initialState: ProgressState = {
  activeBookId: null,
  completedPageIds: new Set<string>(),
  isHydrated: false,
};

export const useProgressStore = create<ProgressStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      hydrateBook: async (bookId) => {
        try {
          const userId = getOrCreateUserId();
          const records = await loadBookProgressRecords(userId, bookId);
          const completed = new Set(
            records.filter((record) => record.completed).map((record) => record.pageId)
          );

          set(
            { activeBookId: bookId, completedPageIds: completed, isHydrated: true },
            false,
            'progress/hydrateBook'
          );
        } catch {
          set({ activeBookId: bookId, isHydrated: true }, false, 'progress/hydrateBookFailed');
        }
      },

      markPageCompleted: async (bookId, pageId) => {
        set(
          (state) => ({
            completedPageIds: new Set([...state.completedPageIds, pageId]),
          }),
          false,
          'progress/markCompleted'
        );

        try {
          const userId = getOrCreateUserId();
          await persistPageCompleted(userId, bookId, pageId, true);
        } catch {
          // ignore
        }
      },

      markPageIncomplete: async (bookId, pageId) => {
        set(
          (state) => {
            const next = new Set(state.completedPageIds);
            next.delete(pageId);
            return { completedPageIds: next };
          },
          false,
          'progress/markIncomplete'
        );

        try {
          const userId = getOrCreateUserId();
          await persistPageCompleted(userId, bookId, pageId, false);
        } catch {
          // ignore
        }
      },

      isPageCompleted: (bookId, pageId) => {
        const { activeBookId, completedPageIds } = get();
        if (activeBookId !== bookId) return false;
        return completedPageIds.has(pageId);
      },

      getChapterProgressMap: (toc) => {
        const { completedPageIds } = get();
        return computeChapterProgress(toc.chapters, completedPageIds);
      },

      getBookProgressPercent: (toc) => {
        const { completedPageIds } = get();
        return computeBookProgressPercent(
          toc.totalPages,
          completedPageIds,
          getAllPageIdsFromToc(toc)
        );
      },

      reset: () => set({ ...initialState, completedPageIds: new Set() }, false, 'progress/reset'),
    }),
    { name: 'progress-store' }
  )
);
