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
      description: 'Learn about Instructis, an education platform for JEE, NEET, and board exam coaching.',
      isPartOf: { '@id': 'https://instructis.co.in/#website' },
      about: { '@id': 'https://instructis.co.in/#organization' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      '@id': 'https://instructis.co.in/#organization',
      name: 'Instructis',
      url: 'https://instructis.co.in/'
    }
  ];

  return (
    <main className="bg-white">
      <Seo
        title="About Instructis"
        description="Instructis is an education platform for JEE, NEET, and Class 11-12 board exam coaching with expert mentors."
        image="/og-image.svg"
        jsonLd={jsonLd}
      />

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900">About Instructis</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl">
            Instructis empowers students with personalised learning programs, expert mentoring, and structured
            preparation for JEE, NEET, and board exams. We combine technology with human guidance to make learning
            consistent, confident, and measurable.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-gray-600">
            <Link to="/jee" className="hover:text-brand-purple">JEE coaching</Link>
            <Link to="/neet" className="hover:text-brand-purple">NEET coaching</Link>
            <Link to="/centers" className="hover:text-brand-purple">Find centers</Link>
            <a href="/#book-session" className="hover:text-brand-purple">Book a doubt session</a>
          </div>
        </div>
      </section>

      <About />
    </main>
  );
}
