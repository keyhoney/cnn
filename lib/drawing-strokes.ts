import type { DrawingTool } from '@/lib/types/stores';

/** 캔버스에 그려지는 단일 획 */
export interface DrawStroke {
  id: string;
  tool: Exclude<DrawingTool, 'eraser' | 'pencil' | 'text' | 'shape' | 'lasso'>;
  points: number[];
  /** 만년필 필압 (points와 동일한 점 개수) */
  pressures?: number[];
  color: string;
  strokeWidth: number;
  opacity: number;
}

export const HIGHLIGHTER_OPACITY = 0.5;
export const HIGHLIGHTER_WIDTH_MULTIPLIER = 4;
export const ERASER_HIT_THRESHOLD = 14;

let strokeIdCounter = 0;

export function createStrokeId(pageId: string): string {
  strokeIdCounter += 1;
  return `${pageId}-${strokeIdCounter}-${Date.now()}`;
}

/** PointerEvent pressure (스타일러스) 또는 기본값 */
export function getPointerPressure(evt: MouseEvent | TouchEvent | PointerEvent): number {
  if (evt instanceof PointerEvent && evt.pressure > 0) {
    return evt.pressure;
  }
  return 0.5;
}

/** 필압에 따른 만년필 굵기 */
export function penWidthFromPressure(baseSize: number, pressure: number): number {
  return Math.max(1, baseSize * (0.35 + pressure * 1.3));
}

export function highlighterWidth(baseSize: number): number {
  return Math.max(12, baseSize * HIGHLIGHTER_WIDTH_MULTIPLIER);
}

function distanceToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    return Math.hypot(px - x1, py - y1);
  }

  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return Math.hypot(px - projX, py - projY);
}

/** 획 단위 지우개: 포인터가 획 경로에 닿으면 true */
export function hitTestStroke(stroke: DrawStroke, px: number, py: number): boolean {
  const pts = stroke.points;
  if (pts.length < 2) return false;

  const hitDist =
    stroke.tool === 'highlighter'
      ? Math.max(stroke.strokeWidth / 2, ERASER_HIT_THRESHOLD)
      : Math.max(stroke.strokeWidth / 2, ERASER_HIT_THRESHOLD);

  if (pts.length === 2) {
    return Math.hypot(px - pts[0], py - pts[1]) <= hitDist;
  }

  for (let i = 0; i < pts.length - 2; i += 2) {
    const d = distanceToSegment(px, py, pts[i], pts[i + 1], pts[i + 2], pts[i + 3]);
    if (d <= hitDist) return true;
  }

  return false;
}

export function findStrokesAtPoint(
  strokes: DrawStroke[],
  px: number,
  py: number
): string[] {
  return strokes.filter((s) => hitTestStroke(s, px, py)).map((s) => s.id);
}

/** Undo/Redo 스냅샷용 깊은 복사 */
export function cloneStrokes(strokes: DrawStroke[]): DrawStroke[] {
  return JSON.parse(JSON.stringify(strokes)) as DrawStroke[];
}

export function serializeStrokes(strokes: DrawStroke[]): string {
  return JSON.stringify(strokes);
}

export function deserializeStrokes(snapshot: string): DrawStroke[] {
  try {
    const parsed = JSON.parse(snapshot) as DrawStroke[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
