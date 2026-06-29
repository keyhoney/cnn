'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadDashboardData } from '@/lib/dashboard-data';
import { DASHBOARD_PAGE_INDEX } from '@/lib/dashboard-content';
import {
  computeAccuracyStats,
  computeStudyTimeStats,
  getWrongAnswerItems,
  type AccuracyStats,
  type StudyTimeStats,
  type WrongAnswerItem,
} from '@/lib/dashboard-stats';

export function useDashboardStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [problemResults, setProblemResults] = useState<Awaited<ReturnType<typeof loadDashboardData>>['problemResults']>([]);
  const [progressRecords, setProgressRecords] = useState<Awaited<ReturnType<typeof loadDashboardData>>['progressRecords']>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const data = await loadDashboardData();
      if (cancelled) return;
      setProblemResults(data.problemResults);
      setProgressRecords(data.progressRecords);
      setIsLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const accuracy = useMemo<AccuracyStats>(
    () => computeAccuracyStats(problemResults),
    [problemResults]
  );

  const studyTime = useMemo<StudyTimeStats>(
    () => computeStudyTimeStats(progressRecords),
    [progressRecords]
  );

  const wrongAnswers = useMemo<WrongAnswerItem[]>(
    () => getWrongAnswerItems(problemResults, DASHBOARD_PAGE_INDEX),
    [problemResults]
  );

  return {
    isLoading,
    accuracy,
    studyTime,
    wrongAnswers,
    problemCount: accuracy.total,
    wrongCount: wrongAnswers.length,
  };
}
