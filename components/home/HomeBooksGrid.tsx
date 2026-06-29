'use client';

import { BookOpen } from 'lucide-react';
import { FeatureCard } from '@/components/eterna/FeatureCard';
import { Reveal } from '@/components/eterna/Reveal';
import { staggerDelay } from '@/lib/eterna-motion';
import type { BookOverview } from '@/lib/content';

interface HomeBooksGridProps {
  books: BookOverview[];
}

export function HomeBooksGrid({ books }: HomeBooksGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book, i) => (
        <Reveal key={book.id} delay={staggerDelay(i)}>
          <FeatureCard
            href={`/${book.id}`}
            badge={`고등학교 ${book.grade}학년`}
            title={book.title}
            description={book.description}
            icon={
              <BookOpen className="relative h-14 w-14 text-app-accent/70 transition-transform duration-300 group-hover:scale-110 group-hover:text-app-accent sm:h-16 sm:w-16" />
            }
          />
        </Reveal>
      ))}
    </div>
  );
}
