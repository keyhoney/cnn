'use client';

import { OfflineBanner } from '@/components/pwa/OfflineBanner';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { useServiceWorkerUpdate } from '@/hooks/use-service-worker-update';

/** PWA 설치·업데이트·오프라인 UI (P7-05) */
export function PwaProvider({ children }: { children: React.ReactNode }) {
  useServiceWorkerUpdate();

  return (
    <>
      {children}
      <OfflineBanner />
      <InstallPrompt />
    </>
  );
}
