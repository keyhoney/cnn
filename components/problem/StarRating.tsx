'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { getStarRatingLabel } from '@/lib/problem-stars';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  hintsUsed?: number;
  className?: string;
}

export function StarRating({ stars, maxStars = 3, hintsUsed = 0, className }: StarRatingProps) {
  if (stars <= 0) return null;

  const label = getStarRatingLabel(stars);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className={cn('flex flex-col items-end gap-0.5', className)}
      role="img"
      aria-label={`별점 ${stars}점 (최대 ${maxStars}점)`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < stars;
          return (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.25 + i * 0.1,
                type: 'spring',
                stiffness: 400,
                damping: 12,
              }}
            >
              <Star
                className={cn(
                  'h-4 w-4',
                  filled ? 'fill-brand-yellow text-brand-yellow' : 'fill-transparent text-app-border'
                )}
                aria-hidden
              />
            </motion.span>
          );
        })}
      </div>
      {label && (
        <span className="text-[10px] font-medium text-app-text-muted">
          {label}
          {hintsUsed > 0 && (
            <span className="text-status-warning"> · 힌트 {hintsUsed}회 사용</span>
          )}
        </span>
      )}
    </motion.div>
  );
}
