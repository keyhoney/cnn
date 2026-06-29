'use client';

import { Eraser, Highlighter, Pen, Redo2, Ruler, Undo2, X, Download } from 'lucide-react';
import { ColorPicker } from '@/components/drawing/ColorPicker';
import { useDrawingStore } from '@/stores/drawingStore';
import { DRAWING_SIZES } from '@/lib/types/stores';
import type { DrawingTool } from '@/lib/types/stores';
import { cn } from '@/lib/utils';

const P4_TOOLS = ['pen', 'highlighter', 'eraser', 'ruler'] as const satisfies readonly DrawingTool[];

const TOOL_CONFIG: Record<
  (typeof P4_TOOLS)[number],
  { label: string; icon: typeof Pen; title?: string }
> = {
  pen: { label: '만년필', icon: Pen },
  highlighter: { label: '형광펜', icon: Highlighter },
  eraser: { label: '지우개', icon: Eraser, title: '지우개 (획 단위)' },
  ruler: { label: '직선', icon: Ruler },
};

const SIZE_OPTIONS = [
  { value: DRAWING_SIZES.thin, label: '얇음', preview: 4 },
  { value: DRAWING_SIZES.normal, label: '보통', preview: 7 },
  { value: DRAWING_SIZES.thick, label: '굵음', preview: 10 },
  { value: DRAWING_SIZES.extraThick, label: '매우 굵음', preview: 13 },
] as const;

interface DrawingToolbarProps {
  pageId: string;
  onClear?: () => void;
  onExportPng?: () => void;
  className?: string;
}

/** 필기 도구 바: 도구, 색상, 굵기, 실행 취소 (P4-03, P4-04) */
export function DrawingToolbar({ pageId, onClear, onExportPng, className }: DrawingToolbarProps) {
  const currentTool = useDrawingStore((s) => s.currentTool);
  const currentColor = useDrawingStore((s) => s.currentColor);
  const currentSize = useDrawingStore((s) => s.currentSize);
  const canUndo = useDrawingStore((s) => s.canUndoPage(pageId));
  const canRedo = useDrawingStore((s) => s.canRedoPage(pageId));
  const setTool = useDrawingStore((s) => s.setTool);
  const setColor = useDrawingStore((s) => s.setColor);
  const setSize = useDrawingStore((s) => s.setSize);
  const setActiveDrawingPageId = useDrawingStore((s) => s.setActiveDrawingPageId);
  const undoPage = useDrawingStore((s) => s.undoPage);
  const redoPage = useDrawingStore((s) => s.redoPage);

  const colorDisabled = currentTool === 'eraser';
  const sizeDisabled = currentTool === 'eraser';

  const handleColorChange = (color: string) => {
    setColor(color);
    if (currentTool === 'eraser' || currentTool === 'ruler') {
      setTool('pen');
    }
  };

  const handleUndo = () => {
    setActiveDrawingPageId(pageId);
    undoPage(pageId);
  };

  const handleRedo = () => {
    setActiveDrawingPageId(pageId);
    redoPage(pageId);
  };

  return (
    <div
      className={cn(
        'glass-bar flex max-w-[calc(100vw-1rem)] items-center gap-1 overflow-x-auto rounded-2xl p-1.5 shadow-app-lg',
        className
      )}
      data-no-flip
      role="toolbar"
      aria-label="필기 도구"
    >
      <div className="flex shrink-0 items-center gap-1" role="group" aria-label="도구">
        {P4_TOOLS.map((tool) => {
          const { label, icon: Icon, title } = TOOL_CONFIG[tool];
          return (
            <button
              key={tool}
              type="button"
              onClick={() => setTool(tool)}
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                currentTool === tool
                  ? 'spectrum-border bg-app-accent text-white'
                  : 'text-app-text-muted hover:bg-app-surface-muted'
              )}
              aria-label={label}
              aria-pressed={currentTool === tool}
              title={title ?? label}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      <div className="mx-0.5 h-6 w-px shrink-0 bg-app-border" aria-hidden />

      <div className="flex shrink-0 items-center gap-0.5" role="group" aria-label="실행 취소">
        <button
          type="button"
          onClick={handleUndo}
          disabled={!canUndo}
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
            canUndo
              ? 'text-app-text-muted hover:bg-app-surface-muted'
              : 'cursor-not-allowed text-app-text-muted/40'
          )}
          aria-label="실행 취소"
          title="실행 취소 (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={!canRedo}
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
            canRedo
              ? 'text-app-text-muted hover:bg-app-surface-muted'
              : 'cursor-not-allowed text-app-text-muted/40'
          )}
          aria-label="다시 실행"
          title="다시 실행 (Ctrl+Shift+Z)"
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-0.5 h-6 w-px shrink-0 bg-app-border" aria-hidden />

      <ColorPicker
        value={currentColor}
        onChange={handleColorChange}
        disabled={colorDisabled}
        className="shrink-0 px-1"
      />

      <div className="mx-0.5 h-6 w-px shrink-0 bg-app-border" aria-hidden />

      <div
        className={cn(
          'flex shrink-0 items-center gap-0.5 px-0.5',
          sizeDisabled && 'pointer-events-none opacity-40'
        )}
        role="group"
        aria-label="굵기"
      >
        {SIZE_OPTIONS.map(({ value, label, preview }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSize(value)}
            disabled={sizeDisabled}
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
              currentSize === value
                ? 'bg-app-accent-soft text-app-accent ring-1 ring-app-accent/30'
                : 'text-app-text-muted hover:bg-app-surface-muted'
            )}
            aria-label={label}
            aria-pressed={currentSize === value}
            title={label}
          >
            <span
              className="rounded-full bg-current"
              style={{ width: preview, height: preview }}
              aria-hidden
            />
          </button>
        ))}
      </div>

      {onExportPng && (
        <>
          <div className="mx-0.5 h-6 w-px shrink-0 bg-app-border" aria-hidden />
          <button
            type="button"
            onClick={onExportPng}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-app-text-muted transition-colors hover:bg-app-surface-muted hover:text-app-accent"
            aria-label="PNG보내기"
            title="PNG보내기"
          >
            <Download className="h-4 w-4" />
          </button>
        </>
      )}

      {onClear && (
        <>
          <div className="mx-0.5 h-6 w-px shrink-0 bg-app-border" aria-hidden />
          <button
            type="button"
            onClick={onClear}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-app-text-muted transition-colors hover:bg-status-error-soft hover:text-status-error"
            aria-label="필기 모두 지우기"
            title="모두 지우기"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}
