'use client';

import { useCallback, useRef, useState } from 'react';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { EMPTY_STROKES, useDrawingStore } from '@/stores/drawingStore';
import {
  cloneStrokes,
  createStrokeId,
  findStrokesAtPoint,
  getPointerPressure,
  highlighterWidth,
  HIGHLIGHTER_OPACITY,
  type DrawStroke,
} from '@/lib/drawing-strokes';
import type { DrawingTool } from '@/lib/types/stores';

function strokesChanged(before: DrawStroke[], after: DrawStroke[]): boolean {
  return JSON.stringify(before) !== JSON.stringify(after);
}

interface UseDrawingGesturesOptions {
  pageId: string;
  enabled: boolean;
  isLoaded?: boolean;
}

export function useDrawingGestures({
  pageId,
  enabled,
  isLoaded = true,
}: UseDrawingGesturesOptions) {
  const currentTool = useDrawingStore((s) => s.currentTool);
  const currentColor = useDrawingStore((s) => s.currentColor);
  const currentSize = useDrawingStore((s) => s.currentSize);
  const strokes = useDrawingStore((s) => s.pageDrawings[pageId] ?? EMPTY_STROKES);
  const setPageStrokes = useDrawingStore((s) => s.setPageStrokes);
  const recordPageHistory = useDrawingStore((s) => s.recordPageHistory);
  const setActiveDrawingPageId = useDrawingStore((s) => s.setActiveDrawingPageId);

  const [isDrawing, setIsDrawing] = useState(false);
  const [rulerStart, setRulerStart] = useState<{ x: number; y: number } | null>(null);
  const [previewStroke, setPreviewStroke] = useState<DrawStroke | null>(null);

  const stageRef = useRef<Konva.Stage>(null);
  const gestureSnapshotRef = useRef<DrawStroke[] | null>(null);

  const applyStrokes = useCallback(
    (updater: (prev: DrawStroke[]) => DrawStroke[]) => {
      const prev = useDrawingStore.getState().getPageStrokes(pageId);
      setPageStrokes(pageId, updater(prev));
    },
    [pageId, setPageStrokes]
  );

  const commitGestureHistory = useCallback(() => {
    const before = gestureSnapshotRef.current;
    gestureSnapshotRef.current = null;
    if (!before) return;

    const after = useDrawingStore.getState().getPageStrokes(pageId);
    if (strokesChanged(before, after)) {
      recordPageHistory(pageId, before);
    }
  }, [pageId, recordPageHistory]);

  const getPointerPos = useCallback((e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();
    return stage?.getPointerPosition() ?? null;
  }, []);

  const eraseAtPoint = useCallback(
    (x: number, y: number) => {
      applyStrokes((prev) => {
        const hitIds = new Set(findStrokesAtPoint(prev, x, y));
        if (hitIds.size === 0) return prev;
        return prev.filter((s) => !hitIds.has(s.id));
      });
    },
    [applyStrokes]
  );

  const beginStroke = useCallback(
    (pos: { x: number; y: number }, pressure: number) => {
      if (currentTool === 'eraser') {
        eraseAtPoint(pos.x, pos.y);
        return;
      }

      if (currentTool === 'ruler') {
        setRulerStart(pos);
        setPreviewStroke({
          id: 'preview',
          tool: 'ruler',
          points: [pos.x, pos.y, pos.x, pos.y],
          color: currentColor,
          strokeWidth: currentSize,
          opacity: 1,
        });
        return;
      }

      const tool = currentTool === 'highlighter' ? 'highlighter' : 'pen';
      const strokeWidth =
        tool === 'highlighter' ? highlighterWidth(currentSize) : currentSize;

      applyStrokes((prev) => [
        ...prev,
        {
          id: createStrokeId(pageId),
          tool,
          points: [pos.x, pos.y],
          pressures: tool === 'pen' ? [pressure] : undefined,
          color: currentColor,
          strokeWidth,
          opacity: tool === 'highlighter' ? HIGHLIGHTER_OPACITY : 1,
        },
      ]);
    },
    [currentTool, currentColor, currentSize, eraseAtPoint, pageId, applyStrokes]
  );

  const extendStroke = useCallback(
    (pos: { x: number; y: number }, pressure: number) => {
      if (currentTool === 'eraser') {
        eraseAtPoint(pos.x, pos.y);
        return;
      }

      if (currentTool === 'ruler' && rulerStart) {
        setPreviewStroke({
          id: 'preview',
          tool: 'ruler',
          points: [rulerStart.x, rulerStart.y, pos.x, pos.y],
          color: currentColor,
          strokeWidth: currentSize,
          opacity: 1,
        });
        return;
      }

      if (currentTool !== 'pen' && currentTool !== 'highlighter') return;

      applyStrokes((prev) => {
        if (prev.length === 0) return prev;
        const last = { ...prev[prev.length - 1] };
        last.points = last.points.concat([pos.x, pos.y]);
        if (last.tool === 'pen') {
          last.pressures = [...(last.pressures ?? []), pressure];
        }
        return [...prev.slice(0, -1), last];
      });
    },
    [currentTool, currentColor, currentSize, eraseAtPoint, rulerStart, applyStrokes]
  );

  const finishStroke = useCallback(
    (pos: { x: number; y: number } | null) => {
      if (currentTool === 'ruler' && rulerStart && pos) {
        const dx = pos.x - rulerStart.x;
        const dy = pos.y - rulerStart.y;
        if (Math.hypot(dx, dy) > 2) {
          applyStrokes((prev) => [
            ...prev,
            {
              id: createStrokeId(pageId),
              tool: 'ruler',
              points: [rulerStart.x, rulerStart.y, pos.x, pos.y],
              color: currentColor,
              strokeWidth: currentSize,
              opacity: 1,
            },
          ]);
        }
      }

      setRulerStart(null);
      setPreviewStroke(null);
      setIsDrawing(false);
      commitGestureHistory();
    },
    [currentTool, rulerStart, currentColor, currentSize, pageId, applyStrokes, commitGestureHistory]
  );

  const handlePointerDown = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!enabled || !isLoaded) return;

      const pos = getPointerPos(e);
      if (!pos) return;

      setActiveDrawingPageId(pageId);
      gestureSnapshotRef.current = cloneStrokes(useDrawingStore.getState().getPageStrokes(pageId));
      setIsDrawing(true);
      const pressure = getPointerPressure(e.evt);
      beginStroke(pos, pressure);
    },
    [enabled, isLoaded, getPointerPos, beginStroke, pageId, setActiveDrawingPageId]
  );

  const handlePointerMove = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!enabled) return;
      if (!isDrawing && currentTool !== 'eraser') return;

      if (e.evt.cancelable) {
        e.evt.preventDefault();
      }

      const pos = getPointerPos(e);
      if (!pos) return;

      const pressure = getPointerPressure(e.evt);
      extendStroke(pos, pressure);
    },
    [isDrawing, enabled, currentTool, getPointerPos, extendStroke]
  );

  const handlePointerUp = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!isDrawing) return;
      const pos = getPointerPos(e);
      finishStroke(pos);
    },
    [isDrawing, getPointerPos, finishStroke]
  );

  const handlePointerLeave = useCallback(() => {
    if (!isDrawing) return;
    finishStroke(null);
  }, [isDrawing, finishStroke]);

  const clearStrokes = useCallback(() => {
    const prev = useDrawingStore.getState().getPageStrokes(pageId);
    if (prev.length === 0) return;
    recordPageHistory(pageId, prev);
    setPageStrokes(pageId, []);
  }, [pageId, recordPageHistory, setPageStrokes]);

  const cursorForTool = useCallback((): string => {
    if (!enabled) return 'default';
    switch (currentTool) {
      case 'eraser':
        return 'pointer';
      case 'ruler':
        return 'crosshair';
      default:
        return 'crosshair';
    }
  }, [enabled, currentTool]);

  return {
    stageRef,
    strokes,
    previewStroke,
    currentTool,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    clearStrokes,
    cursorForTool,
  };
}

export const DRAWING_TOOL_LABELS: Partial<Record<DrawingTool, string>> = {
  pen: '만년필',
  highlighter: '형광펜',
  eraser: '지우개',
  ruler: '직선',
};
