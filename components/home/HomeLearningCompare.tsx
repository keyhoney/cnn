'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useMounted } from '@/hooks/use-mounted';
const BEFORE_ITEMS = [
  '흩어진 교재·문제',
  '진도·오답 수기 관리',
  '맥락 끊김',
] as const;

const AFTER_ITEMS = [
  '교재·문제·해설 한 흐름',
  '대시보드·오답 노트 자동',
  '성취기준 단위 페이지',
] as const;

/** EternaCloud FreedomSection — Before/After 비교 */
export function HomeLearningCompare() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const animate = mounted && !reduceMotion;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 sm:py-20"
      aria-labelledby="home-compare-heading"
    >
      <div className="mb-12 text-center sm:mb-16">
        <p className="hero-card-title gradient-text mb-4 font-medium">학습 방식의 전환</p>
        <h2 id="home-compare-heading" className="hero-section-title text-white">
          흩어진 자료에서 연결된 흐름으로
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        <CompareCard
          variant="before"
          title="일반 학습"
          items={BEFORE_ITEMS}
          icon={<X className="h-5 w-5" />}
          inView={inView}
          animate={animate}
          delay={0}
        />
        <CompareCard
          variant="after"
          title="HowLearn"
          items={AFTER_ITEMS}
          icon={<Check className="h-5 w-5" />}
          inView={inView}
          animate={animate}
          delay={0.15}
        />
      </div>
    </section>
  );
}

function CompareCard({
  variant,
  title,
  items,
  icon,
  inView,
  animate,
  delay,
}: {
  variant: 'before' | 'after';
  title: string;
  items: readonly string[];
  icon: React.ReactNode;
  inView: boolean;
  animate: boolean;
  delay: number;
}) {
  const isAfter = variant === 'after';

  const card = (
    <div className="hero-card-dark flex h-full flex-col p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span
          className={
            isAfter
              ? 'flex h-8 w-8 items-center justify-center rounded-full bg-[#AC24FF]/20 text-[#E59DFA]'
              : 'flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60'
          }
        >
          {icon}
        </span>
        <h3 className="hero-card-headline text-white">{title}</h3>
      </div>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="hero-card-body flex items-start gap-3 font-light">
            <span className="mt-1.5 shrink-0 opacity-60">{icon}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  if (!animate) return card;

  return (
    <motion.div
      initial={{ opacity: 0, x: isAfter ? 40 : -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {card}
    </motion.div>
  );
}
