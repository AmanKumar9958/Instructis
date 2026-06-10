import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import ExamCard from '../ExamCard';
import Reveal from '../Reveal';
import examData, { getExamCategories, getExamsByCategory } from '../../data/examData';

export default function CompetitiveExamsPreview() {
  const categories = ['All', ...getExamCategories()];
  const [activeCategory, setActiveCategory] = useState('All');
  const filteredExams = getExamsByCategory(activeCategory).slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Competitive Exams"
          title={<>Prepare for <span className="gradient-text-purple">any exam</span></>}
          subtitle="Expert-led programs for India's most competitive examinations — structured, personalised, and results-driven."
        />

        {/* Category filter pills */}
        <Reveal direction="up">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Exam grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam, idx) => (
            <Reveal key={exam.id} direction="up" delay={idx * 80}>
              <ExamCard exam={exam} />
            </Reveal>
          ))}
        </div>

        {/* View all CTA */}
        <Reveal direction="up" delay={200}>
          <div className="text-center mt-10">
            <Link
              to="/competitive-exams"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-purple hover:gap-3 transition-all duration-300 bg-brand-light-purple px-6 py-3 rounded-full hover:shadow-md"
            >
              View all competitive exams
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
