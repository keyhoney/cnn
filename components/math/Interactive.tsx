import dynamic from 'next/dynamic';
import type { InteractiveProps } from '@/lib/types/mdx';

const InteractivePanel = dynamic(() => import('@/components/math/InteractivePanel'), {
  ssr: false,
  loading: () => (
    <div className="not-prose surface-card my-6 flex h-40 items-center justify-center text-sm text-app-text-muted">
      인터랙티브 불러오는 중…
    </div>
  ),
});

/** 슬라이더 연동 인터랙티브 (P5-02) */
export function Interactive(props: InteractiveProps) {
  return <InteractivePanel {...props} />;
}
