'use client';

import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { AxeViolationList } from '@/components/accessibility/AxeViolationList';
import { ContrastCheckPanel } from '@/components/accessibility/ContrastCheckPanel';
import { KeyboardChecklist } from '@/components/accessibility/KeyboardChecklist';
import { A11Y_AUDIT_ROUTES } from '@/lib/a11y-checklist';
import { useAxeAudit } from '@/hooks/use-axe-audit';

export function A11yAuditPageContent() {
  const { violations, passes, isRunning, error, lastRunAt, runAudit } = useAxeAudit();

  return (
    <AppShell
      title="접근성 감사"
      subtitle="P7-08"
      backHref="/settings"
      backLabel="설정으로"
      mainClassName="max-w-2xl space-y-4"
    >
      <p className="text-sm leading-relaxed text-app-text-muted">
        ARIA 레이블, 키보드 탐색, 고대비 모드, axe-core 자동 검사를 한곳에서 확인합니다. CI용 전체
        페이지 검사는 <code className="rounded bg-app-surface-muted px-1">npm run a11y</code>를
        사용하세요.
      </p>

      <AxeViolationList
        violations={violations}
        passes={passes}
        isRunning={isRunning}
        error={error}
        lastRunAt={lastRunAt}
        onRun={() => void runAudit()}
      />

      <ContrastCheckPanel />

      <KeyboardChecklist />

      <section className="surface-card">
        <div className="border-b border-app-border bg-app-surface-muted px-4 py-3">
          <h2 className="text-sm font-semibold text-app-heading">자동 검사 대상 페이지</h2>
        </div>
        <ul className="divide-y divide-app-border">
          {A11Y_AUDIT_ROUTES.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-app-surface-muted"
              >
                <span className="font-medium text-app-text">{route.name}</span>
                <span className="text-xs text-app-text-muted">{route.path}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
