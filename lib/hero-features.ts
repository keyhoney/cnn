/** 홈 히어로 기능 카드 */
export const HERO_FEATURES = [
  {
    id: 'design',
    title: '설계',
    subtitle: '아이디어에서 해답으로',
    tagline: '번거로움은 덜어내고',
    headline: '막막함 없이 새로운 개념과 기회를 실현하세요.',
    painPoints: [
      '어디서부터 공부해야 할지 막막할 때',
      '흩어진 개념과 문제를 한곳에 모으기 어려울 때',
      '반복 학습 계획을 직접 짜야 할 때',
      '이해가 안 되는 부분을 혼자 끙끙 앓을 때',
    ],
    highlights: ['맞춤 학습 경로', '이해 중심 콘텐츠'],
    cta: '아이디어를 가져오세요. 우리가 생명을 불어넣습니다.',
    color: '#1B4DFE',
  },
  {
    id: 'onboarding',
    title: '진단',
    subtitle: '평가에서 승인으로',
    tagline: '여기저기 맞춰 볼 필요 없이',
    headline: '훨씬 적은 시도로 나의 수준을 파악하세요.',
    painPoints: [
      '내 수준을 정확히 모를 때',
      '틀린 문제만 골라 복습하기 번거로울 때',
      '학습 진도를 스스로 추적하기 어려울 때',
      '약점을 놓치고 넘어갈 때',
    ],
    highlights: ['진단 기반 추천', '오답 노트 연동'],
    cta: '필요한 것만 말하세요. 나머지는 우리가 합니다.',
    color: '#AC24FF',
  },
  {
    id: 'delivery',
    title: '학습',
    subtitle: '요청에서 전달로',
    tagline: '과부하 없이',
    headline: '필요한 학습 자료를 맥락과 함께 받아보세요.',
    painPoints: [
      '교재와 문제를 오가며 맥락이 끊길 때',
      '필요한 개념을 찾느라 시간을 낭비할 때',
      '학습 순서를 스스로 조율해야 할 때',
      '복습 타이밍을 놓칠 때',
    ],
    highlights: ['교재·문제 통합', '맥락 있는 학습 흐름'],
    cta: '시작만 하세요. 끝까지 이끌어 드립니다.',
    color: '#FE881B',
  },
  {
    id: 'deployment',
    title: '성장',
    subtitle: '수령에서 완성으로',
    tagline: '마찰은 없애고',
    headline: '정리된 맥락으로 복습하고, 실력으로 완성하세요.',
    painPoints: [
      '배운 내용을 시험에 적용하기 어려울 때',
      '복습할 때 처음부터 다시 읽어야 할 때',
      '성취감 없이 반복만 할 때',
      '학습 기록이 흩어져 있을 때',
    ],
    highlights: ['대시보드 한눈에', '뱃지와 성취 추적'],
    cta: '기준을 정하세요. 우리가 굳혀 드립니다.',
    color: '#FFD600',
  },
] as const;

export type HeroFeature = (typeof HERO_FEATURES)[number];
