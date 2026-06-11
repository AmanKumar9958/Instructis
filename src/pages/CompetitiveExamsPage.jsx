import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import SectionHeader from '../components/SectionHeader';
import ExamCard from '../components/ExamCard';
import Reveal from '../components/Reveal';
import examData, { getExamCategories, getExamsByCategory } from '../data/examData';

export default function CompetitiveExamsPage() {
  const categories = ['All', ...getExamCategories()];
  const [activeCategory, setActiveCategory] = useState('All');
  const filteredExams = getExamsByCategory(activeCategory);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Competitive Exams Preparation Programs',
      description: "Explore comprehensive preparation programs for India's top competitive exams — JEE, NEET, UPSC, SSC, CAT, GATE, CUET, CLAT, NDA.",
      itemListElement: examData.map((exam, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Course',
          '@id': `https://instructis.co.in/competitive-exams/${exam.slug}#course`,
          name: exam.name,
          description: exam.description,
          url: `https://instructis.co.in/competitive-exams/${exam.slug}`,
          provider: {
            '@type': 'EducationalOrganization',
            '@id': 'https://instructis.co.in/#organization',
            name: 'Instructis',
            url: 'https://instructis.co.in/'
          }
        }
      }))
    }
  ];

  return (
    <main className="bg-white">
      <Seo
        title="Competitive Exams — JEE, NEET, UPSC, CAT, GATE & More"
        description="Explore comprehensive preparation programs for India's top competitive exams — JEE, NEET, UPSC, SSC, CAT, GATE, CUET, CLAT, NDA. Expert mentors and structured coaching."
        image="/og-image.svg"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="gradient-mesh py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-purple bg-brand-light-purple px-4 py-1.5 rounded-full mb-4">
              All Exams
            </span>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-4">
              Competitive <span className="gradient-text-purple">Exams</span>
            </h1>
          </Reveal>
          <Reveal direction="up" delay={160}>
            <p className="text-lg text-gray-600 max-w-2xl mb-8">
              Expert-led preparation programs for India's most competitive examinations. Choose your exam and start your journey with structured coaching, mock tests, and personalised mentoring.
            </p>
          </Reveal>

          {/* Category filters */}
          <Reveal direction="up" delay={240}>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Exam Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExams.map((exam, idx) => (
              <Reveal key={exam.id} direction="up" delay={idx * 60}>
                <ExamCard exam={exam} />
              </Reveal>
            ))}
          </div>

          {filteredExams.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg font-medium">No exams found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
