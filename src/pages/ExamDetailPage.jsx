import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Seo from '../components/Seo';
import SectionHeader from '../components/SectionHeader';
import MagneticButton from '../components/MagneticButton';
import Reveal from '../components/Reveal';
import { getExamBySlug } from '../data/examData';

export default function ExamDetailPage() {
  const { slug } = useParams();
  const exam = getExamBySlug(slug);

  if (!exam) return <Navigate to="/competitive-exams" replace />;

  const Icon = exam.icon;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': `https://instructis.co.in/competitive-exams/${exam.slug}#course`,
      name: exam.name,
      description: exam.description,
      provider: { '@id': 'https://instructis.co.in/#organization' }
    }
  ];

  return (
    <main className="bg-white">
      <Seo title={exam.name} description={exam.description} image="/og-image.svg" jsonLd={jsonLd} />

      {/* Hero */}
      <section className="gradient-mesh py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${exam.color}15`, color: exam.color }}>
                <Icon className="w-7 h-7" />
              </div>
              <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${exam.color}12`, color: exam.color }}>
                {exam.category}
              </span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">{exam.name}</h1>
          </Reveal>
          <Reveal direction="up" delay={160}>
            <p className="text-lg text-gray-600 max-w-3xl mb-8">{exam.description}</p>
          </Reveal>
          <Reveal direction="up" delay={240}>
            <MagneticButton>
              <a href="/#book-session" className="inline-flex items-center gap-2 bg-brand-purple text-white font-bold py-3.5 px-8 rounded-xl hover:bg-brand-purple-dark transition-all shadow-lg shadow-brand-purple/20 text-sm">
                {exam.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </a>
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Highlights" title={<>What you get in <span style={{ color: exam.color }}>{exam.shortName}</span> coaching</>} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {exam.highlights.map((item, idx) => (
              <Reveal key={idx} direction="up" delay={idx * 60}>
                <div className="flex items-start gap-3 p-5 rounded-2xl bg-surface-secondary border border-gray-100">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: exam.color }} />
                  <p className="text-gray-700 text-sm font-medium">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Pattern & Details */}
      <section className="py-16 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Reveal direction="left">
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Exam Pattern</h3>
                <div className="space-y-4">
                  {Object.entries(exam.examPattern).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start gap-4 pb-3 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-500 capitalize font-medium">{key}</span>
                      <span className="text-sm text-gray-900 font-semibold text-right">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500"><span className="font-semibold text-gray-700">Subjects:</span> {exam.subjects.join(', ')}</p>
                  <p className="text-sm text-gray-500 mt-2"><span className="font-semibold text-gray-700">Eligibility:</span> {exam.eligibility}</p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Preparation Tips</h3>
                <div className="space-y-4">
                  {exam.preparationTips.map((tip, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: exam.color }}>
                        {idx + 1}
                      </span>
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Ready to start your {exam.shortName} journey?</h2>
            <p className="text-gray-600 mb-8">Book a free session with our mentors and get a personalised study plan.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton>
                <a href="/#book-session" className="inline-flex items-center gap-2 bg-brand-purple text-white font-bold py-3.5 px-8 rounded-xl hover:bg-brand-purple-dark transition-all shadow-lg shadow-brand-purple/20 text-sm">
                  {exam.ctaLabel} <ArrowRight className="w-4 h-4" />
                </a>
              </MagneticButton>
              <Link to="/competitive-exams" className="inline-flex items-center gap-2 text-gray-600 font-semibold py-3.5 px-6 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm">
                View All Exams
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
