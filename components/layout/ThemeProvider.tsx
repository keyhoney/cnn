'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getDatabase } from '@/lib/db';
import { applyTheme, getStoredTheme } from '@/lib/theme';
import type { ThemeSetting } from '@/lib/types/database';
import { getUserId } from '@/lib/user';

interface ThemeContextValue {
  theme: ThemeSetting;
  setTheme: (theme: ThemeSetting) => void;
  cycleTheme: () => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

async function loadThemeFromDb(): Promise<ThemeSetting | null> {
  const userId = getUserId();
  if (!userId) return null;

  try {
    const settings = await getDatabase().settings.get(userId);
    return settings?.theme ?? null;
  } catch {
    return null;
  }
}

async function saveThemeToDb(theme: ThemeSetting): Promise<void> {
  const userId = getUserId();
  if (!userId) return;

  try {
    const db = getDatabase();
    const existing = await db.settings.get(userId);
    if (existing) {
      await db.settings.put({ ...existing, theme });
    }
  } catch {
    // IndexedDB 미준비 시 무시
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeSetting>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const stored = getStoredTheme();
      const fromDb = await loadThemeFromDb();
      const resolved = fromDb ?? stored ?? 'light';

      if (!cancelled) {
        setThemeState(resolved);
        applyTheme(resolved);
        setIsReady(true);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const setTheme = useCallback((next: ThemeSetting) => {
    setThemeState(next);
    applyTheme(next);
    saveThemeToDb(next);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const order: ThemeSetting[] = ['light', 'dark', 'sepia'];
      const index = order.indexOf(current);
      const next = order[(index + 1) % order.length];
      applyTheme(next);
      saveThemeToDb(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, cycleTheme, isReady }),
    [theme, setTheme, cycleTheme, isReady]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme()는 ThemeProvider 내부에서 사용해야 합니다.');
  }
  return context;
}
