import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Trophy, Brain, Code } from 'lucide-react';
import Seo from '../components/Seo';
import SectionHeader from '../components/SectionHeader';
import MagneticButton from '../components/MagneticButton';
import Reveal from '../components/Reveal';

const paths = [
  { icon: Trophy, title: 'Government & Civil Services', description: 'UPSC, SSC, Banking, NDA — build a career in India\'s government services.', link: '/competitive-exams', color: '#10B981' },
  { icon: Brain, title: 'AI & Data Science', description: 'ML Engineer, Data Scientist, AI Researcher — enter the fastest-growing tech domain.', link: '/ai-ml', color: '#3B82F6' },
  { icon: Code, title: 'Software Engineering', description: 'Full-Stack Developer, Backend Engineer, DevOps — build, ship, and scale software.', link: '/coding', color: '#8134AF' },
  { icon: Trophy, title: 'Engineering (JEE)', description: 'IIT, NIT, IIIT — crack JEE and get into India\'s top engineering colleges.', link: '/competitive-exams/jee', color: '#FF6C37' },
  { icon: Trophy, title: 'Medical (NEET)', description: 'AIIMS, JIPMER, Government Medical — secure your seat in top medical colleges.', link: '/competitive-exams/neet', color: '#F43F5E' },
  { icon: Trophy, title: 'Management (CAT)', description: 'IIM, ISB, XLRI — crack CAT and build a career in business leadership.', link: '/competitive-exams/cat', color: '#6366F1' }
];

export default function CareersPage() {
  return (
    <main className="bg-white">
      <Seo title="Career Paths" description="Explore guided career paths across technology, government services, management, and more. Mentorship, skill development, and placement support." image="/og-image.svg" />

      {/* Hero */}
      <section className="gradient-mesh py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-orange to-accent-amber flex items-center justify-center text-white mb-6">
              <Compass className="w-7 h-7" />
            </div>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-4">
              Find your <span className="gradient-text-purple">career path</span>
            </h1>
          </Reveal>
          <Reveal direction="up" delay={160}>
            <p className="text-lg text-gray-600 max-w-2xl mb-8">
              Not sure where to start? Explore guided career paths across technology, government services, and management — with structured programs, mentorship, and placement support.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Career Paths Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Explore" title={<>Choose your <span className="gradient-text-purple">direction</span></>} subtitle="Each path includes structured learning, expert mentorship, and career support." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paths.map((path, idx) => {
              const Icon = path.icon;
              return (
                <Reveal key={idx} direction="up" delay={idx * 60}>
                  <Link to={path.link} className="group block p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${path.color}12`, color: path.color }}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-purple transition-colors">{path.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{path.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Reveal direction="up">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Not sure which path to choose?</h2>
            <p className="text-gray-600 mb-8">Book a free session with our career counsellors and get personalised guidance.</p>
            <MagneticButton>
              <a href="/#book-session" className="inline-flex items-center gap-2 bg-brand-purple text-white font-bold py-3.5 px-8 rounded-xl hover:bg-brand-purple-dark transition-all shadow-lg shadow-brand-purple/20 text-sm">
                Get Career Guidance <ArrowRight className="w-4 h-4" />
              </a>
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
