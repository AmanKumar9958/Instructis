import { Suspense, lazy } from 'react';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';

const Centers = lazy(() => import('../components/landing/Centers'));

export default function CentersPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://instructis.co.in/centers#webpage',
      url: 'https://instructis.co.in/centers',
      name: 'Instructis Centers | Offline Coaching Locations',
      description: 'Find Instructis coaching centers across India for competitive exams, AI/ML, coding, and more.',
      isPartOf: { '@id': 'https://instructis.co.in/#website' },
      about: { '@id': 'https://instructis.co.in/#organization' }
    }
  ];

  return (
    <main className="bg-white">
      <Seo
        title="Instructis Centers — Find a Location Near You"
        description="Discover Instructis offline coaching centers across India for competitive exams, AI/ML, coding programs, and career guidance."
        image="/og-image.svg"
        jsonLd={jsonLd}
      />

      <section className="gradient-mesh py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">Instructis Centers</h1>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl">
              Find an Instructis center near you. Get access to offline coaching, doubt sessions, and local mentor support for competitive exams and learning programs.
            </p>
          </Reveal>
        </div>
      </section>

      <Suspense fallback={
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="h-[400px] bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </section>
      }>
        <Centers />
      </Suspense>
    </main>
  );
}
