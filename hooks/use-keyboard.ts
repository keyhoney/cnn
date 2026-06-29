'use client';

import { useEffect } from 'react';
import { useHotkeys, useHotkeysContext } from 'react-hotkeys-hook';
import {
  HOTKEY_OPTIONS,
  HOTKEY_SCOPES,
  VIEWER_HOTKEYS,
} from '@/lib/keyboard-shortcuts';
import { triggerHintShortcut } from '@/lib/hint-shortcut';
import { useDrawingStore } from '@/stores/drawingStore';
import { useProblemStore } from '@/stores/problemStore';

export interface UseViewerKeyboardOptions {
  enabled?: boolean;
  onToggleSearch: () => void;
  onToggleBookmark: () => void;
  onToggleToc: () => void;
  onClosePanels: () => void;
  onOpenPrint?: () => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  fallbackPageId?: string;
}

/** 교재 뷰어 단축키 (react-hotkeys-hook, P7-03) */
export function useViewerKeyboard({
  enabled = true,
  onToggleSearch,
  onToggleBookmark,
  onToggleToc,
  onClosePanels,
  onOpenPrint,
  onNavigatePrev,
  onNavigateNext,
  hasPrev,
  hasNext,
  fallbackPageId,
}: UseViewerKeyboardOptions) {
  const { enableScope, disableScope } = useHotkeysContext();
  const toggleDrawingMode = useDrawingStore((s) => s.toggleDrawingMode);
  const isDrawingMode = useDrawingStore((s) => s.isDrawingMode);
  const activeDrawingPageId = useDrawingStore((s) => s.activeDrawingPageId);
  const undoPage = useDrawingStore((s) => s.undoPage);
  const redoPage = useDrawingStore((s) => s.redoPage);
  const focusedProblemId = useProblemStore((s) => s.focusedProblemId);

  const scope = HOTKEY_SCOPES.viewer;
  const hotkeyOptions = { ...HOTKEY_OPTIONS, scopes: scope, enabled };

  useEffect(() => {
    if (!enabled) return;
    enableScope(scope);
    return () => disableScope(scope);
  }, [disableScope, enableScope, enabled, scope]);

  useHotkeys(
    VIEWER_HOTKEYS.search,
    (event) => {
      event.preventDefault();
      onToggleSearch();
    },
    hotkeyOptions,
    [onToggleSearch]
  );

  useHotkeys(
    VIEWER_HOTKEYS.bookmark,
    () => onToggleBookmark(),
    hotkeyOptions,
    [onToggleBookmark]
  );

  useHotkeys(
    VIEWER_HOTKEYS.toc,
    () => onToggleToc(),
    hotkeyOptions,
    [onToggleToc]
  );

  useHotkeys(
    VIEWER_HOTKEYS.closePanels,
    () => onClosePanels(),
    { ...hotkeyOptions, enableOnFormTags: true },
    [onClosePanels]
  );

  useHotkeys(
    VIEWER_HOTKEYS.prevPage,
    () => {
      if (hasPrev) onNavigatePrev();
    },
    hotkeyOptions,
    [hasPrev, onNavigatePrev]
  );

  useHotkeys(
    VIEWER_HOTKEYS.nextPage,
    () => {
      if (hasNext) onNavigateNext();
    },
    hotkeyOptions,
    [hasNext, onNavigateNext]
  );

  useHotkeys(
    VIEWER_HOTKEYS.drawingMode,
    () => toggleDrawingMode(),
    hotkeyOptions,
    [toggleDrawingMode]
  );

  useHotkeys(
    VIEWER_HOTKEYS.hint,
    () => {
      triggerHintShortcut(focusedProblemId);
    },
    hotkeyOptions,
    [focusedProblemId]
  );

  useHotkeys(
    VIEWER_HOTKEYS.undoDrawing,
    (event) => {
      if (!isDrawingMode) return;
      const pageId = activeDrawingPageId ?? fallbackPageId;
      if (!pageId) return;
      event.preventDefault();
      undoPage(pageId);
    },
    hotkeyOptions,
    [activeDrawingPageId, fallbackPageId, isDrawingMode, undoPage]
  );

  useHotkeys(
    VIEWER_HOTKEYS.redoDrawing,
    (event) => {
      if (!isDrawingMode) return;
      const pageId = activeDrawingPageId ?? fallbackPageId;
      if (!pageId) return;
      event.preventDefault();
      redoPage(pageId);
    },
    hotkeyOptions,
    [activeDrawingPageId, fallbackPageId, isDrawingMode, redoPage]
  );

  useHotkeys(
    VIEWER_HOTKEYS.print,
    (event) => {
      if (!onOpenPrint) return;
      event.preventDefault();
      onOpenPrint();
    },
    hotkeyOptions,
    [onOpenPrint]
  );
}
