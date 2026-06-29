import type { ChartProps } from '@/lib/types/mdx';

export interface ChartRow {
  label: string;
  frequency: number;
}

const FREQUENCY_KEYS = ['frequency', 'value', 'count', '도수'] as const;
const LABEL_KEYS = ['label', 'class', 'bin', '계급', 'name'] as const;

function readNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function readLabel(record: Record<string, unknown>, index: number): string {
  for (const key of LABEL_KEYS) {
    if (record[key] != null) return String(record[key]);
  }
  return `계급 ${index + 1}`;
}

function readFrequency(record: Record<string, unknown>): number {
  for (const key of FREQUENCY_KEYS) {
    if (record[key] != null) return readNumber(record[key]);
  }
  const firstNumeric = Object.values(record).find((v) => typeof v === 'number');
  return readNumber(firstNumeric);
}

/** MDX props → Recharts용 행 데이터 */
export function normalizeChartData(props: ChartProps): ChartRow[] {
  const { data = [], labels = [] } = props;

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'number') {
    const frequencies = data as number[];
    return frequencies.map((frequency, index) => ({
      label: labels[index] ?? `계급 ${index + 1}`,
      frequency,
    }));
  }

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    return (data as Record<string, unknown>[]).map((row, index) => ({
      label: readLabel(row, index),
      frequency: readFrequency(row),
    }));
  }

  return [];
}

export const CHART_HEIGHT = 320;
export const CHART_COLORS = {
  histogram: '#1b4dfe',
  frequencyPolygon: '#7c3aed',
} as const;
