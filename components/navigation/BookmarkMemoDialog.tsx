'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { cn } from '@/lib/utils';

interface BookmarkMemoDialogProps {
  isOpen: boolean;
  pageTitle?: string;
  initialMemo?: string;
  mode?: 'add' | 'edit';
  onClose: () => void;
  onSave: (memo: string) => void;
}

const MAX_MEMO_LENGTH = 120;

/** 북마크 메모 입력 (P6-02) */
export function BookmarkMemoDialog({
  isOpen,
  pageTitle,
  initialMemo = '',
  mode = 'add',
  onClose,
  onSave,
}: BookmarkMemoDialogProps) {
  const [memo, setMemo] = useState(initialMemo);
  const dialogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useFocusTrap(dialogRef, isOpen, textareaRef);

  useEffect(() => {
    if (isOpen) setMemo(initialMemo);
  }, [isOpen, initialMemo]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(memo);
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px]"
        aria-label="메모 닫기"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        className="modal-panel fixed inset-x-4 top-1/2 z-[61] mx-auto max-w-md -translate-y-1/2 p-4 sm:inset-x-auto"
        role="dialog"
        aria-modal="true"
        aria-label="북마크 메모"
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-app-text-muted">
              {mode === 'add' ? '북마크 추가' : '메모 수정'}
            </p>
            {pageTitle && (
              <h3 className="mt-0.5 text-sm font-semibold text-app-heading">{pageTitle}</h3>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-app-text-muted hover:bg-app-surface-muted"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-app-text">메모 (선택)</span>
            <textarea
              ref={textareaRef}
              value={memo}
              onChange={(e) => setMemo(e.target.value.slice(0, MAX_MEMO_LENGTH))}
              rows={3}
              placeholder="이 페이지에 대한 짧은 메모를 남겨보세요"
              className={cn(
                'w-full resize-none rounded-lg border border-app-border bg-app-surface-muted px-3 py-2 text-sm',
                'text-app-text placeholder:text-app-text-muted focus:border-app-accent focus:outline-none focus:ring-1 focus:ring-app-accent'
              )}
            />
            <span className="block text-right text-xs text-app-text-muted">
              {memo.length}/{MAX_MEMO_LENGTH}
            </span>
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-app-text-muted hover:bg-app-surface-muted"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg bg-app-accent px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
            >
              {mode === 'add' ? '북마크 저장' : '메모 저장'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
