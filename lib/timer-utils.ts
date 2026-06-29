/** 초 → MM:SS 또는 HH:MM:SS */
export function formatCountdown(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const TIMER_VISIBILITY_KEY = 'cnn-howlearn:timer-hidden';

export function getTimerHiddenPreference(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TIMER_VISIBILITY_KEY) === 'true';
}

export function setTimerHiddenPreference(hidden: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TIMER_VISIBILITY_KEY, hidden ? 'true' : 'false');
}
