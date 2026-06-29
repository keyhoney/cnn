'use client';

import { useCallback, useEffect, useState } from 'react';
import { getDatabase } from '@/lib/db';
import { DEFAULT_SETTINGS } from '@/lib/types/database';
import { getUserId } from '@/lib/user';

const CACHE_KEY = 'cnn-howlearn:animationEnabled';

export function useAnimationSettings() {
  const [animationEnabled, setAnimationEnabledState] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached !== null) {
        setAnimationEnabledState(cached === 'true');
      }
    } catch {
      // ignore
    }

    async function load() {
      const userId = getUserId();
      if (!userId) {
        setIsReady(true);
        return;
      }

      try {
        const settings = await getDatabase().settings.get(userId);
        const enabled = settings?.animationEnabled ?? DEFAULT_SETTINGS.animationEnabled;
        setAnimationEnabledState(enabled);
        localStorage.setItem(CACHE_KEY, String(enabled));
      } catch {
        // IndexedDB 미준비
      } finally {
        setIsReady(true);
      }
    }

    load();
  }, []);

  const setAnimationEnabled = useCallback(async (enabled: boolean) => {
    setAnimationEnabledState(enabled);
    localStorage.setItem(CACHE_KEY, String(enabled));

    const userId = getUserId();
    if (!userId) return;

    try {
      const db = getDatabase();
      const existing = await db.settings.get(userId);
      if (existing) {
        await db.settings.put({ ...existing, animationEnabled: enabled });
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleAnimation = useCallback(async () => {
    await setAnimationEnabled(!animationEnabled);
  }, [animationEnabled, setAnimationEnabled]);

  return { animationEnabled, toggleAnimation, setAnimationEnabled, isReady };
}
