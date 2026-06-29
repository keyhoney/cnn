import { Suspense } from 'react';
import { SettingsPageContent } from '@/components/settings/SettingsPageContent';

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-app-bg text-sm text-app-text-muted">
          설정 불러오는 중…
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}
