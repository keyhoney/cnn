import { getAllBooks, getTableOfContents } from '@/lib/content';
import { notFound } from 'next/navigation';
import { EternaShell } from '@/components/layout/EternaShell';
import { PageHero } from '@/components/eterna/PageHero';
import { BookProgressIndex } from '@/components/progress/BookProgressIndex';

export async function generateStaticParams() {
  const books = await getAllBooks();
  return books.map((book) => ({ bookId: book.id }));
}

export default async function BookIndex({ params }: { params: { bookId: string } }) {
  const { bookId } = params;
  const toc = await getTableOfContents(bookId);

  if (!toc) {
    notFound();
  }

  const { book } = toc;

  return (
    <EternaShell mainClassName="max-w-3xl">
      <PageHero
        compact
        eyebrow={`고등학교 ${book.grade}학년`}
        title={book.title}
        subtitle={book.subtitle}
      />
      <BookProgressIndex toc={toc} />
    </EternaShell>
  );
}
