import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useImageTilt from '../hooks/useImageTilt';

/**
 * Large category card for the landing page.
 * Features 3D tilt effect on hover.
 * Props: category (from categoryData)
 */
export default function CategoryCard({ category }) {
  const tiltRef = useImageTilt(6);
  const Icon = category.icon;

  return (
    <div ref={tiltRef} className="gpu-accelerated">
      <Link
        to={`/${category.slug}`}
        className={`group block relative overflow-hidden rounded-3xl p-8 ${category.bgColor} border border-gray-100 hover:shadow-card-hover transition-shadow duration-300`}
      >
        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />

        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-5 text-white shadow-lg`}>
            <Icon className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">{category.description}</p>

          {/* Stats row */}
          <div className="flex gap-6 mb-6">
            {category.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-brand-purple group-hover:gap-3 transition-all duration-300">
            <span>Explore</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </div>
  );
}
