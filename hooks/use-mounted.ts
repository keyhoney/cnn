import { useEffect, useState } from 'react';

/** SSR·첫 클라이언트 페인트 일치 — motion 하이드레이션 오류 방지 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
