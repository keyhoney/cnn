'use client';

import { Moon, Sun, BookOpen } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';
import { THEME_LABELS } from '@/lib/theme';
import type { ThemeSetting } from '@/lib/types/database';
import { cn } from '@/lib/utils';

const THEME_ICONS: Record<ThemeSetting, typeof Sun> = {
  light: Sun,
  dark: Moon,
  sepia: BookOpen,
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, cycleTheme } = useTheme();
  const Icon = THEME_ICONS[theme];

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={cn('btn-icon h-11 w-11', className)}
      aria-label={`테마 변경 (현재: ${THEME_LABELS[theme]})`}
      title={`테마: ${THEME_LABELS[theme]}`}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}
