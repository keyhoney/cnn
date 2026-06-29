'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { DrawingStrokeShape } from '@/components/drawing/DrawingStrokeShape';
import { DrawingToolbar } from '@/components/drawing/DrawingToolbar';
import { DrawingSaveIndicator } from '@/components/drawing/DrawingSaveIndicator';
import { NotepadBackgroundLayer } from '@/components/drawing/NotepadBackgroundLayer';
import { useDrawingGestures } from '@/hooks/use-drawing-gestures';
import { useDrawingPersistence } from '@/hooks/use-drawing-persistence';
import { downloadStagePng, notepadExportFilename } from '@/lib/notepad';
import type { NotepadBackground } from '@/lib/notepad';
import { cn } from '@/lib/utils';

interface NotepadCanvasProps {
  bookId: string;
  pageId: string;
  notepadKey: string;
  background: NotepadBackground;
  className?: string;
}

/** 노트패드 전용 Konva 캔버스 (P4-06) */
export function NotepadCanvas({
  bookId,
  pageId,
  notepadKey,
  background,
  className,
}: NotepadCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const { isLoaded, saveStatus } = useDrawingPersistence({ bookId, pageId });

  const {
    stageRef,
    strokes,
    previewStroke,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    clearStrokes,
    cursorForTool,
  } = useDrawingGestures({ pageId, enabled: true, isLoaded });

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      setDimensions({
        width: el.clientWidth,
        height: el.clientHeight,
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const exportPng = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const dataUrl = stage.toDataURL({ pixelRatio: 2 });
    downloadStagePng(dataUrl, notepadExportFilename(bookId, notepadKey));
  };

  return (
    <div ref={containerRef} className={cn('relative min-h-[200px] min-w-0 flex-1 touch-none', className)}>
      {dimensions.width > 0 && (
        <>
          <Stage
            ref={stageRef}
            width={dimensions.width}
            height={dimensions.height}
            onMouseDown={handlePointerDown}
            onMousemove={handlePointerMove}
            onMouseup={handlePointerUp}
            onMouseLeave={handlePointerLeave}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            style={{
              cursor: cursorForTool(),
              touchAction: 'none',
            }}
          >
            <NotepadBackgroundLayer
              type={background}
              width={dimensions.width}
              height={dimensions.height}
            />
            <Layer>
              {strokes.map((stroke) => (
                <DrawingStrokeShape key={stroke.id} stroke={stroke} listening={false} />
              ))}
              {previewStroke && (
                <DrawingStrokeShape stroke={previewStroke} listening={false} />
              )}
            </Layer>
          </Stage>

          <DrawingToolbar
            pageId={pageId}
            onClear={clearStrokes}
            onExportPng={exportPng}
            className="pointer-events-auto absolute bottom-3 left-1/2 z-10 -translate-x-1/2"
          />

          <div className="pointer-events-none absolute left-3 top-3 z-10">
            <DrawingSaveIndicator status={saveStatus} />
          </div>
        </>
      )}
    </div>
  );
}
