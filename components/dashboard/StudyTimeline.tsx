'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Clock3 } from 'lucide-react';
import type { StudyTimeStats } from '@/lib/dashboard-stats';
import { cn } from '@/lib/utils';

interface StudyTimelineProps {
  stats: StudyTimeStats;
  isLoading?: boolean;
  className?: string;
}

function TimelineTooltip({
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
      <p className="text-app-text-muted">학습 {payload[0]?.value ?? 0}분</p>
    </div>
  );
}

/** 학습 시간 통계 (P6-05) */
export function StudyTimeline({ stats, isLoading, className }: StudyTimelineProps) {
  return (
    <section className={cn('surface-card p-5 sm:p-6', className)}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-header">학습 시간</p>
          <h2 className="heading-display-sm font-serif">최근 7일 학습</h2>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-app-surface-muted px-3 py-2">
          <Clock3 className="h-4 w-4 text-app-accent" />
          <div className="text-right">
            <p className="text-sm font-bold text-app-text">{stats.totalLabel}</p>
            <p className="text-[10px] text-app-text-muted">누적 · {stats.visitedPages}페이지</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-app-text-muted">불러오는 중…</p>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.dailyStats} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: 'var(--chart-axis)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--chart-axis)' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<TimelineTooltip />} />
              <Bar dataKey="minutes" fill="var(--chart-primary)" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
