'use client';

import { motion } from 'framer-motion';
import { BookOpen, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConceptTagsPanelProps {
  tags: string[];
  className?: string;
}

/** 오답 시 관련 개념 태그 표시 (P3-03) */
export function ConceptTagsPanel({ tags, className }: ConceptTagsPanelProps) {
  if (!tags.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className={cn(
        'mt-4 overflow-hidden surface-card border-status-warning/30 bg-status-warning-soft p-4',
        className
      )}
      role="note"
      aria-label="관련 개념 안내"
    >
      <div className="mb-2 flex items-center gap-2 text-status-warning">
        <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
        <p className="text-sm font-semibold">이 개념이 부족해요</p>
      </div>
      <p className="mb-3 text-xs text-app-text-muted">
        아래 개념을 다시 복습해 보세요.
      </p>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <motion.li
            key={tag}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
          >
            <span className="inline-flex items-center gap-1 rounded-full border border-status-warning/30 bg-app-surface/80 px-2.5 py-1 text-xs font-medium text-app-text">
              <Tag className="h-3 w-3 text-status-warning" aria-hidden />
              {tag}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
