import type { Metadata } from 'next';
import { A11yAuditPageContent } from '@/components/accessibility/A11yAuditPageContent';

export const metadata: Metadata = {
  title: '접근성 감사',
  robots: { index: false, follow: false },
};

export default function AccessibilityPage() {
  return <A11yAuditPageContent />;
}
