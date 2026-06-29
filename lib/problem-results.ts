import { getDatabase, isIndexedDbAvailable } from '@/lib/db';
import { getOrCreateUserId } from '@/lib/user';

export interface SaveProblemResultParams {
  problemId: string;
  bookId: string;
  pageId: string;
  isCorrect: boolean;
  hintsUsed?: number;
  timeSpentMs?: number;
  tags?: string[];
}

export interface RecordHintUsageParams {
  problemId: string;
  bookId: string;
  pageId: string;
  hintsUsed: number;
  tags?: string[];
}

/** 힌트 공개 시 IndexedDB에 사용 횟수 기록 */
export async function recordHintUsage({
  problemId,
  bookId,
  pageId,
  hintsUsed,
  tags = [],
}: RecordHintUsageParams): Promise<void> {
  if (!isIndexedDbAvailable()) return;

  try {
    const userId = getOrCreateUserId();
    const db = getDatabase();

    const existing = await db.problemResults
      .where('[userId+problemId]')
      .equals([userId, problemId])
      .first();

    const now = new Date();

    if (existing?.id) {
      await db.problemResults.update(existing.id, {
        hintsUsed: Math.max(existing.hintsUsed, hintsUsed),
        lastAttemptAt: now,
      });
    } else {
      await db.problemResults.add({
        userId,
        problemId,
        bookId,
        pageId,
        attempts: 0,
        firstAttemptCorrect: false,
        hintsUsed,
        timeSpentMs: 0,
        lastAttemptAt: now,
        tags,
      });
    }
  } catch {
    // IndexedDB unavailable
  }
}

/** 페이지에 제출된 문제 ID 집합 */
export async function getSubmittedProblemIdsForPage(
  userId: string,
  bookId: string,
  pageId: string
): Promise<Set<string>> {
  if (!isIndexedDbAvailable()) return new Set();

  try {
    const db = getDatabase();
    const records = await db.problemResults.where({ userId, bookId, pageId }).toArray();
    return new Set(records.filter((record) => record.attempts > 0).map((record) => record.problemId));
  } catch {
    return new Set();
  }
}

/** ProblemResult IndexedDB 저장 (시도 횟수 누적) */
export async function saveProblemResult({
  problemId,
  bookId,
  pageId,
  isCorrect,
  hintsUsed = 0,
  timeSpentMs = 0,
  tags = [],
}: SaveProblemResultParams): Promise<void> {
  if (!isIndexedDbAvailable()) return;

  try {
    const userId = getOrCreateUserId();
    const db = getDatabase();

    const existing = await db.problemResults
      .where('[userId+problemId]')
      .equals([userId, problemId])
      .first();

    const now = new Date();

    if (existing?.id) {
      const newAttempts = existing.attempts + 1;
      await db.problemResults.update(existing.id, {
        attempts: newAttempts,
        firstAttemptCorrect:
          newAttempts === 1 ? isCorrect : existing.firstAttemptCorrect,
        hintsUsed: Math.max(existing.hintsUsed, hintsUsed),
        timeSpentMs: existing.timeSpentMs + timeSpentMs,
        lastAttemptAt: now,
        tags: tags.length > 0 ? tags : existing.tags,
      });
    } else {
      await db.problemResults.add({
        userId,
        problemId,
        bookId,
        pageId,
        attempts: 1,
        firstAttemptCorrect: isCorrect,
        hintsUsed,
        timeSpentMs,
        lastAttemptAt: now,
        tags,
      });
    }
  } catch {
    // IndexedDB unavailable
  }
}
