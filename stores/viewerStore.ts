import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { FlipDirection } from '@/lib/types/stores';

interface ViewerState {
  currentBookId: string | null;
  currentPageId: string | null;
  currentSpread: number;
  totalSpreads: number;
  isFlipping: boolean;
  flipDirection: FlipDirection;
  isTOCOpen: boolean;
  isSearchOpen: boolean;
  isNotepadOpen: boolean;
  isBookmarkPanelOpen: boolean;
  isQRShareOpen: boolean;
}

interface ViewerActions {
  setCurrentPage: (bookId: string, pageId: string) => void;
  setSpread: (currentSpread: number, totalSpreads: number) => void;
  startFlip: (direction: FlipDirection) => void;
  endFlip: () => void;
  toggleTOC: () => void;
  setTOCOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleNotepad: () => void;
  setNotepadOpen: (open: boolean) => void;
  toggleBookmarkPanel: () => void;
  setBookmarkPanelOpen: (open: boolean) => void;
  toggleQRShare: () => void;
  setQRShareOpen: (open: boolean) => void;
  closeAllPanels: () => void;
  reset: () => void;
}

export type ViewerStore = ViewerState & ViewerActions;

const initialState: ViewerState = {
  currentBookId: null,
  currentPageId: null,
  currentSpread: 0,
  totalSpreads: 0,
  isFlipping: false,
  flipDirection: 'forward',
  isTOCOpen: false,
  isSearchOpen: false,
  isNotepadOpen: false,
  isBookmarkPanelOpen: false,
  isQRShareOpen: false,
};

export const useViewerStore = create<ViewerStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setCurrentPage: (bookId, pageId) =>
        set({ currentBookId: bookId, currentPageId: pageId }, false, 'viewer/setCurrentPage'),

      setSpread: (currentSpread, totalSpreads) =>
        set({ currentSpread, totalSpreads }, false, 'viewer/setSpread'),

      startFlip: (direction) =>
        set({ isFlipping: true, flipDirection: direction }, false, 'viewer/startFlip'),

      endFlip: () => set({ isFlipping: false }, false, 'viewer/endFlip'),

      toggleTOC: () => set((state) => ({ isTOCOpen: !state.isTOCOpen }), false, 'viewer/toggleTOC'),

      setTOCOpen: (open) => set({ isTOCOpen: open }, false, 'viewer/setTOCOpen'),

      toggleSearch: () =>
        set((state) => ({ isSearchOpen: !state.isSearchOpen }), false, 'viewer/toggleSearch'),

      setSearchOpen: (open) => set({ isSearchOpen: open }, false, 'viewer/setSearchOpen'),

      toggleNotepad: () =>
        set((state) => ({ isNotepadOpen: !state.isNotepadOpen }), false, 'viewer/toggleNotepad'),

      setNotepadOpen: (open) => set({ isNotepadOpen: open }, false, 'viewer/setNotepadOpen'),

      toggleBookmarkPanel: () =>
        set(
          (state) => ({ isBookmarkPanelOpen: !state.isBookmarkPanelOpen }),
          false,
          'viewer/toggleBookmarkPanel'
        ),

      setBookmarkPanelOpen: (open) =>
        set({ isBookmarkPanelOpen: open }, false, 'viewer/setBookmarkPanelOpen'),

      toggleQRShare: () =>
        set((state) => ({ isQRShareOpen: !state.isQRShareOpen }), false, 'viewer/toggleQRShare'),

      setQRShareOpen: (open) => set({ isQRShareOpen: open }, false, 'viewer/setQRShareOpen'),

      closeAllPanels: () =>
        set(
          {
            isTOCOpen: false,
            isSearchOpen: false,
            isNotepadOpen: false,
            isBookmarkPanelOpen: false,
            isQRShareOpen: false,
          },
          false,
          'viewer/closeAllPanels'
        ),

      reset: () => set(initialState, false, 'viewer/reset'),
    }),
    { name: 'viewer-store' }
  )
);
