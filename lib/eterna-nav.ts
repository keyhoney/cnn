export const ETERNA_NAV_LINKS = [
  { href: '/', label: '홈' },
  { href: '/dashboard', label: '대시보드' },
  { href: '/wrong-notes', label: '오답 노트' },
  { href: '/settings', label: '설정' },
] as const;

export const ETERNA_FOOTER_LINKS = [
  ...ETERNA_NAV_LINKS,
  { href: '/accessibility', label: '접근성' },
] as const;

export function isDarkNavPath(pathname: string) {
  return pathname === '/';
}
