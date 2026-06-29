'use client';

import { useEffect, type ReactNode } from 'react';
import { useViewerStore } from '@/stores/viewerStore';

interface SpreadViewProps {
  pageIndex: number;
  totalPages: number;
  children: ReactNode;
}

/** 단일 페이지 뷰어 컨테이너 */
export function SpreadView({ pageIndex, totalPages, children }: SpreadViewProps) {
  const setSpread = useViewerStore((s) => s.setSpread);

  useEffect(() => {
    setSpread(pageIndex, totalPages);
  }, [pageIndex, totalPages, setSpread]);

  return (
    <div className="spread-print-container mx-auto flex h-full min-h-0 w-full max-w-viewer flex-col px-1 pb-2 lg:max-w-viewer-lg">
      <div className="spread-print-pane flex h-full min-h-0 flex-col">{children}</div>
    </div>
  );
}
