'use client';

import type { A11yViolation } from '@/hooks/use-axe-audit';
import { cn } from '@/lib/utils';

const IMPACT_LABEL: Record<string, string> = {
  critical: '치명적',
  serious: '심각',
  moderate: '보통',
  minor: '경미',
};

interface AxeViolationListProps {
  violations: A11yViolation[];
  passes: number;
  isRunning: boolean;
  error: string | null;
  lastRunAt: string | null;
  onRun: () => void;
}

export function AxeViolationList({
  violations,
  passes,
  isRunning,
  error,
  lastRunAt,
  onRun,
}: AxeViolationListProps) {
  return (
    <section className="surface-card">
      <div className="flex items-center justify-between gap-3 border-b border-app-border bg-app-surface-muted px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-app-heading">axe-core 자동 검사</h2>
          <p className="mt-1 text-xs text-app-text-muted">
            현재 페이지의 접근성 위반 항목을 자동으로 검사합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="shrink-0 rounded-lg bg-app-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-app-accent-hover disabled:opacity-60"
        >
          {isRunning ? '검사 중…' : '검사 실행'}
        </button>
      </div>

      <div className="space-y-3 px-4 py-4">
        {lastRunAt && (
          <p className="text-xs text-app-text-muted">
            마지막 검사: {lastRunAt} · 통과 규칙 {passes}개 · 위반 {violations.length}개
          </p>
        )}

        {error && (
          <p className="surface-card border-status-error/30 bg-status-error-soft px-3 py-2 text-sm text-status-error">
            {error}
          </p>
        )}

        {!lastRunAt && !error && !isRunning && (
          <p className="text-sm text-app-text-muted">
            &quot;검사 실행&quot;을 눌러 이 페이지의 접근성을 점검하세요.
          </p>
        )}

        {violations.length === 0 && lastRunAt && !error && (
          <p className="rounded-lg bg-status-success-soft px-3 py-2 text-sm text-status-success">
            위반 항목이 없습니다.
          </p>
        )}

        {violations.length > 0 && (
          <ul className="space-y-2">
            {violations.map((violation) => (
              <li
                key={violation.id}
                className="rounded-lg border border-app-border px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-app-text">{violation.help}</p>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                      violation.impact === 'critical' || violation.impact === 'serious'
                        ? 'bg-status-error-soft text-status-error'
                        : 'bg-status-warning-soft text-status-warning'
                    )}
                  >
                    {violation.impact ? IMPACT_LABEL[violation.impact] ?? violation.impact : '—'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-app-text-muted">{violation.description}</p>
                <p className="mt-1 text-xs text-app-text-muted">영향 요소 {violation.nodes}개</p>
                <a
                  href={violation.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-app-accent hover:underline"
                >
                  수정 가이드 보기
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
