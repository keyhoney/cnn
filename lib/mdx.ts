import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';

/** next-mdx-remote RSC용 MDX 파싱 옵션 (remark-math + rehype-katex) */
export const mdxOptions: MDXRemoteProps['options'] = {
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  parseFrontmatter: true,
};
