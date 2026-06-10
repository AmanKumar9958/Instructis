import { useState, useEffect, useRef } from 'react';

/**
 * Returns a scroll progress value (0–1) for a given element.
 * 0 = element is below viewport, 1 = element has scrolled past.
 * Returns { ref, progress }
 */
export default function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const handleScroll = () => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const p = Math.min(Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0), 1);
            setProgress(p);
          };
          window.addEventListener('scroll', handleScroll, { passive: true });
          handleScroll();

          return () => window.removeEventListener('scroll', handleScroll);
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, progress };
}
