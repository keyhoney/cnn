import { DISPLAY_SETTINGS_STORAGE_KEY } from '@/lib/display-settings';

/** FOUC 방지: React 하이드레이션 전 표시 설정 적용 */
export function DisplaySettingsScript() {
  const script = `
(function() {
  try {
    var raw = localStorage.getItem('${DISPLAY_SETTINGS_STORAGE_KEY}');
    if (!raw) return;
    var s = JSON.parse(raw);
    var root = document.documentElement;
    if (s.fontSize) root.setAttribute('data-font-size', s.fontSize);
    if (s.fontFamily) root.setAttribute('data-font-family', s.fontFamily);
    if (s.lineHeight) root.setAttribute('data-line-height', s.lineHeight);
    root.setAttribute('data-high-contrast', s.highContrast ? 'true' : 'false');
  } catch (e) {}
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
