'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { ETERNA_NAV_LINKS, isDarkNavPath } from '@/lib/eterna-nav';
import { cn } from '@/lib/utils';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function EternaNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = isDarkNavPath(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const headerBg = isDark
    ? scrolled
      ? 'border-b border-white/10 bg-[#13101c]/95 backdrop-blur-md'
      : 'bg-transparent'
    : scrolled
      ? 'glass-bar glass-bar-scrolled border-b border-app-border-subtle shadow-app-sm'
      : 'border-b border-app-border-subtle bg-app-surface';

  const linkBase =
    'relative px-4 py-2.5 text-sm font-medium no-underline transition-colors duration-300';

  return (
    <header
      className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-500', headerBg)}
      data-print-hide
    >
      <nav className="app-container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-app-accent text-white">
            <BookOpen className="h-5 w-5" />
          </span>
          <span
            className={cn(
              'text-sm font-semibold tracking-tight',
              isDark ? 'gradient-text' : 'text-app-heading'
            )}
          >
            HowLearn
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {ETERNA_NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    linkBase,
                    active && 'spectrum-border',
                    isDark
                      ? active
                        ? 'text-white'
                        : 'text-white/75 hover:text-white'
                      : active
                        ? 'text-app-heading'
                        : 'text-app-text-muted hover:text-app-text'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/books" className="btn-primary px-4 py-2 text-xs">
            교재 열기
          </Link>
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="flex flex-col gap-1.5 p-2 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴"
          aria-expanded={mobileOpen}
        >
          <span
            className={cn(
              'block h-0.5 w-6 transition-transform',
              isDark ? 'bg-white' : 'bg-app-text',
              mobileOpen && 'translate-y-2 rotate-45'
            )}
          />
          <span
            className={cn(
              'block h-0.5 w-6 transition-opacity',
              isDark ? 'bg-white' : 'bg-app-text',
              mobileOpen && 'opacity-0'
            )}
          />
          <span
            className={cn(
              'block h-0.5 w-6 transition-transform',
              isDark ? 'bg-white' : 'bg-app-text',
              mobileOpen && '-translate-y-2 -rotate-45'
            )}
          />
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'border-t px-6 py-5 lg:hidden',
            isDark
              ? 'border-white/10 bg-[#1e1830] text-white'
              : 'border-app-border bg-app-surface'
          )}
        >
          {ETERNA_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block py-2.5 text-sm font-medium no-underline transition-colors',
                isDark ? 'text-white/85 hover:text-white' : 'text-app-text hover:text-app-accent'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center gap-2">
            <Link href="/books" className="btn-primary flex-1 justify-center text-xs">
              교재 열기
            </Link>
            <ThemeToggle />
          </div>
        </motion.div>
      )}
    </header>
  );
}
