/** r1(최소) → r4(최대) — viewBox 400 기준 */
export const ORBIT_R1 = 70;
export const ORBIT_R2 = 100;
export const ORBIT_R3 = 130;
export const ORBIT_R4 = 175;

export const ORBIT_RINGS = [
  { id: 'r1', radius: ORBIT_R1, opacity: 0.2 },
  { id: 'r2', radius: ORBIT_R2, opacity: 0.25 },
  { id: 'r3', radius: ORBIT_R3, opacity: 0.3 },
  { id: 'r4', radius: ORBIT_R4, opacity: 0.4 },
] as const;

export const R2_KEYWORDS = [
  '개념 이해',
  '문제해결',
  '사고와 추론',
  '실생활 연결',
  '탐구 및 발견',
  '의사소통',
] as const;

export const R4_KEYWORDS = [
  '식과 구조',
  '함수와 그래프',
  '변화와 극한',
  '누적과 적분',
  '좌표와 도형',
  '경우와 불확실성',
  '확률과 통계적 판단',
  '논리와 일반화',
] as const;

function staggeredAngles(count: number, offsetDeg: number) {
  const step = 360 / count;
  return Array.from({ length: count }, (_, i) => offsetDeg + i * step);
}

export interface OrbitKeywordItem {
  label: string;
  radius: number;
  angleDeg: number;
}

export const ORBIT_INTRO_KEYWORDS: OrbitKeywordItem[] = [
  ...R2_KEYWORDS.map((label, i) => ({
    label,
    radius: ORBIT_R2,
    angleDeg: staggeredAngles(R2_KEYWORDS.length, -90)[i],
  })),
  ...R4_KEYWORDS.map((label, i) => ({
    label,
    radius: ORBIT_R4,
    angleDeg: staggeredAngles(R4_KEYWORDS.length, -90)[i],
  })),
];
