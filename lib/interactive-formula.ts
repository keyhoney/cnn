/** 슬라이더 값을 function-plot 수식에 치환 */
export function formatPlotNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  const rounded = Math.round(value * 1000) / 1000;
  if (rounded < 0) return `(${rounded})`;
  return String(rounded);
}

export function substitutePlotFormula(
  template: string,
  values: Record<string, number>
): string {
  let result = template;

  const names = Object.keys(values).sort((a, b) => b.length - a.length);
  for (const name of names) {
    const regex = new RegExp(`\\b${escapeRegExp(name)}\\b`, 'g');
    result = result.replace(regex, formatPlotNumber(values[name]));
  }

  return result;
}

/** LaTeX 템플릿의 {a}, {b} 플레이스홀더 치환 */
export function formatLatexNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  const rounded = Math.round(value * 1000) / 1000;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(2).replace(/\.?0+$/, '');
}

export function substituteLatexFormula(
  template: string,
  values: Record<string, number>
): string {
  let result = template;

  for (const [name, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${escapeRegExp(name)}\\}`, 'g'), formatLatexNumber(value));
  }

  return result;
}

/** formula만 있을 때 간단한 LaTeX 표시용 문자열 생성 */
export function formulaToDisplayLatex(
  plotFormula: string,
  values: Record<string, number>
): string {
  const substituted = substitutePlotFormula(plotFormula, values);
  return `y = ${substituted.replace(/\*/g, '')}`;
}

export function buildParamDefaults(
  params: Array<{ name: string; default: number }>
): Record<string, number> {
  return Object.fromEntries(params.map((p) => [p.name, p.default]));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
