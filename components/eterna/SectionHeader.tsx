'use client';

import { Reveal } from '@/components/eterna/Reveal';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered,
  className,
}: SectionHeaderProps) {
  return (
    <Reveal className={cn('mb-8', centered && 'mx-auto max-w-3xl text-center', className)}>
      {eyebrow && <p className="section-header mb-2 gradient-text">{eyebrow}</p>}
      <h2 className="heading-display-sm font-serif text-app-heading">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-app-text-muted sm:text-base">{subtitle}</p>}
    </Reveal>
  );
}
