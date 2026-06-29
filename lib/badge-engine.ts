import type { ProblemResult, ProgressRecord } from '@/lib/types/database';
import {
  BOOK_CHAPTER_PROBLEMS,
  BOOK_TOTAL_PAGES,
  type BadgeEvent,
  type BadgeId,
} from '@/lib/types/badges';

export interface BadgeEvaluationContext {
  earnedBadgeIds: Set<BadgeId>;
  problemResults: ProblemResult[];
  progressRecords: ProgressRecord[];
  drawingPageIds: Set<string>;
  event?: BadgeEvent;
}

function getStudyStreakDays(progressRecords: ProgressRecord[]): number {
  const days = new Set(
    progressRecords.map((record) => {
      const date = record.visitedAt instanceof Date ? record.visitedAt : new Date(record.visitedAt);
      return date.toISOString().slice(0, 10);
    })
  );

  let streak = 0;
  const today = new Date();

  for (let offset = 0; offset < 365; offset += 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - offset);
    const key = date.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

function hasVisitedAllBookPages(bookId: string, progressRecords: ProgressRecord[]): boolean {
  const total = BOOK_TOTAL_PAGES[bookId];
  if (!total) return false;

  const visited = new Set(
    progressRecords.filter((record) => record.bookId === bookId).map((record) => record.pageId)
  );

  return visited.size >= total;
}

function isChapterPerfect(
  bookId: string,
  chapterId: string,
  problemResults: ProblemResult[]
): boolean {
  const problemIds = BOOK_CHAPTER_PROBLEMS[bookId]?.[chapterId];
  if (!problemIds || problemIds.length === 0) return false;

  const resultMap = new Map(problemResults.map((result) => [result.problemId, result]));

  return problemIds.every((problemId) => {
    const result = resultMap.get(problemId);
    return result?.attempts === 1 && result.firstAttemptCorrect;
  });
}

/** 뱃지 조건 평가 (P6-04) */
export function evaluateBadges(context: BadgeEvaluationContext): BadgeId[] {
  const newlyEarned: BadgeId[] = [];
  const { earnedBadgeIds, problemResults, progressRecords, drawingPageIds, event } = context;

  const award = (id: BadgeId) => {
    if (!earnedBadgeIds.has(id) && !newlyEarned.includes(id)) {
      newlyEarned.push(id);
    }
  };

  const attemptedProblems = problemResults.filter((result) => result.attempts > 0);
  if (attemptedProblems.length >= 1) {
    award('first-step');
  }

  if (getStudyStreakDays(progressRecords) >= 7) {
    award('streak-7');
  }

  if (drawingPageIds.size >= 50) {
    award('drawing-king');
  }

  for (const [bookId, chapters] of Object.entries(BOOK_CHAPTER_PROBLEMS)) {
    for (const chapterId of Object.keys(chapters)) {
      if (isChapterPerfect(bookId, chapterId, problemResults)) {
        award('perfectionist');
      }
    }
  }

  for (const bookId of Object.keys(BOOK_TOTAL_PAGES)) {
    if (hasVisitedAllBookPages(bookId, progressRecords)) {
      award('explorer');
    }
  }

  if (event?.type === 'problem_submitted') {
    if (
      event.isCorrect &&
      event.hintsUsed === 0 &&
      event.timeSpentMs > 0 &&
      event.timeSpentMs <= 60_000
    ) {
      award('speed-star');
    }

    if (event.isCorrect && event.attemptNumber >= 2) {
      const previous = problemResults.find((result) => result.problemId === event.problemId);
      if (previous && !previous.firstAttemptCorrect) {
        award('wrong-answer-hero');
      }
    }

    if (isChapterPerfect(event.bookId, event.chapterId, problemResults)) {
      award('perfectionist');
    }
  }

  if (event?.type === 'page_visited' && hasVisitedAllBookPages(event.bookId, progressRecords)) {
    award('explorer');
  }

  if (event?.type === 'drawing_saved' && drawingPageIds.size >= 50) {
    award('drawing-king');
  }

  return newlyEarned;
}
