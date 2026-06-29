import type { ProblemProps, ProblemUserAnswer } from '@/lib/types/problem';

/** LaTeX/수식 문자열 정규화 (공백·대소문자) */
export function normalizeLatex(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, '')
    .replace(/\\left/g, '')
    .replace(/\\right/g, '')
    .toLowerCase();
}

/** 분수·소수 문자열 파싱 */
export function parseNumericInput(input: string): number | null {
  const trimmed = input.trim().replace(/,/g, '');
  if (!trimmed) return null;

  const fractionMatch = trimmed.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1]);
    const den = parseFloat(fractionMatch[2]);
    if (den === 0) return null;
    return num / den;
  }

  const parsed = parseFloat(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

export function gradeNumerical(
  input: string,
  answer: number,
  tolerance = 0
): boolean {
  const parsed = parseNumericInput(input);
  if (parsed === null) return false;
  if (tolerance > 0) {
    return Math.abs(parsed - answer) <= tolerance;
  }
  return parsed === answer;
}

export function gradeFormula(input: string, answer: string, accept: string[] = []): boolean {
  const normalized = normalizeLatex(input);
  const candidates = [answer, ...accept].map(normalizeLatex);
  return candidates.some((c) => c === normalized);
}

export function gradeFillBlank(values: string[], expected: string[]): boolean {
  if (values.length !== expected.length) return false;
  return values.every((v, i) => normalizeLatex(v) === normalizeLatex(expected[i] ?? ''));
}

export function gradeTrueFalse(value: boolean | null, answer: boolean): boolean {
  return value === answer;
}

export function gradeMCQ(selected: number | null, answer: number): boolean {
  return selected === answer;
}

/** 순서 배열: 각 위치의 originalIndex가 위치 번호와 일치하면 정답 */
export function gradeOrder(order: number[], itemCount: number): boolean {
  if (order.length !== itemCount) return false;
  return order.every((originalIndex, position) => originalIndex === position);
}

export function gradeAnswer(props: ProblemProps, userAnswer: ProblemUserAnswer): boolean {
  switch (props.type) {
    case 'mcq':
      return userAnswer.type === 'mcq' && gradeMCQ(userAnswer.selected, props.answer);
    case 'numerical':
      return (
        userAnswer.type === 'numerical' &&
        gradeNumerical(userAnswer.value, props.answer, props.tolerance ?? 0)
      );
    case 'formula':
      return (
        userAnswer.type === 'formula' &&
        gradeFormula(userAnswer.value, props.answer, props.accept ?? [])
      );
    case 'fillblank':
      return (
        userAnswer.type === 'fillblank' && gradeFillBlank(userAnswer.values, props.blanks)
      );
    case 'truefalse':
      return (
        userAnswer.type === 'truefalse' && gradeTrueFalse(userAnswer.value, props.answer)
      );
    case 'order':
      return (
        userAnswer.type === 'order' && gradeOrder(userAnswer.order, props.items.length)
      );
    default:
      return false;
  }
}

export function canSubmit(props: ProblemProps, userAnswer: ProblemUserAnswer): boolean {
  switch (props.type) {
    case 'mcq':
      return userAnswer.type === 'mcq' && userAnswer.selected !== null;
    case 'numerical':
      return userAnswer.type === 'numerical' && userAnswer.value.trim() !== '';
    case 'formula':
      return userAnswer.type === 'formula' && userAnswer.value.trim() !== '';
    case 'fillblank':
      return (
        userAnswer.type === 'fillblank' &&
        userAnswer.values.length === props.blanks.length &&
        userAnswer.values.every((v) => v.trim() !== '')
      );
    case 'truefalse':
      return userAnswer.type === 'truefalse' && userAnswer.value !== null;
    case 'order':
      return userAnswer.type === 'order' && userAnswer.order.length > 0;
    default:
      return false;
  }
}

export function createInitialAnswer(type: ProblemProps['type']): ProblemUserAnswer {
  switch (type) {
    case 'mcq':
      return { type: 'mcq', selected: null };
    case 'numerical':
      return { type: 'numerical', value: '' };
    case 'formula':
      return { type: 'formula', value: '' };
    case 'fillblank':
      return { type: 'fillblank', values: [] };
    case 'truefalse':
      return { type: 'truefalse', value: null };
    case 'order':
      return { type: 'order', order: [] };
  }
}
