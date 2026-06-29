'use client';

import { useCallback, useState } from 'react';
import type AxeCore from 'axe-core';

export interface A11yViolation {
  id: string;
  impact?: AxeCore.ImpactValue;
  description: string;
  help: string;
  helpUrl: string;
  nodes: number;
}

export function useAxeAudit() {
  const [violations, setViolations] = useState<A11yViolation[]>([]);
  const [passes, setPasses] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);

  const runAudit = useCallback(async () => {
    setIsRunning(true);
    setError(null);

    try {
      const axe = (await import('axe-core')).default;
      const results = await axe.run(document, {
        rules: {
          region: { enabled: false },
        },
      });

      const mapped = results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.length,
      }));

      setViolations(mapped);
      setPasses(results.passes.length);
      setLastRunAt(new Date().toLocaleString('ko-KR'));
    } catch (err) {
      setViolations([]);
      setPasses(0);
      setError(err instanceof Error ? err.message : 'axe-core 검사에 실패했습니다.');
    } finally {
      setIsRunning(false);
    }
  }, []);

  return {
    violations,
    passes,
    isRunning,
    error,
    lastRunAt,
    runAudit,
  };
}
