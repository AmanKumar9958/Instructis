import { Suspense, lazy } from 'react';
import Hero from '../components/landing/Hero';
import TrustedBy from '../components/landing/TrustedBy';
import Programs from '../components/landing/Programs';
import PopularPaths from '../components/landing/PopularPaths';
import CompetitiveExamsPreview from '../components/landing/CompetitiveExamsPreview';
import Advantage from '../components/landing/Advantage';
import PartnerCTA from '../components/landing/PartnerCTA';
import About from '../components/landing/About';
import FAQSection from '../components/landing/FAQSection';
import Seo from '../components/Seo';

const Centers = lazy(() => import('../components/landing/Centers'));
const Testimonials = lazy(() => import('../components/landing/Testimonials'));

const SectionFallback = ({ title }) => (
  <section className="py-16 bg-white">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <div className="h-8 w-48 bg-gray-100 rounded-lg mx-auto animate-pulse" />
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
      description: 'Comprehensive learning platform for competitive exams, AI & Machine Learning, coding, and career paths.',
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
      name: 'Instructis | Learn, Compete, Excel',
      description: 'Comprehensive learning platform for competitive exams, AI, coding, and career paths with expert mentors.',
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId }
    }
  ];

  return (
    <>
      <Seo
        title="Learn, Compete, Excel — Competitive Exams, AI, Coding & More"
        description="Comprehensive learning platform for competitive exams (JEE, NEET, UPSC, CAT, GATE), AI & Machine Learning, Coding & Programming. Expert mentors and personalised learning paths."
        image="/og-image.svg"
        jsonLd={landingJsonLd}
      />
      <Hero />
      <TrustedBy />
      <Programs />
      <PopularPaths />
      <CompetitiveExamsPreview />
      <Advantage />
      <Suspense fallback={<SectionFallback title="Student Success" />}>
        <Testimonials />
      </Suspense>
      <PartnerCTA />
      <Suspense fallback={<SectionFallback title="Centers" />}>
        <Centers />
      </Suspense>
      <FAQSection />
      <About />
    </>
  );
}
