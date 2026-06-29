'use client';

import { Reveal } from '@/components/eterna/Reveal';
import { X, Check } from 'lucide-react';

interface BeforeAfterSectionProps {
  beforeTitle?: string;
  afterTitle?: string;
  beforeItems: string[];
  afterItems: string[];
}

export function BeforeAfterSection({
  beforeTitle = 'Before',
  afterTitle = 'After',
  beforeItems,
  afterItems,
}: BeforeAfterSectionProps) {
  return (
    <Reveal>
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="surface-card border-status-error/20 bg-status-error-soft/30 p-5 sm:p-6">
          <p className="section-header mb-3 text-status-error">{beforeTitle}</p>
          <ul className="space-y-2">
            {beforeItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-app-text">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-status-error" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="surface-card border-app-accent/20 bg-app-accent-soft/40 p-5 sm:p-6">
          <p className="section-header mb-3 text-app-accent">{afterTitle}</p>
          <ul className="space-y-2">
            {afterItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-app-text">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
