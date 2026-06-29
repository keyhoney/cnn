'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Download, Printer, QrCode, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import { buildAbsolutePageUrl, copyTextToClipboard, downloadDataUrl } from '@/lib/share-url';
import { printQrShare } from '@/lib/print';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { cn } from '@/lib/utils';

interface QRShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  pagePath: string;
  pageTitle: string;
  bookTitle?: string;
}

export function QRShareModal({
  isOpen,
  onClose,
  pagePath,
  pageTitle,
  bookTitle,
}: QRShareModalProps) {
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useFocusTrap(panelRef, isOpen);

  const pageUrl = useMemo(() => buildAbsolutePageUrl(pagePath), [pagePath]);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      return;
    }

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

  const handleCopyUrl = async () => {
    const ok = await copyTextToClipboard(pageUrl);
    if (ok) {
      setCopied(true);
      toast.success('링크를 복사했습니다.');
      window.setTimeout(() => setCopied(false), 2000);
      return;
    }
    toast.error('링크 복사에 실패했습니다.');
  };

  const handleDownload = () => {
    const canvas = qrContainerRef.current?.querySelector('canvas');
    if (!canvas) {
      toast.error('QR 코드를 저장할 수 없습니다.');
      return;
    }

    downloadDataUrl(canvas.toDataURL('image/png'), `qr-${pagePath.replace(/\//g, '-')}.png`);
    toast.success('QR 코드 이미지를 저장했습니다.');
  };

  const handlePrint = () => {
    printQrShare();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:relative print:inset-auto print:bg-transparent print:p-0"
      role="dialog"
      aria-modal="true"
      aria-label="QR 코드 공유"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        id="qr-share-print-area"
        className={cn(
          'flex w-full max-w-md flex-col overflow-hidden modal-panel',
          'print:max-w-none print:rounded-none print:border-0 print:shadow-none'
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-app-border px-4 py-3 print:hidden">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-app-accent" aria-hidden />
            <h2 className="text-sm font-semibold text-app-text">이 페이지 QR 공유</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-app-text-muted transition-colors hover:bg-app-surface-muted"
            aria-label="QR 공유 닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 px-6 py-6">
          <div className="text-center">
            {bookTitle && (
              <p className="text-[11px] font-bold uppercase tracking-widest text-app-text-muted">
                {bookTitle}
              </p>
            )}
            <p className="mt-1 text-base font-semibold text-app-heading">{pageTitle}</p>
          </div>

          <div
            ref={qrContainerRef}
            className="rounded-2xl border border-app-border bg-white p-4 shadow-sm print:border print:p-6"
          >
            <QRCodeCanvas
              value={pageUrl}
              size={220}
              level="M"
              includeMargin
              bgColor="#ffffff"
              fgColor="#111827"
              aria-label={`${pageTitle} 페이지 QR 코드`}
            />
          </div>

          <p className="w-full break-all rounded-lg bg-app-surface-muted px-3 py-2 text-center text-xs text-app-text-muted">
            {pageUrl}
          </p>
          <p className="text-center text-xs text-app-text-muted">
            QR 코드를 스캔하면 이 페이지로 바로 이동합니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-app-border px-4 py-4 print:hidden">
          <button
            type="button"
            onClick={() => void handleCopyUrl()}
            className="inline-flex flex-col items-center gap-1 rounded-xl border border-app-border px-2 py-3 text-xs font-medium text-app-text transition-colors hover:bg-app-surface-muted"
          >
            <Copy className="h-4 w-4" aria-hidden />
            {copied ? '복사됨' : '링크 복사'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex flex-col items-center gap-1 rounded-xl border border-app-border px-2 py-3 text-xs font-medium text-app-text transition-colors hover:bg-app-surface-muted"
          >
            <Download className="h-4 w-4" aria-hidden />
            QR 저장
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex flex-col items-center gap-1 rounded-xl border border-app-border px-2 py-3 text-xs font-medium text-app-text transition-colors hover:bg-app-surface-muted"
          >
            <Printer className="h-4 w-4" aria-hidden />
            인쇄
          </button>
        </div>
      </div>
    </div>
  );
}
