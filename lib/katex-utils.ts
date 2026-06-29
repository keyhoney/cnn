import katex from 'katex';

export type FormulaDisplay = 'inline' | 'block';

export interface RenderKatexOptions {
  display?: FormulaDisplay;
  throwOnError?: boolean;
}

/** KaTeX HTML 문자열 생성 */
export function renderKatexHtml(latex: string, options: RenderKatexOptions = {}): string {
  const { display = 'inline', throwOnError = false } = options;
  return katex.renderToString(latex, {
    displayMode: display === 'block',
    throwOnError,
    trust: false,
  });
}

/** KaTeX DOM에서 LaTeX 소스 추출 */
export function extractLatexFromElement(element: Element): string | null {
  const annotation = element.querySelector('annotation[encoding="application/x-tex"]');
  if (annotation?.textContent?.trim()) {
    return annotation.textContent.trim();
  }

  const fromData = element.getAttribute('data-latex');
  if (fromData) return fromData;

  return null;
}

/** 클립보드에 LaTeX 복사 */
export async function copyLatexToClipboard(latex: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(latex);
    return true;
  } catch {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = latex;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}

/** 접근성용 수식 읽기 레이블 */
export function getFormulaAriaLabel(latex: string): string {
  return `수식: ${latex}`;
}
