import type { ReactNode } from 'react';
import { MathText } from '@/components/math/MathText';
import { cn } from '@/lib/utils';
import type { MdxTableProps } from '@/lib/types/mdx';

function renderCellContent(value: string | number) {
  if (typeof value === 'number') {
    return value;
  }
  return <MathText text={value} />;
}

function TableCell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[2rem] items-center justify-center text-center">
      {children}
    </div>
  );
}

export function MdxTable({ headers = [], data = [], caption }: MdxTableProps) {
  if (headers.length === 0 && data.length === 0) {
    return null;
  }

  return (
    <figure className="not-prose surface-card my-6 overflow-x-auto">
      <table className={cn('w-full border-collapse text-sm [&_td]:text-center [&_th]:text-center')}>
        {headers.length > 0 && (
          <thead>
            <tr className="bg-app-accent-soft/30 border-b border-app-border-subtle">
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="px-3 py-2 align-middle font-semibold text-app-text"
                  scope="col"
                >
                  <TableCell>
                    <MathText text={header} />
                  </TableCell>
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-app-border/60 border-b">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-2 align-middle text-app-text">
                  <TableCell>{renderCellContent(cell)}</TableCell>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-app-text-muted">
          <MathText text={caption} />
        </figcaption>
      )}
    </figure>
  );
}
