/** MDX 본문에서 검색 가능한 평문 추출 */

const JSX_STRING_ATTR =
  /(?:question|title|label|content|formulaLatex|formula|animationId)=["']([^"']+)["']/g;
const JSX_HINT_ARRAY = /hints=\{(\[[\s\S]*?\])\}/g;
const JSX_OPTIONS_ARRAY = /options=\{(\[[\s\S]*?\])\}/g;
const QUOTED_STRING = /["']([^"']{2,})["']/g;
const LATEX_BLOCK = /\$\$([\s\S]*?)\$\$/g;
const LATEX_INLINE = /(?<!\$)\$([^$\n]+)\$/g;

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function stripMarkdownSyntax(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
    .replace(/[*_~]/g, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '');
}

function extractLatex(source: string): string[] {
  const parts: string[] = [];

  for (const match of source.matchAll(LATEX_BLOCK)) {
    if (match[1]) parts.push(match[1].replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}]/g, ' '));
  }

  for (const match of source.matchAll(LATEX_INLINE)) {
    if (match[1]) parts.push(match[1].replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}]/g, ' '));
  }

  return parts;
}

function extractStringsFromJsArray(source: string): string[] {
  const parts: string[] = [];
  for (const match of source.matchAll(QUOTED_STRING)) {
    if (match[1]) parts.push(decodeBasicEntities(match[1]));
  }
  return parts;
}

function extractJsxStrings(source: string): string[] {
  const parts = new Set<string>();

  for (const match of source.matchAll(JSX_STRING_ATTR)) {
    if (match[1]) parts.add(decodeBasicEntities(match[1]));
  }

  for (const pattern of [JSX_HINT_ARRAY, JSX_OPTIONS_ARRAY]) {
    for (const match of source.matchAll(pattern)) {
      for (const value of extractStringsFromJsArray(match[1] ?? '')) {
        parts.add(value);
      }
    }
  }

  return [...parts];
}

function stripJsxAndHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ');
}

/** MDX 원문 + 본문을 합쳐 검색용 평문 생성 */
export function extractSearchableText(source: string, body: string): string {
  const chunks = [
    ...extractJsxStrings(source),
    ...extractLatex(source),
    ...extractLatex(body),
    stripMarkdownSyntax(stripJsxAndHtml(body)),
  ];

  return decodeBasicEntities(chunks.join(' '))
    .replace(/\s+/g, ' ')
    .trim();
}

export function makeSearchSnippet(text: string, query: string, radius = 72): string {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text.slice(0, radius * 2);

  const lowerText = text.toLowerCase();
  const terms = trimmedQuery.toLowerCase().split(/\s+/).filter(Boolean);

  let matchIndex = -1;
  for (const term of terms) {
    const index = lowerText.indexOf(term);
    if (index !== -1) {
      matchIndex = index;
      break;
    }
  }

  if (matchIndex === -1) {
    return text.length > radius * 2 ? `${text.slice(0, radius * 2)}…` : text;
  }

  const start = Math.max(0, matchIndex - radius);
  const end = Math.min(text.length, matchIndex + radius);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';

  return `${prefix}${text.slice(start, end)}${suffix}`;
}
