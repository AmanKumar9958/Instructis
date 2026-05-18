import { Suspense, lazy } from 'react';
import Hero from '../components/landing/Hero';
import Programs from '../components/landing/Programs';
import Advantage from '../components/landing/Advantage';
import About from '../components/landing/About';
import Seo from '../components/Seo';

const Centers = lazy(() => import('../components/landing/Centers'));
const Testimonials = lazy(() => import('../components/landing/Testimonials'));

const SectionFallback = ({ title, description }) => (
  <section className="py-16 bg-white">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-600 mt-3">{description}</p>
    </div>
  </section>
);

export default function LandingPage() {
  const organizationId = 'https://instructis.co.in/#organization';
  const websiteId = 'https://instructis.co.in/#website';
  const landingJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      '@id': organizationId,
      name: 'Instructis',
      url: 'https://instructis.co.in/',
      description: 'Personalised learning programs for Class 11-12, JEE and NEET with expert teachers and doubt sessions.',
      telephone: '+91 7093858372',
      email: 'contact@instructis.co.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Zebrold Tech Park, Plot no.13, Software units layout, Madhapur',
        addressLocality: 'Hyderabad',
        addressRegion: 'Telangana',
        postalCode: '500081',
        addressCountry: 'IN'
      },
      areaServed: 'IN'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': websiteId,
      url: 'https://instructis.co.in/',
      name: 'Instructis',
      publisher: { '@id': organizationId }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://instructis.co.in/#homepage',
      url: 'https://instructis.co.in/',
      name: 'Instructis | JEE, NEET and board exam coaching',
      description: 'JEE, NEET, and board exam coaching with expert teachers, structured programs, and test series for Class 11-12 students.',
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': 'https://instructis.co.in/jee#course',
      name: 'JEE Coaching (Main & Advanced)',
      description: 'JEE coaching with mentor-led doubt sessions, mock tests, and structured preparation for JEE Main and Advanced.',
      educationalLevel: 'Class 11, Class 12',
      provider: { '@id': organizationId }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': 'https://instructis.co.in/neet#course',
      name: 'NEET Coaching (UG)',
      description: 'NEET UG coaching with NCERT-first learning, exam-grade mocks, and personal mentoring.',
      educationalLevel: 'Class 11, Class 12',
      provider: { '@id': organizationId }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': 'https://instructis.co.in/#boards-course',
      name: 'Class 11 & 12 Board Exam Coaching',
      description: 'Board exam coaching with chapter-wise tests, revision support, and concept clarity for Class 11 and 12.',
      educationalLevel: 'Class 11, Class 12',
      provider: { '@id': organizationId }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': 'https://instructis.co.in/#doubt-sessions',
      name: 'Doubt Sessions',
      description: 'Live doubt sessions with expert teachers for JEE, NEET, and board exam preparation.',
      provider: { '@id': organizationId },
      areaServed: 'IN'
    }
  ];

  return (
    <>
      <Seo
        title="JEE, NEET and board exam coaching"
        description="Personalised learning programs for Class 11-12 students with expert teachers, doubt sessions, and test series for JEE and NEET preparation."
        image="/og-image.svg"
        jsonLd={landingJsonLd}
      />
      <Hero />
      <Programs />
      <Suspense
        fallback={
          <SectionFallback
            title="Find Instructis centers"
            description="Discover our JEE and NEET coaching centers across India with local mentor support."
          />
        }
      >
        <Centers />
      </Suspense>
      <Advantage />
      <Suspense
        fallback={
          <SectionFallback
            title="Loved by students and parents"
            description="See why learners trust Instructis for JEE, NEET, and board exam coaching."
          />
        }
      >
        <Testimonials />
      </Suspense>
      <About />
    </>
  );
}
