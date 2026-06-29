'use client';

import type { RefObject } from 'react';
import { Stage, Layer } from 'react-konva';
import { DrawingStrokeShape } from '@/components/drawing/DrawingStrokeShape';
import { useDrawingGestures } from '@/hooks/use-drawing-gestures';
import { useDrawingPersistence } from '@/hooks/use-drawing-persistence';
import { useDrawingStore } from '@/stores/drawingStore';
import { cn } from '@/lib/utils';

interface DrawingCanvasProps {
  width: number;
  height: number;
  bookId: string;
  pageId: string;
  scrollContainerRef?: RefObject<HTMLElement | null>;
}

/**
 * 페이지 위 투명 Konva 오버레이 (P4-01 ~ P4-05)
 */
export default function DrawingCanvas({
  width,
  height,
  bookId,
  pageId,
  scrollContainerRef,
}: DrawingCanvasProps) {
  const isDrawingMode = useDrawingStore((s) => s.isDrawingMode);
  const { isLoaded } = useDrawingPersistence({ bookId, pageId });

  const {
    stageRef,
    strokes,
    previewStroke,
    currentTool,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    cursorForTool,
  } = useDrawingGestures({
    pageId,
    enabled: isDrawingMode,
    isLoaded,
  });

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isDrawingMode) return;
    const scrollEl = scrollContainerRef?.current ?? e.currentTarget.closest('article');
    if (!scrollEl) return;
    scrollEl.scrollTop += e.deltaY;
  };

  return (
    <div
      className={cn(
        'absolute left-0 top-0 z-30',
        isDrawingMode ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      style={{ width, height }}
      data-drawing-overlay={pageId}
      data-drawing-active={isDrawingMode}
      aria-hidden={!isDrawingMode}
      onWheel={handleWheel}
    >
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onMouseDown={handlePointerDown}
        onMousemove={handlePointerMove}
        onMouseup={handlePointerUp}
        onMouseLeave={handlePointerLeave}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{
          cursor: cursorForTool(),
          touchAction: isDrawingMode ? 'none' : 'auto',
        }}
      >
        <Layer>
          {strokes.map((stroke) => (
            <DrawingStrokeShape key={stroke.id} stroke={stroke} listening={false} />
          ))}
          {previewStroke && <DrawingStrokeShape stroke={previewStroke} listening={false} />}
        </Layer>
      </Stage>
    </div>
  );
}
