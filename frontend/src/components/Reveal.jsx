import useScrollReveal from '../hooks/useScrollReveal'

/**
 * Wraps children with a scroll-triggered reveal animation.
 * `direction` controls the animation variant: 'up' | 'left' | 'right' | 'scale'
 * `delay` adds a CSS transition-delay in milliseconds.
 */
const Reveal = ({ children, direction = 'up', delay = 0, className = '' }) => {
    const [ref, isVisible] = useScrollReveal()

    const baseClass =
        direction === 'left'
            ? `scroll-reveal-left${isVisible ? ' scroll-reveal-left--visible' : ''}`
            : direction === 'right'
              ? `scroll-reveal-right${isVisible ? ' scroll-reveal-right--visible' : ''}`
              : direction === 'scale'
                ? `scroll-reveal-scale${isVisible ? ' scroll-reveal-scale--visible' : ''}`
                : `scroll-reveal${isVisible ? ' scroll-reveal--visible' : ''}`

    return (
        <div ref={ref} className={`${baseClass} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    )
}

export default Reveal
