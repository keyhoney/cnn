/** 노트패드 IndexedDB 키용 pageId (페이지 필기와 분리) */
export function getNotepadPageId(bookId: string, pageId: string): string {
  return `notepad:${bookId}:${pageId}`;
}

export type NotepadBackground = 'grid' | 'lined' | 'blank';

export const NOTEPAD_BACKGROUNDS: {
  value: NotepadBackground;
  label: string;
}[] = [
  { value: 'grid', label: '모눈' },
  { value: 'lined', label: '줄' },
  { value: 'blank', label: '백지' },
];

export const NOTEPAD_GRID_STEP = 24;
export const NOTEPAD_LINE_STEP = 32;
export const NOTEPAD_PAPER_COLOR = '#fffef8';

/** Konva Stage → PNG 다운로드 */
export function downloadStagePng(
  dataUrl: string,
  filename: string
): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function notepadExportFilename(bookId: string, pageId: string): string {
  const safe = `${bookId}-${pageId}`.replace(/[^a-zA-Z0-9_-]+/g, '_');
  return `notepad-${safe}-${Date.now()}.png`;
}
