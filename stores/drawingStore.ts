import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DEFAULT_SETTINGS } from '@/lib/types/database';
import type { DrawingTool } from '@/lib/types/stores';
import { MAX_UNDO_HISTORY } from '@/lib/types/stores';
import { cloneStrokes, type DrawStroke } from '@/lib/drawing-strokes';

interface PageUndoStacks {
  history: DrawStroke[][];
  redoStack: DrawStroke[][];
}

interface DrawingState {
  isDrawingMode: boolean;
  currentTool: DrawingTool;
  currentColor: string;
  currentSize: number;
  pageDrawings: Record<string, DrawStroke[]>;
  pageUndo: Record<string, PageUndoStacks>;
  activeDrawingPageId: string | null;
}

interface DrawingActions {
  setDrawingMode: (enabled: boolean) => void;
  toggleDrawingMode: () => void;
  setTool: (tool: DrawingTool) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  setActiveDrawingPageId: (pageId: string | null) => void;
  getPageStrokes: (pageId: string) => DrawStroke[];
  setPageStrokes: (pageId: string, strokes: DrawStroke[]) => void;
  recordPageHistory: (pageId: string, previousStrokes: DrawStroke[]) => void;
  undoPage: (pageId: string) => boolean;
  redoPage: (pageId: string) => boolean;
  canUndoPage: (pageId: string) => boolean;
  canRedoPage: (pageId: string) => boolean;
  clearPageUndo: (pageId: string) => void;
  reset: () => void;
}

export type DrawingStore = DrawingState & DrawingActions;

/** Zustand selector에서 `?? []` 대신 사용 (매 렌더마다 새 배열 방지) */
export const EMPTY_STROKES: DrawStroke[] = [];

const initialState: DrawingState = {
  isDrawingMode: false,
  currentTool: DEFAULT_SETTINGS.penTool,
  currentColor: DEFAULT_SETTINGS.penColor,
  currentSize: DEFAULT_SETTINGS.penSize,
  pageDrawings: {},
  pageUndo: {},
  activeDrawingPageId: null,
};

function getPageUndo(state: DrawingState, pageId: string): PageUndoStacks {
  return state.pageUndo[pageId] ?? { history: [], redoStack: [] };
}

export const useDrawingStore = create<DrawingStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setDrawingMode: (enabled) =>
        set({ isDrawingMode: enabled }, false, 'drawing/setDrawingMode'),

      toggleDrawingMode: () =>
        set((state) => ({ isDrawingMode: !state.isDrawingMode }), false, 'drawing/toggleDrawingMode'),

      setTool: (tool) => set({ currentTool: tool }, false, 'drawing/setTool'),

      setColor: (color) => set({ currentColor: color }, false, 'drawing/setColor'),

      setSize: (size) => set({ currentSize: size }, false, 'drawing/setSize'),

      setActiveDrawingPageId: (pageId) =>
        set({ activeDrawingPageId: pageId }, false, 'drawing/setActiveDrawingPageId'),

      getPageStrokes: (pageId) => get().pageDrawings[pageId] ?? EMPTY_STROKES,

      setPageStrokes: (pageId, strokes) =>
        set(
          (state) => ({
            pageDrawings: { ...state.pageDrawings, [pageId]: strokes },
          }),
          false,
          'drawing/setPageStrokes'
        ),

      recordPageHistory: (pageId, previousStrokes) =>
        set(
          (state) => {
            const stacks = getPageUndo(state, pageId);
            return {
              pageUndo: {
                ...state.pageUndo,
                [pageId]: {
                  history: [...stacks.history, cloneStrokes(previousStrokes)].slice(
                    -MAX_UNDO_HISTORY
                  ),
                  redoStack: [],
                },
              },
            };
          },
          false,
          'drawing/recordPageHistory'
        ),

      undoPage: (pageId) => {
        const state = get();
        const stacks = getPageUndo(state, pageId);
        if (stacks.history.length === 0) return false;

        const previous = stacks.history[stacks.history.length - 1];
        const current = state.pageDrawings[pageId] ?? EMPTY_STROKES;

        set(
          {
            pageDrawings: { ...state.pageDrawings, [pageId]: cloneStrokes(previous) },
            pageUndo: {
              ...state.pageUndo,
              [pageId]: {
                history: stacks.history.slice(0, -1),
                redoStack: [...stacks.redoStack, cloneStrokes(current)],
              },
            },
          },
          false,
          'drawing/undoPage'
        );
        return true;
      },

      redoPage: (pageId) => {
        const state = get();
        const stacks = getPageUndo(state, pageId);
        if (stacks.redoStack.length === 0) return false;

        const next = stacks.redoStack[stacks.redoStack.length - 1];
        const current = state.pageDrawings[pageId] ?? EMPTY_STROKES;

        set(
          {
            pageDrawings: { ...state.pageDrawings, [pageId]: cloneStrokes(next) },
            pageUndo: {
              ...state.pageUndo,
              [pageId]: {
                history: [...stacks.history, cloneStrokes(current)],
                redoStack: stacks.redoStack.slice(0, -1),
              },
            },
          },
          false,
          'drawing/redoPage'
        );
        return true;
      },

      canUndoPage: (pageId) => getPageUndo(get(), pageId).history.length > 0,

      canRedoPage: (pageId) => getPageUndo(get(), pageId).redoStack.length > 0,

      clearPageUndo: (pageId) =>
        set(
          (state) => ({
            pageUndo: {
              ...state.pageUndo,
              [pageId]: { history: [], redoStack: [] },
            },
          }),
          false,
          'drawing/clearPageUndo'
        ),

      reset: () => set(initialState, false, 'drawing/reset'),
    }),
    { name: 'drawing-store' }
  )
);
