import { cn } from '@/lib/utils';

export interface SyntheticDivisionProps {
  /** 조립제법에 쓰는 값 (x − root = 0 의 근) */
  root: number;
  /** 나누어지는 다항식의 계수 (고차 → 저차) */
  coefficients: number[];
  /** 곱한 값 행 (coefficients.length − 1개) */
  products: number[];
  /** 마지막 행 — 몫의 계수와 나머지 (coefficients.length개) */
  bottom: number[];
  /** 변수 기호 (기본 x) */
  variable?: string;
  className?: string;
}

function formatNum(value: number): string {
  return String(value);
}

function PowerLabel({ variable, power }: { variable: string; power: number }) {
  if (power === 0) return <>상수</>;
  if (power === 1) return <>{variable}</>;
  return (
    <>
      {variable}
      <sup className="text-[0.65em] font-medium">{power}</sup>
    </>
  );
}

function CoeffCell({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        'flex h-10 items-center justify-center rounded-lg border px-2 text-center text-lg font-semibold tabular-nums sm:h-11 sm:text-xl',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

/**
 * 조립제법 계산 과정을 교과서 스타일로 표시합니다.
 */
export function SyntheticDivision({
  root,
  coefficients,
  products,
  bottom,
  variable = 'x',
  className,
}: SyntheticDivisionProps) {
  const degree = coefficients.length - 1;
  const labels = coefficients.map((_, i) => degree - i);
  const colCount = coefficients.length;

  return (
    <figure
      className={cn(
        'not-prose my-8 overflow-hidden rounded-app-lg border shadow-app-sm',
        className
      )}
      style={{
        borderColor: 'var(--callout-formula-border)',
        background:
          'linear-gradient(145deg, var(--callout-formula-bg) 0%, var(--app-surface) 55%, var(--app-surface-muted) 100%)',
      }}
      aria-label={`조립제법: ${root}으로 나누기`}
    >
      <div className="border-b border-app-border-subtle/80 px-4 py-2.5 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-app-text-muted">
          조립제법
        </p>
      </div>

      <div className="overflow-x-auto px-4 py-5 pb-8 sm:px-6 sm:py-6 sm:pb-9">
        <div className="mx-auto flex w-fit min-w-[min(100%,16rem)] items-stretch gap-3 sm:gap-4">
          <div className="flex shrink-0 items-start pt-7 sm:pt-8">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg font-semibold tabular-nums sm:h-11 sm:w-11 sm:text-xl"
              style={{
                borderColor: 'var(--app-accent)',
                color: 'var(--app-accent)',
                backgroundColor: 'color-mix(in srgb, var(--app-accent) 12%, var(--app-surface))',
              }}
            >
              {formatNum(root)}
            </div>
          </div>

          <div
            className="min-w-0 flex-1 border-l-2 pl-3 sm:pl-4"
            style={{ borderColor: 'var(--app-border)' }}
          >
            <div
              className="grid gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-2.5"
              style={{ gridTemplateColumns: `repeat(${colCount}, minmax(2.75rem, 3.5rem))` }}
            >
              {labels.map((power) => (
                <div
                  key={`label-${power}`}
                  className="text-center text-[11px] font-medium tracking-tight text-app-text-muted sm:text-xs"
                >
                  <PowerLabel variable={variable} power={power} />
                </div>
              ))}

              {coefficients.map((coeff, i) => (
                <CoeffCell
                  key={`coeff-${i}`}
                  className="border-app-border-subtle bg-app-surface/90 text-app-heading shadow-app-sm"
                >
                  {formatNum(coeff)}
                </CoeffCell>
              ))}

              <div aria-hidden />
              {products.map((product, i) => (
                <div
                  key={`product-${i}`}
                  className="flex h-9 items-center justify-center text-center text-base font-medium tabular-nums sm:text-lg"
                  style={{ color: 'var(--callout-formula-icon)' }}
                >
                  {formatNum(product)}
                </div>
              ))}

              <div
                className="col-span-full my-0.5 h-px bg-gradient-to-r from-app-border via-app-border-subtle to-transparent"
                style={{ gridColumn: `1 / span ${colCount}` }}
                aria-hidden
              />

              {bottom.map((value, i) => {
                const isRemainder = i === bottom.length - 1;
                return (
                  <div key={`bottom-${i}`} className="relative">
                    <CoeffCell
                      className={cn(
                        isRemainder
                          ? 'border-2 text-app-heading'
                          : 'border-app-border-subtle bg-app-surface/70 text-app-heading'
                      )}
                      style={
                        isRemainder
                          ? {
                              borderColor: 'var(--app-brand-purple)',
                              backgroundColor:
                                'color-mix(in srgb, var(--app-brand-purple) 14%, var(--app-surface))',
                            }
                          : undefined
                      }
                    >
                      {formatNum(value)}
                    </CoeffCell>
                    {isRemainder && (
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-app-text-muted sm:text-[11px]">
                        나머지
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <figcaption className="border-t border-app-border-subtle/80 px-4 py-2.5 text-center text-xs text-app-text-muted sm:px-5">
        왼쪽 수 <strong className="font-semibold text-app-text">{formatNum(root)}</strong>는{' '}
        <span className="font-medium text-app-text">
          {variable} − {formatNum(root)} = 0
        </span>
        의 근입니다.
      </figcaption>
    </figure>
  );
}
