/** MDX 커스텀 컴포넌트 공통 props 타입 (P2-03 플레이스홀더) */

export type CalloutType = 'definition' | 'formula' | 'warning' | 'tip' | 'info';

export interface GraphProps {
  functions?: string[];
  domain?: [number, number];
  range?: [number, number];
  points?: Array<{ x: number; y: number; label?: string }>;
  sliders?: Array<{ name: string; min: number; max: number; default: number }>;
  note?: string;
}

export interface ChartProps {
  type?: 'histogram' | 'frequencyPolygon' | 'bar' | 'line' | 'boxplot';
  /** 도수 배열 또는 `{ label, frequency }` 객체 배열 */
  data?: number[] | Record<string, number | string>[];
  /** 계급 라벨 (예: `["0~10", "10~20"]`) */
  labels?: string[];
  title?: string;
}

export type ConceptAnimationId = 'unit-circle' | 'quadratic-transform';

export interface AnimationProps {
  animationId: ConceptAnimationId;
  speed?: number;
  title?: string;
}

export interface InteractiveParam {
  name: string;
  min: number;
  max: number;
  default: number;
  step?: number;
  label?: string;
}

export interface InteractiveProps {
  params?: InteractiveParam[];
  /** function-plot 수식 (예: `a*x^2 + b*x + c`) */
  formula?: string;
  /** LaTeX 표시용 (`{a}`, `{b}` 플레이스홀더) */
  formulaLatex?: string;
  linkedGraph?: boolean;
  title?: string;
  domain?: [number, number];
  range?: [number, number];
}

export interface StepByStepProps {
  steps: Array<{ step: string; content: string; image?: string }>;
  title?: string;
}

export interface ImageNoteProps {
  src: string;
  alt?: string;
  caption?: string;
}

export interface MdxTableProps {
  headers?: string[];
  data?: (string | number)[][];
  caption?: string;
}

export interface SyntheticDivisionProps {
  /** 조립제법에 쓰는 값 (x − root = 0 의 근) */
  root: number;
  /** 나누어지는 다항식의 계수 (고차 → 저차) */
  coefficients: number[];
  /** 곱한 값 행 (coefficients.length − 1개) */
  products: number[];
  /** 마지막 행 — 몫의 계수와 나머지 (coefficients.length개) */
  bottom: number[];
  /** 변수 기호 (기본 x) */
  variable?: string;
  className?: string;
}

export interface ProblemMdxProps {
  id: string;
  type: 'mcq' | 'numerical' | 'formula' | 'fillblank' | 'truefalse' | 'order';
  question: string;
  options?: string[];
  answer?: number | string | boolean;
  tolerance?: number;
  accept?: string[];
  blanks?: string[];
  items?: string[];
  hints?: string[];
  solution?: Array<{ step: string; content: string; image?: string }>;
  timeLimit?: number;
  tags?: string[];
}
