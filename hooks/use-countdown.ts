'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseCountdownOptions {
  totalSeconds: number;
  running?: boolean;
  onExpire?: () => void;
}

export function useCountdown({
  totalSeconds,
  running = true,
  onExpire,
}: UseCountdownOptions) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [expired, setExpired] = useState(false);

  const reset = useCallback(() => {
    setRemaining(totalSeconds);
    setExpired(false);
  }, [totalSeconds]);

  useEffect(() => {
    reset();
  }, [totalSeconds, reset]);

  useEffect(() => {
    if (!running || expired) return;

    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setExpired(true);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [running, expired, onExpire]);

  return { remaining, expired, reset };
}
