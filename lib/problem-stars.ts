/**
 * 문제 별점 계산 (P3-03)
 *
 * - 1회차 정답: ⭐⭐⭐ (3)
 * - 2회차 정답: ⭐⭐ (2)
 * - 3회차 이상 정답: ⭐ (1)
 * - 힌트 1개당 -1 (최소 1)
 * - 오답: 0
 */
export function calculateStarRating(
  attemptNumber: number,
  isCorrect: boolean,
  hintsUsed = 0
): number {
  if (!isCorrect || attemptNumber < 1) return 0;

  let base: number;
  if (attemptNumber <= 1) base = 3;
  else if (attemptNumber === 2) base = 2;
  else base = 1;

  return Math.max(1, base - hintsUsed);
}

export function getStarRatingLabel(stars: number): string {
  switch (stars) {
    case 3:
      return '첫 시도 만점!';
    case 2:
      return '두 번째 시도 성공';
    case 1:
      return '정답! 더 연습해보세요';
    default:
      return '';
  }
}
