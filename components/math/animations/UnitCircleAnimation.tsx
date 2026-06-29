'use client';

import { formatNum } from '@/lib/math-animation';

interface UnitCircleAnimationProps {
  progress: number;
}

const SIZE = 300;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 100;

export function UnitCircleAnimation({ progress }: UnitCircleAnimationProps) {
  const theta = progress * Math.PI * 2;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const px = CX + cos * R;
  const py = CY - sin * R;

  return (
    <div className="flex flex-col items-center gap-3 px-3 py-4">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-auto w-full max-w-[320px]"
        role="img"
        aria-label="단위원 삼각함수 애니메이션"
      >
        <rect x={0} y={0} width={SIZE} height={SIZE} fill="var(--app-surface-muted)" rx={8} />

        <line x1={CX - R - 20} y1={CY} x2={CX + R + 20} y2={CY} stroke="var(--chart-grid)" strokeWidth={1} />
        <line x1={CX} y1={CY - R - 20} x2={CX} y2={CY + R + 20} stroke="var(--chart-grid)" strokeWidth={1} />

        <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--chart-axis)" strokeWidth={2} />

        <line x1={CX} y1={CY} x2={px} y2={py} stroke="var(--chart-primary)" strokeWidth={2} />

        <line
          x1={px}
          y1={py}
          x2={px}
          y2={CY}
          stroke="var(--status-error)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        <line
          x1={px}
          y1={py}
          x2={CX}
          y2={py}
          stroke="var(--status-success)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />

        <circle cx={px} cy={py} r={7} fill="var(--chart-primary)" />

        <text x={px + 10} y={CY + 16} fontSize={11} fill="var(--status-error)">
          sin θ = {formatNum(sin)}
        </text>
        <text x={CX - 48} y={py - 8} fontSize={11} fill="var(--status-success)">
          cos θ = {formatNum(cos)}
        </text>
        <text x={CX + 12} y={CY - 12} fontSize={11} fill="var(--chart-primary)">
          θ
        </text>
      </svg>

      <p className="text-center text-xs text-app-text-muted">
        단위원 위의 점 P에서 <strong className="text-app-text">cos θ</strong>는 x좌표,{' '}
        <strong className="text-app-text">sin θ</strong>는 y좌표입니다.
      </p>
    </div>
  );
}
