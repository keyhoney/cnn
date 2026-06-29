'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Clock3, Target, Trophy } from 'lucide-react';
import { EternaShell } from '@/components/layout/EternaShell';
import { BadgeGallery } from '@/components/dashboard/BadgeGallery';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { WrongAnswerList } from '@/components/dashboard/WrongAnswerList';
import { StudyTimeline } from '@/components/dashboard/StudyTimeline';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { useBadgeStore } from '@/stores/badgeStore';
import { SectionHeader } from '@/components/eterna/SectionHeader';
import { BeforeAfterSection } from '@/components/eterna/BeforeAfterSection';
import { StatHub } from '@/components/eterna/StatHub';
import { PageCTA } from '@/components/eterna/PageCTA';
import { Reveal } from '@/components/eterna/Reveal';

export default function DashboardPage() {
  const hydrateBadges = useBadgeStore((s) => s.hydrate);
  const earnedCount = useBadgeStore((s) => s.earnedBadgeIds.size);
  const { isLoading, accuracy, studyTime, wrongAnswers } = useDashboardStats();

  useEffect(() => {
    void hydrateBadges();
  }, [hydrateBadges]);

  return (
    <EternaShell mainClassName="max-w-5xl">
      <SectionHeader
        eyebrow="Overview"
        title="학습 대시보드"
        subtitle="정답률, 학습 시간, 오답 노트를 한눈에 확인하세요."
      />

      <BeforeAfterSection
        beforeTitle="Before"
        afterTitle="After"
        beforeItems={[
          '진도와 오답이 여러 화면에 흩어져 있음',
          '학습 시간을 따로 기록해야 함',
          '어떤 개념이 부족한지 파악하기 어려움',
        ]}
        afterItems={[
          '대시보드 한 화면에서 전체 현황 확인',
          '최근 7일 학습 시간 자동 집계',
          '오답 노트와 뱃지로 복습 동기 부여',
        ]}
      />

      <StatHub
        items={[
          {
            id: 'accuracy',
            label: '정답률',
            value: isLoading ? '—' : `${accuracy.accuracyPercent}%`,
            hint: `${accuracy.total}문제 풀이`,
            icon: Target,
            color: '#1b4dfe',
            detail: (
              <p className="text-sm text-app-text-muted">
                첫 시도 기준 정답 {accuracy.correct}문제 · 오답 {accuracy.wrong}문제
              </p>
            ),
          },
          {
            id: 'time',
            label: '총 학습 시간',
            value: isLoading ? '—' : studyTime.totalLabel,
            hint: `${studyTime.visitedPages}페이지 체류`,
            icon: Clock3,
            color: '#7c3aed',
            detail: (
              <p className="text-sm text-app-text-muted">
                최근 7일간 누적 학습 시간과 방문 페이지 수를 추적합니다.
              </p>
            ),
          },
          {
            id: 'wrong',
            label: '오답 노트',
            value: isLoading ? '—' : `${wrongAnswers.length}개`,
            hint: '재풀이하러 가기',
            icon: BookOpen,
            color: '#fe881b',
            detail: (
              <Link href="/wrong-notes" className="btn-primary text-xs">
                오답 노트 열기
              </Link>
            ),
          },
          {
            id: 'badges',
            label: '획득 뱃지',
            value: `${earnedCount}개`,
            hint: '성취 뱃지',
            icon: Trophy,
            color: '#ffd600',
            detail: (
              <p className="text-sm text-app-text-muted">
                문제 풀이와 학습 습관에 따라 뱃지를 획득할 수 있습니다.
              </p>
            ),
          },
        ]}
      />

      <Reveal>
        <div className="grid gap-6 lg:grid-cols-2">
          <ProgressChart stats={accuracy} isLoading={isLoading} />
          <StudyTimeline stats={studyTime} isLoading={isLoading} />
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <WrongAnswerList items={wrongAnswers} isLoading={isLoading} />
          <BadgeGallery />
        </div>
      </Reveal>

      <PageCTA
        title="교재로 돌아가 학습을 이어가세요"
        subtitle="인터랙티브 문제와 필기 기능으로 복습해 보세요."
        primaryHref="/books"
        primaryLabel="교재 열기"
        secondaryHref="/"
        secondaryLabel="홈으로"
      />
    </EternaShell>
  );
}
