'use client';

import { useMemo, type ReactNode } from 'react';
import {
  renderKatexHtml,
  getFormulaAriaLabel,
  type FormulaDisplay,
} from '@/lib/katex-utils';
import { cn } from '@/lib/utils';

export interface FormulaProps {
  /** LaTeX 소스 (props 우선) */
  latex?: string;
  /** `inline` | `block` (기본: inline) */
  display?: FormulaDisplay;
  children?: ReactNode;
  className?: string;
}

/**
 * KaTeX 수식 컴포넌트 — 인라인/블록.
 * MDX: `<Formula display="block">a^2 + b^2</Formula>`
 */
export function Formula({
  latex,
  display = 'inline',
  children,
  className,
}: FormulaProps) {
  const source = (latex ?? (typeof children === 'string' ? children : '')).trim();

  const html = useMemo(() => {
    if (!source) return '';
    return renderKatexHtml(source, { display });
  }, [source, display]);

  if (!source) return null;

  const isBlock = display === 'block';

  return (
    <span
      className={cn(isBlock && 'my-4 flex w-full justify-center', className)}
      role="math"
      aria-label={getFormulaAriaLabel(source)}
    >
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </span>
  );
}
