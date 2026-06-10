import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import useReducedMotion from './useReducedMotion';

/**
 * 3D perspective tilt effect on hover.
 * Returns a ref to attach to the element.
 */
export default function useImageTilt(maxTilt = 8) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = useCallback((e) => {
    if (!ref.current || reducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(ref.current, {
      rotateY: x * maxTilt,
      rotateX: -y * maxTilt,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800
    });
  }, [maxTilt, reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current || reducedMotion) return;
    gsap.to(ref.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
  }, [reducedMotion]);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    el.style.transformStyle = 'preserve-3d';
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.set(el, { rotateX: 0, rotateY: 0 });
    };
  }, [handleMouseMove, handleMouseLeave, reducedMotion]);

  return ref;
}
