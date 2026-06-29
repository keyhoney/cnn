import { getDatabase } from '@/lib/db';
import { DEFAULT_SETTINGS, type SettingsRecord } from '@/lib/types/database';

const USER_ID_STORAGE_KEY = 'cnn-howlearn:userId';

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/** 저장된 로컬 사용자 ID 조회 */
export function getUserId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(USER_ID_STORAGE_KEY);
}

/** 로컬 UUID 생성 또는 기존 ID 반환 */
export function getOrCreateUserId(): string {
  if (!isBrowser()) {
    throw new Error('getOrCreateUserId()는 브라우저 환경에서만 호출할 수 있습니다.');
  }

  const existing = localStorage.getItem(USER_ID_STORAGE_KEY);
  if (existing) return existing;

  const userId = crypto.randomUUID();
  localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  return userId;
}

/** 신규 사용자 기본 설정 레코드 생성 */
export async function ensureDefaultSettings(userId: string): Promise<SettingsRecord> {
  const db = getDatabase();
  const existing = await db.settings.get(userId);

  if (existing) return existing;

  const settings: SettingsRecord = {
    userId,
    ...DEFAULT_SETTINGS,
  };

  await db.settings.put(settings);
  return settings;
}

/** 사용자 ID 확보 + DB 기본 설정 초기화 */
export async function initializeUser(): Promise<string> {
  const userId = getOrCreateUserId();
  await ensureDefaultSettings(userId);
  return userId;
}

/** 저장된 사용자 ID 삭제 (디버그/재설정용) */
export function clearUserId(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(USER_ID_STORAGE_KEY);
}
