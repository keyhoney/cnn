'use client';

import { useRef } from 'react';
import { Download, X } from 'lucide-react';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { useFocusTrap } from '@/hooks/use-focus-trap';

/** PWA 홈 화면 설치 프롬프트 (P7-05) */
export function InstallPrompt() {
  const { isVisible, install, dismiss } = usePwaInstall();
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, isVisible);

  if (!isVisible) return null;

  return (
    <div
      ref={panelRef}
      data-print-hide
      className="modal-panel animate-enter fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-lg items-start gap-3 p-4 sm:inset-x-auto sm:right-4"
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-app-accent/10 text-app-accent">
        <Download className="h-5 w-5" aria-hidden />
      </div>

      <div className="min-w-0 flex-1">
        <p id="pwa-install-title" className="text-sm font-semibold text-app-heading">
          앱으로 설치하기
        </p>
        <p id="pwa-install-description" className="mt-1 text-xs leading-relaxed text-app-text-muted">
          홈 화면에 추가하면 오프라인에서도 더 빠르게 교재를 열 수 있습니다.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => void install()}
            className="btn-primary px-3 py-1.5 text-xs"
          >
            설치
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="btn-secondary px-3 py-1.5 text-xs"
          >
            나중에
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={dismiss}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-app-text-muted transition-colors hover:bg-app-surface-muted"
        aria-label="설치 안내 닫기"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
