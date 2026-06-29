'use client';

import { useMemo } from 'react';
import { Layer, Line, Rect } from 'react-konva';
import {
  NOTEPAD_GRID_STEP,
  NOTEPAD_LINE_STEP,
  NOTEPAD_PAPER_COLOR,
  type NotepadBackground,
} from '@/lib/notepad';

interface NotepadBackgroundLayerProps {
  type: NotepadBackground;
  width: number;
  height: number;
}

/** 노트패드 배경: 모눈 / 줄 / 백지 (P4-06) */
export function NotepadBackgroundLayer({ type, width, height }: NotepadBackgroundLayerProps) {
  const lines = useMemo(() => {
    const elements: React.ReactNode[] = [];

    if (type === 'lined' || type === 'grid') {
      const step = type === 'lined' ? NOTEPAD_LINE_STEP : NOTEPAD_GRID_STEP;
      for (let y = step; y < height; y += step) {
        elements.push(
          <Line
            key={`h-${y}`}
            points={[0, y, width, y]}
            stroke={type === 'lined' ? '#c7d2e0' : '#dce3ed'}
            strokeWidth={1}
            listening={false}
          />
        );
      }
    }

    if (type === 'grid') {
      for (let x = NOTEPAD_GRID_STEP; x < width; x += NOTEPAD_GRID_STEP) {
        elements.push(
          <Line
            key={`v-${x}`}
            points={[x, 0, x, height]}
            stroke="#e8edf4"
            strokeWidth={1}
            listening={false}
          />
        );
      }
    }

    return elements;
  }, [type, width, height]);

  return (
    <Layer listening={false}>
      <Rect x={0} y={0} width={width} height={height} fill={NOTEPAD_PAPER_COLOR} listening={false} />
      {lines}
    </Layer>
  );
}
