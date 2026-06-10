/**
 * Animated gradient text heading.
 * Props: children, gradient ('purple' | 'blue' | 'orange'), as (tag), className
 */
export default function GradientText({
  children,
  gradient = 'purple',
  as: Tag = 'span',
  className = ''
}) {
  const gradientMap = {
    purple: 'gradient-text-purple',
    blue: 'gradient-text-blue',
    orange: 'bg-gradient-to-r from-brand-orange to-accent-amber bg-clip-text text-transparent'
  };

  return (
    <Tag className={`${gradientMap[gradient] || gradientMap.purple} ${className}`}>
      {children}
    </Tag>
  );
}
