import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import useReducedMotion from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Wraps children with a scroll-triggered reveal animation using GSAP.
 * `direction` controls the animation variant: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'
 * `delay` adds a delay in milliseconds.
 * Respects prefers-reduced-motion — renders children immediately without animation.
 */
const Reveal = ({ children, direction = 'up', delay = 0, className = '' }) => {
    const ref = useRef(null)
    const reducedMotion = useReducedMotion()

    useGSAP(
        () => {
            const el = ref.current
            if (!el || reducedMotion) return

            let x = 0
            let y = 0
            let startScale = 1
            let startOpacity = 0

            // Configure initial state based on direction
            if (direction === 'up') y = 40
            else if (direction === 'down') y = -40
            else if (direction === 'left') x = -40
            else if (direction === 'right') x = 40
            else if (direction === 'scale') startScale = 0.9
            else if (direction === 'fade') { /* just opacity */ }

            // Animation configuration
            gsap.fromTo(
                el,
                {
                    opacity: startOpacity,
                    x,
                    y,
                    scale: startScale,
                },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: 'power3.out',
                    delay: delay / 1000, // Convert ms to seconds
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none', // Play once
                    },
                }
            )
        },
        { scope: ref, dependencies: [direction, delay, reducedMotion] }
    )

    return (
        <div ref={ref} className={className} style={reducedMotion ? {} : { opacity: 0 }}>
            {children}
        </div>
    )
}

export default Reveal
