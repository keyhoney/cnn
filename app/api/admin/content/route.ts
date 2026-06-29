import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getAllBooks, getTableOfContents } from '@/lib/content';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const books = await getAllBooks();
  const tables = await Promise.all(
    books.map(async (book) => {
      const toc = await getTableOfContents(book.id);
      return toc;
    })
  );

  return NextResponse.json({
    books: tables.filter((toc) => toc !== null),
  });
}
