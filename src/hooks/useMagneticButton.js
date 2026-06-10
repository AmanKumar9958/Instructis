import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import useReducedMotion from './useReducedMotion';

/**
 * Magnetic button effect — element subtly pulls toward cursor on hover.
 * Returns a ref to attach to the element.
 */
export default function useMagneticButton(strength = 0.3) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const quickX = useRef(null);
  const quickY = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current || reducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    if (quickX.current) quickX.current(x * strength);
    if (quickY.current) quickY.current(y * strength);
  }, [strength, reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current || reducedMotion) return;
    if (quickX.current) quickX.current(0);
    if (quickY.current) quickY.current(0);
  }, [reducedMotion]);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    quickX.current = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    quickY.current = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [handleMouseMove, handleMouseLeave, reducedMotion]);

  return ref;
}
