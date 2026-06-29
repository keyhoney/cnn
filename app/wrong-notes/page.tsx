import { Suspense } from 'react';
import { WrongNotesPageContent } from '@/components/wrong-notes/WrongNotesPageContent';

export default function WrongNotesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-app-bg text-sm text-app-text-muted">
          오답 노트 불러오는 중…
        </div>
      }
    >
      <WrongNotesPageContent />
    </Suspense>
  );
}
