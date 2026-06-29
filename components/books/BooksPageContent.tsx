'use client';

import type { BookOverview } from '@/lib/content';
import { EternaShell } from '@/components/layout/EternaShell';
import { SectionHeader } from '@/components/eterna/SectionHeader';
import { HomeBooksGrid } from '@/components/home/HomeBooksGrid';
import { PageCTA } from '@/components/eterna/PageCTA';

interface BooksPageContentProps {
  books: BookOverview[];
}

export function BooksPageContent({ books }: BooksPageContentProps) {
  return (
    <EternaShell mainClassName="max-w-5xl">
      <SectionHeader
        eyebrow="도서관"
        title="교재 목록"
        subtitle={
          books.length > 0
            ? `${books.length}권의 교재 중에서 학습할 교재를 선택하세요.`
            : '등록된 교재가 없습니다.'
        }
      />

      <HomeBooksGrid books={books} />

      <PageCTA
        title="학습을 이어가 보세요"
        subtitle="대시보드에서 진도와 오답 노트를 확인할 수 있습니다."
        primaryHref="/dashboard"
        primaryLabel="대시보드 열기"
        secondaryHref="/"
        secondaryLabel="홈으로"
      />
    </EternaShell>
  );
}
