import { useEffect, useRef, useState, type RefObject } from 'react';

export function useInView<T extends HTMLElement = HTMLElement>(
  threshold = 0.2
): { ref: RefObject<T>; inView: boolean } {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref: ref as RefObject<T>, inView };
}
