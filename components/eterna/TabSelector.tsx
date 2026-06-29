'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Reveal } from '@/components/eterna/Reveal';
import { useMounted } from '@/hooks/use-mounted';
import { revealTransition } from '@/lib/eterna-motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  subtitle?: string;
  color?: string;
  content: ReactNode;
}

interface TabSelectorProps {
  tabs: TabItem[];
  className?: string;
}

export function TabSelector({ tabs, className }: TabSelectorProps) {
  const [active, setActive] = useState(0);
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const current = tabs[active];

  const detailPanel = (
    <div className="card-elevated relative mt-4 overflow-hidden p-5 sm:p-6">
      <div
        className="feature-card-accent absolute inset-x-0 top-0"
        style={{
          background: `linear-gradient(90deg, ${current.color ?? 'var(--app-accent)'}, transparent)`,
        }}
        aria-hidden
      />
      <div className="relative pt-2">{current.content}</div>
    </div>
  );

  return (
    <Reveal className={className}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'card-elevated p-4 text-left transition-all duration-300',
              active === i ? 'tab-card-active' : 'opacity-70 hover:opacity-100'
            )}
            style={active === i && tab.color ? { borderColor: `${tab.color}44` } : undefined}
          >
            <div
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `${tab.color ?? 'var(--app-accent)'}22` }}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: tab.color ?? 'var(--app-accent)' }}
              />
            </div>
            <p className="text-sm font-semibold text-app-heading">{tab.label}</p>
            {tab.subtitle && <p className="mt-0.5 text-xs text-app-text-muted">{tab.subtitle}</p>}
          </button>
        ))}
      </div>

      {!mounted || reduceMotion ? (
        detailPanel
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={revealTransition}
            className="card-elevated relative mt-4 overflow-hidden p-5 sm:p-6"
          >
            <div
              className="feature-card-accent absolute inset-x-0 top-0"
              style={{
                background: `linear-gradient(90deg, ${current.color ?? 'var(--app-accent)'}, transparent)`,
              }}
              aria-hidden
            />
            <div className="relative pt-2">{current.content}</div>
          </motion.div>
        </AnimatePresence>
      )}
    </Reveal>
  );
}
