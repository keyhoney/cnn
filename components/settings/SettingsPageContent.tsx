'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { EternaShell } from '@/components/layout/EternaShell';
import { AccordionPanel } from '@/components/eterna/AccordionPanel';
import { PageCTA } from '@/components/eterna/PageCTA';
import { SectionHeader } from '@/components/eterna/SectionHeader';
import { SettingsOptionGroup } from '@/components/settings/SettingsOptionGroup';
import { useTheme } from '@/components/layout/ThemeProvider';
import { useAnimationSettings } from '@/hooks/use-animation-settings';
import { useSettings } from '@/components/layout/SettingsProvider';
import {
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  LINE_HEIGHT_OPTIONS,
} from '@/lib/display-settings';
import { THEME_LABELS, THEMES } from '@/lib/theme';
import type { ThemeSetting } from '@/lib/types/database';
import { KeyboardShortcutList } from '@/components/settings/KeyboardShortcutList';
import { usePrintSettings } from '@/hooks/use-print-settings';
import { cn } from '@/lib/utils';

function SettingsToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <div>
        <p className="text-sm font-medium text-app-text">{label}</p>
        {description && <p className="mt-0.5 text-xs text-app-text-muted">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors',
          checked ? 'bg-app-accent' : 'bg-app-border'
        )}
        aria-label={label}
      >
        <span
          className={cn(
            'absolute top-0.5 h-6 w-6 rounded-full bg-app-surface shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}

export function SettingsPageContent() {
  const searchParams = useSearchParams();
  const returnHref =
    searchParams.get('from')?.startsWith('/') === true ? searchParams.get('from')! : '/';

  const { theme, setTheme } = useTheme();
  const { animationEnabled, setAnimationEnabled } = useAnimationSettings();
  const { settings, setFontSize, setFontFamily, setLineHeight, setHighContrast } = useSettings();
  const { includeDrawing, setIncludeDrawing } = usePrintSettings();

  const themeOptions = THEMES.map((value) => ({
    value,
    label: THEME_LABELS[value],
  }));

  const fontSizeOptions = FONT_SIZE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
    description: `${option.px}px`,
  }));

  return (
    <EternaShell mainClassName="max-w-lg">
      <SectionHeader eyebrow="Settings" title="앱 설정" subtitle="화면, 뷰어, 인쇄, 접근성을 조정합니다." />

      <div className="space-y-4">
        <AccordionPanel title="화면" subtitle="테마 · 글꼴 · 고대비">
          <SettingsOptionGroup
            label="테마"
            description="라이트 · 다크 · 세피아"
            value={theme}
            options={themeOptions}
            onChange={(value) => setTheme(value as ThemeSetting)}
            columns={3}
          />
          <div className="border-t border-app-border">
            <SettingsOptionGroup
              label="글꼴 크기"
              value={settings.fontSize}
              options={fontSizeOptions}
              onChange={setFontSize}
              columns={4}
            />
          </div>
          <div className="border-t border-app-border">
            <SettingsOptionGroup
              label="글꼴 종류"
              value={settings.fontFamily}
              options={FONT_FAMILY_OPTIONS}
              onChange={setFontFamily}
              columns={1}
            />
          </div>
          <div className="border-t border-app-border">
            <SettingsOptionGroup
              label="줄 간격"
              value={settings.lineHeight}
              options={LINE_HEIGHT_OPTIONS}
              onChange={setLineHeight}
              columns={3}
            />
          </div>
          <div className="border-t border-app-border">
            <SettingsToggle
              label="고대비 모드"
              description="텍스트와 테두리 대비를 높여 가독성을 개선합니다."
              checked={settings.highContrast}
              onChange={setHighContrast}
            />
          </div>
        </AccordionPanel>

        <AccordionPanel title="뷰어" subtitle="페이지 넘김 애니메이션" defaultOpen={false}>
          <SettingsToggle
            label="페이지 넘김 애니메이션"
            description="책 넘김 효과를 켜거나 끕니다."
            checked={animationEnabled}
            onChange={setAnimationEnabled}
          />
        </AccordionPanel>

        <AccordionPanel title="인쇄" subtitle="필기 레이어 포함 여부" defaultOpen={false}>
          <SettingsToggle
            label="인쇄 시 필기 포함"
            description="끄면 교재 내용만 인쇄하고, 필기 레이어는 제외합니다."
            checked={includeDrawing}
            onChange={setIncludeDrawing}
          />
        </AccordionPanel>

        <AccordionPanel title="접근성 · 단축키" defaultOpen={false}>
          <div className="px-4 py-4">
            <Link href="/accessibility" className="btn-secondary text-sm">
              접근성 감사 열기
            </Link>
            <p className="mt-2 text-xs text-app-text-muted">
              axe-core 자동 검사, 키보드 탐색 체크리스트, 고대비 대비 검증
            </p>
          </div>
          <div className="border-t border-app-border">
            <KeyboardShortcutList />
          </div>
        </AccordionPanel>

        <p className="text-center text-xs text-app-text-muted">
          설정은 이 기기의 localStorage에 저장됩니다.
        </p>
      </div>

      <PageCTA
        title="설정을 마쳤나요?"
        subtitle="교재 뷰어로 돌아가 학습을 이어가세요."
        primaryHref={returnHref}
        primaryLabel="돌아가기"
        secondaryHref="/"
        secondaryLabel="홈으로"
      />
    </EternaShell>
  );
}
