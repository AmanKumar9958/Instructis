import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NeetPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://instructis.co.in/neet#webpage',
      url: 'https://instructis.co.in/neet',
      name: 'NEET Coaching | Instructis',
      description: 'NEET UG coaching with NCERT-first learning, mock tests, and mentor-led doubt sessions.',
      isPartOf: { '@id': 'https://instructis.co.in/#website' },
      about: { '@id': 'https://instructis.co.in/#organization' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': 'https://instructis.co.in/neet#course',
      name: 'NEET Coaching (UG)',
      description: 'NEET coaching with Biology, Physics, and Chemistry mastery, NCERT revision, and exam-style mocks.',
      educationalLevel: 'Class 11, Class 12',
      provider: { '@id': 'https://instructis.co.in/#organization' }
    }
  ];

  return (
    <main className="bg-white">
      <Seo
        title="NEET Coaching for NEET UG"
        description="NEET coaching with expert teachers, NCERT-first study, doubt sessions, and mock tests for Class 11 and 12 students."
        image="/og-image.svg"
        jsonLd={jsonLd}
      />

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900">NEET Coaching for NEET UG</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl">
            Crack NEET UG with a study plan that prioritises NCERT, concept clarity, and consistent practice.
            Instructis NEET coaching covers Biology, Physics, and Chemistry with smart revision and exam-grade tests.
          </p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="rounded-3xl border border-blue-100 bg-blue-50/40 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">NEET preparation highlights</h2>
              <ul className="text-gray-600 space-y-2">
                <li>NCERT-focused notes with daily practice</li>
                <li>Topic-wise tests and full-length mock exams</li>
                <li>Personal mentoring to improve accuracy</li>
                <li>Revision sprints before exam season</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Build confidence for NEET</h2>
              <p className="text-gray-600">
                Our NEET study program helps students stay on track with weekly milestones, doubt resolution,
                and feedback on every mock test. Prepare smarter with a plan built for the NEET UG syllabus.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <a href="/#book-session" className="font-semibold text-brand-purple hover:underline">Book a free NEET doubt session</a>
                <Link to="/centers" className="font-semibold text-brand-orange hover:underline">Find a NEET center</Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 text-sm font-semibold text-gray-600">
            <Link to="/jee" className="hover:text-brand-purple">Explore JEE coaching</Link>
            <Link to="/about" className="hover:text-brand-purple">Learn about Instructis</Link>
            <Link to="/centers" className="hover:text-brand-purple">View all centers</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
