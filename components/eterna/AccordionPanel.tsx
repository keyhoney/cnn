'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Reveal } from '@/components/eterna/Reveal';
import { cn } from '@/lib/utils';

interface AccordionPanelProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  accentColor?: string;
}

export function AccordionPanel({
  title,
  subtitle,
  defaultOpen = true,
  children,
  accentColor = 'var(--app-accent)',
}: AccordionPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Reveal>
      <div className="settings-section overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5"
          aria-expanded={open}
        >
          <div>
            <div
              className="mb-2 h-1 w-10 rounded-full"
              style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
              aria-hidden
            />
            <h3 className="font-semibold text-app-heading">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-app-text-muted">{subtitle}</p>}
          </div>
          <ChevronDown
            className={cn('h-5 w-5 shrink-0 text-app-text-muted transition-transform', open && 'rotate-180')}
          />
        </button>
        {open && <div className="border-t border-app-border-subtle">{children}</div>}
      </div>
    </Reveal>
  );
}
