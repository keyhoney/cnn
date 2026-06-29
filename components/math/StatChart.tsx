'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartProps } from '@/lib/types/mdx';
import { MathText } from '@/components/math/MathText';
import {
  CHART_COLORS,
  CHART_HEIGHT,
  normalizeChartData,
} from '@/lib/chart-utils';

type ChartVariant = 'histogram' | 'frequencyPolygon';

function resolveChartType(type: ChartProps['type']): ChartVariant {
  if (type === 'frequencyPolygon' || type === 'line') {
    return 'frequencyPolygon';
  }
  return 'histogram';
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-app-border bg-app-surface px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-app-text">{label}</p>
      <p className="text-app-text-muted">도수: {payload[0]?.value ?? 0}</p>
    </div>
  );
}

/** Recharts 통계 차트 (P5-03) */
export default function StatChart({ type = 'histogram', data, labels, title }: ChartProps) {
  const chartType = resolveChartType(type);
  const rows = useMemo(
    () => normalizeChartData({ type, data, labels, title }),
    [type, data, labels, title]
  );

  const stopPageGestures = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  if (rows.length === 0) {
    return (
      <div className="my-4 rounded-xl border border-dashed border-app-border bg-app-surface-muted px-4 py-8 text-center text-sm text-app-text-muted">
        차트 데이터가 없습니다. <code>labels</code>와 <code>data</code>를 지정해 주세요.
      </div>
    );
  }

  const yMax = Math.max(...rows.map((r) => r.frequency), 1);

  return (
    <figure
      className="not-prose surface-card my-6 overflow-hidden"
      onPointerDown={stopPageGestures}
      onTouchStart={stopPageGestures}
      data-no-flip
    >
      {title && (
        <figcaption className="border-b border-app-border bg-app-surface-muted/60 px-4 py-2.5 text-sm font-bold text-app-text">
          <MathText text={title} />
        </figcaption>
      )}

      <div className="bg-app-surface px-2 py-3">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-app-text-muted">
          {chartType === 'histogram' ? '히스토그램' : '도수분포다각형'}
        </p>

        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          {chartType === 'histogram' ? (
            <BarChart
              data={rows}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              barCategoryGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: 'var(--chart-axis)' }}
                axisLine={{ stroke: 'var(--chart-grid)' }}
              />
              <YAxis
                allowDecimals={false}
                domain={[0, Math.ceil(yMax * 1.1)]}
                tick={{ fontSize: 11, fill: 'var(--chart-axis)' }}
                axisLine={{ stroke: 'var(--chart-grid)' }}
                label={{
                  value: '도수',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 11, fill: 'var(--chart-axis)' },
                }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="frequency"
                fill={CHART_COLORS.histogram}
                radius={[2, 2, 0, 0]}
                maxBarSize={64}
              />
            </BarChart>
          ) : (
            <LineChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: 'var(--chart-axis)' }}
                axisLine={{ stroke: 'var(--chart-grid)' }}
              />
              <YAxis
                allowDecimals={false}
                domain={[0, Math.ceil(yMax * 1.1)]}
                tick={{ fontSize: 11, fill: 'var(--chart-axis)' }}
                axisLine={{ stroke: 'var(--chart-grid)' }}
                label={{
                  value: '도수',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 11, fill: 'var(--chart-axis)' },
                }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="linear"
                dataKey="frequency"
                stroke={CHART_COLORS.frequencyPolygon}
                strokeWidth={2}
                dot={{ r: 4, fill: CHART_COLORS.frequencyPolygon, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
