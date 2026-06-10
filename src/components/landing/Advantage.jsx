import { CheckCircle } from 'lucide-react';
import SectionHeader from '../SectionHeader';
import Reveal from '../Reveal';

const points = [
  { title: 'Personalised Learning Paths', description: 'Every student gets a study plan tailored to their pace, strengths, and target exam.' },
  { title: 'Expert Mentors', description: 'Learn from educators and industry professionals with proven track records.' },
  { title: 'Exam-Grade Mock Tests', description: 'Practice with tests that mirror real exam patterns, timing, and difficulty levels.' },
  { title: 'One-on-One Doubt Resolution', description: 'Never stay stuck — get your doubts resolved by dedicated mentors.' },
  { title: 'Comprehensive Study Material', description: 'Curated notes, practice sets, and video lessons designed by subject experts.' },
  { title: 'Progress Analytics', description: 'Track your improvement with detailed performance reports and weak-area identification.' }
];

export default function Advantage() {
  return (
    <section className="py-20 bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              badge="Why Instructis"
              title={<>Built for learners who <span className="gradient-text-purple">mean business</span></>}
              subtitle="We don't just deliver content — we build learning systems that produce results."
              align="left"
            />

            <div className="space-y-5">
              {points.map((point, idx) => (
                <Reveal key={idx} direction="left" delay={idx * 60}>
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-brand-purple flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-0.5">{point.title}</h4>
                      <p className="text-sm text-gray-600">{point.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal direction="scale">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-orange rounded-3xl transform rotate-2 opacity-15" />
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students learning together in a modern classroom"
                width="800"
                height="500"
                loading="lazy"
                decoding="async"
                className="rounded-3xl shadow-elevated relative z-10 w-full object-cover h-[460px]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
