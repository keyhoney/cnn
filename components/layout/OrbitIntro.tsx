'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';
import { ORBIT_INTRO_KEYWORDS, ORBIT_RINGS } from '@/lib/orbit-keywords';

const VIEW_SIZE = 400;
const VIEW_CENTER = 200;

/** 수렴 종료 시 중앙 흰 원 기준 크기(px) — coreScale 6 × 12px */
const CONVERGED_WHITE_SIZE = 72;

/** HowLearn 글자 등장을 기존 타이밍보다 앞당기는 시간(ms) */
const BRAND_LEAD_MS = 1500;

/** 총 약 8.2초 — 궤도(3s) + 수렴(3s) + 흰 원 확대(1.4s) + 브랜드 + 페이드 */
const TIMING = {
  orbit: 3000,
  converge: 3000,
  expand: 1400,
  brand: 1600,
  exit: 700,
} as const;

type Phase = 'orbit' | 'converge' | 'expand' | 'brand' | 'exit';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function getCoverDiameter() {
  if (typeof window === 'undefined') return 2400;
  return Math.hypot(window.innerWidth, window.innerHeight) * 1.2;
}

function OrbitIntroScene({ onComplete }: { onComplete: () => void }) {
  const timing = TIMING;
  const diagramRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('orbit');
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [converge, setConverge] = useState(0);
  const [expand, setExpand] = useState(0);
  const [showBrand, setShowBrand] = useState(false);
  const [coverDiameter, setCoverDiameter] = useState(getCoverDiameter);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const syncOrbitUnit = useCallback(() => {
    const container = diagramRef.current;
    if (!container) return;
    const size = Math.max(container.getBoundingClientRect().width, 280);
    container.style.setProperty('--orbit-unit', `${size / VIEW_SIZE}px`);
    setCoverDiameter(getCoverDiameter());
  }, []);

  useLayoutEffect(() => {
    syncOrbitUnit();
    const ro = new ResizeObserver(syncOrbitUnit);
    if (diagramRef.current) ro.observe(diagramRef.current);
    window.addEventListener('resize', syncOrbitUnit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', syncOrbitUnit);
    };
  }, [syncOrbitUnit]);

  useEffect(() => {
    if (phase !== 'orbit') return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / timing.orbit);
      setOrbitAngle(t * 72);
      if (t >= 1) {
        setPhase('converge');
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, timing.orbit]);

  useEffect(() => {
    if (phase !== 'converge') return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / timing.converge);
      setConverge(easeOutCubic(t));
      if (t >= 1) {
        window.setTimeout(() => setPhase('expand'), 180);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, timing.converge]);

  useEffect(() => {
    if (phase !== 'expand') return;

    const brandDelay = Math.max(0, timing.expand + 120 - BRAND_LEAD_MS);
    const brandTimer = window.setTimeout(() => setShowBrand(true), brandDelay);

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / timing.expand);
      setExpand(easeOutCubic(t));
      if (t >= 1) {
        setPhase('brand');
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      window.clearTimeout(brandTimer);
      cancelAnimationFrame(raf);
    };
  }, [phase, timing.expand]);

  useEffect(() => {
    if (!showBrand) return;
    const t = window.setTimeout(() => setPhase('exit'), timing.brand);
    return () => window.clearTimeout(t);
  }, [showBrand, timing.brand]);

  useEffect(() => {
    if (phase === 'exit') {
      const t = window.setTimeout(() => onCompleteRef.current(), timing.exit);
      return () => window.clearTimeout(t);
    }
  }, [phase, timing.brand, timing.exit]);

  const showOrbit = phase === 'orbit' || phase === 'converge' || phase === 'expand';
  const showInnerCore = phase === 'orbit' || phase === 'converge';
  const orbitProgress = orbitAngle / 72;
  const keywordOpacity =
    phase === 'converge' || phase === 'expand'
      ? Math.max(0, 1 - converge * 1.1)
      : Math.min(1, orbitProgress * 2.8);
  const coreScale = 1 + converge * 5;
  const coreBrightness = 0.35 + converge * 0.65;

  const expandProgress = phase === 'expand' ? expand : phase === 'brand' || phase === 'exit' ? 1 : 0;
  const whiteDiameter =
    CONVERGED_WHITE_SIZE + (coverDiameter - CONVERGED_WHITE_SIZE) * expandProgress;

  return (
    <div
      className="orbit-intro-screen fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
      aria-live="polite"
      aria-label="HowLearn 시작 화면"
    >
      {showOrbit ? (
        <motion.div
          ref={diagramRef}
          className="orbit-intro-diagram relative z-[1] aspect-square w-[min(88vmin,560px)]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          style={{ '--orbit-unit': '0.7px' } as React.CSSProperties}
        >
          <svg viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} className="h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="introCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
                stroke="url(#introCircleGrad)"
                strokeWidth="1"
                opacity={ring.opacity}
              />
            ))}
          </svg>

          <div
            className="absolute inset-0"
            style={{
              transform: `rotate(${orbitAngle}deg)`,
              transformOrigin: 'center center',
            }}
          >
            {ORBIT_INTRO_KEYWORDS.map((kw) => {
              const r = kw.radius * (1 - converge);
              return (
                <div
                  key={kw.label}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0"
                  style={{
                    transform: `rotate(${kw.angleDeg}deg) translateY(calc(-1 * ${r} * var(--orbit-unit)))`,
                    opacity: keywordOpacity,
                  }}
                >
                  <div
                    style={{
                      transform: `rotate(${-kw.angleDeg - orbitAngle}deg)`,
                    }}
                  >
                    <div className="hero-orbit-node">
                      <span className="hero-orbit-keyword-dot" aria-hidden />
                      <span className="hero-orbit-keyword-label">{kw.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showInnerCore ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="rounded-full bg-gradient-to-br from-[#1B4DFE] via-[#AC24FF] to-[#FE881B]"
                style={{
                  width: `${24 * coreScale}px`,
                  height: `${24 * coreScale}px`,
                  opacity: coreBrightness,
                  boxShadow: `0 0 ${30 + converge * 180}px rgba(172, 36, 255, ${0.35 + converge * 0.55}), 0 0 ${converge * 120}px rgba(255, 255, 255, ${converge * 0.85})`,
                }}
              />
              <div
                className="absolute rounded-full bg-white"
                style={{
                  width: `${12 * coreScale}px`,
                  height: `${12 * coreScale}px`,
                  opacity: 0.5 + converge * 0.5,
                  boxShadow: `0 0 ${20 + converge * 60}px rgba(255,255,255,${0.6 + converge * 0.4})`,
                }}
              />
            </div>
          ) : null}
        </motion.div>
      ) : null}

      {phase === 'expand' || phase === 'brand' || phase === 'exit' ? (
        <div
          className="pointer-events-none fixed left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{
            width: `${whiteDiameter}px`,
            height: `${whiteDiameter}px`,
            boxShadow:
              expandProgress < 1
                ? `0 0 ${24 + expandProgress * 48}px rgba(255,255,255,${0.45 + expandProgress * 0.35})`
                : undefined,
          }}
          aria-hidden
        />
      ) : null}

      {showBrand ? (
        <motion.div
          className={cn(
            'absolute inset-0 z-[3] flex items-center justify-center',
            expandProgress >= 1 && 'bg-white'
          )}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'exit' ? 0 : 1 }}
          transition={{ duration: timing.exit / 1000, ease: 'easeInOut' }}
        >
          <motion.h1
            className="gradient-text text-5xl font-medium tracking-tight sm:text-7xl"
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            HowLearn
          </motion.h1>
        </motion.div>
      ) : null}
    </div>
  );
}

/** 홈 진입 — 궤도 키워드 수렴 후 흰 핵이 화면을 덮고 HowLearn 브랜드 노출 */
export function OrbitIntro({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const [loaded, setLoaded] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  const handleComplete = useCallback(() => {
    setShowIntro(false);
    setLoaded(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;
    setShowIntro(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mounted]);

  useEffect(() => {
    if (loaded) document.body.style.overflow = '';
  }, [loaded]);

  const intro =
    showIntro && mounted && typeof document !== 'undefined'
      ? createPortal(<OrbitIntroScene onComplete={handleComplete} />, document.body)
      : null;

  return (
    <>
      {intro}
      <div
        className={cn(
          'transition-opacity duration-700',
          loaded ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!loaded}
      >
        {children}
      </div>
    </>
  );
}
