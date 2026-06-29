/** sRGB hex → 상대 휘도 (WCAG 2.1) */
function relativeLuminance(hex: string): number {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return 0;

  const channels = [0, 2, 4].map((start) => {
    const value = Number.parseInt(normalized.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function getContrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsWcagAA(ratio: number, isLargeText = false): boolean {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

export function meetsWcagAAA(ratio: number, isLargeText = false): boolean {
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/** CSS 변수 값을 #rrggbb 로 정규화 */
export function cssColorToHex(color: string): string | null {
  const trimmed = color.trim();
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    const [, r, g, b] = trimmed.match(/^#(.)(.)(.)$/i) ?? [];
    if (!r || !g || !b) return null;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  const rgbMatch = trimmed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!rgbMatch) return null;

  const toHex = (value: string) => Number(value).toString(16).padStart(2, '0');
  return `#${toHex(rgbMatch[1])}${toHex(rgbMatch[2])}${toHex(rgbMatch[3])}`;
}

export function readThemeContrastPairs(root: HTMLElement = document.documentElement) {
  const styles = getComputedStyle(root);
  const text = cssColorToHex(styles.getPropertyValue('--app-text'));
  const surface = cssColorToHex(styles.getPropertyValue('--app-surface'));
  const heading = cssColorToHex(styles.getPropertyValue('--app-heading'));
  const accent = cssColorToHex(styles.getPropertyValue('--app-accent'));

  const pairs: Array<{ id: string; label: string; fg: string; bg: string }> = [];

  if (text && surface) {
    pairs.push({ id: 'text-surface', label: '본문 / 배경', fg: text, bg: surface });
  }
  if (heading && surface) {
    pairs.push({ id: 'heading-surface', label: '제목 / 배경', fg: heading, bg: surface });
  }
  if (accent && surface) {
    pairs.push({ id: 'accent-surface', label: '강조색 / 배경', fg: accent, bg: surface });
  }

  return pairs.map((pair) => {
    const ratio = getContrastRatio(pair.fg, pair.bg);
    return {
      ...pair,
      ratio,
      aa: meetsWcagAA(ratio),
      aaa: meetsWcagAAA(ratio),
    };
  });
}
