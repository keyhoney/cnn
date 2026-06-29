import type { Metadata, Viewport } from 'next';
import { Gowun_Batang, Nanum_Myeongjo, Noto_Sans_KR } from 'next/font/google';
import { UserInitializer } from '@/components/layout/UserInitializer';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { KeyboardShortcutsProvider } from '@/components/layout/KeyboardShortcutsProvider';
import { SettingsProvider } from '@/components/layout/SettingsProvider';
import { BadgeProvider } from '@/components/layout/BadgeProvider';
import { PwaProvider } from '@/components/layout/PwaProvider';
import { PrintLifecycle } from '@/components/print/PrintLifecycle';
import { ThemeScript } from '@/components/layout/ThemeScript';
import { DisplaySettingsScript } from '@/components/layout/DisplaySettingsScript';
import { SkipNav } from '@/components/layout/SkipNav';
import './globals.css';
import 'katex/dist/katex.min.css';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
});

const gowunBatang = Gowun_Batang({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-textbook',
  display: 'swap',
});

const APP_NAME = 'Interactive Math';
const APP_DESCRIPTION = '고등학교 수학 인터랙티브 전자교재';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#1b4dfe',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${nanumMyeongjo.variable} ${gowunBatang.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <ThemeScript />
        <DisplaySettingsScript />
      </head>
      <body suppressHydrationWarning>
        <PrintLifecycle />
        <ThemeProvider>
          <KeyboardShortcutsProvider>
            <SettingsProvider>
              <SkipNav />
              <UserInitializer />
              <PwaProvider>
                <BadgeProvider>{children}</BadgeProvider>
              </PwaProvider>
            </SettingsProvider>
          </KeyboardShortcutsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
