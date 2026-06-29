/** SVG 좌표계: 수학 (x,y) → 픽셀 */
export interface GraphViewport {
  width: number;
  height: number;
  padding: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export function createViewport(
  overrides: Partial<GraphViewport> & Pick<GraphViewport, 'width' | 'height'>
): GraphViewport {
  return {
    padding: 28,
    xMin: -4,
    xMax: 4,
    yMin: -2,
    yMax: 10,
    ...overrides,
  };
}

export function toSvgX(x: number, vp: GraphViewport): number {
  const plotWidth = vp.width - vp.padding * 2;
  return vp.padding + ((x - vp.xMin) / (vp.xMax - vp.xMin)) * plotWidth;
}

export function toSvgY(y: number, vp: GraphViewport): number {
  const plotHeight = vp.height - vp.padding * 2;
  return vp.height - vp.padding - ((y - vp.yMin) / (vp.yMax - vp.yMin)) * plotHeight;
}

export function sampleParabolaPath(
  a: number,
  h: number,
  k: number,
  vp: GraphViewport,
  steps = 80
): string {
  const points: string[] = [];

  for (let i = 0; i <= steps; i += 1) {
    const x = vp.xMin + ((vp.xMax - vp.xMin) * i) / steps;
    const y = a * (x - h) ** 2 + k;
    if (y < vp.yMin - 5 || y > vp.yMax + 5) continue;
    points.push(`${toSvgX(x, vp)},${toSvgY(y, vp)}`);
  }

  return points.length > 1 ? `M ${points.join(' L ')}` : '';
}

export interface QuadraticPhase {
  a: number;
  h: number;
  k: number;
  label: string;
}

/** 이차함수 변환 단계 (progress 0~1) */
export function getQuadraticPhase(progress: number): QuadraticPhase {
  const t = Math.max(0, Math.min(1, progress));

  if (t < 0.25) {
    return { a: 1, h: 0, k: 0, label: 'y = x^2' };
  }

  if (t < 0.5) {
    const local = (t - 0.25) / 0.25;
    const k = Math.round(local * 20) / 10;
    return { a: 1, h: 0, k, label: `y = x^2 + ${formatNum(k)}` };
  }

  if (t < 0.75) {
    const local = (t - 0.5) / 0.25;
    const h = Math.round(local * 10) / 10;
    return { a: 1, h, k: 2, label: `y = (x - ${formatNum(h)})^2 + 2` };
  }

  const local = (t - 0.75) / 0.25;
  const a = 1 + local;
  return {
    a,
    h: 1,
    k: 2,
    label: `y = ${formatNum(a)}(x - 1)^2 + 2`,
  };
}

export function formatNum(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(1).replace(/\.0$/, '');
}

export const ANIMATION_IDS = ['unit-circle', 'quadratic-transform'] as const;
export type ConceptAnimationId = (typeof ANIMATION_IDS)[number];

export function isConceptAnimationId(id: string): id is ConceptAnimationId {
  return (ANIMATION_IDS as readonly string[]).includes(id);
}

export const ANIMATION_LABELS: Record<ConceptAnimationId, string> = {
  'unit-circle': '단위원 (삼각함수)',
  'quadratic-transform': '이차함수 변환',
};
