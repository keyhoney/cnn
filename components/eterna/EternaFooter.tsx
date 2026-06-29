'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { ETERNA_FOOTER_LINKS } from '@/lib/eterna-nav';

export function EternaFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-app-border-subtle bg-app-surface-muted">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(27, 77, 254, 0.15) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <div className="app-container relative z-10 py-16">
        <div className="mb-12 grid gap-10 lg:grid-cols-3">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2.5 no-underline">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-app-accent text-white">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-app-heading">HowLearn</span>
            </Link>
            <p className="max-w-xs text-sm text-app-text-muted">
              인터랙티브 수학 교재로 학습하고, 진도와 오답을 한곳에서 관리하세요.
            </p>
          </div>

          <div>
            <h4 className="section-header mb-3">메뉴</h4>
            <ul className="space-y-2">
              {ETERNA_FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-app-text-muted no-underline transition-colors hover:text-app-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="section-header mb-3">학습</h4>
            <ul className="space-y-2 text-sm text-app-text-muted">
              <li>문제 풀이 · 필기 · 진도 추적</li>
              <li>라이트 / 다크 / 세피아 테마</li>
              <li>오프라인 PWA 지원</li>
            </ul>
          </div>
        </div>

        <div className="mb-10 text-center">
          <h3 className="heading-display-sm font-serif text-app-heading">학습은 끝이 없다</h3>
          <p className="mt-1 text-sm text-app-text-muted">단순함이 궁극의 정교함이다.</p>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-app-border-subtle pt-6 text-xs text-app-text-muted md:flex-row">
          <p>© HowLearn {new Date().getFullYear()}</p>
          <p>인터랙티브 수학 교재</p>
        </div>
      </div>
    </footer>
  );
}
