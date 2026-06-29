import { getAllBooks } from '@/lib/content';
import { HomePage } from '@/components/home/HomePage';

export default async function Home() {
  const books = await getAllBooks();

  return <HomePage books={books} />;
}
