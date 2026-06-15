import { useState } from 'react';
import { ArrowRight, Handshake, Globe, BarChart3, Users, Zap, Lightbulb, Building2, Cpu } from 'lucide-react';
import { db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFriendlyErrorMessage } from '../utils/errors';
import Seo from '../components/Seo';
import SectionHeader from '../components/SectionHeader';
import FAQAccordion from '../components/FAQAccordion';
import MagneticButton from '../components/MagneticButton';
import Reveal from '../components/Reveal';
import useSpotlightCursor from '../hooks/useSpotlightCursor';
import faqData from '../data/faqData';

const benefits = [
  { icon: Globe, title: 'Reach & Distribution', description: 'Access our growing community of 50K+ learners across 1700+ cities in India.' },
  { icon: Zap, title: 'Technology Platform', description: 'Leverage our EdTech infrastructure for content delivery, assessments, and analytics.' },
  { icon: BarChart3, title: 'Revenue Growth', description: 'Transparent revenue-sharing models designed for sustainable mutual growth.' },
  { icon: Users, title: 'Dedicated Support', description: 'A dedicated partnerships team to ensure smooth collaboration and scaling.' }
];

const models = [
  { icon: Lightbulb, title: 'Content Partner', description: 'Create courses, study materials, or video content for our platform. Ideal for educators and subject matter experts.' },
  { icon: Building2, title: 'Institute Partner', description: 'Integrate Instructis programs into your coaching center. Access our tech, content, and assessment tools.' },
  { icon: Users, title: 'Corporate Partner', description: 'Offer upskilling programs to your employees through customised learning paths and certifications.' },
  { icon: Cpu, title: 'Technology Partner', description: 'Build EdTech solutions together. Integrate your tools and services with our platform ecosystem.' }
];

const steps = [
  { step: 1, title: 'Apply', description: 'Fill out the partnership form with your details and collaboration interest.' },
  { step: 2, title: 'Discussion', description: 'Our team reviews your application and schedules a call to explore synergies.' },
  { step: 3, title: 'Agreement', description: 'We finalize partnership terms, deliverables, and timelines together.' },
  { step: 4, title: 'Launch', description: 'Go live with your partnership — start creating impact and growing together.' }
];

