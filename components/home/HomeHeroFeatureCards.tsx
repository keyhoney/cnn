'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { HERO_FEATURES } from '@/lib/hero-features';
import { useInView } from '@/hooks/useInView';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';

/** EternaCloud MissionSection ServiceCards — 4개 설명 버튼 + 상세 패널 */
export function HomeHeroFeatureCards() {
  const [active, setActive] = useState(0);
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const animate = mounted && !reduceMotion;
  const service = HERO_FEATURES[active];

  const grid = (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {HERO_FEATURES.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => setActive(i)}
          className={cn(
            'hero-card-dark cursor-pointer border-none p-4 text-left font-inherit transition-all duration-300 sm:p-6',
            active === i ? 'scale-[1.02] ring-1 ring-white/25' : 'opacity-80 hover:opacity-100'
          )}
        >
          <div
            className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl sm:mb-4"
            style={{ background: `${s.color}22` }}
          >
            <div className="h-4 w-4 rounded-full" style={{ background: s.color }} />
          </div>
          <h4 className="hero-card-title mb-1 text-white">{s.title}</h4>
          <p className="hero-card-subtitle mb-1">{s.subtitle}</p>
        </button>
      ))}
    </div>
  );

  const detailPanel = (
    <div className="hero-card-dark relative grid gap-8 overflow-hidden p-6 sm:p-8 lg:grid-cols-2 lg:p-12">
      <div
        className="absolute left-0 top-0 h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }}
        aria-hidden
      />
      <div>
        <p className="hero-card-subtitle mb-2">{service.tagline}</p>
        <h3 className="hero-card-headline mb-6 text-white">{service.headline}</h3>
        <ul className="mb-8 space-y-2">
          {service.highlights.map((h) => (
            <li key={h} className="hero-card-subtitle flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: service.color }} />
              {h}
            </li>
          ))}
        </ul>
        <Link href="/books" className="hero-btn-outline">
          교재 열기
        </Link>
      </div>
      <div className="space-y-3">
        <p className="hero-card-subtitle mb-4">{service.cta}</p>
        {service.painPoints.map((point) => (
          <div
            key={point}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60" aria-hidden>
              <path d="M4 8h8M8 4v8" stroke="#B8AED0" strokeWidth="1" />
            </svg>
            <span className="hero-card-subtitle">
              {point}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={ref} className="w-full">
      {animate ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {grid}
        </motion.div>
      ) : (
        grid
      )}

      {animate ? (
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
        >
          {detailPanel}
        </motion.div>
      ) : (
        detailPanel
      )}
    </div>
  );
}
