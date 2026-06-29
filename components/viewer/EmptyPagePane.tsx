import { cn } from '@/lib/utils';

/** 스프레드 오른쪽 빈 페이지 (홀수 마지막 페이지) */
export function EmptyPagePane({ side, pageNumber }: { side: 'left' | 'right'; pageNumber: number }) {
  return (
    <div
      data-side={side}
      className={cn(
        'flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed border-app-border bg-app-surface-muted/50',
        side === 'left' && 'rounded-r-sm',
        side === 'right' && 'rounded-l-sm'
      )}
      aria-hidden
    >
      <span className="font-mono text-[10px] text-app-text-muted">{pageNumber}p</span>
      <span className="mt-2 text-xs text-app-text-muted">빈 페이지</span>
    </div>
  );
}
