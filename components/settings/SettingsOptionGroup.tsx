'use client';

import { cn } from '@/lib/utils';

interface SettingsOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface SettingsOptionGroupProps<T extends string> {
  label: string;
  description?: string;
  value: T;
  options: SettingsOption<T>[];
  onChange: (value: T) => void;
  columns?: 1 | 2 | 3 | 4;
}

export function SettingsOptionGroup<T extends string>({
  label,
  description,
  value,
  options,
  onChange,
  columns = 3,
}: SettingsOptionGroupProps<T>) {
  const gridClass =
    columns === 1
      ? 'grid-cols-1'
      : columns === 4
        ? 'grid-cols-2 sm:grid-cols-4'
        : columns === 2
          ? 'grid-cols-2'
          : 'grid-cols-1 sm:grid-cols-3';

  return (
    <div className="px-4 py-4">
      <div className="mb-3">
        <p className="text-sm font-medium text-app-text">{label}</p>
        {description && <p className="mt-0.5 text-xs text-app-text-muted">{description}</p>}
      </div>
      <div className={cn('grid gap-2', gridClass)} role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${label}: ${option.label}`}
              onClick={() => onChange(option.value)}
              className={cn(
                'flex flex-col items-start rounded-xl border px-3 py-2.5 text-left text-sm transition-colors',
                selected
                  ? 'border-app-accent bg-app-accent-soft font-semibold text-app-accent'
                  : 'hover:border-app-accent/40 border-app-border bg-app-surface text-app-text hover:bg-app-surface-muted'
              )}
            >
              <span className="block leading-tight">{option.label}</span>
              {option.description && (
                <span className="mt-1 block text-xs font-normal leading-snug text-app-text-muted">
                  {option.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
