import dynamic from 'next/dynamic';
import type { AnimationProps } from '@/lib/types/mdx';

const ConceptAnimation = dynamic(() => import('@/components/math/ConceptAnimation'), {
  ssr: false,
  loading: () => (
    <div className="not-prose surface-card my-6 flex h-[360px] items-center justify-center text-sm text-app-text-muted">
      애니메이션 불러오는 중…
    </div>
  ),
});

/** 개념 시각화 애니메이션 (P5-04) */
export function Animation(props: AnimationProps) {
  return <ConceptAnimation {...props} />;
}
