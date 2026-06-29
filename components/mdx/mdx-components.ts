import { Callout } from '@/components/mdx/Callout';
import { Problem } from '@/components/problem/Problem';
import { StepByStep } from '@/components/mdx/StepByStep';
import { ImageNote } from '@/components/mdx/ImageNote';
import { MdxTable } from '@/components/mdx/MdxTable';
import { Graph } from '@/components/math/Graph';
import { Chart } from '@/components/math/Chart';
import { Animation } from '@/components/math/Animation';
import { Interactive } from '@/components/math/Interactive';
import { Formula } from '@/components/math/Formula';
import { SyntheticDivision } from '@/components/math/SyntheticDivision';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';

/**
 * MDX 콘텐츠에서 사용하는 커스텀 컴포넌트 맵.
 * 서버 컴포넌트(PageContent)에서 import합니다.
 */
export const mdxComponents: MDXRemoteProps['components'] = {
  Callout,
  Problem,
  Graph,
  Chart,
  Animation,
  Interactive,
  StepByStep,
  ImageNote,
  Table: MdxTable,
  Formula,
  SyntheticDivision,
};
