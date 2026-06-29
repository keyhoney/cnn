'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { TableOfContents } from '@/lib/content';
import { getPageTypeLabel } from '@/lib/page-utils';
import { useBookProgress } from '@/hooks/use-book-progress';
import { ChapterProgressBar } from '@/components/progress/ChapterProgressBar';
import { BookBookmarkSection } from '@/components/progress/BookBookmarkSection';
import { useProgressStore } from '@/stores/progressStore';
import { AccordionPanel } from '@/components/eterna/AccordionPanel';
import { Reveal } from '@/components/eterna/Reveal';
import { staggerDelay } from '@/lib/eterna-motion';

interface BookProgressIndexProps {
  toc: TableOfContents;
}

/** 교재 목차 페이지 — 챕터별 AccordionPanel + Reveal stagger */
export function BookProgressIndex({ toc }: BookProgressIndexProps) {
  const { bookProgressPercent, chapterProgress, completedCount } = useBookProgress(toc.bookId, toc);
  const isPageCompleted = useProgressStore((s) => s.isPageCompleted);

  return (
    <div className="surface-card overflow-hidden">
      <Reveal>
        <div className="spectrum-border flex items-center justify-between border-b border-app-border-subtle bg-gradient-to-r from-app-surface-muted to-app-surface p-6 sm:p-8">
          <div>
            <p className="section-header mb-1">Contents</p>
            <h2 className="heading-display-sm font-serif">목차</h2>
            <p className="mt-1.5 text-sm text-app-text-muted">
              전체 진행률{' '}
              <span className="font-mono font-semibold text-app-accent">{bookProgressPercent}%</span>
            </p>
          </div>
          <span className="chip-muted">{toc.totalPages}페이지</span>
        </div>
      </Reveal>

      <Reveal>
        <div className="border-b border-app-border-subtle px-6 py-5 sm:px-8">
          <ChapterProgressBar
            percent={bookProgressPercent}
            completed={completedCount}
            total={toc.totalPages}
          />
        </div>
      </Reveal>

      <BookBookmarkSection toc={toc} />

      <div className="space-y-3 p-4 sm:p-6">
        {toc.chapters.map((chapter, chapterIndex) => {
          const progress = chapterProgress[chapter.id] ?? { completed: 0, total: 0, percent: 0 };
          const accentColors = ['#1b4dfe', '#7c3aed', '#fe881b', '#0ea5e9'];
          const accentColor = accentColors[chapterIndex % accentColors.length];

          return (
            <AccordionPanel
              key={chapter.id}
              title={chapter.title}
              subtitle={`${progress.completed}/${progress.total}페이지 · ${progress.percent}%`}
              defaultOpen
              accentColor={accentColor}
            >
              <div className="px-4 pb-4 sm:px-5">
                <ChapterProgressBar
                  size="sm"
                  percent={progress.percent}
                  completed={progress.completed}
                  total={progress.total}
                />
              </div>

              <div className="space-y-6 border-t border-app-border-subtle px-4 py-4 sm:px-5">
                {chapter.sections.map((section) => (
                  <div key={section.id}>
                    <h4 className="mb-3 text-xs font-semibold text-app-accent">{section.title}</h4>
                    <ul className="space-y-1">
                        {section.pages.map((page, pageIndex) => {
                          const completed = isPageCompleted(toc.bookId, page.id);

                          return (
                            <Reveal key={page.id} as="li" delay={staggerDelay(pageIndex)}>
                              <Link
                                href={page.href}
                                className="group -mx-2 flex min-h-[44px] items-start justify-between gap-3 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-app-accent/15 hover:bg-app-accent-soft/60 hover:shadow-app-sm"
                              >
                                <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-app-surface-muted font-mono text-[11px] font-semibold text-app-text-muted shadow-app-sm transition-all duration-200 group-hover:bg-app-accent group-hover:text-white group-hover:shadow-app-md">
                                    {page.pageNumber}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <span className="flex items-start gap-1.5 text-sm font-medium leading-snug text-app-text group-hover:text-app-accent">
                                      {completed && (
                                        <span className="shrink-0 text-status-success" aria-label="완료">
                                          ✓
                                        </span>
                                      )}
                                      <span className="break-words">{page.title}</span>
                                    </span>
                                    <span className="mt-0.5 block text-[10px] text-app-text-muted">
                                      {getPageTypeLabel(page.type)}
                                      {page.estimatedMinutes != null
                                        ? ` · 약 ${page.estimatedMinutes}분`
                                        : ''}
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-app-border transition-colors group-hover:text-app-accent" />
                              </Link>
                            </Reveal>
                          );
                        })}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionPanel>
          );
        })}
      </div>
    </div>
  );
}
