'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import functionPlot, { type Chart } from 'function-plot';
import { RotateCcw } from 'lucide-react';
import type { GraphProps } from '@/lib/types/mdx';
import { MathText } from '@/components/math/MathText';
import {
  buildFunctionPlotData,
  buildPointAnnotations,
  buildPointPlotData,
  GRAPH_COLORS,
  GRAPH_HEIGHT,
  resolveGraphDomain,
  resolveGraphRange,
} from '@/lib/graph-utils';

const MIN_WIDTH = 280;

export default function FunctionPlotChart({
  functions = [],
  domain,
  range,
  points = [],
  note,
}: GraphProps) {
  const plotId = useId().replace(/:/g, '');
  const containerRef = useRef<HTMLDivElement>(null);
  const plotTargetRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [width, setWidth] = useState(MIN_WIDTH);

  const xDomain = resolveGraphDomain(domain);
  const yDomain = resolveGraphRange(range);

  const initialDomainsRef = useRef({ xDomain, yDomain });

  useEffect(() => {
    initialDomainsRef.current = { xDomain, yDomain };
  }, [xDomain, yDomain]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(Math.max(MIN_WIDTH, Math.floor(entry.contentRect.width)));
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const renderChart = useCallback(() => {
    const target = plotTargetRef.current;
    if (!target || functions.length === 0) return;

    const data = [...buildFunctionPlotData(functions), ...buildPointPlotData(points)];
    const annotations = buildPointAnnotations(points);

    const options = {
      target,
      width,
      height: GRAPH_HEIGHT,
      grid: true,
      disableZoom: false,
      xAxis: { domain: xDomain, label: 'x' },
      yAxis: { domain: yDomain, label: 'y' },
      xDomain,
      yDomain,
      data,
      annotations,
      tip: {
        xLine: true,
        yLine: true,
      },
    };

    if (chartRef.current) {
      Object.assign(chartRef.current.options, options);
      chartRef.current.build();
      return;
    }

    target.innerHTML = '';
    chartRef.current = functionPlot(options);
  }, [functions, points, width, xDomain, yDomain]);

  useEffect(() => {
    renderChart();
  }, [renderChart]);

  useEffect(() => {
    const target = plotTargetRef.current;
    return () => {
      if (target) {
        target.innerHTML = '';
      }
      chartRef.current = null;
    };
  }, []);

  const handleResetZoom = () => {
    const { xDomain: initialX, yDomain: initialY } = initialDomainsRef.current;
    if (!chartRef.current) return;

    chartRef.current.options.xDomain = [...initialX];
    chartRef.current.options.yDomain = [...initialY];
    chartRef.current.options.xAxis = {
      ...chartRef.current.options.xAxis,
      domain: [...initialX],
    };
    chartRef.current.options.yAxis = {
      ...chartRef.current.options.yAxis,
      domain: [...initialY],
    };
    chartRef.current.build();
  };

  const stopPageGestures = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  if (functions.length === 0) {
    return (
      <div className="my-4 rounded-xl border border-dashed border-app-border bg-app-surface-muted px-4 py-8 text-center text-sm text-app-text-muted">
        표시할 함수가 없습니다. <code>functions</code> prop을 지정해 주세요.
      </div>
    );
  }

  return (
    <figure
      className="not-prose surface-card my-6 overflow-hidden"
      data-graph-id={plotId}
      onPointerDown={stopPageGestures}
      onTouchStart={stopPageGestures}
      data-no-flip
    >
      <div
        ref={containerRef}
        className="flex flex-wrap items-center justify-between gap-2 border-b border-app-border bg-app-surface-muted/60 px-3 py-2"
      >
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          {functions.map((fn, index) => (
            <span
              key={`${fn}-${index}`}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-app-text"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: GRAPH_COLORS[index % GRAPH_COLORS.length] }}
                aria-hidden
              />
              <span className="truncate">y = {fn}</span>
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleResetZoom}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-app-text-muted transition-colors hover:bg-app-surface hover:text-app-accent"
          title="줌 초기화"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          초기화
        </button>
      </div>

      <div className="relative bg-app-surface px-2 py-2">
        <div ref={plotTargetRef} className="w-full touch-none" aria-label="함수 그래프" />
        <p className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-app-surface/90 px-2 py-0.5 text-[10px] text-app-text-muted shadow-sm">
          휠/핀치 줌 · 드래그 이동
        </p>
      </div>

      {note && (
        <figcaption className="border-t border-app-border px-4 py-2 text-sm text-app-text-muted">
          <MathText text={note} />
        </figcaption>
      )}
    </figure>
  );
}
