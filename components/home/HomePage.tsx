'use client';

import type { BookOverview } from '@/lib/content';
import { EternaShell } from '@/components/layout/EternaShell';
import { OrbitIntro } from '@/components/layout/OrbitIntro';
import { SectionHeader } from '@/components/eterna/SectionHeader';
import { PageCTA } from '@/components/eterna/PageCTA';
import { HomeBooksGrid } from '@/components/home/HomeBooksGrid';
import { HomeHeroTop } from '@/components/home/HomeHeroTop';
import { HomeMissionSection } from '@/components/home/HomeMissionSection';
import { HomeLearningCompare } from '@/components/home/HomeLearningCompare';
import { HomeValueBlocks } from '@/components/home/HomeValueBlocks';

interface HomePageProps {
  books: BookOverview[];
}

export function HomePage({ books }: HomePageProps) {
  return (
    <OrbitIntro>
      <EternaShell homeDark mainClassName="max-w-5xl" withTopPadding={false} hero={<HomeHeroTop />}>
        <HomeMissionSection booksCount={books.length} />
        <HomeLearningCompare />
        <HomeValueBlocks />

        <SectionHeader
          eyebrow="도서관"
          title="내 교재 목록"
          subtitle={`${books.length}권의 교재가 준비되어 있습니다.`}
        />

        <HomeBooksGrid books={books} />

        <PageCTA
          title="학습 현황을 확인해 보세요"
          subtitle="정답률, 학습 시간, 오답 노트를 대시보드에서 한눈에 볼 수 있습니다."
          primaryHref="/dashboard"
          primaryLabel="대시보드 열기"
          secondaryHref="/settings"
          secondaryLabel="설정"
        />
      </EternaShell>
    </OrbitIntro>
  );
}
