import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animated number counter — animates from 0 to target on scroll-into-view.
 * Props: value (number), suffix, prefix, duration, delay, className
 */
export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  delay = 0,
  className = ''
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;

    if (reducedMotion) {
      ref.current.textContent = `${prefix}${value}${suffix}`;
      return;
    }

    const counter = { val: 0 };
    const tween = gsap.to(counter, {
      val: value,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
        }
      }
    });

    return () => {
      tween.kill();
    };
  }, [value, suffix, prefix, duration, delay, reducedMotion]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {`${prefix}0${suffix}`}
    </span>
  );
}
