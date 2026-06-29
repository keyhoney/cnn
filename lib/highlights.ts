import { getDatabase, isIndexedDbAvailable } from '@/lib/db';
import type { HighlightRecord } from '@/lib/types/database';

export interface HighlightWithId extends HighlightRecord {
  id: number;
}

/** 페이지 하이라이트 목록 로드 */
export async function loadPageHighlights(
  userId: string,
  bookId: string,
  pageId: string
): Promise<HighlightWithId[]> {
  if (!isIndexedDbAvailable()) return [];

  try {
    const db = getDatabase();
    const records = await db.highlights.where({ userId, bookId, pageId }).toArray();
    return records
      .filter((record): record is HighlightWithId => record.id != null)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } catch {
    return [];
  }
}

/** 하이라이트 추가 */
export async function addPageHighlight(
  userId: string,
  record: Omit<HighlightRecord, 'id' | 'userId' | 'createdAt'>
): Promise<HighlightWithId | undefined> {
  if (!isIndexedDbAvailable()) return undefined;

  try {
    const db = getDatabase();
    const id = await db.highlights.add({
      userId,
      ...record,
      createdAt: new Date(),
    });

    return {
      id,
      userId,
      ...record,
      createdAt: new Date(),
    };
  } catch {
    return undefined;
  }
}

/** 하이라이트 삭제 */
export async function removePageHighlight(userId: string, highlightId: number): Promise<void> {
  if (!isIndexedDbAvailable()) return;

  try {
    const db = getDatabase();
    await db.highlights.delete(highlightId);
  } catch {
    // ignore
  }
}

/** 하이라이트 메모 수정 */
export async function updatePageHighlightMemo(
  userId: string,
  highlightId: number,
  memo: string
): Promise<void> {
  if (!isIndexedDbAvailable()) return;

  try {
    const db = getDatabase();
    await db.highlights.update(highlightId, {
      memo: memo.trim() || undefined,
    });
  } catch {
    // ignore
  }
}

/** 하이라이트 색상 수정 */
export async function updatePageHighlightColor(
  userId: string,
  highlightId: number,
  color: string
): Promise<void> {
  if (!isIndexedDbAvailable()) return;

  try {
    const db = getDatabase();
    await db.highlights.update(highlightId, { color });
  } catch {
    // ignore
  }
}
