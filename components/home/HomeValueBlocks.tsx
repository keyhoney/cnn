'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, TrendingUp } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';

const BLOCKS = [
  {
    eyebrow: '개념 → 문제',
    title: '읽고 바로 풀 수 있게',
    body: '성취기준 단위로 개념을 읽고, 같은 맥락에서 문제와 해설까지 이어집니다. 교재와 문제집을 오가며 맥락을 잃지 않습니다.',
    accent: '#1B4DFE',
    icon: BookOpen,
    visual: (
      <div className="grid grid-cols-2 gap-3">
        {['개념', '예제', '문제', '해설'].map((label, i) => (
          <div
            key={label}
            className="hero-card-dark flex flex-col items-center justify-center p-4 text-center"
            style={{ opacity: 0.5 + i * 0.15 }}
          >
            <span className="hero-card-subtitle mb-1 text-xs uppercase tracking-wider opacity-60">
              Step {i + 1}
            </span>
            <span className="hero-card-title text-white">{label}</span>
          </div>
        ))}
      </div>
    ),
    reverse: false,
  },
  {
    eyebrow: '진도 → 성장',
    title: '학습이 쌓이는 대시보드',
    body: '읽은 페이지, 푼 문제, 오답 노트가 자동으로 기록됩니다. 수기 관리 없이 진도와 성장을 한눈에 확인하세요.',
    accent: '#AC24FF',
    icon: TrendingUp,
    reverse: true,
    visual: (
      <div className="space-y-3">
        {[
          { label: '읽기 진도', pct: 72 },
          { label: '문제 풀이', pct: 58 },
          { label: '오답 복습', pct: 41 },
        ].map((bar) => (
          <div key={bar.label} className="hero-card-dark p-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-white/80">{bar.label}</span>
              <span className="font-medium text-white">{bar.pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1B4DFE] to-[#AC24FF]"
                style={{ width: `${bar.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
] as const;

/** EternaCloud NatureSection — 2단 alternating 비주얼 블록 */
export function HomeValueBlocks() {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const animate = mounted && !reduceMotion;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 sm:py-20"
      aria-labelledby="home-value-heading"
    >
      <h2 id="home-value-heading" className="sr-only">
        HowLearn 핵심 가치
      </h2>

      <div className="space-y-20 sm:space-y-28">
        {BLOCKS.map((block, i) => {
          const Icon = block.icon;
          const content = (
            <div
              className={cn(
                'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
                block.reverse ? 'lg:[direction:rtl]' : undefined
              )}
            >
              <div className={cn(block.reverse ? 'lg:[direction:ltr]' : undefined)}>
                <p
                  className="hero-card-title mb-3 font-medium"
                  style={{ color: block.accent }}
                >
                  {block.eyebrow}
                </p>
                <h3 className="hero-section-title mb-4 text-white">{block.title}</h3>
                <p className="hero-card-body font-light">{block.body}</p>
              </div>
              <div className={cn('relative', block.reverse ? 'lg:[direction:ltr]' : undefined)}>
                <div
                  className="pointer-events-none absolute -inset-4 rounded-2xl opacity-20 blur-2xl"
                  style={{ background: `radial-gradient(circle, ${block.accent} 0%, transparent 70%)` }}
                  aria-hidden
                />
                <div className="relative flex items-center gap-4">
                  <div
                    className="hidden shrink-0 rounded-xl p-3 sm:flex"
                    style={{ background: `${block.accent}22` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: block.accent }} />
                  </div>
                  {block.visual}
                </div>
              </div>
            </div>
          );

          if (!animate) {
            return <div key={block.eyebrow}>{content}</div>;
          }

          return (
            <motion.div
              key={block.eyebrow}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.2 }}
            >
              {content}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
