'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormulaEnhancerProps {
  children: ReactNode;
  className?: string;
  'data-page-content'?: boolean;
}

/** 페이지 MDX 콘텐츠 래퍼 (`data-page-content` 마커) */
export function FormulaEnhancer({
  children,
  className,
  'data-page-content': dataPageContent,
}: FormulaEnhancerProps) {
  return (
    <div
      className={cn(className)}
      {...(dataPageContent !== undefined ? { 'data-page-content': dataPageContent } : {})}
    >
      {children}
    </div>
  );
}
