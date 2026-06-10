import useMagneticButton from '../hooks/useMagneticButton';

/**
 * Wrapper component that applies magnetic hover effect to its child.
 * Usage: <MagneticButton><button>Click</button></MagneticButton>
 */
export default function MagneticButton({ children, strength = 0.3, className = '' }) {
  const ref = useMagneticButton(strength);

  return (
    <div ref={ref} className={`magnetic-wrap ${className}`}>
      {children}
    </div>
  );
}
