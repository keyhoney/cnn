export const HOTKEY_SCOPES = {
  viewer: 'viewer',
} as const;

export const VIEWER_HOTKEYS = {
  search: 'ctrl+f, meta+f',
  bookmark: 'b',
  prevPage: 'left',
  nextPage: 'right',
  drawingMode: 'n',
  hint: 'h',
  toc: 't',
  closePanels: 'escape',
  undoDrawing: 'ctrl+z, meta+z',
  redoDrawing: 'ctrl+shift+z, meta+shift+z',
  print: 'ctrl+p, meta+p',
} as const;

export interface KeyboardShortcutItem {
  id: string;
  label: string;
  keys: string[];
  scope?: keyof typeof HOTKEY_SCOPES;
}

/** 설정 페이지·도움말용 단축키 목록 */
export const KEYBOARD_SHORTCUT_CATALOG: KeyboardShortcutItem[] = [
  { id: 'prev', label: '이전 페이지', keys: ['←'], scope: 'viewer' },
  { id: 'next', label: '다음 페이지', keys: ['→'], scope: 'viewer' },
  { id: 'search', label: '검색', keys: ['Ctrl+F'], scope: 'viewer' },
  { id: 'bookmark', label: '북마크 토글', keys: ['B'], scope: 'viewer' },
  { id: 'drawing', label: '필기 모드 ON/OFF', keys: ['N'], scope: 'viewer' },
  { id: 'hint', label: '힌트 요청', keys: ['H'], scope: 'viewer' },
  { id: 'toc', label: '목차 토글', keys: ['T'], scope: 'viewer' },
  { id: 'undo', label: '필기 실행 취소', keys: ['Ctrl+Z'], scope: 'viewer' },
  { id: 'redo', label: '필기 다시 실행', keys: ['Ctrl+Shift+Z'], scope: 'viewer' },
  { id: 'print', label: '페이지 인쇄', keys: ['Ctrl+P'], scope: 'viewer' },
  { id: 'escape', label: '패널/모달 닫기', keys: ['Esc'] },
];

export function isEditableHotkeyTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  );
}

export const HOTKEY_OPTIONS = {
  enableOnFormTags: false,
  preventDefault: true,
} as const;
