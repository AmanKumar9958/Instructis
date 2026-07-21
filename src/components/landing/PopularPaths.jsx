import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import Reveal from '../Reveal';

const paths = [
  { title: 'JEE 2026 Prep', description: 'Complete JEE Main & Advanced', link: '/competitive-exams/jee', color: '#FF6C37', tag: 'Engineering' },
  { title: 'NEET Biology Mastery', description: 'NCERT-first NEET coaching', link: '/competitive-exams/neet', color: '#3B82F6', tag: 'Medical' },
  { title: 'Python for AI', description: 'From basics to deep learning', link: '/ai-ml', color: '#8134AF', tag: 'AI/ML' },
  { title: 'DSA Interview Prep', description: '200+ problems, mock interviews', link: '/coding', color: '#10B981', tag: 'Coding' },
  { title: 'UPSC Foundation', description: 'Prelims + Mains + Interview', link: '/competitive-exams/upsc', color: '#F59E0B', tag: 'Government' },
  { title: 'Full-Stack Dev', description: 'React, Node.js, cloud deploy', link: '/coding', color: '#06B6D4', tag: 'Coding' },
  { title: 'CAT Quantitative', description: 'Speed, accuracy, strategy', link: '/competitive-exams/cat', color: '#6366F1', tag: 'Management' },
  { title: 'Deep Learning', description: 'CNNs, RNNs, Transformers', link: '/ai-ml', color: '#F43F5E', tag: 'AI/ML' },
  { title: 'IELTS Mastery', description: 'Target 8+ Band Score', link: '/competitive-exams/ielts', color: '#E11D48', tag: 'Study Abroad' }
];

export default function PopularPaths() {
  const scrollRef = useRef(null);

  return (
    <section className="py-20 bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Popular"
          title={<>Trending learning <span className="gradient-text-purple">paths</span></>}
          subtitle="Explore the most popular programs our students are enrolling in right now."
        />
      </div>

      {/* Horizontal scrolling card rail */}
      <Reveal direction="up">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 sm:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {paths.map((path) => (
            <Link
              key={path.title}
              to={path.link}
              className="group flex-shrink-0 w-[280px] md:w-[300px] bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 snap-start"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${path.color}12`, color: path.color }}
                >
                  {path.tag}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-brand-purple transition-colors">{path.title}</h4>
              <p className="text-sm text-gray-500">{path.description}</p>
            </Link>
          ))}
        </div>
      </Reveal>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
