import { getDatabase, isIndexedDbAvailable } from '@/lib/db';
import type { ProgressRecord } from '@/lib/types/database';
import type { TableOfContents, TocChapterEntry } from '@/lib/content';

export function progressKey(bookId: string, pageId: string): string {
  return `${bookId}:${pageId}`;
}

export interface ChapterProgress {
  completed: number;
  total: number;
  percent: number;
}

/** 챕터별 완료율 계산 */
export function computeChapterProgress(
  chapters: TocChapterEntry[],
  completedPageIds: Set<string>
): Record<string, ChapterProgress> {
  const result: Record<string, ChapterProgress> = {};

  for (const chapter of chapters) {
    const pageIds = chapter.sections.flatMap((section) => section.pages.map((page) => page.id));
    const total = pageIds.length;
    const completed = pageIds.filter((id) => completedPageIds.has(id)).length;

    result[chapter.id] = {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  return result;
}

/** 교재 전체 완료율 (%) */
export function computeBookProgressPercent(
  totalPages: number,
  completedPageIds: Set<string>,
  allPageIds: string[]
): number {
  if (totalPages === 0) return 0;
  const completed = allPageIds.filter((id) => completedPageIds.has(id)).length;
  return Math.round((completed / totalPages) * 100);
}

export function getAllPageIdsFromToc(toc: TableOfContents): string[] {
  return toc.chapters.flatMap((chapter) =>
    chapter.sections.flatMap((section) => section.pages.map((page) => page.id))
  );
}

async function getExistingRecord(
  userId: string,
  bookId: string,
  pageId: string
): Promise<ProgressRecord | undefined> {
  const db = getDatabase();
  return db.progress.where('[userId+bookId+pageId]').equals([userId, bookId, pageId]).first();
}

/** 교재 진도 레코드 일괄 로드 */
export async function loadBookProgressRecords(
  userId: string,
  bookId: string
): Promise<ProgressRecord[]> {
  if (!isIndexedDbAvailable()) return [];

  try {
    const db = getDatabase();
    return db.progress.where({ userId, bookId }).toArray();
  } catch {
    return [];
  }
}

/** 페이지 방문 기록 (visitedAt 갱신) */
export async function recordPageVisit(
  userId: string,
  bookId: string,
  pageId: string
): Promise<void> {
  if (!isIndexedDbAvailable()) return;

  try {
    const db = getDatabase();
    const existing = await getExistingRecord(userId, bookId, pageId);
    const now = new Date();

    if (existing?.id) {
      await db.progress.update(existing.id, { visitedAt: now });
    } else {
      await db.progress.add({
        userId,
        bookId,
        pageId,
        completed: false,
        visitedAt: now,
        timeSpentMs: 0,
      });
    }
  } catch {
    // IndexedDB unavailable
  }
}

/** 체류 시간 누적 */
export async function addPageTimeSpent(
  userId: string,
  bookId: string,
  pageId: string,
  deltaMs: number
): Promise<void> {
  if (!isIndexedDbAvailable() || deltaMs <= 0) return;

  try {
    const db = getDatabase();
    const existing = await getExistingRecord(userId, bookId, pageId);
    const now = new Date();

    if (existing?.id) {
      await db.progress.update(existing.id, {
        timeSpentMs: existing.timeSpentMs + deltaMs,
        visitedAt: now,
      });
    } else {
      await db.progress.add({
        userId,
        bookId,
        pageId,
        completed: false,
        visitedAt: now,
        timeSpentMs: deltaMs,
      });
    }
  } catch {
    // IndexedDB unavailable
  }
}

/** 페이지 완료 상태 설정 */
export async function setPageCompleted(
  userId: string,
  bookId: string,
  pageId: string,
  completed: boolean
): Promise<void> {
  if (!isIndexedDbAvailable()) return;

  try {
    const db = getDatabase();
    const existing = await getExistingRecord(userId, bookId, pageId);
    const now = new Date();

    if (existing?.id) {
      await db.progress.update(existing.id, { completed, visitedAt: now });
    } else {
      await db.progress.add({
        userId,
        bookId,
        pageId,
        completed,
        visitedAt: now,
        timeSpentMs: 0,
      });
    }
  } catch {
    // IndexedDB unavailable
  }
}
