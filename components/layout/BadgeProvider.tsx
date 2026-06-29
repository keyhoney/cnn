'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BadgeEarnedModal } from '@/components/dashboard/BadgeEarnedModal';
import { useBadgeStore } from '@/stores/badgeStore';

/** 뱃지 hydrate + 획득 팝업/토스트 (P6-04) */
export function BadgeProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useBadgeStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <>
      {children}
      <BadgeEarnedModal />
      <Toaster position="top-center" toastOptions={{ className: 'text-sm' }} />
    </>
  );
}
