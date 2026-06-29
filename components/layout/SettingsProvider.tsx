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
import {
  applyDisplaySettings,
  DEFAULT_DISPLAY_SETTINGS,
  fontFamilyFromDbValue,
  fontFamilyToDbValue,
  getStoredDisplaySettings,
  mergeDisplaySettings,
  persistDisplaySettings,
  type DisplaySettings,
  type FontFamilySetting,
} from '@/lib/display-settings';
import type { FontSizeSetting, LineHeightSetting } from '@/lib/types/database';
import { getUserId } from '@/lib/user';

export interface SettingsContextValue {
  settings: DisplaySettings;
  isReady: boolean;
  setFontSize: (fontSize: FontSizeSetting) => void;
  setFontFamily: (fontFamily: FontFamilySetting) => void;
  setLineHeight: (lineHeight: LineHeightSetting) => void;
  setHighContrast: (highContrast: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

async function loadDisplaySettingsFromDb(): Promise<DisplaySettings | null> {
  const userId = getUserId();
  if (!userId) return null;

  try {
    const record = await getDatabase().settings.get(userId);
    if (!record) return null;

    return {
      fontSize: record.fontSize,
      fontFamily: fontFamilyFromDbValue(record.fontFamily),
      lineHeight: record.lineHeight,
      highContrast: record.highContrast,
    };
  } catch {
    return null;
  }
}

async function saveDisplaySettingsToDb(settings: DisplaySettings): Promise<void> {
  const userId = getUserId();
  if (!userId) return;

  try {
    const db = getDatabase();
    const existing = await db.settings.get(userId);
    if (!existing) return;

    await db.settings.put({
      ...existing,
      fontSize: settings.fontSize,
      fontFamily: fontFamilyToDbValue(settings.fontFamily),
      lineHeight: settings.lineHeight,
      highContrast: settings.highContrast,
    });
  } catch {
    // IndexedDB 미준비
  }
}

function useSettingsState(): SettingsContextValue {
  const [settings, setSettings] = useState<DisplaySettings>(DEFAULT_DISPLAY_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const stored = getStoredDisplaySettings();
      const fromDb = await loadDisplaySettingsFromDb();
      const resolved = fromDb ?? stored ?? DEFAULT_DISPLAY_SETTINGS;

      if (!cancelled) {
        setSettings(resolved);
        applyDisplaySettings(resolved);
        persistDisplaySettings(resolved);
        setIsReady(true);
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback((partial: Partial<DisplaySettings>) => {
    setSettings((current) => {
      const next = mergeDisplaySettings(partial, current);
      applyDisplaySettings(next);
      persistDisplaySettings(next);
      void saveDisplaySettingsToDb(next);
      return next;
    });
  }, []);

  const setFontSize = useCallback(
    (fontSize: FontSizeSetting) => updateSettings({ fontSize }),
    [updateSettings]
  );

  const setFontFamily = useCallback(
    (fontFamily: FontFamilySetting) => updateSettings({ fontFamily }),
    [updateSettings]
  );

  const setLineHeight = useCallback(
    (lineHeight: LineHeightSetting) => updateSettings({ lineHeight }),
    [updateSettings]
  );

  const setHighContrast = useCallback(
    (highContrast: boolean) => updateSettings({ highContrast }),
    [updateSettings]
  );

  return useMemo(
    () => ({
      settings,
      isReady,
      setFontSize,
      setFontFamily,
      setLineHeight,
      setHighContrast,
    }),
    [settings, isReady, setFontSize, setFontFamily, setLineHeight, setHighContrast]
  );
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const value = useSettingsState();
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings()는 SettingsProvider 내부에서 사용해야 합니다.');
  }
  return context;
}
