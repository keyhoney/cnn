export type PageType = 'concept' | 'example' | 'exercise' | 'summary';

export function getPageTypeLabel(type: PageType): string {
  switch (type) {
    case 'concept':
      return '개념';
    case 'example':
      return '예제';
    case 'exercise':
      return '문제';
    case 'summary':
      return '정리';
    default:
      return '페이지';
  }
}
