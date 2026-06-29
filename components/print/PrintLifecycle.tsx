'use client';

import { useEffect } from 'react';
import { endPrint } from '@/lib/print';

/** 인쇄 종료 후 data-print-mode 등 정리 (P7-06) */
export function PrintLifecycle() {
  useEffect(() => {
    const handleAfterPrint = () => {
      endPrint();
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  return null;
}
