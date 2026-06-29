import type { ProblemResult, ProgressRecord } from '@/lib/types/database';

export interface AccuracyStats {
  total: number;
  correct: number;
  wrong: number;
  accuracyPercent: number;
  chartData: Array<{ name: string; value: number; color: string }>;
}

export interface WrongAnswerItem {
  problemId: string;
  bookId: string;
  pageId: string;
  chapterId: string;
  href: string;
  pageTitle: string;
  tags: string[];
  attempts: number;
  hintsUsed: number;
  timeSpentMs: number;
  lastAttemptAt: Date;
}

export interface StudyDayStat {
  label: string;
  dateKey: string;
  minutes: number;
}

export interface StudyTimeStats {
  totalMs: number;
  totalLabel: string;
  visitedPages: number;
  dailyStats: StudyDayStat[];
}

const ACCURACY_COLORS = {
  correct: 'var(--chart-primary)',
  wrong: 'var(--chart-secondary)',
};

export function formatDuration(ms: number): string {
  if (ms <= 0) return '0분';

  const totalMinutes = Math.round(ms / 60_000);
  if (totalMinutes < 60) return `${totalMinutes}분`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`;
}

/** 정답률 통계 (첫 시도 기준) */
export function computeAccuracyStats(problemResults: ProblemResult[]): AccuracyStats {
  const attempted = problemResults.filter((result) => result.attempts > 0);
  const correct = attempted.filter((result) => result.firstAttemptCorrect).length;
  const wrong = attempted.length - correct;
  const total = attempted.length;
  const accuracyPercent = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    total,
    correct,
    wrong,
    accuracyPercent,
    chartData: [
      { name: '정답', value: correct, color: ACCURACY_COLORS.correct },
      { name: '오답', value: wrong, color: ACCURACY_COLORS.wrong },
    ].filter((item) => item.value > 0),
  };
}

/** 오답 노트 목록 (첫 시도 오답) */
export function getWrongAnswerItems(
  problemResults: ProblemResult[],
  pageIndex: Record<string, { chapterId: string; title: string; href: string }>
): WrongAnswerItem[] {
  return problemResults
    .filter((result) => result.attempts > 0 && !result.firstAttemptCorrect)
    .sort((a, b) => {
      const aTime = a.lastAttemptAt instanceof Date ? a.lastAttemptAt : new Date(a.lastAttemptAt);
      const bTime = b.lastAttemptAt instanceof Date ? b.lastAttemptAt : new Date(b.lastAttemptAt);
      return bTime.getTime() - aTime.getTime();
    })
    .map((result) => {
      const pageMeta = pageIndex[`${result.bookId}:${result.pageId}`];
      const chapterId = pageMeta?.chapterId ?? 'ch01';
      const href = pageMeta?.href ?? `/${result.bookId}/${chapterId}/${result.pageId}`;

      return {
        problemId: result.problemId,
        bookId: result.bookId,
        pageId: result.pageId,
        chapterId,
        href: `${href}#${result.problemId}`,
        pageTitle: pageMeta?.title ?? result.pageId,
        tags: result.tags,
        attempts: result.attempts,
        hintsUsed: result.hintsUsed,
        timeSpentMs: result.timeSpentMs,
        lastAttemptAt:
          result.lastAttemptAt instanceof Date
            ? result.lastAttemptAt
            : new Date(result.lastAttemptAt),
      };
    });
}

/** 최근 7일 학습 시간 통계 */
export function computeStudyTimeStats(progressRecords: ProgressRecord[]): StudyTimeStats {
  const totalMs = progressRecords.reduce((sum, record) => sum + record.timeSpentMs, 0);
  const visitedPages = progressRecords.filter((record) => record.timeSpentMs > 0).length;

  const dayMap = new Map<string, number>();

  for (const record of progressRecords) {
    const visitedAt =
      record.visitedAt instanceof Date ? record.visitedAt : new Date(record.visitedAt);
    const key = visitedAt.toISOString().slice(0, 10);
    dayMap.set(key, (dayMap.get(key) ?? 0) + record.timeSpentMs);
  }

  const dailyStats: StudyDayStat[] = [];
  const today = new Date();

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - offset);
    const dateKey = date.toISOString().slice(0, 10);
    const label = new Intl.DateTimeFormat('ko-KR', {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
    }).format(date);

    dailyStats.push({
      label,
      dateKey,
      minutes: Math.round((dayMap.get(dateKey) ?? 0) / 60_000),
    });
  }

  return {
    totalMs,
    totalLabel: formatDuration(totalMs),
    visitedPages,
    dailyStats,
  };
}
