import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';

const AdminPageContent = nextDynamic(
  () => import('@/components/admin/AdminPageContent').then((mod) => mod.AdminPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-app-bg text-sm text-app-text-muted">
        관리자 페이지 불러오는 중…
      </div>
    ),
  }
);

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '관리자',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPageContent />;
}
