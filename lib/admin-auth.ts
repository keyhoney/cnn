import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'cnn_admin_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length > 0 ? password : null;
}

export function isAdminConfigured(): boolean {
  return getAdminPassword() !== null;
}

function signSession(exp: number, secret: string): string {
  return createHmac('sha256', secret).update(String(exp)).digest('hex');
}

export function createAdminSessionToken(): string | null {
  const secret = getAdminPassword();
  if (!secret) return null;

  const exp = Date.now() + SESSION_TTL_MS;
  const sig = signSession(exp, secret);
  return `${exp}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const secret = getAdminPassword();
  if (!secret) return false;

  const [expStr, sig] = token.split('.');
  if (!expStr || !sig) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const expected = signSession(exp, secret);
  try {
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  if (password.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export function assertValidContentIds(bookId: string, chapterId: string, pageId: string) {
  const safe = (value: string) => /^[a-zA-Z0-9_-]+$/.test(value);
  if (!safe(bookId) || !safe(chapterId) || !safe(pageId)) {
    throw new Error('Invalid content path');
  }
}
