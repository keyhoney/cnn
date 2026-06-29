'use client';

import { useEffect, useMemo, useRef } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { renderKatexHtml, type FormulaDisplay } from '@/lib/katex-utils';
import { cn } from '@/lib/utils';

interface FormulaZoomModalProps {
  latex: string;
  display: FormulaDisplay;
  onClose: () => void;
}

export function FormulaZoomModal({ latex, display, onClose }: FormulaZoomModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, true);
  const html = useMemo(
    () => renderKatexHtml(latex, { display: 'block' }),
    [latex]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="수식 확대 보기"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className={cn('modal-panel animate-enter relative max-h-[85vh] w-full max-w-2xl overflow-auto p-8')}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-app-text-muted transition-colors hover:bg-app-surface-muted hover:text-app-text"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="section-header mb-4">
          수식 확대
        </p>

        <div
          className="flex justify-center overflow-x-auto py-4 text-2xl md:text-3xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <pre className="mt-6 overflow-x-auto rounded-lg bg-app-surface-muted p-3 text-xs text-app-text-muted">
          {latex}
        </pre>

        {display === 'inline' && (
          <p className="mt-2 text-center text-[10px] text-app-text-muted">
            원본은 인라인 수식입니다
          </p>
        )}
      </div>
    </div>
  );
}
