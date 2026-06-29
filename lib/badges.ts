import { getDatabase, isIndexedDbAvailable } from '@/lib/db';
import type { BadgeRecord } from '@/lib/types/database';
import type { BadgeId } from '@/lib/types/badges';

export interface EarnedBadge extends BadgeRecord {
  id: number;
}

export async function loadEarnedBadges(userId: string): Promise<EarnedBadge[]> {
  if (!isIndexedDbAvailable()) return [];

  try {
    const records = await getDatabase().badges.where({ userId }).toArray();
    return records
      .filter((record): record is EarnedBadge => record.id != null)
      .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime());
  } catch {
    return [];
  }
}

export async function awardBadge(userId: string, badgeId: BadgeId): Promise<EarnedBadge | null> {
  if (!isIndexedDbAvailable()) return null;

  try {
    const db = getDatabase();
    const existing = await db.badges.where('[userId+badgeId]').equals([userId, badgeId]).first();
    if (existing?.id != null) return existing as EarnedBadge;

    const id = await db.badges.add({
      userId,
      badgeId,
      earnedAt: new Date(),
    });

    return { id, userId, badgeId, earnedAt: new Date() };
  } catch {
    return null;
  }
}

export async function loadBadgeEvaluationData(userId: string) {
  if (!isIndexedDbAvailable()) {
    return {
      problemResults: [],
      progressRecords: [],
      drawingPageIds: new Set<string>(),
    };
  }

  try {
    const db = getDatabase();
    const [problemResults, progressRecords, notes] = await Promise.all([
      db.problemResults.where({ userId }).toArray(),
      db.progress.where({ userId }).toArray(),
      db.notes.where({ userId }).toArray(),
    ]);

    const drawingPageIds = new Set(
      notes
        .filter((note) => note.konvaJson && !note.pageId.startsWith('notepad:'))
        .map((note) => note.pageId)
    );

    return { problemResults, progressRecords, drawingPageIds };
  } catch {
    return {
      problemResults: [],
      progressRecords: [],
      drawingPageIds: new Set<string>(),
    };
  }
}
