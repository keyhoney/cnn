'use client';

import { Fragment } from 'react';
import { Formula } from '@/components/math/Formula';

/** `$...$` 인라인 수식이 포함된 문자열을 Formula 컴포넌트로 렌더링 */
export function MathText({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const latex = part.slice(1, -1);
          return <Formula key={i} latex={latex} display="inline" />;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
