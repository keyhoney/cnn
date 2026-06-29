'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { AccuracyStats } from '@/lib/dashboard-stats';
import { cn } from '@/lib/utils';

interface ProgressChartProps {
  stats: AccuracyStats;
  isLoading?: boolean;
  className?: string;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; payload?: { color?: string } }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  return (
    <div className="rounded-lg border border-app-border bg-app-surface px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-app-text">{item.name}</p>
      <p className="text-app-text-muted">{item.value}문제</p>
    </div>
  );
}

/** 정답률 도넛 차트 (P6-05) */
export function ProgressChart({ stats, isLoading, className }: ProgressChartProps) {
  if (isLoading) {
    return (
      <section className={cn('surface-card p-5', className)}>
        <p className="text-sm text-app-text-muted">정답률 불러오는 중…</p>
      </section>
    );
  }

  return (
    <section className={cn('surface-card p-5 sm:p-6', className)}>
      <div className="mb-4">
          <p className="section-header">정답률</p>
          <h2 className="heading-display-sm font-serif">첫 시도 정답률</h2>
      </div>

      {stats.total === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-app-border bg-app-surface-muted text-sm text-app-text-muted">
          아직 풀이한 문제가 없습니다.
        </div>
      ) : (
        <div className="grid items-center gap-4 sm:grid-cols-[1fr_160px]">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                >
                  {stats.chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg bg-app-accent-soft px-4 py-3 text-center">
              <p className="text-3xl font-bold text-app-accent">{stats.accuracyPercent}%</p>
              <p className="text-xs text-app-text-muted">첫 시도 정답률</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-chart-primary" />
                  정답
                </span>
                <span className="font-mono font-semibold">{stats.correct}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-chart-secondary" />
                  오답
                </span>
                <span className="font-mono font-semibold">{stats.wrong}</span>
              </div>
              <div className="flex items-center justify-between border-t border-app-border pt-2 text-app-text-muted">
                <span>총 시도</span>
                <span className="font-mono font-semibold text-app-text">{stats.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
