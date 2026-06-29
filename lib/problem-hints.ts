/** 힌트 단계 라벨 (P3-04) */
export const HINT_LEVEL_LABELS = ['개념 상기', '접근 방향', '풀이 힌트'] as const;

export const MAX_HINTS = 3;

export function getHintLevelLabel(level: number): string {
  return HINT_LEVEL_LABELS[level - 1] ?? `힌트 ${level}`;
}

/** MDX hints 배열을 최대 3개로 제한 */
export function normalizeHints(hints?: string[]): string[] {
  if (!hints?.length) return [];
  return hints.slice(0, MAX_HINTS);
}
