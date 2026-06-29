'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { getSubmittedProblemIdsForPage } from '@/lib/problem-results';
import { getOrCreateUserId } from '@/lib/user';
import { useProgressStore } from '@/stores/progressStore';
import { useProblemStore } from '@/stores/problemStore';

export interface ProblemPageContextValue {
  bookId: string;
  chapterId: string;
  pageId: string;
  registerProblem: (problemId: string) => void;
  notifyProblemSubmitted: (problemId: string) => void;
}

const ProblemPageContext = createContext<ProblemPageContextValue | null>(null);

export function ProblemPageProvider({
  bookId,
  chapterId,
  pageId,
  children,
}: {
  bookId: string;
  chapterId: string;
  pageId: string;
  children: ReactNode;
}) {
  const [registeredProblemIds, setRegisteredProblemIds] = useState<Set<string>>(new Set());
  const registeredRef = useRef<Set<string>>(new Set());
  const dbSubmittedRef = useRef<Set<string>>(new Set());
  const markPageCompleted = useProgressStore((s) => s.markPageCompleted);
  const isPageCompleted = useProgressStore((s) => s.isPageCompleted);
  const submittedProblems = useProblemStore((s) => s.submittedProblems);

  const tryAutoComplete = useCallback(
    (ids: Set<string>) => {
      if (ids.size === 0) return;
      if (isPageCompleted(bookId, pageId)) return;

      const allSubmitted = [...ids].every(
        (id) => submittedProblems.has(id) || dbSubmittedRef.current.has(id)
      );

      if (allSubmitted) {
        void markPageCompleted(bookId, pageId);
      }
    },
    [bookId, pageId, isPageCompleted, markPageCompleted, submittedProblems]
  );

  useEffect(() => {
    registeredRef.current = new Set();
    setRegisteredProblemIds(new Set());
    dbSubmittedRef.current = new Set();

    async function loadSubmitted() {
      try {
        const userId = getOrCreateUserId();
        const ids = await getSubmittedProblemIdsForPage(userId, bookId, pageId);
        dbSubmittedRef.current = ids;
        tryAutoComplete(registeredRef.current);
      } catch {
        // ignore
      }
    }

    void loadSubmitted();
  }, [bookId, pageId, tryAutoComplete]);

  useEffect(() => {
    if (registeredProblemIds.size === 0) return;
    tryAutoComplete(registeredProblemIds);
  }, [registeredProblemIds, submittedProblems, tryAutoComplete]);

  const registerProblem = useCallback((problemId: string) => {
    if (registeredRef.current.has(problemId)) return;
    const next = new Set([...registeredRef.current, problemId]);
    registeredRef.current = next;
    setRegisteredProblemIds(next);
  }, []);

  const notifyProblemSubmitted = useCallback(
    (problemId: string) => {
      dbSubmittedRef.current = new Set([...dbSubmittedRef.current, problemId]);
      if (!registeredRef.current.has(problemId)) {
        const next = new Set([...registeredRef.current, problemId]);
        registeredRef.current = next;
        setRegisteredProblemIds(next);
      }
      tryAutoComplete(registeredRef.current);
    },
    [tryAutoComplete]
  );

  const value = useMemo(
    () => ({ bookId, chapterId, pageId, registerProblem, notifyProblemSubmitted }),
    [bookId, chapterId, pageId, registerProblem, notifyProblemSubmitted]
  );

  return <ProblemPageContext.Provider value={value}>{children}</ProblemPageContext.Provider>;
}

export function useProblemPage(): ProblemPageContextValue | null {
  return useContext(ProblemPageContext);
}
