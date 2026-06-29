'use client';

import { RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/use-online-status';

export function OfflineRetryButton() {
  const isOnline = useOnlineStatus();

  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      disabled={!isOnline}
      className="hover:border-app-accent/30 inline-flex items-center gap-2 rounded-full border border-app-border bg-app-surface px-6 py-2.5 text-sm font-semibold text-app-text shadow-app-sm transition-all duration-200 hover:bg-app-accent-soft hover:shadow-app-md disabled:cursor-not-allowed disabled:opacity-50"
    >
      <RefreshCw className={`h-4 w-4 ${isOnline ? '' : 'animate-spin'}`} aria-hidden />
      {isOnline ? '다시 시도' : '연결 대기 중…'}
    </button>
  );
}
