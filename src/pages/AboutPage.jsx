import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import About from '../components/landing/About';

export default function AboutPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://instructis.co.in/about#webpage',
      url: 'https://instructis.co.in/about',
      name: 'About Instructis',
      description: 'Learn about Instructis — a comprehensive learning platform for competitive exams, AI/ML, coding, and career paths.',
      isPartOf: { '@id': 'https://instructis.co.in/#website' },
      about: { '@id': 'https://instructis.co.in/#organization' }
    }
  ];

  return (
    <main className="bg-white">
      <Seo
        title="About Instructis"
        description="Instructis is a comprehensive learning platform for competitive exams, AI & Machine Learning, coding, and career-oriented paths with expert mentors."
        image="/og-image.svg"
        jsonLd={jsonLd}
      />

      <section className="gradient-mesh py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900">About Instructis</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl">
            Instructis empowers learners with personalised programs, expert mentoring, and structured
            preparation for competitive exams, AI & Machine Learning, coding, and career development.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-gray-600">
            <Link to="/competitive-exams" className="hover:text-brand-purple transition-colors">Competitive exams</Link>
            <Link to="/ai-ml" className="hover:text-brand-purple transition-colors">AI & ML</Link>
            <Link to="/coding" className="hover:text-brand-purple transition-colors">Coding</Link>
            <Link to="/partner" className="hover:text-brand-purple transition-colors">Partner with us</Link>
            <Link to="/centers" className="hover:text-brand-purple transition-colors">Find centers</Link>
          </div>
        </div>
      </section>

      <About />
    </main>
  );
}
