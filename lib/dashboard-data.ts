import { getDatabase, isIndexedDbAvailable } from '@/lib/db';
import type { ProblemResult, ProgressRecord } from '@/lib/types/database';
import { getOrCreateUserId } from '@/lib/user';

export interface DashboardRawData {
  problemResults: ProblemResult[];
  progressRecords: ProgressRecord[];
}

export async function loadDashboardData(): Promise<DashboardRawData> {
  if (!isIndexedDbAvailable()) {
    return { problemResults: [], progressRecords: [] };
  }

  try {
    const userId = getOrCreateUserId();
    const db = getDatabase();
    const [problemResults, progressRecords] = await Promise.all([
      db.problemResults.where({ userId }).toArray(),
      db.progress.where({ userId }).toArray(),
    ]);

    return { problemResults, progressRecords };
  } catch {
    return { problemResults: [], progressRecords: [] };
  }
}
