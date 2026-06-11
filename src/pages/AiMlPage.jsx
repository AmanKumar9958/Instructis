import { Brain, ArrowRight } from 'lucide-react';
import Seo from '../components/Seo';
import SectionHeader from '../components/SectionHeader';
import LearningRoadmap from '../components/LearningRoadmap';
import AnimatedCounter from '../components/AnimatedCounter';
import FAQAccordion from '../components/FAQAccordion';
import MagneticButton from '../components/MagneticButton';
import Reveal from '../components/Reveal';
import { aiMlRoadmap, aiMlCourses, aiMlBenefits, aiMlCareerStats } from '../data/aiMlData';
import faqData from '../data/faqData';

export default function AiMlPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://instructis.co.in/ai-ml#webpage',
      url: 'https://instructis.co.in/ai-ml',
      name: 'AI & Machine Learning Programs',
      description: 'Master AI and Machine Learning from foundations to deployment. Project-based learning with expert mentors.',
      isPartOf: { '@id': 'https://instructis.co.in/#website' },
      about: { '@id': 'https://instructis.co.in/#organization' }
    },
    ...aiMlCourses.map((course, idx) => ({
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': `https://instructis.co.in/ai-ml#course-${idx}`,
      name: course.title,
      description: course.description,
      provider: { '@id': 'https://instructis.co.in/#organization' },
      educationalLevel: course.level
    }))
  ];

  return (
    <main className="bg-white">
      <Seo
        title="AI & Machine Learning Programs"
        description="Master AI and Machine Learning from foundations to deployment. Project-based learning with expert mentors, industry-aligned curriculum, and career support."
        image="/og-image.svg"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="gradient-mesh py-16 md:py-20 relative overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[5%] w-48 h-48 bg-brand-purple/8 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal direction="up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center text-white">
                <Brain className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent-blue bg-blue-50 px-3 py-1.5 rounded-full">AI & Machine Learning</span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-4">
              Master <span className="gradient-text-blue">AI & Machine Learning</span>
            </h1>
          </Reveal>
          <Reveal direction="up" delay={160}>
            <p className="text-lg text-gray-600 max-w-2xl mb-8">
              From mathematical foundations to production-ready ML systems — learn AI with hands-on projects, industry-expert mentors, and a curriculum designed for real-world impact.
            </p>
          </Reveal>
          <Reveal direction="up" delay={240}>
            <MagneticButton>
              <a href="/#book-session" className="inline-flex items-center gap-2 bg-accent-blue text-white font-bold py-3.5 px-8 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-accent-blue/20 text-sm">
                Start Learning <ArrowRight className="w-4 h-4" />
              </a>
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* Learning Roadmap */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Roadmap" title={<>Your learning <span className="gradient-text-blue">journey</span></>} subtitle="A structured path from foundations to production-ready AI — built by industry practitioners." />
          <LearningRoadmap stages={aiMlRoadmap} accentColor="#3B82F6" />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Courses" title={<>Featured <span className="gradient-text-blue">courses</span></>} subtitle="Dive deep into specific domains with focused, project-based courses." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiMlCourses.map((course, idx) => (
              <Reveal key={idx} direction="up" delay={idx * 60}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent-blue bg-blue-50 px-2.5 py-1 rounded-full">{course.level}</span>
                    <span className="text-xs text-gray-500 font-medium">{course.duration}</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">{course.title}</h4>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">{course.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {course.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100">{tag}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Why Instructis" title={<>Learn AI/ML the <span className="gradient-text-blue">right way</span></>} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiMlBenefits.map((benefit, idx) => (
              <Reveal key={idx} direction="up" delay={idx * 80}>
                <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Career Stats */}
      <section className="py-16 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Careers" title={<>AI/ML career <span className="gradient-text-blue">opportunities</span></>} subtitle="The AI industry is booming — and so are the opportunities for skilled professionals." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {aiMlCareerStats.map((stat, idx) => (
              <Reveal key={stat.label} direction="up" delay={idx * 100}>
                <div className="text-center p-6 rounded-2xl bg-white border border-gray-100">
                  <div className="text-3xl font-black text-gray-900 mb-1">
                    <AnimatedCounter value={Number(stat.value)} suffix={stat.suffix} prefix={stat.prefix || ''} duration={2} delay={idx * 150} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Reveal direction="up">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Ready to start your AI journey?</h2>
            <p className="text-gray-600 mb-8">Book a free session to explore our AI & ML programs and find your perfect starting point.</p>
            <MagneticButton>
              <a href="/#book-session" className="inline-flex items-center gap-2 bg-accent-blue text-white font-bold py-3.5 px-8 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-accent-blue/20 text-sm">
                Book a Free Session <ArrowRight className="w-4 h-4" />
              </a>
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="FAQ" title={<>Common <span className="gradient-text-blue">questions</span></>} />
          <FAQAccordion items={faqData.aiMl} />
        </div>
      </section>
    </main>
  );
}
