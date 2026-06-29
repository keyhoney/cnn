'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getStoredPrintIncludeDrawing,
  persistPrintIncludeDrawing,
} from '@/lib/print-settings';

export function usePrintSettings() {
  const [includeDrawing, setIncludeDrawingState] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIncludeDrawingState(getStoredPrintIncludeDrawing());
    setIsReady(true);
  }, []);

  const setIncludeDrawing = useCallback((value: boolean) => {
    setIncludeDrawingState(value);
    persistPrintIncludeDrawing(value);
  }, []);

  return { includeDrawing, setIncludeDrawing, isReady };
}
