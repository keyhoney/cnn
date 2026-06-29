'use client';

import { useState } from 'react';
import { Copy, Check, ZoomIn } from 'lucide-react';
import { copyLatexToClipboard } from '@/lib/katex-utils';
import { cn } from '@/lib/utils';

interface FormulaToolbarProps {
  latex: string;
  onZoom: () => void;
  className?: string;
}

export function FormulaToolbar({ latex, onZoom, className }: FormulaToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyLatexToClipboard(latex);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleZoom = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onZoom();
  };

  return (
    <span
      className={cn(
        'formula-toolbar pointer-events-none absolute z-10 flex gap-0.5 rounded-lg',
        'border border-app-border bg-app-surface/95 p-0.5 opacity-0 shadow-md backdrop-blur-sm',
        'transition-opacity group-hover:pointer-events-auto group-hover:opacity-100',
        'group-focus-within:pointer-events-auto group-focus-within:opacity-100',
        className
      )}
      data-no-flip
    >
      <button
        type="button"
        onClick={handleCopy}
        className="flex h-8 w-8 items-center justify-center rounded-md text-app-text-muted transition-colors hover:bg-app-accent-soft hover:text-app-accent"
        aria-label={copied ? 'LaTeX 복사됨' : 'LaTeX 복사'}
        title={copied ? '복사됨' : 'LaTeX 복사'}
      >
        {copied ? <Check className="h-4 w-4 text-status-success" /> : <Copy className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={handleZoom}
        className="flex h-8 w-8 items-center justify-center rounded-md text-app-text-muted transition-colors hover:bg-app-accent-soft hover:text-app-accent"
        aria-label="수식 확대"
        title="수식 확대"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
    </span>
  );
}
