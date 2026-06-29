export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
} as const;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const;

export function staggerDelay(index: number, step = 0.08) {
  return index * step;
}

export const revealTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const };
