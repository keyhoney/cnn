const INSTALL_PROMPT_DISMISSED_KEY = 'cnn-howlearn:pwa-install-dismissed';
const INSTALL_PROMPT_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export function isPwaInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isInstallPromptDismissed(): boolean {
  try {
    const dismissedAt = localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY);
    if (!dismissedAt) return false;
    return Date.now() - Number(dismissedAt) < INSTALL_PROMPT_COOLDOWN_MS;
  } catch {
    return false;
  }
}

export function dismissInstallPrompt(): void {
  try {
    localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}
