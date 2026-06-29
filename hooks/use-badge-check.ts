'use client';

import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useBadgeStore } from '@/stores/badgeStore';
import type { BadgeEvent } from '@/lib/types/badges';
import { getBadgeDefinition } from '@/lib/types/badges';

/** 뱃지 조건 검사 및 획득 처리 (P6-04) */
export function useBadgeCheck() {
  const checkAndAward = useBadgeStore((s) => s.checkAndAward);

  const runBadgeCheck = useCallback(
    async (event?: BadgeEvent) => {
      const earned = await checkAndAward(event);
      for (const badgeId of earned) {
        const badge = getBadgeDefinition(badgeId);
        toast.success(`뱃지 획득! ${badge.emoji} ${badge.title}`, {
          duration: 4000,
        });
      }
      return earned;
    },
    [checkAndAward]
  );

  return { runBadgeCheck };
}
