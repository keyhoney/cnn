export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-app-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
    >
      본문으로 건너뛰기
    </a>
  );
}
