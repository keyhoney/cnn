import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ImageNoteProps } from '@/lib/types/mdx';

export function ImageNote({ src, alt = '', caption }: ImageNoteProps) {
  return (
    <figure className={cn('surface-card my-6 overflow-hidden')}>
      <div className="relative flex min-h-[120px] items-center justify-center bg-app-surface-muted p-4">
        <Image
          src={src}
          alt={alt}
          width={640}
          height={360}
          className="h-auto w-auto rounded-md object-contain"
          style={{ maxHeight: '20rem' }}
          sizes="(max-width: 640px) 100vw, 640px"
        />
      </div>
      {caption && (
        <figcaption className="border-t border-app-border px-4 py-2 text-center text-sm text-app-text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
