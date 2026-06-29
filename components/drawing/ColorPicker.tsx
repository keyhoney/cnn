'use client';

import { useRef } from 'react';
import { Palette } from 'lucide-react';
import { DRAWING_COLORS } from '@/lib/types/stores';
import { cn } from '@/lib/utils';

function isPresetColor(color: string): boolean {
  return (DRAWING_COLORS as readonly string[]).includes(color);
}

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  className?: string;
}

/** 6색 팔레트 + 커스텀 색상 피커 (P4-03) */
export function ColorPicker({ value, onChange, disabled, className }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isCustom = !isPresetColor(value);

  return (
    <div
      className={cn('flex items-center gap-1', disabled && 'pointer-events-none opacity-40', className)}
      role="group"
      aria-label="색상 선택"
    >
      {DRAWING_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          disabled={disabled}
          className={cn(
            'h-6 w-6 shrink-0 rounded-full border border-black/10 transition-transform',
            value === color && 'scale-110 ring-2 ring-app-accent ring-offset-1'
          )}
          style={{ backgroundColor: color }}
          aria-label={`색상 ${color}`}
          aria-pressed={value === color}
        />
      ))}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className={cn(
          'relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 transition-transform',
          isCustom && 'scale-110 ring-2 ring-app-accent ring-offset-1'
        )}
        aria-label="커스텀 색상"
        aria-pressed={isCustom}
        title="커스텀 색상"
      >
        {isCustom ? (
          <span className="absolute inset-0" style={{ backgroundColor: value }} aria-hidden />
        ) : (
          <Palette className="h-3.5 w-3.5 text-app-text-muted" aria-hidden />
        )}
      </button>

      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        disabled={disabled}
        tabIndex={-1}
        aria-hidden
      />
    </div>
  );
}
