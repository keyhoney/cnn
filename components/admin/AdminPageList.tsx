'use client';

import type { TableOfContents } from '@/lib/content';
import type { AdminPageSelection } from '@/hooks/use-admin-editor';
import { cn } from '@/lib/utils';

interface AdminPageListProps {
  books: TableOfContents[];
  isLoading: boolean;
  error: string | null;
  selection: AdminPageSelection | null;
  onSelect: (page: AdminPageSelection) => void;
}

export function AdminPageList({
  books,
  isLoading,
  error,
  selection,
  onSelect,
}: AdminPageListProps) {
  if (isLoading) {
    return <p className="p-4 text-sm text-app-text-muted">페이지 목록 불러오는 중…</p>;
  }

  if (error) {
    return <p className="p-4 text-sm text-status-error">{error}</p>;
  }

  if (books.length === 0) {
    return <p className="p-4 text-sm text-app-text-muted">편집할 콘텐츠가 없습니다.</p>;
  }

  return (
    <nav className="overflow-y-auto p-2" aria-label="교재 페이지 목록">
      {books.map((book) => (
        <div key={book.bookId} className="mb-4">
          <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-app-text-muted">
            {book.book.title}
          </p>
          {book.chapters.map((chapter) => (
            <div key={chapter.id} className="mb-2">
              <p className="px-2 py-1 text-xs font-semibold text-app-text">{chapter.title}</p>
              <ul>
                {chapter.sections.flatMap((section) =>
                  section.pages.map((page) => {
                    const item: AdminPageSelection = {
                      bookId: book.bookId,
                      chapterId: chapter.id,
                      pageId: page.id,
                      title: page.title,
                      href: page.href,
                    };
                    const isSelected =
                      selection?.bookId === item.bookId &&
                      selection?.chapterId === item.chapterId &&
                      selection?.pageId === item.pageId;

                    return (
                      <li key={`${chapter.id}-${page.id}`}>
                        <button
                          type="button"
                          onClick={() => onSelect(item)}
                          className={cn(
                            'w-full rounded-lg px-2 py-2 text-left text-sm transition-colors',
                            isSelected
                              ? 'bg-app-accent text-white'
                              : 'text-app-text hover:bg-app-surface-muted'
                          )}
                        >
                          <span className="block font-medium">{page.title}</span>
                          <span
                            className={cn(
                              'mt-0.5 block text-[10px] uppercase tracking-wide',
                              isSelected ? 'text-white/80' : 'text-app-text-muted'
                            )}
                          >
                            {section.title} · {page.type}
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </nav>
  );
}
