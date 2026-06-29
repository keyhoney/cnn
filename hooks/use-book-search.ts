'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadSearchIndex, searchBookContent } from '@/lib/search-runtime';
import type { SearchHit } from '@/lib/search-types';

interface UseBookSearchOptions {
  bookId: string;
  enabled?: boolean;
}

export function useBookSearch({ bookId, enabled = true }: UseBookSearchOptions) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !bookId) return;

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    void loadSearchIndex(bookId).then((payload) => {
      if (cancelled) return;
      setIsReady(Boolean(payload));
      if (!payload) {
        setLoadError('검색 인덱스를 불러오지 못했습니다. npm run build:search 를 실행해 주세요.');
      }
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [bookId, enabled]);

  const results = useMemo<SearchHit[]>(() => {
    if (!isReady || !query.trim()) return [];
    return searchBookContent(bookId, query, 20);
  }, [bookId, isReady, query]);

  const reset = useCallback(() => {
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isReady,
    loadError,
    reset,
  };
}
