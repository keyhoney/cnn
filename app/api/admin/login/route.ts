import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  isAdminConfigured,
  verifyAdminPassword,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD 환경 변수가 설정되지 않았습니다.' },
      { status: 503 }
    );
  }

  const body = (await request.json()) as { password?: string };
  const password = body.password ?? '';

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const token = createAdminSessionToken();
  if (!token) {
    return NextResponse.json({ error: '세션을 생성할 수 없습니다.' }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return response;
}