export default function PartnerPage() {
  const spotlightRef = useSpotlightCursor();
  const [formData, setFormData] = useState({ name: '', organization: '', email: '', phone: '', partnershipType: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch("https://formsubmit.co/ajax/info@codewithaman.tech", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ _subject: "New Partnership Inquiry!", ...formData })
      });
      await addDoc(collection(db, 'partnerships'), { ...formData, createdAt: serverTimestamp() });
      setStatus('success');
      setFormData({ name: '', organization: '', email: '', phone: '', partnershipType: '', message: '' });
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error));
      setStatus('error');
    }
  };
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://instructis.co.in/partner#webpage',
      url: 'https://instructis.co.in/partner',
      name: 'Partner With Us | Instructis',
      description: "Partner with Instructis — India's growing EdTech platform. Content, institute, corporate, and technology partnership opportunities.",
      isPartOf: { '@id': 'https://instructis.co.in/#website' },
      about: { '@id': 'https://instructis.co.in/#organization' }
    }
  ];

  return (
    <main className="bg-white">
      <Seo
        title="Partner With Us"
        description="Partner with Instructis — India's growing EdTech platform. Content, institute, corporate, and technology partnership opportunities."
        image="/og-image.svg"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section ref={spotlightRef} className="spotlight-cursor gradient-cta py-16 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal direction="up">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-orange mb-4">Partnership</span>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Partner with <span className="text-brand-purple-light">Instructis</span>
            </h1>
          </Reveal>
          <Reveal direction="up" delay={160}>
            <p className="text-lg text-gray-300 max-w-2xl mb-8">
              Join India's fastest-growing EdTech platform. Whether you're an educator, institution, or technology company — let's build the future of learning together.
            </p>
          </Reveal>
          <Reveal direction="up" delay={240}>
            <MagneticButton>
              <a href="#partner-form" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold py-3.5 px-8 rounded-xl hover:shadow-xl transition-all text-sm">
                Get Started <ArrowRight className="w-4 h-4" />
              </a>
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Benefits" title={<>Why partner with <span className="gradient-text-purple">Instructis</span></>} subtitle="We offer the platform, reach, and support to help you grow." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <Reveal key={idx} direction="up" delay={idx * 80}>
                  <div className="p-6 rounded-2xl bg-brand-light-purple/30 border border-purple-100/50 flex gap-5">
                    <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{b.title}</h4>
                      <p className="text-sm text-gray-600">{b.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Collaboration Models */}
      <section className="py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Models" title={<>Collaboration <span className="gradient-text-purple">models</span></>} subtitle="Choose the partnership model that fits your goals." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {models.map((m, idx) => {
              const Icon = m.icon;
              return (
                <Reveal key={idx} direction="up" delay={idx * 80}>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-card transition-shadow duration-300">
                    <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{m.title}</h4>
                    <p className="text-sm text-gray-600">{m.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners & Integrations */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Partners"
            title={<>More partners and integrations than <span className="gradient-text-purple">any other</span> edtech company</>}
            subtitle="And not just any partners and integrations. The best in the business."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'AWS', sub: 'Amazon Web Services', color: '#FF9900', bg: '#FFF8F0' },
              { name: 'Google', sub: 'for Education', color: '#4285F4', bg: '#F0F5FF' },
              { name: 'Cidilabs', sub: 'EdTech Tools', color: '#2ECC71', bg: '#F0FDF4' },
              { name: 'Turnitin', sub: 'Integrity Solutions', color: '#1F4E79', bg: '#F0F4FA' },
              { name: 'Inspera', sub: 'Assessment Platform', color: '#E74C3C', bg: '#FFF0F0' },
              { name: 'Lincoln Learning', sub: 'K-12 Solutions', color: '#2C3E8F', bg: '#F0F1FA' },
              { name: 'BigBlueButton', sub: 'Virtual Classrooms', color: '#283593', bg: '#F0F1FA' },
              { name: 'Poll Everywhere', sub: 'Live Engagement', color: '#5C6BC0', bg: '#F3F2FF' },
              { name: 'FeedbackFruits', sub: 'Peer Learning', color: '#FF6D00', bg: '#FFF5EC' },
              { name: 'Atomic Jolt', sub: 'LMS Integration', color: '#7CB342', bg: '#F5FAF0' },
              { name: 'DREAM', sub: 'Research & Analytics', color: '#00838F', bg: '#F0FAFB' },
              { name: 'Copyleaks', sub: 'Plagiarism Detection', color: '#1565C0', bg: '#F0F5FF' },
            ].map((partner, idx) => (
              <Reveal key={partner.name} direction="up" delay={idx * 50}>
                <div
                  className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-default min-h-[110px]"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors duration-300"
                    style={{ background: partner.bg }}>
                    <span className="text-lg font-black" style={{ color: partner.color }}>
                      {partner.name.charAt(0)}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-gray-900 text-center leading-tight">
                    {partner.name}
                  </h5>
                  <p className="text-[10px] text-gray-400 font-medium text-center mt-0.5">
                    {partner.sub}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal direction="up" delay={300}>
            <p className="text-center text-sm text-gray-400 mt-8">
              ...and many more world-class technology &amp; education partners
            </p>
          </Reveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Process" title={<>How it <span className="gradient-text-purple">works</span></>} />
          <div className="relative">
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-8">
              {steps.map((s, idx) => (
                <Reveal key={idx} direction="up" delay={idx * 100}>
                  <div className="relative flex gap-6 md:gap-8">
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-brand-purple flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {s.step}
                    </div>
                    <div className="flex-1 pb-2">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{s.title}</h3>
                      <p className="text-sm text-gray-600">{s.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Form */}
      <section id="partner-form" className="py-20 bg-surface-secondary">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Get Started" title={<>Partnership <span className="gradient-text-purple">inquiry</span></>} subtitle="Fill out the form below and our team will get back to you within 48 hours." />

          {status === 'success' ? (
            <Reveal direction="up">
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Inquiry Received!</h4>
                <p className="text-gray-600">Our partnerships team will review your application and reach out within 48 hours.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-brand-purple font-semibold hover:underline text-sm">Submit another inquiry</button>
              </div>
            </Reveal>
          ) : (
            <Reveal direction="up">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-card space-y-4">
                {status === 'error' && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100 font-medium">{errorMessage}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Your Name" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 text-sm" />
                  <input type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Organization (optional)" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 text-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 text-sm" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 text-sm" />
                </div>
                <select name="partnershipType" required value={formData.partnershipType} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 text-gray-500 text-sm">
                  <option value="">Select Partnership Type</option>
                  <option value="content">Content Partner</option>
                  <option value="institute">Institute Partner</option>
                  <option value="corporate">Corporate Partner</option>
                  <option value="technology">Technology Partner</option>
                </select>
                <textarea name="message" rows="4" value={formData.message} onChange={handleChange} placeholder="Tell us about your collaboration interest..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 text-sm resize-none" />
                <MagneticButton className="w-full">
                  <button type="submit" disabled={status === 'loading'} className={`w-full text-white font-bold py-3.5 rounded-xl transition-all text-sm ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-purple hover:bg-brand-purple-dark shadow-lg shadow-brand-purple/20'}`}>
                    {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </MagneticButton>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="FAQ" title={<>Partnership <span className="gradient-text-purple">questions</span></>} />
          <FAQAccordion items={faqData.partner} />
        </div>
      </section>
    </main>
  );
}
