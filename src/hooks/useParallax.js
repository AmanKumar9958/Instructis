import { useState, useEffect, useCallback, useRef } from 'react';
import useReducedMotion from './useReducedMotion';

/**
 * Mouse-reactive parallax — returns { x, y } transform offsets.
 * Tracks mouse position relative to viewport center.
 * Throttled via requestAnimationFrame for 60 FPS.
 */
export default function useParallax(strength = 20) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();
  const rafId = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (reducedMotion) return;
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * strength;
      const y = (e.clientY / window.innerHeight - 0.5) * strength;
      setOffset({ x, y });
      rafId.current = null;
    });
  }, [strength, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleMouseMove, reducedMotion]);

  return reducedMotion ? { x: 0, y: 0 } : offset;
}
