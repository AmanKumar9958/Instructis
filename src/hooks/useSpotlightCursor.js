import { useCallback, useEffect, useRef } from 'react';
import useReducedMotion from './useReducedMotion';

/**
 * Spotlight cursor effect — a radial gradient follows the mouse.
 * Uses CSS custom properties for GPU-accelerated positioning.
 * The element must have the 'spotlight-cursor' CSS class.
 * Returns a ref to attach to the container element.
 */
export default function useSpotlightCursor() {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const rafId = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current || reducedMotion) return;
    if (rafId.current) return; // Throttle to one rAF per frame
    rafId.current = requestAnimationFrame(() => {
      const rect = ref.current.getBoundingClientRect();
      ref.current.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
      ref.current.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
      ref.current.style.setProperty('--spotlight-opacity', '1');
      rafId.current = null;
    });
  }, [reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.setProperty('--spotlight-opacity', '0');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleMouseMove, handleMouseLeave, reducedMotion]);

  return ref;
}
