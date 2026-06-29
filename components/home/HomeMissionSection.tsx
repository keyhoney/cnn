'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { useMounted } from '@/hooks/use-mounted';
import { HomeTrustBand } from '@/components/home/HomeTrustBand';
import { HomeHeroFeatureCards } from '@/components/home/HomeHeroFeatureCards';

interface HomeMissionSectionProps {
  booksCount: number;
}

/** EternaCloud MissionSection — 헤더, 신뢰 밴드, 기능 카드 */
export function HomeMissionSection({ booksCount }: HomeMissionSectionProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const animate = mounted && !reduceMotion;

  const header = (
    <div className="mb-12 text-center sm:mb-16">
      <p className="hero-card-title gradient-text mb-4 font-medium">끊김 없는 학습</p>
      <h2 className="hero-section-title mb-4 text-white">쉽게 설계하고 배우세요.</h2>
      <p className="hero-card-body mx-auto max-w-2xl font-light">
        HowLearn은 학습 목표를 명확하게 실행하도록 돕습니다. 개념, 문제 풀이, 진도를 한곳에서
        이어가며 무거운 준비는 덜어내세요.
      </p>
    </div>
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 sm:py-20"
      aria-labelledby="home-mission-heading"
    >
      <div
        className="glow-orb pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2"
        style={{
          background: 'radial-gradient(ellipse, rgba(27,77,254,0.15) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative z-10">
        {animate ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            {header}
          </motion.div>
        ) : (
          header
        )}

        <HomeTrustBand booksCount={booksCount} />
        <HomeHeroFeatureCards />
      </div>
    </section>
  );
}
