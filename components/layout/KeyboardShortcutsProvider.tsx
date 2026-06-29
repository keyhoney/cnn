'use client';

import { HotkeysProvider } from 'react-hotkeys-hook';
import type { ReactNode } from 'react';

/** react-hotkeys-hook 전역 Provider (P7-03) */
export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
  return <HotkeysProvider initiallyActiveScopes={['*']}>{children}</HotkeysProvider>;
}
