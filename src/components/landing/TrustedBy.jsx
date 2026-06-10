import SectionHeader from '../SectionHeader';
import AnimatedCounter from '../AnimatedCounter';
import Reveal from '../Reveal';

const stats = [
  { value: 50, suffix: 'K+', label: 'Students Enrolled' },
  { value: 1700, suffix: '+', label: 'Cities Worldwide' },
  { value: 10, suffix: '+', label: 'Competitive Exams' },
  { value: 500, suffix: '+', label: 'Hours of Content' }
];

export default function TrustedBy() {
  return (
    <section className="py-16 bg-white border-b border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Trusted by thousands"
          title={<>Empowering learners <span className="gradient-text-purple">across India</span></>}
          subtitle="Join a growing community of students who trust Instructis for their exam preparation and skill development."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <Reveal key={stat.label} direction="up" delay={idx * 100}>
              <div className="text-center p-6 rounded-2xl bg-surface-secondary hover:shadow-card transition-shadow duration-300">
                <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} delay={idx * 150} />
                </div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
