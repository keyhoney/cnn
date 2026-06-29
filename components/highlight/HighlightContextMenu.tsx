'use client';

import { useEffect, useState, type SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import { Trash2 } from 'lucide-react';
import { HIGHLIGHT_COLORS } from '@/lib/highlight-range';
import { cn } from '@/lib/utils';

export interface HighlightMenuState {
  x: number;
  y: number;
  mode: 'create' | 'edit';
  highlightId?: number;
  selectedText?: string;
  color?: string;
}

interface HighlightContextMenuProps {
  menu: HighlightMenuState | null;
  onPickColor: (color: string) => void;
  onDelete: () => void;
  onClose: () => void;
}

function stopMenuEvent(event: SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

/** 드래그 선택 후 형광펜 컨텍스트 메뉴 (P6-03) */
export function HighlightContextMenu({
  menu,
  onPickColor,
  onDelete,
  onClose,
}: HighlightContextMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!menu || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70]"
      data-no-flip
      data-no-highlight
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal-panel absolute z-[71] w-72 max-w-[calc(100vw-24px)] p-4"
        style={{ left: menu.x, top: menu.y }}
        onMouseDown={stopMenuEvent}
        onClick={stopMenuEvent}
        role="menu"
        aria-label="형광펜 메뉴"
      >
        {menu.mode === 'create' && menu.selectedText && (
          <p className="mb-2 line-clamp-2 text-xs text-app-text-muted">
            &ldquo;{menu.selectedText}&rdquo;
          </p>
        )}

        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-app-text-muted">
          형광펜 색상
        </p>

        <div className="mb-4 flex gap-2">
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              onMouseDown={stopMenuEvent}
              onClick={(event) => {
                stopMenuEvent(event);
                void onPickColor(color.value);
              }}
              className={cn(
                'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                menu.color === color.value ? 'border-app-accent' : 'border-transparent'
              )}
              style={{ backgroundColor: color.value }}
              aria-label={`${color.label} 하이라이트`}
              title={color.label}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          {menu.mode === 'edit' && menu.highlightId != null && (
            <button
              type="button"
              onMouseDown={stopMenuEvent}
              onClick={(event) => {
                stopMenuEvent(event);
                void onDelete();
              }}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-status-error hover:bg-status-error-soft"
            >
              <Trash2 className="h-3.5 w-3.5" />
              삭제
            </button>
          )}

          <button
            type="button"
            onMouseDown={stopMenuEvent}
            onClick={(event) => {
              stopMenuEvent(event);
              onClose();
            }}
            className={cn(
              'rounded-lg px-2.5 py-1.5 text-xs font-semibold text-app-text-muted hover:bg-app-surface-muted',
              menu.mode === 'create' && 'ml-auto'
            )}
          >
            닫기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
