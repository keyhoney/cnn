'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ExternalLink, LogOut, Save } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { AdminMdxEditor } from '@/components/admin/AdminMdxEditor';
import { AdminMdxPreview } from '@/components/admin/AdminMdxPreview';
import { AdminPageList } from '@/components/admin/AdminPageList';
import {
  useAdminContentTree,
  useAdminPageEditor,
  type AdminPageSelection,
} from '@/hooks/use-admin-editor';
import { useAdminSession } from '@/hooks/use-admin-session';

export function AdminPageContent() {
  const { authenticated, configured, isLoading, login, logout } = useAdminSession();
  const { books, isLoading: isTreeLoading, error: treeError } = useAdminContentTree(authenticated);
  const [selection, setSelection] = useState<AdminPageSelection | null>(null);

  const initialSelection = useMemo(() => {
    if (books.length === 0) return null;

    const book = books[0];
    const chapter = book.chapters[0];
    const page = chapter?.sections[0]?.pages[0];
    if (!chapter || !page) return null;

    return {
      bookId: book.bookId,
      chapterId: chapter.id,
      pageId: page.id,
      title: page.title,
      href: page.href,
    } satisfies AdminPageSelection;
  }, [books]);

  const activeSelection = selection ?? initialSelection;

  const {
    source,
    setSource,
    isDirty,
    isLoading: isPageLoading,
    isSaving,
    error: pageError,
    saveMessage,
    save,
  } = useAdminPageEditor(activeSelection);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-bg text-sm text-app-text-muted">
        관리자 페이지 불러오는 중…
      </div>
    );
  }

  if (!authenticated) {
    return (
      <AppShell title="관리자" subtitle="콘텐츠 편집" backHref="/" backLabel="홈으로">
        <AdminLoginForm onLogin={login} configured={configured} />
      </AppShell>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-app-bg text-app-text">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-app-border bg-app-surface px-4 sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-app-heading sm:text-base">관리자</h1>
          <p className="truncate text-xs text-app-text-muted">
            {activeSelection ? activeSelection.title : '페이지를 선택하세요'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSelection && (
            <Link
              href={activeSelection.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 rounded-lg border border-app-border px-3 py-2 text-xs font-medium text-app-text transition-colors hover:bg-app-surface-muted sm:inline-flex"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              뷰어 열기
            </Link>
          )}

          <button
            type="button"
            onClick={() => void save()}
            disabled={!activeSelection || !isDirty || isSaving || isPageLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-app-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-app-accent-hover disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" aria-hidden />
            {isSaving ? '저장 중…' : '저장'}
          </button>

          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-app-border px-3 py-2 text-xs font-medium text-app-text-muted transition-colors hover:bg-app-surface-muted"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            로그아웃
          </button>
        </div>
      </header>

      {(pageError || saveMessage) && (
        <div className="border-b border-app-border px-4 py-2 text-sm sm:px-6">
          {pageError && <p className="text-status-error">{pageError}</p>}
          {saveMessage && <p className="text-app-accent">{saveMessage}</p>}
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
        <aside className="border-b border-app-border bg-app-surface lg:border-b-0 lg:border-r">
          <AdminPageList
            books={books}
            isLoading={isTreeLoading}
            error={treeError}
            selection={activeSelection}
            onSelect={setSelection}
          />
        </aside>

        <section className="flex min-h-[320px] flex-col border-b border-app-border p-3 xl:border-b-0 xl:border-r">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-app-text-muted">MDX 편집</h2>
            {isDirty && <span className="text-xs text-status-warning">저장되지 않음</span>}
          </div>
          <div className="min-h-0 flex-1">
            {isPageLoading ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-app-border text-sm text-app-text-muted">
                파일 불러오는 중…
              </div>
            ) : activeSelection ? (
              <AdminMdxEditor value={source} onChange={setSource} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-app-border text-sm text-app-text-muted">
                왼쪽에서 페이지를 선택하세요.
              </div>
            )}
          </div>
        </section>

        <section className="flex min-h-[320px] flex-col p-3">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-app-text-muted">
            KaTeX 미리보기
          </h2>
          <div className="min-h-0 flex-1 surface-card">
            <AdminMdxPreview source={source} selection={activeSelection} />
          </div>
        </section>
      </div>
    </div>
  );
}
