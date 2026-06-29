'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useBreakpoint } from '@/hooks/use-media';
import { cn } from '@/lib/utils';

const DrawingCanvas = dynamic(() => import('@/components/drawing/DrawingCanvas'), {
  ssr: false,
});

export default function ViewerContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const breakpoint = useBreakpoint();

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex h-full flex-col overflow-y-auto touch-pan-y rounded-md border border-app-border bg-app-surface',
        'shadow-[0_4px_10px_-4px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(0,0,0,0.05)]',
        breakpoint === 'mobile' ? 'w-full' : 'w-full max-w-[800px]',
        breakpoint === 'desktop' && 'lg:max-w-[960px]'
      )}
    >
      <div
        className={cn(
          'prose-app flex-1',
          breakpoint === 'mobile'
            ? 'p-4 prose-h1:text-2xl'
            : 'p-6 prose-h1:text-3xl md:p-8 lg:p-12 lg:prose-h1:text-4xl',
          'prose-h1:mb-6 prose-h1:leading-tight lg:prose-h1:mb-8',
          'prose-h2:mt-8 prose-p:leading-relaxed prose-li:leading-relaxed'
        )}
      >
        {children}
      </div>

      {dimensions.width > 0 && (
        <DrawingCanvas
          width={dimensions.width}
          height={dimensions.height}
          bookId="preview"
          pageId="viewer"
        />
      )}
    </div>
  );
}
