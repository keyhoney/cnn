import { getDatabase, isIndexedDbAvailable } from '@/lib/db';
import type { BookmarkRecord } from '@/lib/types/database';

export interface BookmarkWithId extends BookmarkRecord {
  id: number;
}

/** 교재 북마크 목록 로드 */
export async function loadBookBookmarks(
  userId: string,
  bookId: string
): Promise<BookmarkWithId[]> {
  if (!isIndexedDbAvailable()) return [];

  try {
    const db = getDatabase();
    const records = await db.bookmarks.where({ userId, bookId }).toArray();
    return records
      .filter((record): record is BookmarkWithId => record.id != null)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch {
    return [];
  }
}

export async function getBookmark(
  userId: string,
  bookId: string,
  pageId: string
): Promise<BookmarkWithId | undefined> {
  if (!isIndexedDbAvailable()) return undefined;

  try {
    const db = getDatabase();
    const record = await db.bookmarks
      .where('[userId+bookId+pageId]')
      .equals([userId, bookId, pageId])
      .first();
    return record?.id != null ? (record as BookmarkWithId) : undefined;
  } catch {
    return undefined;
  }
}

/** 북마크 추가 */
export async function addBookmark(
  userId: string,
  bookId: string,
  pageId: string,
  memo?: string
): Promise<BookmarkWithId | undefined> {
  if (!isIndexedDbAvailable()) return undefined;

  try {
    const db = getDatabase();
    const existing = await getBookmark(userId, bookId, pageId);
    if (existing) return existing;

    const id = await db.bookmarks.add({
      userId,
      bookId,
      pageId,
      memo: memo?.trim() || undefined,
      createdAt: new Date(),
    });

    return {
      id,
      userId,
      bookId,
      pageId,
      memo: memo?.trim() || undefined,
      createdAt: new Date(),
    };
  } catch {
    return undefined;
  }
}

/** 북마크 삭제 */
export async function removeBookmark(
  userId: string,
  bookId: string,
  pageId: string
): Promise<void> {
  if (!isIndexedDbAvailable()) return;

  try {
    const db = getDatabase();
    const existing = await getBookmark(userId, bookId, pageId);
    if (existing?.id) {
      await db.bookmarks.delete(existing.id);
    }
  } catch {
    // ignore
  }
}

/** 북마크 메모 수정 */
export async function updateBookmarkMemo(
  userId: string,
  bookId: string,
  pageId: string,
  memo: string
): Promise<void> {
  if (!isIndexedDbAvailable()) return;

  try {
    const db = getDatabase();
    const existing = await getBookmark(userId, bookId, pageId);
    if (!existing?.id) return;

    await db.bookmarks.update(existing.id, {
      memo: memo.trim() || undefined,
    });
  } catch {
    // ignore
  }
}
