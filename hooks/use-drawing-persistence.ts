'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  loadDrawingNotes,
  saveDrawingNotes,
  strokesSnapshot,
} from '@/lib/drawing-notes';
import { useBadgeCheck } from '@/hooks/use-badge-check';
import { EMPTY_STROKES, useDrawingStore } from '@/stores/drawingStore';

const SAVE_DEBOUNCE_MS = 5000;
const SAVED_INDICATOR_MS = 2000;

export type DrawingSaveStatus = 'idle' | 'pending' | 'saving' | 'saved';

interface UseDrawingPersistenceOptions {
  bookId: string;
  pageId: string;
  enabled?: boolean;
}

/**
 * 페이지 필기 IndexedDB 저장/로드 (P4-05)
 * - 진입 시 복원
 * - 5초 디바운스 자동 저장
 */
export function useDrawingPersistence({
  bookId,
  pageId,
  enabled = true,
}: UseDrawingPersistenceOptions) {
  const strokes = useDrawingStore((s) => s.pageDrawings[pageId] ?? EMPTY_STROKES);
  const setPageStrokes = useDrawingStore((s) => s.setPageStrokes);
  const clearPageUndo = useDrawingStore((s) => s.clearPageUndo);
  const { runBadgeCheck } = useBadgeCheck();

  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<DrawingSaveStatus>('idle');

  const lastSavedRef = useRef('');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingFlushRef = useRef(false);
  const bookIdRef = useRef(bookId);
  const pageIdRef = useRef(pageId);

  bookIdRef.current = bookId;
  pageIdRef.current = pageId;

  const flushSave = useCallback(async (targetPageId?: string) => {
    const resolvedPageId = targetPageId ?? pageIdRef.current;
    const current = useDrawingStore.getState().getPageStrokes(resolvedPageId);
    const snapshot = strokesSnapshot(current);

    if (snapshot === lastSavedRef.current) {
      pendingFlushRef.current = false;
      return;
    }

    setSaveStatus('saving');
    await saveDrawingNotes(bookIdRef.current, resolvedPageId, current);
    lastSavedRef.current = snapshot;
    pendingFlushRef.current = false;
    setSaveStatus('saved');

    if (current.length > 0 && !resolvedPageId.startsWith('notepad:')) {
      void runBadgeCheck({
        type: 'drawing_saved',
        bookId: bookIdRef.current,
        pageId: resolvedPageId,
      });
    }

    if (savedIndicatorTimerRef.current) {
      clearTimeout(savedIndicatorTimerRef.current);
    }
    savedIndicatorTimerRef.current = setTimeout(() => {
      setSaveStatus('idle');
    }, SAVED_INDICATOR_MS);
  }, [runBadgeCheck]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setIsLoaded(false);
    setSaveStatus('idle');
    lastSavedRef.current = '';

    loadDrawingNotes(bookId, pageId).then((loaded) => {
      if (cancelled) return;

      const strokesToRestore = loaded ?? [];
      setPageStrokes(pageId, strokesToRestore);
      clearPageUndo(pageId);
      lastSavedRef.current = strokesSnapshot(strokesToRestore);
      setIsLoaded(true);
    });

    return () => {
      cancelled = true;

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }

      if (pendingFlushRef.current) {
        void flushSave(pageId);
      }
    };
  }, [bookId, pageId, enabled, setPageStrokes, clearPageUndo, flushSave]);

  useEffect(() => {
    if (!enabled || !isLoaded) return;

    const snapshot = strokesSnapshot(strokes);
    if (snapshot === lastSavedRef.current) {
      return;
    }

    pendingFlushRef.current = true;
    setSaveStatus('pending');

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      void flushSave(pageId);
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [strokes, pageId, enabled, isLoaded, flushSave]);

  useEffect(() => {
    return () => {
      if (savedIndicatorTimerRef.current) {
        clearTimeout(savedIndicatorTimerRef.current);
      }
    };
  }, []);

  return { isLoaded, saveStatus };
}
