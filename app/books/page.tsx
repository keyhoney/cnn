import type { Metadata } from 'next';
import { getAllBooks } from '@/lib/content';
import { BooksPageContent } from '@/components/books/BooksPageContent';

export const metadata: Metadata = {
  title: '교재 목록',
  description: 'HowLearn에 등록된 교재를 선택해 학습을 시작하세요.',
};

export default async function BooksPage() {
  const books = await getAllBooks();

  return <BooksPageContent books={books} />;
}
