import { useEffect, useRef, useState } from 'react'

/**
 * Hook that uses IntersectionObserver to detect when an element enters the viewport.
 * Returns a ref to attach to the element and a boolean indicating visibility.
 * Once visible, the element stays visible (one-shot animation).
 */
const useScrollReveal = (options = {}) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
        ...options,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

export default useScrollReveal
