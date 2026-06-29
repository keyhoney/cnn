import type { FontSizeSetting, LineHeightSetting } from '@/lib/types/database';

export const DISPLAY_SETTINGS_STORAGE_KEY = 'cnn-howlearn:displaySettings';

export type FontFamilySetting = 'noto-sans' | 'nanum-myeongjo' | 'textbook';

export interface DisplaySettings {
  fontSize: FontSizeSetting;
  fontFamily: FontFamilySetting;
  lineHeight: LineHeightSetting;
  highContrast: boolean;
}

export const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  fontSize: 'md',
  fontFamily: 'noto-sans',
  lineHeight: 'normal',
  highContrast: false,
};

export const FONT_SIZE_OPTIONS: Array<{ value: FontSizeSetting; label: string; px: number }> = [
  { value: 'sm', label: '작음', px: 14 },
  { value: 'md', label: '보통', px: 16 },
  { value: 'lg', label: '크게', px: 18 },
  { value: 'xl', label: '매우 크게', px: 20 },
];

export const FONT_FAMILY_OPTIONS: Array<{ value: FontFamilySetting; label: string }> = [
  { value: 'noto-sans', label: '기본 (Noto Sans KR)' },
  { value: 'nanum-myeongjo', label: '나눔명조' },
  { value: 'textbook', label: '교과서체' },
];

export const LINE_HEIGHT_OPTIONS: Array<{ value: LineHeightSetting; label: string }> = [
  { value: 'tight', label: '좁음' },
  { value: 'normal', label: '보통' },
  { value: 'loose', label: '넓음' },
];

const FONT_FAMILIES: FontFamilySetting[] = ['noto-sans', 'nanum-myeongjo', 'textbook'];
const FONT_SIZES: FontSizeSetting[] = ['sm', 'md', 'lg', 'xl'];
const LINE_HEIGHTS: LineHeightSetting[] = ['tight', 'normal', 'loose'];

export function isFontFamilySetting(value: string): value is FontFamilySetting {
  return FONT_FAMILIES.includes(value as FontFamilySetting);
}

export function isFontSizeSetting(value: string): value is FontSizeSetting {
  return FONT_SIZES.includes(value as FontSizeSetting);
}

export function isLineHeightSetting(value: string): value is LineHeightSetting {
  return LINE_HEIGHTS.includes(value as LineHeightSetting);
}

export function fontFamilyToDbValue(value: FontFamilySetting): string {
  const map: Record<FontFamilySetting, string> = {
    'noto-sans': 'Noto Sans KR',
    'nanum-myeongjo': 'Nanum Myeongjo',
    textbook: 'Gowun Batang',
  };
  return map[value];
}

export function fontFamilyFromDbValue(value: string): FontFamilySetting {
  if (value.includes('Myeongjo') || value.includes('명조')) return 'nanum-myeongjo';
  if (value.includes('Batang') || value.includes('교과서')) return 'textbook';
  return 'noto-sans';
}

function parseStoredSettings(raw: string | null): DisplaySettings | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<DisplaySettings>;
    return {
      fontSize: parsed.fontSize && isFontSizeSetting(parsed.fontSize) ? parsed.fontSize : 'md',
      fontFamily:
        parsed.fontFamily && isFontFamilySetting(parsed.fontFamily) ? parsed.fontFamily : 'noto-sans',
      lineHeight:
        parsed.lineHeight && isLineHeightSetting(parsed.lineHeight) ? parsed.lineHeight : 'normal',
      highContrast: Boolean(parsed.highContrast),
    };
  } catch {
    return null;
  }
}

export function getStoredDisplaySettings(): DisplaySettings | null {
  if (typeof window === 'undefined') return null;

  try {
    return parseStoredSettings(localStorage.getItem(DISPLAY_SETTINGS_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function persistDisplaySettings(settings: DisplaySettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(DISPLAY_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // private browsing 등
  }
}

/** document에 표시 설정 적용 */
export function applyDisplaySettings(settings: DisplaySettings): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.setAttribute('data-font-size', settings.fontSize);
  root.setAttribute('data-font-family', settings.fontFamily);
  root.setAttribute('data-line-height', settings.lineHeight);
  root.setAttribute('data-high-contrast', settings.highContrast ? 'true' : 'false');
}

export function mergeDisplaySettings(
  partial: Partial<DisplaySettings>,
  current: DisplaySettings = DEFAULT_DISPLAY_SETTINGS
): DisplaySettings {
  return {
    fontSize: partial.fontSize ?? current.fontSize,
    fontFamily: partial.fontFamily ?? current.fontFamily,
    lineHeight: partial.lineHeight ?? current.lineHeight,
    highContrast: partial.highContrast ?? current.highContrast,
  };
}
