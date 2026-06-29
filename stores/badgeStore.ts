'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { evaluateBadges } from '@/lib/badge-engine';
import { awardBadge, loadBadgeEvaluationData, loadEarnedBadges } from '@/lib/badges';
import type { BadgeEvent, BadgeId } from '@/lib/types/badges';
import { getBadgeDefinition } from '@/lib/types/badges';
import { getOrCreateUserId } from '@/lib/user';

export interface QueuedBadge {
  id: BadgeId;
  earnedAt: Date;
}

interface BadgeState {
  earnedBadgeIds: Set<BadgeId>;
  earnedAtMap: Partial<Record<BadgeId, Date>>;
  queue: QueuedBadge[];
  isHydrated: boolean;
}

interface BadgeActions {
  hydrate: () => Promise<void>;
  checkAndAward: (event?: BadgeEvent) => Promise<BadgeId[]>;
  dequeueBadge: () => QueuedBadge | null;
  hasBadge: (id: BadgeId) => boolean;
}

export type BadgeStore = BadgeState & BadgeActions;

const initialState: BadgeState = {
  earnedBadgeIds: new Set(),
  earnedAtMap: {},
  queue: [],
  isHydrated: false,
};

export const useBadgeStore = create<BadgeStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      hydrate: async () => {
        try {
          const userId = getOrCreateUserId();
          const earned = await loadEarnedBadges(userId);
          const earnedBadgeIds = new Set(earned.map((item) => item.badgeId as BadgeId));
          const earnedAtMap = earned.reduce<Partial<Record<BadgeId, Date>>>((acc, item) => {
            acc[item.badgeId as BadgeId] = item.earnedAt;
            return acc;
          }, {});

          set({ earnedBadgeIds, earnedAtMap, isHydrated: true }, false, 'badge/hydrate');
        } catch {
          set({ isHydrated: true }, false, 'badge/hydrateFailed');
        }
      },

      checkAndAward: async (event) => {
        const { earnedBadgeIds, isHydrated } = get();
        if (!isHydrated) {
          await get().hydrate();
        }

        const userId = getOrCreateUserId();
        const data = await loadBadgeEvaluationData(userId);
        const currentEarned = get().earnedBadgeIds;

        const newlyEarned = evaluateBadges({
          earnedBadgeIds: currentEarned,
          problemResults: data.problemResults,
          progressRecords: data.progressRecords,
          drawingPageIds: data.drawingPageIds,
          event,
        });

        if (newlyEarned.length === 0) return [];

        const queueItems: QueuedBadge[] = [];

        for (const badgeId of newlyEarned) {
          const saved = await awardBadge(userId, badgeId);
          if (!saved) continue;
          queueItems.push({ id: badgeId, earnedAt: saved.earnedAt });
        }

        if (queueItems.length === 0) return [];

        set(
          (state) => {
            const nextIds = new Set(state.earnedBadgeIds);
            const nextMap = { ...state.earnedAtMap };
            for (const item of queueItems) {
              nextIds.add(item.id);
              nextMap[item.id] = item.earnedAt;
            }
            return {
              earnedBadgeIds: nextIds,
              earnedAtMap: nextMap,
              queue: [...state.queue, ...queueItems],
            };
          },
          false,
          'badge/award'
        );

        return queueItems.map((item) => item.id);
      },

      dequeueBadge: () => {
        const { queue } = get();
        if (queue.length === 0) return null;
        const [next, ...rest] = queue;
        set({ queue: rest }, false, 'badge/dequeue');
        return next;
      },

      hasBadge: (id) => get().earnedBadgeIds.has(id),
    }),
    { name: 'badge-store' }
  )
);

export function getQueuedBadgeLabel(item: QueuedBadge): string {
  return `${getBadgeDefinition(item.id).emoji} ${getBadgeDefinition(item.id).title}`;
}
