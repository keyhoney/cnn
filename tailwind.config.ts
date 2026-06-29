import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './stores/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-nanum-myeongjo)', 'Georgia', 'serif'],
        textbook: ['var(--font-textbook)', 'var(--font-nanum-myeongjo)', 'serif'],
      },
      colors: {
        app: {
          bg: 'var(--app-bg)',
          'bg-accent': 'var(--app-bg-accent)',
          surface: 'var(--app-surface)',
          'surface-muted': 'var(--app-surface-muted)',
          'surface-elevated': 'var(--app-surface-elevated)',
          border: 'var(--app-border)',
          'border-subtle': 'var(--app-border-subtle)',
          text: 'var(--app-text)',
          'text-muted': 'var(--app-text-muted)',
          heading: 'var(--app-heading)',
          accent: 'var(--app-accent)',
          'accent-hover': 'var(--app-accent-hover)',
          'accent-soft': 'var(--app-accent-soft)',
          prose: 'var(--app-prose)',
        },
        status: {
          success: 'var(--status-success)',
          'success-soft': 'var(--status-success-soft)',
          error: 'var(--status-error)',
          'error-soft': 'var(--status-error-soft)',
          warning: 'var(--status-warning)',
          'warning-soft': 'var(--status-warning-soft)',
        },
        chart: {
          primary: 'var(--chart-primary)',
          secondary: 'var(--chart-secondary)',
          grid: 'var(--chart-grid)',
          axis: 'var(--chart-axis)',
        },
        brand: {
          purple: 'var(--app-brand-purple)',
          orange: 'var(--app-brand-orange)',
          yellow: 'var(--app-brand-yellow)',
        },
        bookmark: {
          DEFAULT: 'var(--app-bookmark)',
          soft: 'var(--app-bookmark-soft)',
        },
      },
      boxShadow: {
        'app-sm': 'var(--app-shadow-sm)',
        'app-md': 'var(--app-shadow-md)',
        'app-lg': 'var(--app-shadow-lg)',
        'app-page': 'var(--app-shadow-page)',
      },
      borderRadius: {
        'app-sm': 'var(--app-radius-sm)',
        'app-md': 'var(--app-radius-md)',
        'app-lg': 'var(--app-radius-lg)',
        'app-xl': 'var(--app-radius-xl)',
      },
      screens: {
        tablet: '768px',
        desktop: '1024px',
      },
      maxWidth: {
        viewer: '800px',
        'viewer-lg': '960px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
