import { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFriendlyErrorMessage } from '../../utils/errors';
import useParallax from '../../hooks/useParallax';
import useSpotlightCursor from '../../hooks/useSpotlightCursor';
import useReducedMotion from '../../hooks/useReducedMotion';
import MagneticButton from '../MagneticButton';
import AnimatedCounter from '../AnimatedCounter';
import { Calculator, Stethoscope, Brain, Code, Award, Landmark, TrendingUp, Cpu } from 'lucide-react';

const examBadges = ['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'SSC', 'CLAT', 'NDA'];
const orbitIcons = [Calculator, Stethoscope, Brain, Code, Award, Landmark, TrendingUp, Cpu];

export default function Hero() {
  const [formData, setFormData] = useState({ fullName: '', mobile: '', grade: '', targetExam: '' });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeBadge, setActiveBadge] = useState(0);
  const spotlightRef = useSpotlightCursor();
  const parallax = useParallax(15);
  const reducedMotion = useReducedMotion();

  // Rotate exam badges
  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => {
      setActiveBadge((prev) => (prev + 1) % examBadges.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch("https://formsubmit.co/ajax/info@codewithaman.tech", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: "New Student Booking Request!",
          Name: formData.fullName,
          Mobile: formData.mobile,
          Grade: formData.grade,
          "Target Exam": formData.targetExam
        })
      });
      if (!response.ok) throw new Error("Failed to send email");
      const bookingsRef = collection(db, 'bookings');
      await addDoc(bookingsRef, { ...formData, createdAt: serverTimestamp() });
      setStatus('success');
      setFormData({ fullName: '', mobile: '', grade: '', targetExam: '' });
    } catch (error) {
      console.error(error);
      setErrorMessage(getFriendlyErrorMessage(error));
      setStatus('error');
    }
  };

  return (
    <section
      ref={spotlightRef}
      id="home"
      className="spotlight-cursor relative min-h-[calc(100vh-4rem)] overflow-hidden"
    >
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 gradient-mesh animate-mesh" />

      {/* Floating decorative orbs — GPU accelerated */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[10%] left-[8%] w-72 h-72 rounded-full bg-brand-purple/[0.07] blur-3xl gpu-accelerated"
          style={{ transform: `translate(${parallax.x * 0.5}px, ${parallax.y * 0.5}px)` }}
        />
        <div
          className="absolute bottom-[15%] right-[5%] w-96 h-96 rounded-full bg-brand-orange/[0.05] blur-3xl gpu-accelerated"
          style={{ transform: `translate(${parallax.x * -0.3}px, ${parallax.y * -0.3}px)` }}
        />
        <div
          className="absolute top-[60%] left-[50%] w-64 h-64 rounded-full bg-accent-indigo/[0.04] blur-3xl gpu-accelerated"
          style={{ transform: `translate(${parallax.x * 0.4}px, ${parallax.y * 0.4}px)` }}
        />
      </div>

      {/* Orbiting icons */}
      {!reducedMotion && (
        <div className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
          {orbitIcons.map((Icon, idx) => (
            <div
              key={idx}
              className="absolute animate-orbit"
              style={{
                '--orbit-radius': `${180 + idx * 20}px`,
                '--orbit-duration': `${25 + idx * 5}s`,
                animationDelay: `${idx * -3}s`,
                opacity: 0.15 + idx * 0.02
              }}
            >
              <Icon className="w-5 h-5 text-brand-purple" />
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Headlines + floating elements */}
          <div className="order-2 lg:order-1">
            {/* Rotating badge */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-purple bg-brand-light-purple px-4 py-2 rounded-full">
                <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-pulse" />
                Prepare for
                <span className="relative h-4 w-10 overflow-hidden inline-flex">
                  {examBadges.map((badge, idx) => (
                    <span
                      key={badge}
                      className="absolute inset-0 flex items-center transition-all duration-500"
                      style={{
                        opacity: activeBadge === idx ? 1 : 0,
                        transform: activeBadge === idx ? 'translateY(0)' : 'translateY(8px)'
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </span>
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
              Master Any Exam.{' '}
              <br className="hidden md:block" />
              <span className="gradient-text-purple">Learn Any Skill.</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Comprehensive programs for competitive exams, AI & Machine Learning, coding, and career-oriented paths. Learn from India's best mentors with personalised learning journeys.
            </p>

            {/* Animated stats */}
            <div className="flex flex-wrap gap-8 mb-8">
              <div>
                <div className="text-2xl font-black text-gray-900">
                  <AnimatedCounter value={50} suffix="K+" duration={2} />
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Students</p>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">
                  <AnimatedCounter value={10} suffix="+" duration={1.5} delay={0.2} />
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Exams</p>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">
                  <AnimatedCounter value={94} suffix="%" duration={2} delay={0.4} />
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Success Rate</p>
              </div>
            </div>

            {/* Floating cards */}
            <div className="hidden lg:flex gap-3">
              {[
                { label: 'JEE Advanced', color: '#FF6C37' },
                { label: 'NEET UG', color: '#3B82F6' },
                { label: 'AI/ML', color: '#8134AF' },
                { label: 'DSA', color: '#10B981' }
              ].map((card, idx) => (
                <div
                  key={card.label}
                  className={`glass-card px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 shadow-sm ${!reducedMotion ? (idx % 2 === 0 ? 'animate-float' : 'animate-float-delayed') : ''}`}
                  style={{ animationDelay: `${idx * 0.5}s` }}
                >
                  <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: card.color }} />
                  {card.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Lead form */}
          <div className="order-1 lg:order-2">
            <div id="book-session" className="bg-white rounded-3xl shadow-elevated p-8 lg:p-10 max-w-lg mx-auto w-full relative">
              {/* Glow behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple/10 to-brand-orange/10 rounded-[28px] blur-xl -z-10" />

              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 text-center">Book a Free Session</h3>

              {status === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl">✓</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Request Received!</h4>
                  <p className="text-gray-600 text-sm">We'll contact you shortly to schedule your session.</p>
                  <button onClick={() => setStatus('idle')} className="mt-4 text-brand-purple font-semibold hover:underline text-sm">
                    Book another session
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {status === 'error' && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100 font-medium">
                      {errorMessage}
                    </div>
                  )}
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Full Name"
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 transition-all text-base" />
                  <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} placeholder="Mobile Number"
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 transition-all text-base" />
                  <select name="grade" required value={formData.grade} onChange={handleChange}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 text-gray-500 transition-all text-base">
                    <option value="">Select Grade</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                    <option value="dropper">Dropper</option>
                    <option value="graduate">Graduate</option>
                    <option value="professional">Working Professional</option>
                  </select>
                  <select name="targetExam" required value={formData.targetExam} onChange={handleChange}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 text-gray-500 transition-all text-base">
                    <option value="">Select Program</option>
                    <option value="jee">JEE Main & Advanced</option>
                    <option value="neet">NEET UG</option>
                    <option value="upsc">UPSC Civil Services</option>
                    <option value="cat">CAT</option>
                    <option value="gate">GATE</option>
                    <option value="ssc">SSC</option>
                    <option value="banking">Banking</option>
                    <option value="ai-ml">AI & Machine Learning</option>
                    <option value="coding">Coding & Programming</option>
                    <option value="boards">Board Exams</option>
                  </select>
                  <MagneticButton className="w-full">
                    <button type="submit" disabled={status === 'loading'}
                      className={`w-full text-white font-bold py-4 rounded-xl transition-all text-base shadow-md ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-orange hover:bg-brand-orange-dark hover:shadow-lg hover:shadow-brand-orange/20'}`}>
                      {status === 'loading' ? 'Sending...' : 'Schedule a Free Demo'}
                    </button>
                  </MagneticButton>
                </form>
              )}
              <p className="text-[10px] text-center text-gray-400 mt-4">
                By registering, you agree to our Terms & Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
