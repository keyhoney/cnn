import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Interactive Math — 고등학교 수학 교재',
    short_name: 'Math',
    description: '고등학교 수학 인터랙티브 전자교재',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f3f8',
    theme_color: '#1b4dfe',
    orientation: 'any',
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
