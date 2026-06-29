export type FlipDirection = 'forward' | 'backward';

export type DrawingTool =
  | 'pen'
  | 'pencil'
  | 'highlighter'
  | 'eraser'
  | 'ruler'
  | 'text'
  | 'shape'
  | 'lasso';

/** Konva Stage/Layer JSON 직렬화 문자열 */
export type KonvaSnapshot = string;

export const MAX_UNDO_HISTORY = 50;

export const DRAWING_COLORS = [
  '#1a1333',
  '#dc2626',
  '#1b4dfe',
  '#16a34a',
  '#b45309',
  '#7c3aed',
] as const;

export const DRAWING_SIZES = {
  thin: 1,
  normal: 3,
  thick: 6,
  extraThick: 10,
} as const;
