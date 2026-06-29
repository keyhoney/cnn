import dynamic from 'next/dynamic';
import type { ChartProps } from '@/lib/types/mdx';

const StatChart = dynamic(() => import('@/components/math/StatChart'), {
  ssr: false,
  loading: () => (
    <div className="not-prose surface-card my-6 flex h-[320px] items-center justify-center text-sm text-app-text-muted">
      차트 불러오는 중…
    </div>
  ),
});

/** Recharts 통계 차트 (P5-03) */
export function Chart(props: ChartProps) {
  return <StatChart {...props} />;
}
