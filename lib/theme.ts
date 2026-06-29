import type { ThemeSetting } from '@/lib/types/database';

export const THEME_STORAGE_KEY = 'cnn-howlearn:theme';

export const THEMES: ThemeSetting[] = ['light', 'dark', 'sepia'];

export const THEME_LABELS: Record<ThemeSetting, string> = {
  light: '라이트',
  dark: '다크',
  sepia: '세피아',
};

export function isThemeSetting(value: string): value is ThemeSetting {
  return THEMES.includes(value as ThemeSetting);
}

/** document에 테마 적용 + localStorage 동기화 */
export function applyTheme(theme: ThemeSetting): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // private browsing 등
  }
}

export function getStoredTheme(): ThemeSetting | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored && isThemeSetting(stored) ? stored : null;
  } catch {
    return null;
  }
}
