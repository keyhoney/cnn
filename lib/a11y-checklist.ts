export interface KeyboardCheckItem {
  id: string;
  label: string;
  hint: string;
}

/** 키보드 탐색 수동 검증 체크리스트 (P7-08) */
export const KEYBOARD_NAV_CHECKLIST: KeyboardCheckItem[] = [
  {
    id: 'skip-nav',
    label: 'Skip Navigation',
    hint: 'Tab 키로 "본문으로 건너뛰기" 링크가 먼저 포커스되는지 확인',
  },
  {
    id: 'viewer-shortcuts',
    label: '뷰어 단축키',
    hint: '←/→ 페이지 이동, Ctrl+F 검색, B 북마크, N 필기, Esc 패널 닫기',
  },
  {
    id: 'modal-trap',
    label: '모달 포커스 트랩',
    hint: '검색·목차·QR·인쇄 모달에서 Tab이 모달 내부만 순환하는지 확인',
  },
  {
    id: 'modal-escape',
    label: '모달 Esc 닫기',
    hint: '열린 모달에서 Esc 키로 닫히는지 확인',
  },
  {
    id: 'focus-visible',
    label: '포커스 표시',
    hint: 'Tab 이동 시 포커스 링이 명확히 보이는지 확인 (고대비 모드 포함)',
  },
  {
    id: 'settings-radiogroup',
    label: '설정 라디오 그룹',
    hint: '설정 페이지에서 화살표/Tab으로 옵션을 선택할 수 있는지 확인',
  },
  {
    id: 'touch-target',
    label: '터치 타겟 44px',
    hint: '상단·하단 바 버튼이 최소 44×44px인지 확인',
  },
];

/** axe 자동 검사 대상 페이지 */
export const A11Y_AUDIT_ROUTES = [
  { path: '/', name: '홈' },
  { path: '/settings', name: '설정' },
  { path: '/dashboard', name: '대시보드' },
  { path: '/math-grade1/ch01/page01', name: '교재 뷰어' },
  { path: '/accessibility', name: '접근성 감사' },
] as const;

export const A11Y_CHECKLIST_STORAGE_KEY = 'cnn-howlearn:a11y-keyboard-checks';
