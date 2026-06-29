import Link from 'next/link';
import { Reveal } from '@/components/eterna/Reveal';

interface PageCTAProps {
  title: string;
  subtitle?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function PageCTA({
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: PageCTAProps) {
  return (
    <Reveal>
      <section className="hero-band relative mt-10 overflow-hidden p-8 text-center sm:p-10">
        <div
          className="glow-orb h-[300px] w-[400px] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(172, 36, 255, 0.2) 0%, transparent 70%)',
          }}
          aria-hidden
        />
        <div className="relative z-10">
          <h2 className="heading-display-sm font-serif mb-3 text-app-heading">{title}</h2>
          {subtitle && <p className="mb-6 text-sm text-app-text-muted">{subtitle}</p>}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href={primaryHref} className="btn-primary">
              {primaryLabel}
            </Link>
            {secondaryHref && secondaryLabel && (
              <Link href={secondaryHref} className="btn-secondary">
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
