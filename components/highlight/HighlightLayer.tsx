'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {
  applyHighlightToRoot,
  deserializeTextRange,
  getHighlightIdFromNode,
  isSelectionAllowed,
  removeHighlightFromDom,
  serializeTextRange,
  type SerializedTextRange,
  wrapRangeWithHighlight,
} from '@/lib/highlight-range';
import { usePageHighlights } from '@/hooks/use-page-highlights';
import { useDrawingStore } from '@/stores/drawingStore';
import {
  HighlightContextMenu,
  type HighlightMenuState,
} from '@/components/highlight/HighlightContextMenu';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface HighlightLayerProps {
  bookId: string;
  pageId: string;
  children: ReactNode;
  className?: string;
}

function clampMenuPosition(x: number, y: number) {
  const margin = 12;
  const menuWidth = 288;
  const menuHeight = 160;
  const maxX = window.innerWidth - menuWidth - margin;
  const maxY = window.innerHeight - menuHeight - margin;
  return {
    x: Math.max(margin, Math.min(x, maxX)),
    y: Math.max(margin, Math.min(y, maxY)),
  };
}

/** 텍스트 형광펜 레이어 (P6-03) */
export function HighlightLayer({ bookId, pageId, children, className }: HighlightLayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingRangeRef = useRef<Range | null>(null);
  const pendingSerializedRef = useRef<SerializedTextRange | null>(null);
  const isDrawingMode = useDrawingStore((s) => s.isDrawingMode);

  const { highlights, isHydrated, addHighlight, removeHighlight, updateColor } =
    usePageHighlights(bookId, pageId);

  const [menu, setMenu] = useState<HighlightMenuState | null>(null);

  const closeMenu = useCallback(() => {
    setMenu(null);
    pendingRangeRef.current = null;
    pendingSerializedRef.current = null;
    window.getSelection()?.removeAllRanges();
  }, []);

  const applyStoredHighlights = useCallback(() => {
    const root = rootRef.current;
    if (!root || !isHydrated) return;

    for (const highlight of highlights) {
      applyHighlightToRoot(root, String(highlight.id), highlight.selector, highlight.color);
    }
  }, [highlights, isHydrated]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isHydrated) return;

    const timer = window.setTimeout(() => {
      applyStoredHighlights();
    }, 50);

    return () => window.clearTimeout(timer);
  }, [bookId, pageId, isHydrated, applyStoredHighlights]);

  const openCreateMenu = useCallback((range: Range, clientX: number, clientY: number) => {
    const root = rootRef.current;
    if (!root) return;

    const serialized = serializeTextRange(root, range);
    if (!serialized) {
      toast.error('이 텍스트는 하이라이트할 수 없습니다.');
      return;
    }

    const position = clampMenuPosition(clientX, clientY);
    pendingRangeRef.current = range.cloneRange();
    pendingSerializedRef.current = serialized;
    setMenu({
      x: position.x,
      y: position.y,
      mode: 'create',
      selectedText: range.toString().trim(),
    });
  }, []);

  const openEditMenu = useCallback(
    (highlightId: number, clientX: number, clientY: number, color?: string) => {
      const position = clampMenuPosition(clientX, clientY);
      pendingRangeRef.current = null;
      pendingSerializedRef.current = null;
      setMenu({
        x: position.x,
        y: position.y,
        mode: 'edit',
        highlightId,
        color,
      });
    },
    []
  );

  const handleHighlightClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (isDrawingMode || menu) return;

      const highlightDomId = getHighlightIdFromNode(event.target as Node);
      if (!highlightDomId) return;

      const dbId = Number(highlightDomId);
      if (Number.isNaN(dbId)) return;

      event.preventDefault();
      event.stopPropagation();

      const root = rootRef.current;
      const mark = root?.querySelector<HTMLElement>(`[data-highlight-id="${highlightDomId}"]`);
      const record = highlights.find((item) => item.id === dbId);

      openEditMenu(
        dbId,
        event.clientX,
        event.clientY,
        record?.color ?? mark?.style.backgroundColor
      );
    },
    [isDrawingMode, menu, highlights, openEditMenu]
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (isDrawingMode || menu) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      const root = rootRef.current;
      const selection = window.getSelection();
      if (!root || !selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      if (range.collapsed) return;
      if (!isSelectionAllowed(root, range)) return;

      openCreateMenu(range, event.clientX, event.clientY);
    },
    [isDrawingMode, menu, openCreateMenu]
  );

  const handlePickColor = useCallback(
    async (color: string) => {
      const root = rootRef.current;

      if (menu?.mode === 'edit' && menu.highlightId != null) {
        await updateColor(menu.highlightId, color);
        const mark = root?.querySelector<HTMLElement>(
          `[data-highlight-id="${menu.highlightId}"]`
        );
        if (mark) {
          mark.style.backgroundColor = color;
        }
        closeMenu();
        toast.success('형광펜 색상을 변경했습니다.');
        return;
      }

      const serialized = pendingSerializedRef.current;
      if (!root || !serialized) {
        toast.error('하이라이트를 적용할 수 없습니다. 다시 텍스트를 선택해 주세요.');
        return;
      }

      const created = await addHighlight(JSON.stringify(serialized), color);
      if (!created) {
        toast.error('하이라이트 저장에 실패했습니다.');
        return;
      }

      const highlightId = String(created.id);
      const range =
        (pendingRangeRef.current && !pendingRangeRef.current.collapsed
          ? pendingRangeRef.current
          : null) ?? deserializeTextRange(root, serialized);

      const wrapped =
        range != null
          ? wrapRangeWithHighlight(range, highlightId, color)
          : applyHighlightToRoot(root, highlightId, JSON.stringify(serialized), color);

      if (!wrapped) {
        toast.error('형광펜을 적용하지 못했습니다. 다시 시도해 주세요.');
        return;
      }

      closeMenu();
      toast.success('형광펜을 적용했습니다.');
    },
    [menu, addHighlight, updateColor, closeMenu]
  );

  const handleDelete = useCallback(async () => {
    if (!menu?.highlightId) return;
    const root = rootRef.current;
    if (root) removeHighlightFromDom(root, String(menu.highlightId));
    await removeHighlight(menu.highlightId);
    closeMenu();
    toast.success('형광펜을 삭제했습니다.');
  }, [menu, removeHighlight, closeMenu]);

  return (
    <>
      <div
        ref={rootRef}
        data-highlight-root
        className={cn('relative', className, !isDrawingMode && 'select-text')}
        onClick={handleHighlightClick}
        onPointerUp={handlePointerUp}
      >
        {children}
      </div>

      <HighlightContextMenu
        menu={menu}
        onPickColor={handlePickColor}
        onDelete={handleDelete}
        onClose={closeMenu}
      />
    </>
  );
}
