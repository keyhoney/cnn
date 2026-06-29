'use client';

import { useEffect, useState } from 'react';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { mdxComponents } from '@/components/mdx/mdx-components';
import { ProblemPageProvider } from '@/components/problem/ProblemPageContext';
import type { AdminPageSelection } from '@/hooks/use-admin-editor';

interface AdminMdxPreviewProps {
  source: string;
  selection: AdminPageSelection | null;
}

export function AdminMdxPreview({ source, selection }: AdminMdxPreviewProps) {
  const [serialized, setSerialized] = useState<MDXRemoteSerializeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!source.trim()) {
      setSerialized(null);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void (async () => {
        setIsLoading(true);
        setError(null);

        try {
          const response = await fetch('/api/admin/preview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source }),
            signal: controller.signal,
          });

          const data = (await response.json()) as MDXRemoteSerializeResult & { error?: string };
          if (!response.ok) {
            throw new Error(data.error ?? '미리보기를 생성하지 못했습니다.');
          }

          setSerialized(data);
        } catch (err) {
          if (controller.signal.aborted) return;
          setSerialized(null);
          setError(err instanceof Error ? err.message : '미리보기를 생성하지 못했습니다.');
        } finally {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        }
      })();
    }, 400);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [source]);

  if (!source.trim()) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-app-text-muted">
        MDX를 입력하면 KaTeX 미리보기가 표시됩니다.
      </div>
    );
  }

  if (isLoading && !serialized) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-app-text-muted">
        미리보기 생성 중…
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-auto p-4">
        <p className="surface-card border-status-error/30 bg-status-error-soft px-4 py-3 text-sm text-status-error">
          {error}
        </p>
      </div>
    );
  }

  if (!serialized || !selection) return null;

  return (
    <div className="prose-app h-full overflow-auto p-4 sm:p-6">
      <ProblemPageProvider
        bookId={selection.bookId}
        chapterId={selection.chapterId}
        pageId={selection.pageId}
      >
        <MDXRemote {...serialized} components={mdxComponents} />
      </ProblemPageProvider>
    </div>
  );
}
