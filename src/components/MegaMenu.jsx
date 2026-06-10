import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import categoryData from '../data/categoryData';
import examData from '../data/examData';

/**
 * Mega-menu dropdown with glassmorphism backdrop.
 * Shows categories and featured exams.
 */
export default function MegaMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  const featuredExams = examData.slice(0, 6);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[99]" onClick={onClose} />

      {/* Menu panel */}
      <div className="fixed top-16 left-0 right-0 z-[100] mt-2 mx-4 lg:mx-auto lg:max-w-5xl">
        <div className="glass-card rounded-2xl shadow-elevated p-6 lg:p-8 animate-[scaleIn_200ms_ease]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Categories */}
            <div className="lg:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Categories</h3>
              <div className="space-y-2">
                {categoryData.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.id}
                      to={`/${cat.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-brand-purple transition-colors">{cat.title}</p>
                        <p className="text-xs text-gray-500">{cat.stats[0]?.value} {cat.stats[0]?.label}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Featured exams */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Popular Exams</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {featuredExams.map((exam) => {
                  const Icon = exam.icon;
                  return (
                    <Link
                      key={exam.id}
                      to={`/competitive-exams/${exam.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${exam.color}15`, color: exam.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm text-gray-700 group-hover:text-brand-purple transition-colors">{exam.shortName}</span>
                    </Link>
                  );
                })}
              </div>
              <Link
                to="/competitive-exams"
                onClick={onClose}
                className="flex items-center gap-2 mt-4 text-sm font-semibold text-brand-purple hover:gap-3 transition-all"
              >
                <span>View all exams</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.97) translateY(-4px) } to { opacity: 1; transform: scale(1) translateY(0) } }
        `}</style>
      </div>
    </>
  );
}
