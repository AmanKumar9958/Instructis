import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Centers from '../components/landing/Centers';

export default function CentersPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://instructis.co.in/centers#webpage',
      url: 'https://instructis.co.in/centers',
      name: 'Instructis Centers | Pan-India Coaching Hubs',
      description: 'Find Instructis coaching centers across India for JEE, NEET, and board exam preparation.',
      isPartOf: { '@id': 'https://instructis.co.in/#website' },
      about: { '@id': 'https://instructis.co.in/#organization' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': 'https://instructis.co.in/centers#service',
      name: 'Offline Coaching Centers',
      description: 'Pan-India coaching centers with mentor support, doubt sessions, and exam preparation guidance.',
      provider: { '@id': 'https://instructis.co.in/#organization' },
      areaServed: 'IN'
    }
  ];

  return (
    <main className="bg-white">
      <Seo
        title="Instructis Coaching Centers"
        description="Find Instructis coaching centers across India for JEE, NEET, and Class 11-12 board exam preparation."
        image="/og-image.svg"
        jsonLd={jsonLd}
      />

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900">Instructis Centers Across India</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl">
            Visit an Instructis coaching center near you for JEE and NEET preparation, doubt sessions, and
            mentor-led support. Select your state to explore our pan-India presence.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-gray-600">
            <Link to="/jee" className="hover:text-brand-purple">JEE coaching</Link>
            <Link to="/neet" className="hover:text-brand-purple">NEET coaching</Link>
            <Link to="/about" className="hover:text-brand-purple">About Instructis</Link>
          </div>
        </div>
      </section>

      <Centers />
    </main>
  );
}
