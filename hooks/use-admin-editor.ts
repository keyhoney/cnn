'use client';

import { useCallback, useEffect, useState } from 'react';
import type { TableOfContents } from '@/lib/content';

export interface AdminPageSelection {
  bookId: string;
  chapterId: string;
  pageId: string;
  title: string;
  href: string;
}

export function useAdminContentTree(enabled: boolean) {
  const [books, setBooks] = useState<TableOfContents[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/content');
      const data = (await response.json()) as { books?: TableOfContents[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? '콘텐츠 목록을 불러오지 못했습니다.');
      }

      setBooks(data.books ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '콘텐츠 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  return { books, isLoading, error, reload: load };
}

export function useAdminPageEditor(selection: AdminPageSelection | null) {
  const [source, setSource] = useState('');
  const [savedSource, setSavedSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isDirty = source !== savedSource;

  useEffect(() => {
    if (!selection) {
      setSource('');
      setSavedSource('');
      setError(null);
      return;
    }

    let cancelled = false;
    const current = selection;

    async function loadPage() {
      if (!current) return;

      setIsLoading(true);
      setError(null);
      setSaveMessage(null);

      try {
        const response = await fetch(
          `/api/admin/content/${current.bookId}/${current.chapterId}/${current.pageId}`
        );
        const data = (await response.json()) as { source?: string; error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? '페이지를 불러오지 못했습니다.');
        }

        if (!cancelled) {
          const nextSource = data.source ?? '';
          setSource(nextSource);
          setSavedSource(nextSource);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '페이지를 불러오지 못했습니다.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, [selection]);

  const save = useCallback(async () => {
    if (!selection) return;

    setIsSaving(true);
    setError(null);
    setSaveMessage(null);

    try {
      const response = await fetch(
        `/api/admin/content/${selection.bookId}/${selection.chapterId}/${selection.pageId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source }),
        }
      );

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? '저장에 실패했습니다.');
      }

      setSavedSource(source);
      setSaveMessage('저장되었습니다.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [selection, source]);

  return {
    source,
    setSource,
    isDirty,
    isLoading,
    isSaving,
    error,
    saveMessage,
    save,
  };
}
