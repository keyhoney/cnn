'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useBadgeStore } from '@/stores/badgeStore';
import { getBadgeDefinition } from '@/lib/types/badges';

/** 뱃지 획득 애니메이션 팝업 (P6-04) */
export function BadgeEarnedModal() {
  const queue = useBadgeStore((s) => s.queue);
  const dequeueBadge = useBadgeStore((s) => s.dequeueBadge);
  const current = queue[0] ?? null;
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, Boolean(current));

  useEffect(() => {
    if (!current) return;
    const timer = window.setTimeout(() => {
      dequeueBadge();
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [current, dequeueBadge]);

  const badge = current ? getBadgeDefinition(current.id) : null;

  return (
    <AnimatePresence>
      {badge && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="뱃지 팝업 닫기"
            onClick={dequeueBadge}
          />

          <motion.div
            ref={panelRef}
            className="modal-panel animate-enter fixed inset-x-4 top-1/2 z-[81] mx-auto max-w-sm -translate-y-1/2 p-6 text-center"
            initial={{ opacity: 0, scale: 0.7, y: '-40%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.85, y: '-45%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            role="dialog"
            aria-modal="true"
            aria-label="뱃지 획득"
          >
            <button
              type="button"
              onClick={dequeueBadge}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-app-text-muted hover:bg-app-surface-muted"
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </button>

            <motion.div
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-bookmark-soft text-4xl"
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 0.8, repeat: 2 }}
            >
              {badge.emoji}
            </motion.div>

            <div className="section-header mb-2 flex items-center justify-center gap-1 text-bookmark">
              <Sparkles className="h-3.5 w-3.5" />
              뱃지 획득!
            </div>

            <h3 className="font-serif text-2xl text-app-heading">{badge.title}</h3>
            <p className="mt-2 text-sm text-app-text-muted">{badge.description}</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
