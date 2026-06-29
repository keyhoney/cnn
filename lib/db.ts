import Dexie, { type Table } from 'dexie';
import type {
  BadgeRecord,
  BookmarkRecord,
  HighlightRecord,
  NoteRecord,
  ProblemResult,
  ProgressRecord,
  SettingsRecord,
} from '@/lib/types/database';

const DB_NAME = 'cnn-howlearn';
const DB_VERSION = 2;

export class AppDatabase extends Dexie {
  progress!: Table<ProgressRecord, number>;
  problemResults!: Table<ProblemResult, number>;
  notes!: Table<NoteRecord, number>;
  highlights!: Table<HighlightRecord, number>;
  bookmarks!: Table<BookmarkRecord, number>;
  badges!: Table<BadgeRecord, number>;
  settings!: Table<SettingsRecord, string>;

  constructor() {
    super(DB_NAME);

    this.version(1).stores({
      progress: '++id, userId, bookId, pageId, [userId+bookId+pageId]',
      problemResults: '++id, userId, problemId, bookId, pageId, [userId+problemId]',
      notes: '++id, userId, bookId, pageId, [userId+bookId+pageId]',
      highlights: '++id, userId, bookId, pageId, [userId+bookId+pageId]',
      bookmarks: '++id, userId, bookId, pageId, [userId+bookId+pageId]',
      badges: '++id, userId, badgeId, [userId+badgeId]',
      settings: 'userId',
    });

    this.version(DB_VERSION).stores({
      progress: '++id, userId, bookId, pageId, [userId+bookId+pageId]',
      problemResults:
        '++id, userId, problemId, bookId, pageId, [userId+problemId], [userId+bookId+pageId]',
      notes: '++id, userId, bookId, pageId, [userId+bookId+pageId]',
      highlights: '++id, userId, bookId, pageId, [userId+bookId+pageId]',
      bookmarks: '++id, userId, bookId, pageId, [userId+bookId+pageId]',
      badges: '++id, userId, badgeId, [userId+badgeId]',
      settings: 'userId',
    });
  }
}

let database: AppDatabase | undefined;

/** 브라우저에서 Dexie 인스턴스 반환 (SSR 환경에서는 호출하지 않음) */
export function getDatabase(): AppDatabase {
  if (typeof window === 'undefined') {
    throw new Error('getDatabase()는 브라우저 환경에서만 호출할 수 있습니다.');
  }

  if (!database) {
    database = new AppDatabase();
  }

  return database;
}

/** IndexedDB 사용 가능 여부 */
export function isIndexedDbAvailable(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}
