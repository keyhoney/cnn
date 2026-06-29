'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_QUOTES } from '@/lib/hero-quotes';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';
import { HomeHeroOrbitDiagram } from '@/components/home/HomeHeroOrbitDiagram';

/** EternaCloud HeroQuotes 스타일 — 명언, CTA, 궤도 비주얼 */
export function HomeHeroTop() {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % HERO_QUOTES.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + HERO_QUOTES.length) % HERO_QUOTES.length);
  }, []);

  useEffect(() => {
    if (!mounted || reduceMotion) return;
    const timer = window.setInterval(next, 6000);
    return () => window.clearInterval(timer);
  }, [mounted, next, reduceMotion]);

  const quote = HERO_QUOTES[index];
  const animate = mounted && !reduceMotion;

  return (
    <section
      className="hero-dark-screen relative flex min-h-screen flex-col justify-center overflow-hidden pt-24 pb-16"
      aria-label="홈 히어로"
    >
      <div
        className="glow-orb animate-pulse-glow h-[600px] w-[600px] -top-32 left-1/2 -translate-x-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(36, 11, 108, 0.6) 0%, transparent 70%)',
        }}
        aria-hidden
      />
      <div
        className="glow-orb h-[400px] w-[400px] bottom-0 right-0"
        style={{
          background: 'radial-gradient(circle, rgba(172, 36, 255, 0.2) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="app-container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            {animate ? (
              <motion.h2
                className="hero-eyebrow mb-8 font-light lg:mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="gradient-text font-medium">HowLearn</span>이 지혜에 생명을
                불어넣습니다
              </motion.h2>
            ) : (
              <h2 className="hero-eyebrow mb-8 font-light lg:mb-10">
                <span className="gradient-text font-medium">HowLearn</span>이 지혜에 생명을
                불어넣습니다
              </h2>
            )}

            <div className="relative mx-auto flex min-h-[180px] max-w-xl items-center justify-center lg:mx-0 lg:min-h-[200px]">
              {animate ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center px-2 lg:items-start"
                  >
                    <p className="hero-quote-text mb-4 font-light leading-snug text-white lg:mb-6">
                      {quote.text}
                    </p>
                    <p className="hero-quote-author">{quote.author}</p>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center px-2 lg:items-start">
                  <p className="hero-quote-text mb-4 font-light leading-snug text-white lg:mb-6">
                    {quote.text}
                  </p>
                  <p className="hero-quote-author">{quote.author}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link href="/books" className="hero-primary-btn">
                교재 열기
              </Link>
              <Link href="/dashboard" className="hero-btn-outline">
                학습 현황
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 lg:justify-start">
              <button
                type="button"
                onClick={prev}
                className="hero-quote-control"
                aria-label="이전 명언"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-2">
                {HERO_QUOTES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={cn(
                      'h-1 cursor-pointer rounded-full border-0 transition-all duration-300',
                      i === index ? 'w-8 bg-[#AC24FF]' : 'w-2 bg-white/35'
                    )}
                    aria-label={`명언 ${i + 1}`}
                    aria-current={i === index}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                className="hero-quote-control"
                aria-label="다음 명언"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="order-first lg:order-none">
            {animate ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
              >
                <HomeHeroOrbitDiagram />
              </motion.div>
            ) : (
              <HomeHeroOrbitDiagram />
            )}
          </div>
        </div>
      </div>

      <div className="hero-section-divider absolute bottom-0 left-0 right-0" aria-hidden />
    </section>
  );
}
