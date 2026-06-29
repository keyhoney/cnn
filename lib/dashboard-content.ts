/** 대시보드용 페이지 메타 (문제·오답 링크) */
export const DASHBOARD_PAGE_INDEX: Record<
  string,
  { chapterId: string; title: string; href: string }
> = {
  'math-grade1:page01': {
    chapterId: 'ch01',
    title: '지수의 확장',
    href: '/math-grade1/ch01/page01',
  },
  'math-grade1:page02': {
    chapterId: 'ch01',
    title: '지수법칙',
    href: '/math-grade1/ch01/page02',
  },
  'math-grade1:page03': {
    chapterId: 'ch01',
    title: '지수법칙 연습',
    href: '/math-grade1/ch01/page03',
  },
};

export const PROBLEM_LABELS: Record<string, string> = {
  'prob-001': '문제 1 — a³ × a⁴',
  'prob-002': '문제 2 — 3² × 3³',
  'prob-003': '문제 3 — 지수법칙 나눗셈',
  'prob-004': '문제 4 — 거듭제곱의 거듭제곱',
  'prob-005': '문제 5 — 곱의 거듭제곱',
  'prob-006': '문제 6 — 복합 지수',
  'prob-007': '문제 7 — 종합',
};

export function getProblemLabel(problemId: string): string {
  return PROBLEM_LABELS[problemId] ?? problemId;
}
