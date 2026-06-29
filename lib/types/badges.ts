export type BadgeId =
  | 'first-step'
  | 'streak-7'
  | 'speed-star'
  | 'perfectionist'
  | 'explorer'
  | 'drawing-king'
  | 'wrong-answer-hero';

export interface BadgeDefinition {
  id: BadgeId;
  emoji: string;
  title: string;
  description: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-step',
    emoji: '🏅',
    title: '첫 발걸음',
    description: '첫 문제 풀이를 완료했습니다.',
  },
  {
    id: 'streak-7',
    emoji: '🔥',
    title: '7일 연속',
    description: '7일 연속 학습했습니다.',
  },
  {
    id: 'speed-star',
    emoji: '⚡',
    title: '스피드 스타',
    description: '힌트 없이 60초 안에 정답을 맞혔습니다.',
  },
  {
    id: 'perfectionist',
    emoji: '💯',
    title: '완벽주의자',
    description: '챕터의 모든 문제를 1회 만에 정답 처리했습니다.',
  },
  {
    id: 'explorer',
    emoji: '📖',
    title: '탐험가',
    description: '교재의 모든 페이지를 방문했습니다.',
  },
  {
    id: 'drawing-king',
    emoji: '✏️',
    title: '필기왕',
    description: '50페이지 이상 필기를 저장했습니다.',
  },
  {
    id: 'wrong-answer-hero',
    emoji: '🎯',
    title: '오답 정복',
    description: '틀렸던 문제를 재풀이에서 정답 처리했습니다.',
  },
];

export function getBadgeDefinition(id: BadgeId): BadgeDefinition {
  return BADGE_DEFINITIONS.find((badge) => badge.id === id)!;
}

/** 교재별 챕터 문제 ID (뱃지 조건 평가용) */
export const BOOK_CHAPTER_PROBLEMS: Record<string, Record<string, string[]>> = {
  'math-grade1': {
    ch01: [
      'prob-001',
      'prob-002',
      'prob-003',
      'prob-004',
      'prob-005',
      'prob-006',
      'prob-007',
    ],
  },
};

/** 교재별 총 페이지 수 */
export const BOOK_TOTAL_PAGES: Record<string, number> = {
  'math-grade1': 3,
};

export type BadgeEvent =
  | {
      type: 'problem_submitted';
      bookId: string;
      chapterId: string;
      pageId: string;
      problemId: string;
      isCorrect: boolean;
      hintsUsed: number;
      timeSpentMs: number;
      attemptNumber: number;
    }
  | { type: 'page_visited'; bookId: string; pageId: string }
  | { type: 'drawing_saved'; bookId: string; pageId: string };
