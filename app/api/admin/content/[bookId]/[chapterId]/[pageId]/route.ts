import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { assertValidContentIds, isAdminAuthenticated } from '@/lib/admin-auth';
import { getPageSource, pageExists } from '@/lib/content';

interface RouteParams {
  params: Promise<{ bookId: string; chapterId: string; pageId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { bookId, chapterId, pageId } = await params;

  try {
    assertValidContentIds(bookId, chapterId, pageId);
  } catch {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const exists = await pageExists(bookId, chapterId, pageId);
  if (!exists) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const parsed = await getPageSource(bookId, chapterId, pageId);
  if (!parsed) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }

  return NextResponse.json({
    bookId,
    chapterId,
    pageId,
    source: parsed.source,
    frontmatter: parsed.frontmatter,
  });
}

export async function PUT(request: Request, { params }: RouteParams) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { bookId, chapterId, pageId } = await params;

  try {
    assertValidContentIds(bookId, chapterId, pageId);
  } catch {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const body = (await request.json()) as { source?: string };
  if (typeof body.source !== 'string') {
    return NextResponse.json({ error: 'source is required' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'content', bookId, chapterId, `${pageId}.mdx`);

  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, body.source, 'utf8');
  } catch (error) {
    console.error('Failed to write MDX file:', error);
    return NextResponse.json(
      {
        error:
          '파일 저장에 실패했습니다. 로컬 개발 환경에서 content/ 폴더에 쓰기 권한이 있는지 확인하세요.',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, bookId, chapterId, pageId });
}
