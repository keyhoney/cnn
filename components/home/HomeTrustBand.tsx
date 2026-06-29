'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { useMounted } from '@/hooks/use-mounted';

interface HomeTrustBandProps {
  booksCount: number;
}

/** MissionSection 스타일 신뢰 통계 카드 */
export function HomeTrustBand({ booksCount }: HomeTrustBandProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const animate = mounted && !reduceMotion;

  const content = (
    <div className="hero-card-dark p-8 text-center sm:p-10 lg:p-12">
      <h3 className="hero-card-headline mb-3 text-white">
        성취기준에서 문제까지,
        <br />
        <span className="font-light text-white/75">한 흐름으로 이어지는 학습</span>
      </h3>
      <p className="hero-card-subtitle">
        <span className="font-medium text-white">{booksCount}권 교재</span>
        {' · '}
        성취기준 기반
        {' · '}
        문제·해설 통합
      </p>
    </div>
  );

  return (
    <div ref={ref} className="mb-12 sm:mb-16">
      {animate ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {content}
        </motion.div>
      ) : (
        content
      )}
    </div>
  );
}
