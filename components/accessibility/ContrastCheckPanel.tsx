'use client';

import { useEffect, useState } from 'react';
import { useSettings } from '@/components/layout/SettingsProvider';
import { useTheme } from '@/components/layout/ThemeProvider';
import { readThemeContrastPairs } from '@/lib/contrast-utils';
import { THEME_LABELS } from '@/lib/theme';
import { cn } from '@/lib/utils';

export function ContrastCheckPanel() {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const [pairs, setPairs] = useState<ReturnType<typeof readThemeContrastPairs>>([]);

  useEffect(() => {
    setPairs(readThemeContrastPairs());
  }, [theme, settings.highContrast]);

  const allPassAa = pairs.length > 0 && pairs.every((pair) => pair.aa);

  return (
    <section className="surface-card">
      <div className="border-b border-app-border bg-app-surface-muted px-4 py-3">
        <h2 className="text-sm font-semibold text-app-heading">고대비 모드 검증</h2>
        <p className="mt-1 text-xs text-app-text-muted">
          현재 테마({THEME_LABELS[theme]}
          {settings.highContrast ? ', 고대비 켬' : ''})의 WCAG AA 대비 비율
        </p>
      </div>

      <div className="space-y-3 px-4 py-4">
        {pairs.map((pair) => (
          <div
            key={pair.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-app-border px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-app-text">{pair.label}</p>
              <p className="text-xs text-app-text-muted">
                {pair.fg} / {pair.bg}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums text-app-text">{pair.ratio.toFixed(2)}:1</p>
              <p
                className={cn(
                  'text-xs font-medium',
                  pair.aa ? 'text-status-success' : 'text-status-error'
                )}
              >
                AA {pair.aa ? '통과' : '미달'}
              </p>
            </div>
          </div>
        ))}

        <p
          className={cn(
            'rounded-lg px-3 py-2 text-sm',
            pairs.length === 0
              ? 'bg-app-surface-muted text-app-text-muted'
              : allPassAa
                ? 'bg-status-success-soft text-status-success'
                : 'bg-status-warning-soft text-status-warning'
          )}
        >
          {pairs.length === 0
            ? '색상 조합을 분석하는 중…'
            : allPassAa
              ? '현재 색상 조합은 WCAG AA(일반 텍스트 4.5:1) 기준을 충족합니다.'
              : '일부 색상 조합이 WCAG AA 기준에 미달합니다. 고대비 모드를 켜거나 테마를 변경해 보세요.'}
        </p>
      </div>
    </section>
  );
}
