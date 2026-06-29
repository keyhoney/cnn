'use client';

import { useState } from 'react';
import { Reveal } from '@/components/eterna/Reveal';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface StatHubItem {
  id: string;
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  color: string;
  detail: React.ReactNode;
}

interface StatHubProps {
  items: StatHubItem[];
}

export function StatHub({ items }: StatHubProps) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  const current = items.find((item) => item.id === active) ?? items[0];

  return (
    <Reveal>
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={cn(
              'card-elevated p-4 text-left transition-all duration-300',
              active === item.id ? 'tab-card-active' : 'opacity-80 hover:opacity-100'
            )}
          >
            <item.icon className="mb-2 h-5 w-5 text-app-accent" style={{ color: item.color }} />
            <p className="section-header">{item.label}</p>
            <p className="heading-display-sm font-serif mt-1">{item.value}</p>
            {item.hint && <p className="mt-1 text-xs text-app-text-muted">{item.hint}</p>}
          </button>
        ))}
      </div>
      {current && (
        <div className="card-elevated relative overflow-hidden p-5 sm:p-6">
          <div
            className="feature-card-accent absolute inset-x-0 top-0"
            style={{ background: `linear-gradient(90deg, ${current.color}, transparent)` }}
            aria-hidden
          />
          <div className="relative pt-2">{current.detail}</div>
        </div>
      )}
    </Reveal>
  );
}
