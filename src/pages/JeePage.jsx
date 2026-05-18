import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function JeePage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://instructis.co.in/jee#webpage',
      url: 'https://instructis.co.in/jee',
      name: 'JEE Coaching | Instructis',
      description: 'JEE coaching for Main and Advanced with mentor-led doubt sessions, mock tests, and structured preparation.',
      isPartOf: { '@id': 'https://instructis.co.in/#website' },
      about: { '@id': 'https://instructis.co.in/#organization' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': 'https://instructis.co.in/jee#course',
      name: 'JEE Coaching (Main & Advanced)',
      description: 'Concept-first JEE coaching with mock tests, practice sheets, and personal mentoring for Class 11 and 12.',
      educationalLevel: 'Class 11, Class 12',
      provider: { '@id': 'https://instructis.co.in/#organization' }
    }
  ];

  return (
    <main className="bg-white">
      <Seo
        title="JEE Coaching for Main & Advanced"
        description="JEE coaching with expert teachers, mock tests, and doubt sessions for Class 11 and 12 students preparing for JEE Main and Advanced."
        image="/og-image.svg"
        jsonLd={jsonLd}
      />

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900">JEE Coaching for Main & Advanced</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl">
            Instructis helps you crack JEE Main and JEE Advanced with structured learning paths, daily practice,
            and mentor-led doubt sessions. Build strong fundamentals in Physics, Chemistry, and Mathematics with
            expert faculty and exam-grade problem solving.
          </p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="rounded-3xl border border-orange-100 bg-orange-50/40 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">What you get in JEE coaching</h2>
              <ul className="text-gray-600 space-y-2">
                <li>Concept clarity with chapter-wise practice sets</li>
                <li>Full-length mock tests aligned with JEE patterns</li>
                <li>Personalised study plans for Class 11 and 12</li>
                <li>Mentor support to fix weak topics and speed</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Prepare smarter, not harder</h2>
              <p className="text-gray-600">
                Our JEE preparation combines targeted worksheets, analytics, and one-to-one feedback so students
                stay consistent and confident throughout the year. Whether you are starting early or revising,
                we tailor your plan for measurable progress.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <a href="/#book-session" className="font-semibold text-brand-purple hover:underline">Book a free JEE doubt session</a>
                <Link to="/centers" className="font-semibold text-brand-orange hover:underline">Find a JEE center</Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 text-sm font-semibold text-gray-600">
            <Link to="/neet" className="hover:text-brand-purple">Explore NEET coaching</Link>
            <Link to="/about" className="hover:text-brand-purple">Learn about Instructis</Link>
            <Link to="/centers" className="hover:text-brand-purple">View all centers</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
