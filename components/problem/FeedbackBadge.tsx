'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackBadgeProps {
  isCorrect: boolean;
  className?: string;
}

export function FeedbackBadge({ isCorrect, className }: FeedbackBadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.5, opacity: 0 }}
      animate={
        isCorrect
          ? { scale: 1, opacity: 1, x: 0 }
          : { scale: 1, opacity: 1, x: [0, -5, 5, -4, 4, 0] }
      }
      transition={
        isCorrect
          ? { type: 'spring', stiffness: 400, damping: 18 }
          : { duration: 0.45 }
      }
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold',
        isCorrect
          ? 'bg-status-success-soft text-status-success shadow-sm'
          : 'bg-status-error-soft text-status-error shadow-sm',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <motion.span
        initial={{ scale: 0, rotate: isCorrect ? -45 : 0 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 500, damping: 15 }}
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-full',
          isCorrect ? 'bg-status-success text-white' : 'bg-status-error text-white'
        )}
        aria-hidden
      >
        {isCorrect ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
      </motion.span>
      {isCorrect ? '정답입니다!' : '오답입니다'}
    </motion.span>
  );
}
