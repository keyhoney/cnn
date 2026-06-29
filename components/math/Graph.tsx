import dynamic from 'next/dynamic';
import type { GraphProps } from '@/lib/types/mdx';

const FunctionPlotChart = dynamic(() => import('@/components/math/FunctionPlotChart'), {
  ssr: false,
  loading: () => (
    <div className="not-prose surface-card my-6 flex h-[360px] items-center justify-center text-sm text-app-text-muted">
      그래프 불러오는 중…
    </div>
  ),
});

/** function-plot 기반 함수 그래프 (P5-01) */
export function Graph(props: GraphProps) {
  return <FunctionPlotChart {...props} />;
}
