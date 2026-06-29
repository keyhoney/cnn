import { getDatabase, isIndexedDbAvailable } from '@/lib/db';
import {
  deserializeStrokes,
  serializeStrokes,
  type DrawStroke,
} from '@/lib/drawing-strokes';
import { getOrCreateUserId } from '@/lib/user';

/** notes:{bookId}:{pageId}:{userId} — Dexie 복합 인덱스로 조회 */
export async function loadDrawingNotes(
  bookId: string,
  pageId: string
): Promise<DrawStroke[] | null> {
  if (!isIndexedDbAvailable()) return null;

  try {
    const userId = getOrCreateUserId();
    const record = await getDatabase()
      .notes.where('[userId+bookId+pageId]')
      .equals([userId, bookId, pageId])
      .first();

    if (!record?.konvaJson) return null;
    return deserializeStrokes(record.konvaJson);
  } catch {
    return null;
  }
}

export async function saveDrawingNotes(
  bookId: string,
  pageId: string,
  strokes: DrawStroke[]
): Promise<void> {
  if (!isIndexedDbAvailable()) return;

  try {
    const userId = getOrCreateUserId();
    const db = getDatabase();
    const konvaJson = serializeStrokes(strokes);
    const updatedAt = new Date();

    const existing = await db.notes
      .where('[userId+bookId+pageId]')
      .equals([userId, bookId, pageId])
      .first();

    if (existing?.id != null) {
      await db.notes.update(existing.id, { konvaJson, updatedAt });
      return;
    }

    if (strokes.length > 0) {
      await db.notes.add({ userId, bookId, pageId, konvaJson, updatedAt });
    }
  } catch {
    // IndexedDB unavailable
  }
}

export function strokesSnapshot(strokes: DrawStroke[]): string {
  return serializeStrokes(strokes);
}
