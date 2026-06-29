import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxOptions } from '@/lib/mdx';
import { mdxComponents } from '@/components/mdx/mdx-components';
import { FormulaEnhancer } from '@/components/math/FormulaEnhancer';
import { cn } from '@/lib/utils';

interface PageContentProps {
  /** MDX 원문 (frontmatter 포함 가능) */
  source: string;
  className?: string;
}

/**
 * 교재 페이지 MDX → React 렌더러.
 * remark-math + rehype-katex 및 커스텀 MDX 컴포넌트를 연결합니다.
 */
export function PageContent({ source, className }: PageContentProps) {
  return (
    <FormulaEnhancer className={cn('page-content', className)} data-page-content>
      <MDXRemote source={source} components={mdxComponents} options={mdxOptions} />
    </FormulaEnhancer>
  );
}
