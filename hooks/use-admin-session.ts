'use client';

import { useCallback, useEffect, useState } from 'react';

interface AdminSessionState {
  authenticated: boolean;
  configured: boolean;
  isLoading: boolean;
}

export function useAdminSession() {
  const [state, setState] = useState<AdminSessionState>({
    authenticated: false,
    configured: true,
    isLoading: true,
  });

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/session');
      const data = (await response.json()) as { authenticated?: boolean; configured?: boolean };
      setState({
        authenticated: Boolean(data.authenticated),
        configured: data.configured !== false,
        isLoading: false,
      });
    } catch {
      setState({ authenticated: false, configured: true, isLoading: false });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (password: string) => {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? '로그인에 실패했습니다.');
      }

      await refresh();
    },
    [refresh]
  );

  const logout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    await refresh();
  }, [refresh]);

  return {
    ...state,
    login,
    logout,
    refresh,
  };
}
