import { NextResponse } from 'next/server';
import { isAdminAuthenticated, isAdminConfigured } from '@/lib/admin-auth';

export async function GET() {
  if (!isAdminConfigured()) {
    return NextResponse.json({ authenticated: false, configured: false });
  }

  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated, configured: true });
}
