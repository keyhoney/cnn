'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginFormProps {
  onLogin: (password: string) => Promise<void>;
  configured: boolean;
}

export function AdminLoginForm({ onLogin, configured }: AdminLoginFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onLogin(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!configured) {
    return (
      <div className="surface-card mx-auto max-w-md border-status-warning/30 bg-status-warning-soft p-6 text-sm text-app-text">
        <p className="font-semibold">관리자 비밀번호가 설정되지 않았습니다.</p>
        <p className="mt-2 leading-relaxed">
          프로젝트 루트에 <code className="rounded bg-app-surface px-1">.env.local</code> 파일을 만들고{' '}
          <code className="rounded bg-app-surface px-1">ADMIN_PASSWORD</code> 값을 설정한 뒤 개발 서버를
          다시 시작하세요.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="modal-panel mx-auto w-full max-w-md p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-app-accent/10 text-app-accent">
          <Lock className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-app-heading">관리자 로그인</h2>
          <p className="text-xs text-app-text-muted">교사용 콘텐츠 편집 페이지</p>
        </div>
      </div>

      <label className="block text-sm font-medium text-app-text" htmlFor="admin-password">
        비밀번호
      </label>
      <input
        id="admin-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="input-field mt-2"
        autoComplete="current-password"
        required
      />

      {error && (
        <p className="mt-3 text-sm text-status-error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary mt-4 w-full"
      >
        {isSubmitting ? '확인 중…' : '로그인'}
      </button>
    </form>
  );
}
