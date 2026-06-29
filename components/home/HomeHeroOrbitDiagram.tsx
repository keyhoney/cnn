'use client';

import { useReducedMotion } from 'framer-motion';
import { ORBIT_RINGS } from '@/lib/orbit-keywords';
import { cn } from '@/lib/utils';

const VIEW_CENTER = 200;

/** 홈 히어로 — 인트로와 연결되는 회전 궤도 비주얼 */
export function HomeHeroOrbitDiagram({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn('relative mx-auto aspect-square w-full max-w-md', className)}
      aria-hidden
    >
      <svg
        viewBox="0 0 400 400"
        className={cn('h-full w-full', !reduceMotion && 'animate-spin-slow')}
      >
        <defs>
          <linearGradient id="homeHeroCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B4DFE" />
            <stop offset="33%" stopColor="#AC24FF" />
            <stop offset="66%" stopColor="#FE881B" />
            <stop offset="100%" stopColor="#FFD600" />
          </linearGradient>
        </defs>
        {ORBIT_RINGS.map((ring) => (
          <circle
            key={ring.id}
            cx={VIEW_CENTER}
            cy={VIEW_CENTER}
            r={ring.radius}
            fill="none"
            stroke="url(#homeHeroCircleGrad)"
            strokeWidth="1"
            opacity={ring.opacity}
          />
        ))}
        <circle cx={VIEW_CENTER} cy={VIEW_CENTER} r="8" fill="url(#homeHeroCircleGrad)" />
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = VIEW_CENTER + 160 * Math.cos(rad);
          const y = VIEW_CENTER + 160 * Math.sin(rad);
          return <circle key={angle} cx={x} cy={y} r="4" fill="#E59DFA" opacity="0.8" />;
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#1B4DFE] via-[#AC24FF] to-[#FE881B] opacity-80 blur-sm" />
        <div className="absolute h-8 w-8 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.5)]" />
      </div>
    </div>
  );
}
