'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { X, ChevronDown, ChevronRight, Check } from 'lucide-react';
import type { TableOfContents } from '@/lib/content';
import { getPageTypeLabel } from '@/lib/page-utils';
import { useBookProgress } from '@/hooks/use-book-progress';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { ChapterProgressBar } from '@/components/progress/ChapterProgressBar';
import { useProgressStore } from '@/stores/progressStore';
import { cn } from '@/lib/utils';

interface TOCSidebarProps {
  toc: TableOfContents;
  chapterId: string;
  pageId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TOCSidebar({
  toc,
  chapterId,
  pageId,
  isOpen,
  onClose,
}: TOCSidebarProps) {
  const panelRef = useRef<HTMLElement>(null);
  const { chapterProgress } = useBookProgress(toc.bookId, toc);
  const isPageCompleted = useProgressStore((s) => s.isPageCompleted);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(() => new Set([chapterId]));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => new Set());

  const currentSectionId = useMemo(() => {
    for (const chapter of toc.chapters) {
      for (const section of chapter.sections) {
        if (section.pages.some((p) => p.id === pageId && p.chapterId === chapterId)) {
          return section.id;
        }
      }
    }
    return null;
  }, [toc, chapterId, pageId]);

  useEffect(() => {
    if (!isOpen) return;
    setExpandedChapters((prev) => new Set(prev).add(chapterId));
    if (currentSectionId) {
      setExpandedSections((prev) => new Set(prev).add(currentSectionId));
    }
  }, [isOpen, chapterId, currentSectionId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useFocusTrap(panelRef, isOpen);

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
        aria-hidden
        onClick={onClose}
      />

      <aside
        ref={panelRef}
        className="fixed inset-y-0 left-0 z-50 flex w-[min(20rem,88vw)] flex-col border-r border-app-border-subtle modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="목차"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-app-border px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-app-text-muted">
              목차
            </p>
            <h2 className="truncate font-serif text-base text-app-heading">{toc.book.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-app-text-muted transition-colors hover:bg-app-surface-muted"
            aria-label="목차 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain p-3" aria-label="교재 목차">
          <ul className="space-y-2">
            {toc.chapters.map((chapter) => {
              const chapterExpanded = expandedChapters.has(chapter.id);
              const isCurrentChapter = chapter.id === chapterId;
              const progress = chapterProgress[chapter.id] ?? {
                completed: 0,
                total: 0,
                percent: 0,
              };

              return (
                <li key={chapter.id}>
                  <button
                    type="button"
                    onClick={() => toggleChapter(chapter.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors',
                      isCurrentChapter
                        ? 'bg-app-accent-soft/60 text-app-accent'
                        : 'hover:bg-app-surface-muted'
                    )}
                  >
                    {chapterExpanded ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="truncate font-serif text-sm font-semibold text-app-heading">
                        {chapter.title}
                      </span>
                      <ChapterProgressBar
                        size="sm"
                        percent={progress.percent}
                        completed={progress.completed}
                        total={progress.total}
                        className="mt-1.5"
                      />
                    </div>
                  </button>

                  {chapterExpanded && (
                    <ul className="ml-3 mt-1 space-y-1 border-l border-app-border pl-3">
                      {chapter.sections.map((section) => {
                        const sectionExpanded = expandedSections.has(section.id);
                        const isCurrentSection = section.id === currentSectionId;

                        return (
                          <li key={section.id}>
                            <button
                              type="button"
                              onClick={() => toggleSection(section.id)}
                              className={cn(
                                'flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-bold uppercase tracking-wider transition-colors',
                                isCurrentSection
                                  ? 'text-app-accent'
                                  : 'text-app-text-muted hover:text-app-text'
                              )}
                            >
                              {sectionExpanded ? (
                                <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                              )}
                              <span className="truncate">{section.title}</span>
                            </button>

                            {sectionExpanded && (
                              <ul className="mt-1 space-y-0.5">
                                {section.pages.map((page) => {
                                  const isActive =
                                    page.id === pageId && page.chapterId === chapterId;
                                  const completed = isPageCompleted(toc.bookId, page.id);

                                  return (
                                    <li key={page.id}>
                                      <Link
                                        href={page.href}
                                        onClick={onClose}
                                        className={cn(
                                          'group flex min-h-[40px] items-start gap-2.5 rounded-lg px-2 py-2 transition-all',
                                          isActive
                                            ? 'border border-app-accent/30 bg-app-accent-soft font-semibold text-app-accent shadow-sm'
                                            : 'border border-transparent hover:border-app-border hover:bg-app-surface-muted'
                                        )}
                                        aria-current={isActive ? 'page' : undefined}
                                      >
                                        <span
                                          className={cn(
                                            'flex h-7 w-7 shrink-0 items-center justify-center rounded font-mono text-[10px]',
                                            isActive
                                              ? 'bg-app-accent text-white'
                                              : 'bg-app-surface-muted text-app-text-muted group-hover:bg-app-accent group-hover:text-white'
                                          )}
                                        >
                                          {page.pageNumber}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                          <span className="flex items-start gap-1 text-sm leading-snug">
                                            {completed && (
                                              <Check
                                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-status-success"
                                                aria-label="완료"
                                              />
                                            )}
                                            <span className="break-words">{page.title}</span>
                                          </span>
                                          <span className="mt-0.5 block text-[10px] text-app-text-muted">
                                            {getPageTypeLabel(page.type)}
                                          </span>
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-app-border px-4 py-3 text-center text-[10px] text-app-text-muted">
          총 {toc.totalPages}페이지
        </div>
      </aside>
    </>
  );
}
