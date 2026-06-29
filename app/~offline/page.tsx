import Link from 'next/link';
import { WifiOff } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { OfflineRetryButton } from '@/components/pwa/OfflineRetryButton';

export default function OfflinePage() {
  return (
    <AppShell title="오프라인" mainClassName="flex max-w-lg flex-col items-center justify-center text-center">
      <WifiOff className="mb-6 h-16 w-16 text-app-accent" aria-hidden />
      <h2 className="mb-3 font-serif text-2xl text-app-heading">오프라인 상태입니다</h2>
      <p className="mb-8 text-sm leading-relaxed text-app-text-muted">
        인터넷 연결이 없습니다. 이전에 방문한 페이지는 캐시에서 불러올 수 있습니다. 최초 1회는 온라인
        접속이 필요합니다.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <OfflineRetryButton />
        <Link
          href="/"
          className="rounded-xl bg-app-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-app-accent-hover"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </AppShell>
  );
}
