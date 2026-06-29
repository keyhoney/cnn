'use client';

/** 항상 단일 페이지 뷰 */
export function useSpreadLayout() {
  return {
    isSingleColumn: true,
    isSpread: false,
    isMobile: false,
    isPortrait: false,
  };
}
