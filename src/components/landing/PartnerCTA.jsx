import { Link } from 'react-router-dom';
import { ArrowRight, Handshake, Users, BarChart3, Globe } from 'lucide-react';
import useSpotlightCursor from '../../hooks/useSpotlightCursor';
import MagneticButton from '../MagneticButton';
import Reveal from '../Reveal';

const benefits = [
  { icon: Globe, label: 'Reach 50K+ learners' },
  { icon: BarChart3, label: 'Revenue sharing' },
  { icon: Users, label: 'Co-branded programs' },
  { icon: Handshake, label: 'Dedicated support' }
];

export default function PartnerCTA() {
  const spotlightRef = useSpotlightCursor();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="scale">
          <div
            ref={spotlightRef}
            className="spotlight-cursor gradient-cta rounded-3xl p-10 md:p-14 lg:p-16 relative overflow-hidden"
          >
            {/* Decorative gradient orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-orange mb-4">
                  Partnership
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                  Partner with Instructis
                </h2>
                <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
                  Join India's fastest-growing EdTech platform. Whether you're an educator, institution, or technology company — let's build the future of learning together.
                </p>
                <MagneticButton>
                  <Link
                    to="/partner"
                    className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold py-3.5 px-8 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm"
                  >
                    Explore Partnership
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </MagneticButton>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={idx} className="glass-dark rounded-2xl p-5 text-center">
                      <Icon className="w-7 h-7 text-brand-purple-light mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-300">{benefit.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
