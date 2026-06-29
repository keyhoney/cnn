'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  href?: string;
  badge?: string;
  icon?: ReactNode;
  accentColor?: string;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  href,
  badge,
  icon,
  accentColor = 'var(--app-accent)',
  className,
}: FeatureCardProps) {
  const content = (
    <article
      className={cn(
        'surface-card group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-app-lg',
        className
      )}
    >
      <div
        className="feature-card-accent"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'var(--app-gradient-card-glow)' }}
        aria-hidden
      />
      {icon && (
        <div className="relative flex h-36 items-center justify-center overflow-hidden border-b border-app-border-subtle bg-gradient-to-br from-app-accent-soft via-app-surface-muted to-app-surface sm:h-40">
          {icon}
        </div>
      )}
      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        {badge && <div className="chip-muted mb-3 w-fit">{badge}</div>}
        <h3 className="mb-2 font-serif text-lg font-bold tracking-tight text-app-heading transition-colors group-hover:text-app-accent sm:text-xl">
          {title}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-app-text-muted">{description}</p>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
