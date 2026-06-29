/** 텍스트 범위 직렬화 (하이라이트 복원용) */
export interface SerializedTextRange {
  version: 1;
  startPath: number[];
  startOffset: number;
  endPath: number[];
  endOffset: number;
  text: string;
}

const HIGHLIGHT_MARK_CLASS = 'hl-mark';

export const HIGHLIGHT_COLORS = [
  { id: 'yellow', label: '노랑', value: '#fef08a' },
  { id: 'green', label: '초록', value: '#bbf7d0' },
  { id: 'blue', label: '파랑', value: '#bae6fd' },
  { id: 'pink', label: '분홍', value: '#fbcfe8' },
] as const;

export type HighlightColorId = (typeof HIGHLIGHT_COLORS)[number]['id'];

export function getHighlightColor(value: string) {
  return (
    HIGHLIGHT_COLORS.find((color) => color.id === value || color.value === value) ?? {
      id: 'yellow' as const,
      label: '노랑',
      value,
    }
  );
}

function normalizeHighlightText(value: string): string {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function getNodePath(root: Node, target: Node): number[] | null {
  if (target === root) return [];

  const path: number[] = [];
  let current: Node | null = target;

  while (current && current !== root) {
    const parent: Node | null = current.parentNode;
    if (!parent) return null;
    const index = Array.from(parent.childNodes).indexOf(current as ChildNode);
    if (index < 0) return null;
    path.unshift(index);
    current = parent;
  }

  return current === root ? path : null;
}

function getNodeByPath(root: Node, path: number[]): Node | null {
  let current: Node = root;
  for (const index of path) {
    const next = current.childNodes[index];
    if (!next) return null;
    current = next;
  }
  return current;
}

export function serializeTextRange(root: HTMLElement, range: Range): SerializedTextRange | null {
  const startContainer = range.startContainer;
  const endContainer = range.endContainer;
  const startPath = getNodePath(root, startContainer);
  const endPath = getNodePath(root, endContainer);

  if (!startPath || !endPath) return null;

  return {
    version: 1,
    startPath,
    startOffset: range.startOffset,
    endPath,
    endOffset: range.endOffset,
    text: range.toString(),
  };
}

export function deserializeTextRange(root: HTMLElement, data: SerializedTextRange): Range | null {
  const startNode = getNodeByPath(root, data.startPath);
  const endNode = getNodeByPath(root, data.endPath);
  if (!startNode || !endNode) return null;

  try {
    const range = document.createRange();
    const startMax =
      startNode.nodeType === Node.TEXT_NODE
        ? (startNode.textContent?.length ?? 0)
        : startNode.childNodes.length;
    const endMax =
      endNode.nodeType === Node.TEXT_NODE
        ? (endNode.textContent?.length ?? 0)
        : endNode.childNodes.length;

    range.setStart(startNode, Math.min(data.startOffset, startMax));
    range.setEnd(endNode, Math.min(data.endOffset, endMax));

    if (range.collapsed) return null;

    const actual = normalizeHighlightText(range.toString());
    const expected = normalizeHighlightText(data.text);
    if (actual !== expected && actual.length > 0 && expected.length > 0) {
      // DOM 정규화로 공백이 달라져도 오프셋이 맞으면 허용
      if (!actual.includes(expected) && !expected.includes(actual)) return null;
    }

    return range;
  } catch {
    return null;
  }
}

export function parseSerializedRange(selector: string): SerializedTextRange | null {
  try {
    const parsed = JSON.parse(selector) as SerializedTextRange;
    if (parsed.version !== 1 || !Array.isArray(parsed.startPath)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function wrapRangeWithHighlight(
  range: Range,
  highlightId: string,
  color: string
): boolean {
  if (range.collapsed) return false;

  const applyMark = (segment: Range) => {
    const mark = document.createElement('mark');
    mark.className = HIGHLIGHT_MARK_CLASS;
    mark.dataset.highlightId = highlightId;
    mark.style.backgroundColor = color;
    mark.style.borderRadius = '2px';
    mark.style.padding = '0 1px';

    const contents = segment.extractContents();
    mark.appendChild(contents);
    segment.insertNode(mark);
  };

  try {
    applyMark(range);
    return true;
  } catch {
    return wrapRangeAcrossTextNodes(range, highlightId, color);
  }
}

function wrapRangeAcrossTextNodes(
  range: Range,
  highlightId: string,
  color: string
): boolean {
  const ancestor =
    range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentNode;

  if (!ancestor) return false;

  const segments: Array<{ node: Text; start: number; end: number }> = [];
  const walker = document.createTreeWalker(ancestor, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();

  while (current) {
    const textNode = current as Text;
    if (range.intersectsNode(textNode)) {
      const length = textNode.textContent?.length ?? 0;
      let start = 0;
      let end = length;
      if (textNode === range.startContainer) start = range.startOffset;
      if (textNode === range.endContainer) end = range.endOffset;
      if (start < end) segments.push({ node: textNode, start, end });
    }
    current = walker.nextNode();
  }

  if (segments.length === 0) return false;

  for (let i = segments.length - 1; i >= 0; i--) {
    const { node, start, end } = segments[i];
    const segment = document.createRange();
    segment.setStart(node, start);
    segment.setEnd(node, end);

    const mark = document.createElement('mark');
    mark.className = HIGHLIGHT_MARK_CLASS;
    mark.dataset.highlightId = highlightId;
    mark.style.backgroundColor = color;
    mark.style.borderRadius = '2px';
    mark.style.padding = '0 1px';

    try {
      const contents = segment.extractContents();
      mark.appendChild(contents);
      segment.insertNode(mark);
    } catch {
      return false;
    }
  }

  return true;
}

export function applyHighlightToRoot(
  root: HTMLElement,
  highlightId: string,
  selector: string,
  color: string
): boolean {
  const data = parseSerializedRange(selector);
  if (!data) return false;

  const range = deserializeTextRange(root, data);
  if (!range) return false;

  if (root.querySelector(`[data-highlight-id="${highlightId}"]`)) return true;

  return wrapRangeWithHighlight(range, highlightId, color);
}

export function removeHighlightFromDom(root: HTMLElement, highlightId: string): void {
  const mark = root.querySelector<HTMLElement>(`[data-highlight-id="${highlightId}"]`);
  if (!mark) return;

  const parent = mark.parentNode;
  if (!parent) return;

  while (mark.firstChild) {
    parent.insertBefore(mark.firstChild, mark);
  }
  parent.removeChild(mark);
  parent.normalize();
}

export function isSelectionAllowed(root: HTMLElement, range: Range): boolean {
  const text = range.toString().trim();
  if (!text) return false;

  const common = range.commonAncestorContainer;
  const element =
    common.nodeType === Node.ELEMENT_NODE
      ? (common as Element)
      : common.parentElement;

  if (!element || !root.contains(element)) return false;

  const blocked = element.closest(
    '[data-no-highlight], [data-no-flip], [data-problem-type], button, input, textarea, select, .katex, .katex-display, mark.hl-mark'
  );

  return !blocked || !root.contains(blocked);
}

export function getHighlightIdFromNode(node: Node | null): string | null {
  if (!node) return null;
  const element =
    node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  const mark = element?.closest<HTMLElement>('mark.hl-mark');
  return mark?.dataset.highlightId ?? null;
}
