import type { SolutionStep } from '@/lib/types/solution';

/** 문제 유형 (P3-01, P3-02) */
export type ProblemType =
  | 'mcq'
  | 'numerical'
  | 'formula'
  | 'fillblank'
  | 'truefalse'
  | 'order';

export interface ProblemBaseProps {
  id: string;
  type: ProblemType;
  question: string;
  tags?: string[];
  hints?: string[];
  solution?: SolutionStep[];
  timeLimit?: number;
}

export interface MCQProblemProps extends ProblemBaseProps {
  type: 'mcq';
  options: string[];
  answer: number;
}

export interface NumericalProblemProps extends ProblemBaseProps {
  type: 'numerical';
  answer: number;
  tolerance?: number;
}

export interface FormulaProblemProps extends ProblemBaseProps {
  type: 'formula';
  answer: string;
  /** 허용 대안 LaTeX (선택) */
  accept?: string[];
}

export interface FillBlankProblemProps extends ProblemBaseProps {
  type: 'fillblank';
  /** `___` 자리표시자 순서대로 정답 */
  blanks: string[];
}

export interface TrueFalseProblemProps extends ProblemBaseProps {
  type: 'truefalse';
  answer: boolean;
}

export interface OrderProblemProps extends ProblemBaseProps {
  type: 'order';
  /** 올바른 순서대로 나열 (표시 시 셔플됨) */
  items: string[];
}

export type ProblemProps =
  | MCQProblemProps
  | NumericalProblemProps
  | FormulaProblemProps
  | FillBlankProblemProps
  | TrueFalseProblemProps
  | OrderProblemProps;

export type ProblemUserAnswer =
  | { type: 'mcq'; selected: number | null }
  | { type: 'numerical'; value: string }
  | { type: 'formula'; value: string }
  | { type: 'fillblank'; values: string[] }
  | { type: 'truefalse'; value: boolean | null }
  | { type: 'order'; order: number[] };
