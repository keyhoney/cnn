import { THEME_STORAGE_KEY } from '@/lib/theme';

/** FOUC 방지: React 하이드레이션 전 localStorage 테마 적용 */
export function ThemeScript() {
  const script = `
(function() {
  try {
    var theme = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (theme === 'dark' || theme === 'sepia' || theme === 'light') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } catch (e) {}
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
