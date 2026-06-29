import { AlertCircle, BookOpen, Lightbulb, Info, Sigma } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalloutType } from '@/lib/types/mdx';

const STYLES: Record<CalloutType, { bg: string; border: string; icon: string }> = {
  warning: {
    bg: 'var(--callout-warning-bg)',
    border: 'var(--callout-warning-border)',
    icon: 'var(--callout-warning-icon)',
  },
  definition: {
    bg: 'var(--callout-definition-bg)',
    border: 'var(--callout-definition-border)',
    icon: 'var(--callout-definition-icon)',
  },
  formula: {
    bg: 'var(--callout-formula-bg)',
    border: 'var(--callout-formula-border)',
    icon: 'var(--callout-formula-icon)',
  },
  tip: {
    bg: 'var(--callout-tip-bg)',
    border: 'var(--callout-tip-border)',
    icon: 'var(--callout-tip-icon)',
  },
  info: {
    bg: 'var(--callout-info-bg)',
    border: 'var(--callout-info-border)',
    icon: 'var(--callout-info-icon)',
  },
};

const LABELS: Record<CalloutType, string> = {
  warning: '주의',
  definition: '정의',
  formula: '공식',
  tip: '팁',
  info: '참고',
};

const ICONS: Record<CalloutType, typeof Info> = {
  warning: AlertCircle,
  definition: BookOpen,
  formula: Sigma,
  tip: Lightbulb,
  info: Info,
};

export function Callout({
  type = 'info',
  children,
}: {
  type?: CalloutType;
  children: React.ReactNode;
}) {
  const Icon = ICONS[type];
  const style = STYLES[type];

  return (
    <aside
      className="relative my-6 overflow-hidden rounded-app-lg border text-app-text shadow-app-sm"
      style={{ backgroundColor: style.bg, borderColor: style.border }}
      role="note"
      aria-label={LABELS[type]}
    >
      <div
        className="absolute bottom-0 left-0 top-0 w-1 rounded-l-app-lg"
        style={{ background: `linear-gradient(180deg, ${style.icon}, var(--app-brand-purple))` }}
        aria-hidden
      />
      <div className="flex gap-3.5 p-4 pl-5 sm:p-5 sm:pl-6">
        <div
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-app-border-subtle bg-app-surface/80 shadow-app-sm"
          style={{ color: style.icon }}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </div>
        <div className="prose-app prose-sm prose-p:my-0 max-w-none flex-1">{children}</div>
      </div>
    </aside>
  );
}
