'use client';

import { useEffect } from 'react';
import { EternaShell } from '@/components/layout/EternaShell';
import { PageCTA } from '@/components/eterna/PageCTA';
import { Reveal } from '@/components/eterna/Reveal';
import { SectionHeader } from '@/components/eterna/SectionHeader';
import { WrongNotesList } from '@/components/wrong-notes/WrongNotesList';
import { WrongNoteRetryPanel } from '@/components/wrong-notes/WrongNoteRetryPanel';
import { useWrongNotes } from '@/hooks/use-wrong-notes';

export function WrongNotesPageContent() {
  const {
    isLoading,
    items,
    selectedItem,
    selectedId,
    retryKey,
    selectProblem,
    restartRetry,
    refreshAfterSubmit,
  } = useWrongNotes();

  useEffect(() => {
    if (!isLoading && items.length > 0 && !selectedId) {
      selectProblem(items[0].problemId);
    }
  }, [isLoading, items, selectedId, selectProblem]);

  return (
    <EternaShell mainClassName="max-w-6xl">
      <SectionHeader
        eyebrow="Wrong notes"
        title="오답 노트"
        subtitle="첫 시도에 틀린 문제만 모아 둡니다. 왼쪽에서 고른 뒤 오른쪽에서 바로 재풀이하세요."
      />

      <Reveal>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
          <WrongNotesList
            items={items}
            selectedId={selectedId}
            isLoading={isLoading}
            onSelect={selectProblem}
          />

          <WrongNoteRetryPanel
            item={selectedItem}
            retryKey={retryKey}
            onRestart={restartRetry}
            onSubmitted={() => void refreshAfterSubmit()}
          />
        </div>
      </Reveal>

      <PageCTA
        title="복습을 마쳤나요?"
        subtitle="대시보드에서 전체 학습 현황을 확인하세요."
        primaryHref="/dashboard"
        primaryLabel="대시보드로"
        secondaryHref="/math-grade1/ch01/page03"
        secondaryLabel="연습 문제 페이지"
      />
    </EternaShell>
  );
}
