'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadDashboardData } from '@/lib/dashboard-data';
import { DASHBOARD_PAGE_INDEX } from '@/lib/dashboard-content';
import { getWrongAnswerItems, type WrongAnswerItem } from '@/lib/dashboard-stats';

/** 오답 노트 데이터 (P6-06) */
export function useWrongNotes() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<WrongAnswerItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const reload = useCallback(async () => {
    setIsLoading(true);
    const data = await loadDashboardData();
    const wrongItems = getWrongAnswerItems(data.problemResults, DASHBOARD_PAGE_INDEX);
    setItems(wrongItems);
    setIsLoading(false);
    return wrongItems;
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const problemParam = searchParams.get('problem');
    if (!problemParam || isLoading) return;
    const exists = items.some((item) => item.problemId === problemParam);
    if (exists) {
      setSelectedId(problemParam);
    }
  }, [searchParams, items, isLoading]);

  const selectedItem = useMemo(
    () => items.find((item) => item.problemId === selectedId) ?? null,
    [items, selectedId]
  );

  const selectProblem = useCallback((problemId: string) => {
    setSelectedId(problemId);
    setRetryKey((key) => key + 1);
  }, []);

  const restartRetry = useCallback(() => {
    setRetryKey((key) => key + 1);
  }, []);

  const refreshAfterSubmit = useCallback(async () => {
    const wrongItems = await reload();
    if (selectedId && !wrongItems.some((item) => item.problemId === selectedId)) {
      setSelectedId(wrongItems[0]?.problemId ?? null);
    }
  }, [reload, selectedId]);

  return {
    isLoading,
    items,
    selectedItem,
    selectedId,
    retryKey,
    selectProblem,
    restartRetry,
    refreshAfterSubmit,
    reload,
  };
}
