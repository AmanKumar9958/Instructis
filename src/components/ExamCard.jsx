import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Reusable exam card for grid layouts.
 * Props: exam (from examData), variant ('full' | 'compact')
 */
export default function ExamCard({ exam, variant = 'full' }) {
  const Icon = exam.icon;

  if (variant === 'compact') {
    return (
      <Link
        to={`/competitive-exams/${exam.slug}`}
        className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${exam.color}15`, color: exam.color }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-gray-900 text-sm">{exam.shortName}</h4>
          <p className="text-xs text-gray-500 truncate">{exam.category}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 ml-auto flex-shrink-0 transition-colors" />
      </Link>
    );
  }

  return (
    <Link
      to={`/competitive-exams/${exam.slug}`}
      className="group block p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${exam.color}12`, color: exam.color }}
        >
          <Icon className="w-7 h-7" />
        </div>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: `${exam.color}10`, color: exam.color }}
        >
          {exam.category}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-purple transition-colors">
        {exam.shortName}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exam.tagline}</p>

      <div className="flex items-center gap-2 text-sm font-semibold text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Explore</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
