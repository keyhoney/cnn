'use client';

import type { ReactNode } from 'react';
import { Group, Line } from 'react-konva';
import type { DrawStroke } from '@/lib/drawing-strokes';
import { penWidthFromPressure } from '@/lib/drawing-strokes';

interface DrawingStrokeShapeProps {
  stroke: DrawStroke;
  listening?: boolean;
}

/** 만년필: 필압 반응 세그먼트 + 베지어 tension */
function PressurePenLine({ stroke }: { stroke: DrawStroke }) {
  const { points, pressures, color, strokeWidth } = stroke;
  const pointCount = points.length / 2;

  if (pointCount < 2) {
    const pressure = pressures?.[0] ?? 0.5;
    return (
      <Line
        points={points}
        stroke={color}
        strokeWidth={penWidthFromPressure(strokeWidth, pressure)}
        lineCap="round"
        lineJoin="round"
        listening={false}
      />
    );
  }

  const segments: ReactNode[] = [];

  for (let i = 0; i < pointCount - 1; i += 1) {
    const idx = i * 2;
    const p0 = pressures?.[i] ?? 0.5;
    const p1 = pressures?.[i + 1] ?? 0.5;
    const width = penWidthFromPressure(strokeWidth, (p0 + p1) / 2);

    segments.push(
      <Line
        key={`${stroke.id}-seg-${i}`}
        points={[points[idx], points[idx + 1], points[idx + 2], points[idx + 3]]}
        stroke={color}
        strokeWidth={width}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        listening={false}
        perfectDrawEnabled={false}
      />
    );
  }

  return <Group>{segments}</Group>;
}

export function DrawingStrokeShape({ stroke, listening = false }: DrawingStrokeShapeProps) {
  const { tool, points, color, strokeWidth, opacity } = stroke;

  if (tool === 'pen') {
    return <PressurePenLine stroke={stroke} />;
  }

  if (tool === 'highlighter') {
    return (
      <Line
        points={points}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
        tension={0.3}
        lineCap="round"
        lineJoin="round"
        listening={listening}
        perfectDrawEnabled={false}
      />
    );
  }

  if (tool === 'ruler') {
    return (
      <Line
        points={points}
        stroke={color}
        strokeWidth={strokeWidth}
        lineCap="round"
        listening={listening}
        perfectDrawEnabled={false}
      />
    );
  }

  return null;
}
