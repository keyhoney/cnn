'use client';

import toast from 'react-hot-toast';

const UPDATE_TOAST_ID = 'pwa-update';

export function showServiceWorkerUpdateToast(onRefresh: () => void) {
  toast.custom(
    (t) => (
      <div
        className="modal-panel flex max-w-sm flex-col gap-3 p-4"
        role="alert"
      >
        <p className="text-sm font-medium text-app-text">새 버전이 있습니다. 새로고침하시겠습니까?</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-app-text-muted transition-colors hover:bg-app-surface-muted"
          >
            나중에
          </button>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              onRefresh();
            }}
            className="rounded-lg bg-app-accent px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-app-accent-hover"
          >
            새로고침
          </button>
        </div>
      </div>
    ),
    {
      id: UPDATE_TOAST_ID,
      duration: Infinity,
      position: 'bottom-center',
    }
  );
}
