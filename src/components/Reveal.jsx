import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Wraps children with a scroll-triggered reveal animation using GSAP.
 * `direction` controls the animation variant: 'up' | 'down' | 'left' | 'right' | 'scale'
 * `delay` adds a delay in milliseconds.
 */
const Reveal = ({ children, direction = 'up', delay = 0, className = '' }) => {
    const ref = useRef(null)

    useGSAP(
        () => {
            const el = ref.current
            let x = 0
            let y = 0
            let startScale = 1
            let startOpacity = 0

            // Configure initial state based on direction
            if (direction === 'up') y = 50
            else if (direction === 'down') y = -50
            else if (direction === 'left') x = -50
            else if (direction === 'right') x = 50
            else if (direction === 'scale') startScale = 0.85

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
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: delay / 1000, // Convert ms to seconds
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%', // Start animation when top of element hits 85% of viewport
                        toggleActions: 'play none none none', // Play once
                    },
                }
            )
        },
        { scope: ref, dependencies: [direction, delay] }
    )

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    )
}

export default Reveal
