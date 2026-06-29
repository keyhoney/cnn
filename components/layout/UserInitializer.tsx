'use client';

import { useEffect } from 'react';
import { isIndexedDbAvailable } from '@/lib/db';
import { initializeUser } from '@/lib/user';

/**
 * 앱 최초 로드 시 로컬 UUID를 생성/복원하고 IndexedDB 기본 설정을 초기화합니다.
 */
export function UserInitializer() {
  useEffect(() => {
    if (!isIndexedDbAvailable()) return;

    initializeUser().catch((error) => {
      console.error('사용자 초기화 실패:', error);
    });
  }, []);

  return null;
}
