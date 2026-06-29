export interface ProgressRecord {
  id?: number;
  userId: string;
  bookId: string;
  pageId: string;
  completed: boolean;
  visitedAt: Date;
  timeSpentMs: number;
}

export interface ProblemResult {
  id?: number;
  userId: string;
  problemId: string;
  bookId: string;
  pageId: string;
  attempts: number;
  firstAttemptCorrect: boolean;
  hintsUsed: number;
  timeSpentMs: number;
  lastAttemptAt: Date;
  tags: string[];
}

export interface NoteRecord {
  id?: number;
  userId: string;
  bookId: string;
  pageId: string;
  konvaJson: string;
  updatedAt: Date;
}

export interface HighlightRecord {
  id?: number;
  userId: string;
  bookId: string;
  pageId: string;
  selector: string;
  color: string;
  memo?: string;
  createdAt: Date;
}

export interface BookmarkRecord {
  id?: number;
  userId: string;
  bookId: string;
  pageId: string;
  memo?: string;
  createdAt: Date;
}

export interface BadgeRecord {
  id?: number;
  userId: string;
  badgeId: string;
  earnedAt: Date;
}

export type ThemeSetting = 'light' | 'dark' | 'sepia';
export type FontSizeSetting = 'sm' | 'md' | 'lg' | 'xl';
export type LineHeightSetting = 'tight' | 'normal' | 'loose';
export type PenToolSetting = 'pen' | 'pencil' | 'highlighter';

export interface SettingsRecord {
  userId: string;
  theme: ThemeSetting;
  fontSize: FontSizeSetting;
  fontFamily: string;
  lineHeight: LineHeightSetting;
  animationEnabled: boolean;
  highContrast: boolean;
  penColor: string;
  penSize: number;
  penTool: PenToolSetting;
}

export const DEFAULT_SETTINGS: Omit<SettingsRecord, 'userId'> = {
  theme: 'light',
  fontSize: 'md',
  fontFamily: 'Noto Sans KR',
  lineHeight: 'normal',
  animationEnabled: true,
  highContrast: false,
  penColor: '#1a1333',
  penSize: 3,
  penTool: 'pen',
};
