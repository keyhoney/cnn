'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Formula } from '@/components/math/Formula';
import type { InteractiveProps } from '@/lib/types/mdx';
import {
  buildParamDefaults,
  formulaToDisplayLatex,
  substituteLatexFormula,
  substitutePlotFormula,
} from '@/lib/interactive-formula';
import { cn } from '@/lib/utils';

const FunctionPlotChart = dynamic(() => import('@/components/math/FunctionPlotChart'), {
  ssr: false,
});

/** 슬라이더 연동 인터랙티브 (P5-02) */
export default function InteractivePanel({
  params = [],
  formula,
  formulaLatex,
  linkedGraph = false,
  title,
  domain,
  range,
}: InteractiveProps) {
  const [values, setValues] = useState(() => buildParamDefaults(params));

  const plotExpression = useMemo(() => {
    if (!formula) return '';
    return substitutePlotFormula(formula, values);
  }, [formula, values]);

  const displayLatex = useMemo(() => {
    if (formulaLatex) {
      return substituteLatexFormula(formulaLatex, values);
    }
    if (formula) {
      return formulaToDisplayLatex(formula, values);
    }
    return '';
  }, [formula, formulaLatex, values]);

  const handleChange = (name: string, raw: string) => {
    const next = Number(raw);
    if (!Number.isFinite(next)) return;
    setValues((prev) => ({ ...prev, [name]: next }));
  };

  const stopPageGestures = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  if (!formula && params.length === 0) {
    return (
      <div className="my-4 rounded-xl border border-dashed border-app-border bg-app-surface-muted px-4 py-6 text-center text-sm text-app-text-muted">
        <code>formula</code>와 <code>params</code>를 지정해 주세요.
      </div>
    );
  }

  return (
    <section
      className="not-prose surface-card my-6 overflow-hidden"
      onPointerDown={stopPageGestures}
      onTouchStart={stopPageGestures}
      data-no-flip
      aria-label={title ?? '인터랙티브 수식'}
    >
      {title && (
        <header className="border-b border-app-border bg-app-surface-muted/60 px-4 py-2.5">
          <h3 className="text-sm font-bold text-app-text">{title}</h3>
        </header>
      )}

      {displayLatex && (
        <div className="border-b border-app-border bg-app-surface px-4 py-4">
          <Formula display="block" latex={displayLatex} />
        </div>
      )}

      {params.length > 0 && (
        <div className="space-y-4 border-b border-app-border px-4 py-4">
          {params.map((param) => {
            const value = values[param.name] ?? param.default;
            const step = param.step ?? (Number.isInteger(param.min) && Number.isInteger(param.max) ? 1 : 0.1);

            return (
              <label
                key={param.name}
                className="block space-y-2"
                htmlFor={`interactive-${param.name}`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-semibold text-app-text">
                  <span>{param.label ?? param.name}</span>
                  <span className="font-mono text-app-accent">{value}</span>
                </div>
                <input
                  id={`interactive-${param.name}`}
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={step}
                  value={value}
                  onChange={(e) => handleChange(param.name, e.target.value)}
                  className={cn(
                    'h-2 w-full cursor-pointer appearance-none rounded-full bg-app-border',
                    'accent-app-accent'
                  )}
                  aria-valuemin={param.min}
                  aria-valuemax={param.max}
                  aria-valuenow={value}
                />
                <div className="flex justify-between font-mono text-[10px] text-app-text-muted">
                  <span>{param.min}</span>
                  <span>{param.max}</span>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {linkedGraph && plotExpression && (
        <FunctionPlotChart
          functions={[plotExpression]}
          domain={domain}
          range={range}
        />
      )}
    </section>
  );
}
