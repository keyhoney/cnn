'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import type { TableOfContents } from '@/lib/content';
import { useBookSearch } from '@/hooks/use-book-search';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  toc: TableOfContents;
  isOpen: boolean;
  onClose: () => void;
}

function highlightSnippet(snippet: string, query: string) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (terms.length === 0) return snippet;

  const pattern = new RegExp(
    `(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi'
  );
  const parts = snippet.split(pattern);

  return parts.map((part, index) =>
    terms.some((term) => part.toLowerCase() === term.toLowerCase()) ? (
      <mark key={`${part}-${index}`} className="rounded bg-yellow-200/80 px-0.5 text-app-text">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
}

export function SearchModal({ toc, isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { query, setQuery, results, isLoading, isReady, loadError, reset } = useBookSearch({
    bookId: toc.bookId,
    enabled: isOpen,
  });

  useFocusTrap(panelRef, isOpen, inputRef);

  useEffect(() => {
    if (!isOpen) {
      reset();
      return;
    }

    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, reset]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 p-4 pt-[10vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="교재 검색"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="modal-panel flex max-h-[min(36rem,82vh)] w-full max-w-2xl flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-app-border px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-app-text-muted" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="본문, 수식, 문제 문구, 태그 검색…"
            className="min-w-0 flex-1 bg-transparent text-sm text-app-text outline-none placeholder:text-app-text-muted"
            aria-label="검색어"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-app-text-muted transition-colors hover:bg-app-surface-muted"
            aria-label="검색 닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <p className="px-3 py-6 text-center text-sm text-app-text-muted">
              검색 인덱스 불러오는 중…
            </p>
          ) : loadError ? (
            <p className="px-3 py-6 text-center text-sm text-status-error">{loadError}</p>
          ) : !query.trim() ? (
            <p className="px-3 py-6 text-center text-sm text-app-text-muted">
              교재 전체 본문을 검색합니다. Ctrl+F로 언제든 열 수 있습니다.
            </p>
          ) : !isReady ? (
            <p className="px-3 py-6 text-center text-sm text-app-text-muted">
              검색 인덱스를 준비하지 못했습니다.
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-app-text-muted">
              &quot;{query}&quot;에 맞는 결과가 없습니다.
            </p>
          ) : (
            <ul className="space-y-1">
              {results.map((hit) => (
                <li key={hit.id}>
                  <Link
                    href={hit.href}
                    onClick={onClose}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-app-surface-muted"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-app-accent-soft font-mono text-xs font-bold text-app-accent">
                      {hit.pageNumber}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-app-text">
                        {hit.pageTitle}
                      </span>
                      <span className="truncate text-[11px] text-app-text-muted">
                        {hit.chapterTitle} · {hit.sectionTitle}
                      </span>
                      <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-app-text-muted">
                        {highlightSnippet(hit.snippet, query)}
                      </span>
                      {hit.tags.length > 0 && (
                        <span className="mt-1.5 flex flex-wrap gap-1">
                          {hit.tags.map((tag) => (
                            <span
                              key={tag}
                              className={cn(
                                'rounded bg-app-surface-muted px-1.5 py-0.5 text-xs text-app-text-muted'
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
