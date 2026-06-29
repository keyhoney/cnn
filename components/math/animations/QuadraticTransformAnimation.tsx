'use client';

import {
  createViewport,
  getQuadraticPhase,
  sampleParabolaPath,
  toSvgX,
  toSvgY,
} from '@/lib/math-animation';

interface QuadraticTransformAnimationProps {
  progress: number;
}

const VP = createViewport({ width: 360, height: 280, xMin: -3, xMax: 5, yMin: -1, yMax: 12 });

export function QuadraticTransformAnimation({ progress }: QuadraticTransformAnimationProps) {
  const phase = getQuadraticPhase(progress);
  const path = sampleParabolaPath(phase.a, phase.h, phase.k, VP);
  const originX = toSvgX(0, VP);
  const originY = toSvgY(0, VP);

  return (
    <div className="flex flex-col items-center gap-3 px-3 py-4">
      <p className="font-mono text-sm font-semibold text-app-accent">{phase.label}</p>

      <svg
        viewBox={`0 0 ${VP.width} ${VP.height}`}
        className="h-auto w-full"
        role="img"
        aria-label="이차함수 변환 애니메이션"
      >
        <rect width={VP.width} height={VP.height} fill="var(--app-surface-muted)" rx={8} />

        {Array.from({ length: 9 }).map((_, i) => {
          const x = VP.xMin + i;
          const sx = toSvgX(x, VP);
          return (
            <line
              key={`gx-${x}`}
              x1={sx}
              y1={VP.padding}
              x2={sx}
              y2={VP.height - VP.padding}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
          );
        })}

        {Array.from({ length: 7 }).map((_, i) => {
          const y = VP.yMin + i * 2;
          const sy = toSvgY(y, VP);
          return (
            <line
              key={`gy-${y}`}
              x1={VP.padding}
              y1={sy}
              x2={VP.width - VP.padding}
              y2={sy}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
          );
        })}

        <line
          x1={VP.padding}
          y1={originY}
          x2={VP.width - VP.padding}
          y2={originY}
          stroke="var(--chart-axis)"
          strokeWidth={1.5}
        />
        <line
          x1={originX}
          y1={VP.padding}
          x2={originX}
          y2={VP.height - VP.padding}
          stroke="var(--chart-axis)"
          strokeWidth={1.5}
        />

        {path && (
          <path d={path} fill="none" stroke="var(--chart-primary)" strokeWidth={2.5} strokeLinecap="round" />
        )}

        {phase.h !== 0 && (
          <line
            x1={toSvgX(phase.h, VP)}
            y1={VP.padding}
            x2={toSvgX(phase.h, VP)}
            y2={VP.height - VP.padding}
            stroke="var(--chart-secondary)"
            strokeWidth={1}
            strokeDasharray="5 4"
          />
        )}
      </svg>

      <p className="text-center text-xs text-app-text-muted">
        평행이동(상하·좌우)과 y축 방향 늘이기/줄이기 순서로 그래프가 변합니다.
      </p>
    </div>
  );
}
