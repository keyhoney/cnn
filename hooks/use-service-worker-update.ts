'use client';

import { useEffect } from 'react';
import { showServiceWorkerUpdateToast } from '@/components/pwa/ServiceWorkerUpdateToast';

export function useServiceWorkerUpdate() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let isReloading = false;

    const handleWaiting = () => {
      showServiceWorkerUpdateToast(() => {
        window.workbox?.messageSkipWaiting();
      });
    };

    const handleControlling = () => {
      if (isReloading) return;
      isReloading = true;
      window.location.reload();
    };

    const registerWorkbox = () => {
      const workbox = window.workbox;
      if (!workbox) return;

      workbox.addEventListener('waiting', handleWaiting);
      workbox.addEventListener('controlling', handleControlling);

      void navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          handleWaiting();
        }
      });
    };

    if (window.workbox) {
      registerWorkbox();
      return () => {
        window.workbox?.removeEventListener('waiting', handleWaiting);
        window.workbox?.removeEventListener('controlling', handleControlling);
      };
    }

    const intervalId = window.setInterval(() => {
      if (!window.workbox) return;
      window.clearInterval(intervalId);
      registerWorkbox();
    }, 500);

    return () => {
      window.clearInterval(intervalId);
      window.workbox?.removeEventListener('waiting', handleWaiting);
      window.workbox?.removeEventListener('controlling', handleControlling);
    };
  }, []);
}
