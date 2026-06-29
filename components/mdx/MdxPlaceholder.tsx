import { cn } from '@/lib/utils';
import { Construction } from 'lucide-react';

interface MdxPlaceholderProps {
  name: string;
  description: string;
  props?: Record<string, unknown>;
}

/** 아직 구현되지 않은 MDX 컴포넌트용 플레이스홀더 */
export function MdxPlaceholder({ name, description, props }: MdxPlaceholderProps) {
  return (
    <div
      className={cn(
        'my-6 rounded-xl border border-dashed border-app-border bg-app-surface-muted/60 p-4',
        'text-sm text-app-text-muted'
      )}
      data-mdx-placeholder={name}
    >
      <div className="mb-2 flex items-center gap-2 font-semibold text-app-text">
        <Construction className="h-4 w-4 text-app-accent" aria-hidden />
        <span>{`<${name}>`}</span>
        <span className="rounded bg-app-accent-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-app-accent">
          준비 중
        </span>
      </div>
      <p className="mb-2">{description}</p>
      {props && Object.keys(props).length > 0 && (
        <pre className="overflow-x-auto rounded-lg bg-app-surface p-2 text-[11px] leading-relaxed">
          {JSON.stringify(props, null, 2)}
        </pre>
      )}
    </div>
  );
}
