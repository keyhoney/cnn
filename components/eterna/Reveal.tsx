'use client';

import { Children, type ReactNode, type RefObject } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { useMounted } from '@/hooks/use-mounted';
import { fadeUp, revealTransition, staggerDelay } from '@/lib/eterna-motion';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li';
}

function RevealMotion({
  children,
  className,
  delay,
  inView,
}: {
  children: ReactNode;
  className?: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      className={cn('h-full', className)}
      initial={false}
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const mounted = useMounted();
  const { ref, inView } = useInView(0.15);
  const reduceMotion = useReducedMotion();
  const Tag = as;

  if (!mounted || reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const motionChild = (
    <RevealMotion delay={delay} inView={inView}>
      {children}
    </RevealMotion>
  );

  switch (as) {
    case 'section':
      return (
        <section ref={ref as RefObject<HTMLElement>} className={className}>
          {motionChild}
        </section>
      );
    case 'article':
      return (
        <article ref={ref as RefObject<HTMLElement>} className={className}>
          {motionChild}
        </article>
      );
    case 'li':
      return (
        <li ref={ref as RefObject<HTMLLIElement>} className={className}>
          {motionChild}
        </li>
      );
    default:
      return (
        <div ref={ref as RefObject<HTMLDivElement>} className={className}>
          {motionChild}
        </div>
      );
  }
}

interface RevealStaggerProps {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
}

export function RevealStagger({ children, className, itemClassName }: RevealStaggerProps) {
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, i) => (
        <Reveal key={i} delay={staggerDelay(i)} className={itemClassName}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
