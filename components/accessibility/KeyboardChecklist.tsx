'use client';

import { useEffect, useState } from 'react';
import { KEYBOARD_NAV_CHECKLIST, A11Y_CHECKLIST_STORAGE_KEY } from '@/lib/a11y-checklist';
import { cn } from '@/lib/utils';

export function KeyboardChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(A11Y_CHECKLIST_STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      // ignore
    }
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(A11Y_CHECKLIST_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const doneCount = KEYBOARD_NAV_CHECKLIST.filter((item) => checked[item.id]).length;

  return (
    <section className="surface-card">
      <div className="border-b border-app-border bg-app-surface-muted px-4 py-3">
        <h2 className="text-sm font-semibold text-app-heading">키보드 탐색 검증</h2>
        <p className="mt-1 text-xs text-app-text-muted">
          수동 확인 체크리스트 ({doneCount}/{KEYBOARD_NAV_CHECKLIST.length})
        </p>
      </div>

      <ul className="divide-y divide-app-border">
        {KEYBOARD_NAV_CHECKLIST.map((item) => {
          const isChecked = Boolean(checked[item.id]);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-app-surface-muted"
                aria-pressed={isChecked}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold',
                    isChecked
                      ? 'border-app-accent bg-app-accent text-white'
                      : 'border-app-border bg-app-surface text-transparent'
                  )}
                  aria-hidden
                >
                  ✓
                </span>
                <span>
                  <span className="block text-sm font-medium text-app-text">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-app-text-muted">{item.hint}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
