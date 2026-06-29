'use client';

import { useEffect, useRef } from 'react';
import { Printer, X } from 'lucide-react';
import { usePrintSettings } from '@/hooks/use-print-settings';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { printViewer } from '@/lib/print';
import { cn } from '@/lib/utils';

interface PrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pageTitle?: string;
}

export function PrintDialog({ isOpen, onClose, pageTitle }: PrintDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { includeDrawing, setIncludeDrawing } = usePrintSettings();

  useFocusTrap(panelRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    printViewer(includeDrawing);
    onClose();
  };

  return (
    <div
      data-print-hide
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-dialog-title"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="modal-panel animate-enter flex w-full max-w-md flex-col overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-app-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-app-accent" aria-hidden />
            <h2 id="print-dialog-title" className="text-sm font-semibold text-app-heading">
              페이지 인쇄
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-app-text-muted transition-colors hover:bg-app-surface-muted"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-4 py-4">
          {pageTitle && (
            <p className="text-sm text-app-text-muted">
              인쇄 대상: <span className="font-medium text-app-text">{pageTitle}</span>
            </p>
          )}

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-app-text">필기 레이어</legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: false, label: '제외', description: '교재 내용만' },
                { value: true, label: '포함', description: '필기도 함께' },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => setIncludeDrawing(option.value)}
                  className={cn(
                    'rounded-xl border px-3 py-3 text-left transition-colors',
                    includeDrawing === option.value
                      ? 'border-app-accent bg-app-accent-soft'
                      : 'border-app-border hover:bg-app-surface-muted'
                  )}
                  aria-pressed={includeDrawing === option.value}
                >
                  <span className="block text-sm font-semibold text-app-text">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-app-text-muted">{option.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <p className="text-xs leading-relaxed text-app-text-muted">
            인쇄 대화상자에서 &quot;PDF로 저장&quot;을 선택하면 현재 페이지를 PDF로 저장할 수 있습니다.
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-app-border px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-primary gap-2"
          >
            <Printer className="h-4 w-4" aria-hidden />
            인쇄
          </button>
        </div>
      </div>
    </div>
  );
}
