'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { useMounted } from '@/hooks/use-mounted';
import { revealTransition } from '@/lib/eterna-motion';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  compact?: boolean;
  className?: string;
}

export function PageHero({ eyebrow, title, subtitle, compact, className }: PageHeroProps) {
  const mounted = useMounted();
  const { ref, inView } = useInView<HTMLElement>(0.2);
  const reduceMotion = useReducedMotion();

  const sectionClass = cn(
    'hero-band relative overflow-hidden',
    compact ? 'mb-8 p-6 sm:p-8' : 'mb-10 p-8 sm:p-10 md:p-12',
    className
  );

  const orbs = (
    <>
      <div
        className="glow-orb -top-20 left-1/2 h-[280px] w-[480px] -translate-x-1/2"
        style={{
          background: 'radial-gradient(ellipse, rgba(36, 11, 108, 0.35) 0%, transparent 70%)',
        }}
        aria-hidden
      />
      <div
        className="glow-orb right-0 top-10 h-[200px] w-[320px] opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(27, 77, 254, 0.2) 0%, transparent 70%)',
        }}
        aria-hidden
      />
    </>
  );

  const noMotion = !mounted || reduceMotion;

  const motionProps = {
    initial: noMotion ? false : { opacity: 0, y: 20 },
    animate: noMotion ? false : inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: revealTransition,
  };

  const Wrapper = noMotion ? 'div' : motion.p;
  const Heading = noMotion ? 'h1' : motion.h1;
  const Subtitle = noMotion ? 'p' : motion.p;

  return (
    <section ref={noMotion ? undefined : ref} className={sectionClass} data-print-hide-decor>
      {orbs}
      <div className="relative z-10 max-w-3xl">
        <Wrapper
          {...(noMotion ? {} : (motionProps as Record<string, unknown>))}
          className="section-header gradient-text mb-2"
        >
          {eyebrow}
        </Wrapper>
        <Heading
          {...(noMotion
            ? {}
            : { ...motionProps, transition: { ...revealTransition, delay: 0.08 } })}
          className={cn('heading-display mb-3 font-serif', compact && 'heading-display-sm')}
        >
          {title}
        </Heading>
        {subtitle && (
          <Subtitle
            {...(noMotion
              ? {}
              : { ...motionProps, transition: { ...revealTransition, delay: 0.16 } })}
            className="max-w-xl text-sm leading-relaxed text-app-text-muted sm:text-base"
          >
            {subtitle}
          </Subtitle>
        )}
      </div>
    </section>
  );
}
