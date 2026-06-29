import type { FunctionPlotDatum, FunctionPlotAnnotation } from 'function-plot';
import type { GraphProps } from '@/lib/types/mdx';

export const GRAPH_COLORS = [
  '#1b4dfe',
  '#7c3aed',
  '#240b6c',
  '#dc2626',
  '#16a34a',
  '#1a1333',
] as const;

export const DEFAULT_GRAPH_DOMAIN: [number, number] = [-5, 5];
export const DEFAULT_GRAPH_RANGE: [number, number] = [-5, 5];
export const GRAPH_HEIGHT = 360;

export function resolveGraphDomain(domain?: [number, number]): [number, number] {
  return domain ?? DEFAULT_GRAPH_DOMAIN;
}

export function resolveGraphRange(range?: [number, number]): [number, number] {
  return range ?? DEFAULT_GRAPH_RANGE;
}

export function buildFunctionPlotData(functions: string[]): FunctionPlotDatum[] {
  return functions.map((fn, index) => ({
    fn,
    graphType: 'polyline',
    color: GRAPH_COLORS[index % GRAPH_COLORS.length],
  }));
}

export function buildPointAnnotations(
  points: NonNullable<GraphProps['points']>
): FunctionPlotAnnotation[] {
  return points.map((point) => ({
    x: point.x,
    y: point.y,
    text: point.label ?? `(${point.x}, ${point.y})`,
  }));
}

export function buildPointPlotData(
  points: NonNullable<GraphProps['points']>
): FunctionPlotDatum[] {
  if (points.length === 0) return [];

  return [
    {
      fnType: 'points',
      graphType: 'scatter',
      points: points.map((p) => [p.x, p.y]),
      color: '#1a1333',
      attr: { r: 5 },
    },
  ];
}
