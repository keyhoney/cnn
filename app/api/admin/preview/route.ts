import { NextResponse } from 'next/server';
import { serialize } from 'next-mdx-remote/serialize';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { mdxOptions } from '@/lib/mdx';

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as { source?: string };
  if (typeof body.source !== 'string') {
    return NextResponse.json({ error: 'source is required' }, { status: 400 });
  }

  try {
    const serialized = await serialize(body.source, mdxOptions);
    return NextResponse.json(serialized);
  } catch (error) {
    const message = error instanceof Error ? error.message : '미리보기 생성 실패';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
