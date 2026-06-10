import Reveal from './Reveal';

/**
 * Reusable section header with optional badge, gradient title, and subtitle.
 * Built-in scroll-reveal animation.
 */
export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  className = ''
}) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`${alignClass} mb-12 md:mb-16 ${className}`}>
      {badge && (
        <Reveal direction="up" delay={0}>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-purple bg-brand-light-purple px-4 py-1.5 rounded-full mb-4">
            {badge}
          </span>
        </Reveal>
      )}
      <Reveal direction="up" delay={80}>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal direction="up" delay={160}>
          <p className={`text-base md:text-lg text-gray-600 mt-4 ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-3xl'}`}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
