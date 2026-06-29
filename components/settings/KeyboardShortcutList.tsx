'use client';

import { KEYBOARD_SHORTCUT_CATALOG } from '@/lib/keyboard-shortcuts';

export function KeyboardShortcutList() {
  return (
    <ul className="divide-y divide-app-border px-4 py-2 text-sm text-app-text">
      {KEYBOARD_SHORTCUT_CATALOG.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
          <span>{item.label}</span>
          <span className="flex shrink-0 flex-wrap justify-end gap-1">
            {item.keys.map((key) => (
              <kbd
                key={key}
                className="rounded border border-app-border bg-app-surface-muted px-2 py-0.5 font-mono text-xs"
              >
                {key}
              </kbd>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}
