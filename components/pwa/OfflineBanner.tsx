'use client';

import { WifiOff } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useOnlineStatus } from '@/hooks/use-online-status';

/** 오프라인 상태 상단 배너 (P7-05) */
export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const pathname = usePathname();

  if (isOnline || pathname === '/~offline') return null;

  return (
    <div
      data-print-hide
      className="glass-bar border-status-warning/30 fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 border-b px-4 py-2.5 text-center text-sm font-medium shadow-md"
      role="status"
      aria-live="polite"
      style={{
        background: 'color-mix(in srgb, var(--status-warning-soft) 90%, var(--app-surface))',
        color: 'var(--app-text)',
      }}
    >
      <div className="bg-status-warning/15 flex items-center gap-2 rounded-full px-3 py-1">
        <WifiOff className="h-4 w-4 shrink-0 text-status-warning" aria-hidden />
        <span className="font-semibold text-status-warning">오프라인</span>
      </div>
      <span className="text-app-text-muted">방문한 페이지는 캐시에서 불러올 수 있습니다.</span>
    </div>
  );
}
