'use client';

import { useCallback, useEffect, useState } from 'react';
import type { BeforeInstallPromptEvent } from '@/types/pwa';
import { dismissInstallPrompt, isInstallPromptDismissed, isPwaInstalled } from '@/lib/pwa-storage';

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isPwaInstalled() || isInstallPromptDismissed()) return;

    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setIsVisible(false);

    if (outcome === 'dismissed') {
      dismissInstallPrompt();
    }
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    dismissInstallPrompt();
    setIsVisible(false);
  }, []);

  return {
    canInstall: Boolean(deferredPrompt),
    isVisible,
    install,
    dismiss,
  };
}
