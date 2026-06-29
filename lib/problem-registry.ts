import type { ProblemProps } from '@/lib/types/problem';

/** MDX 문제 정의 레지스트리 (오답 노트 재풀이용, P6-06) */
export const PROBLEM_REGISTRY: Record<string, ProblemProps> = {
  'prob-001': {
    id: 'prob-001',
    type: 'mcq',
    question: '위 식을 간단히 한 결과는?',
    options: ['$a^7$', '$a^{12}$', '$a^{-1}$', '$a$'],
    answer: 0,
    hints: [
      '같은 밑의 거듭제곱을 곱할 때는 지수끼리 더합니다.',
      '$a^m \\times a^n$ 에서 밑 $a$가 같다는 점에 주목하세요.',
      '$a^3 \\times a^4 = a^{3+4}$ 입니다.',
    ],
    tags: ['지수법칙', '곱셈'],
    solution: [
      { step: '지수법칙 확인', content: '밑이 같은 두 거듭제곱의 곱은 $a^m \\times a^n = a^{m+n}$ 입니다.' },
      { step: '지수 더하기', content: '$a^3 \\times a^4$ 에서 지수 $3$과 $4$를 더합니다.' },
      { step: '결과', content: '$a^{3+4} = a^7$' },
    ],
  },
  'prob-002': {
    id: 'prob-002',
    type: 'numerical',
    question: '$3^2 \\times 3^3$ 의 값을 구하시오.',
    answer: 243,
    tolerance: 0,
    timeLimit: 120,
    hints: [
      '밑이 3으로 같으므로 지수법칙을 적용할 수 있습니다.',
      '먼저 $3^2 \\times 3^3 = 3^{2+3}$ 으로 나타내세요.',
      '$3^5 = 243$ 입니다.',
    ],
    tags: ['지수법칙'],
    solution: [
      { step: '식 정리', content: '$3^2 \\times 3^3 = 3^{2+3}$' },
      { step: '지수 계산', content: '$2 + 3 = 5$ 이므로 $3^5$ 입니다.' },
      { step: '값 구하기', content: '$3^5 = 243$' },
    ],
  },
  'prob-003': {
    id: 'prob-003',
    type: 'numerical',
    question: '$2^7 \\div 2^3$ 의 값을 구하시오.',
    answer: 16,
    tolerance: 0,
    timeLimit: 90,
    hints: [
      '나눗셈은 지수끼리 빼는 것으로 바꿀 수 있습니다.',
      '$2^7 \\div 2^3 = 2^{7-3}$',
      '$2^4 = 16$',
    ],
    tags: ['지수법칙', '나눗셈'],
    solution: [
      { step: '나눗셈 법칙', content: '$a^m \\div a^n = a^{m-n}$ (단, $a \\neq 0$)' },
      { step: '지수 빼기', content: '$2^7 \\div 2^3 = 2^{7-3} = 2^4$' },
      { step: '계산', content: '$2^4 = 16$' },
    ],
  },
  'prob-004': {
    id: 'prob-004',
    type: 'fillblank',
    question: '$a^m ___ a^n = a^{___}$',
    blanks: ['\\times', 'm+n'],
    tags: ['지수법칙', '곱셈'],
  },
  'prob-005': {
    id: 'prob-005',
    type: 'truefalse',
    question: '$a \\neq 0$ 일 때 $a^0 = 1$ 이다.',
    answer: true,
    tags: ['지수', '지수의 확장'],
  },
  'prob-006': {
    id: 'prob-006',
    type: 'formula',
    question: '$a^3 \\times a^4$ 를 간단히 하시오.',
    answer: 'a^7',
    accept: ['a^{7}'],
    tags: ['지수법칙'],
  },
  'prob-007': {
    id: 'prob-007',
    type: 'order',
    question:
      '같은 밑의 거듭제곱 곱셈을 지수의 합으로 나타내는 과정을 순서대로 배열하시오.',
    items: [
      '밑이 같은 두 거듭제곱의 곱을 확인한다.',
      '지수끼리 더한다.',
      '결과를 $a^{m+n}$ 형태로 쓴다.',
    ],
    tags: ['지수법칙', '곱셈'],
  },
};

export function getProblemDefinition(problemId: string): ProblemProps | undefined {
  return PROBLEM_REGISTRY[problemId];
}

export function hasProblemDefinition(problemId: string): boolean {
  return problemId in PROBLEM_REGISTRY;
}
