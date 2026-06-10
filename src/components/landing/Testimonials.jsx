import { Star } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import useReducedMotion from '../../hooks/useReducedMotion';
import SectionHeader from '../SectionHeader';

const testimonials = [
  { quote: "Instructis is the best platform for my daughter to strengthen her Science basics.", author: "Mother of Devananda", grade: "Class 11 | Bangalore", bgColor: "bg-pink-50" },
  { quote: "My son understands Math and Physics better with Instructis.", author: "Father of Souradip", grade: "Class 12 | Kolkata", bgColor: "bg-orange-50" },
  { quote: "Instructis helped me understand JEE concepts through real-life examples.", author: "Suraj Peela", grade: "JEE Aspirant | Hyderabad", bgColor: "bg-blue-50" },
  { quote: "The mock tests feel exactly like the real NEET format. Highly recommend!", author: "Priya Sharma", grade: "NEET Aspirant | Delhi", bgColor: "bg-green-50" },
  { quote: "Her confidence in Mathematics has improved drastically over 3 months.", author: "Father of Riya", grade: "Class 11 | Mumbai", bgColor: "bg-yellow-50" },
  { quote: "Best faculty out there. They break down complex topics seamlessly.", author: "Aniket Verma", grade: "JEE Aspirant | Pune", bgColor: "bg-purple-50" },
  { quote: "The AI/ML curriculum is incredibly well-structured and project-oriented.", author: "Sneha Nair", grade: "B.Tech Student | Kochi", bgColor: "bg-pink-50" },
  { quote: "As a parent, I love the detailed progress reports provided every week.", author: "Mother of Aryan", grade: "JEE Aspirant | Jaipur", bgColor: "bg-blue-50" },
  { quote: "The DSA course helped me crack my dream company's interview.", author: "Rohit Das", grade: "Software Engineer | Guwahati", bgColor: "bg-orange-50" }
];

export default function Testimonials() {
  const trackRef = useRef(null);
  const timelineRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Duplicate items for seamless loop
  const items = [...testimonials, ...testimonials];

  useEffect(() => {
    if (!trackRef.current || reducedMotion) return;

    const track = trackRef.current;
    const totalWidth = track.scrollWidth / 2; // Half since we duplicated

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(track, {
      x: -totalWidth,
      duration: 60,
      ease: 'none'
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  const handleMouseEnter = () => {
    if (timelineRef.current && !reducedMotion) {
      gsap.to(timelineRef.current, { timeScale: 0, duration: 0.5 });
    }
  };

  const handleMouseLeave = () => {
    if (timelineRef.current && !reducedMotion) {
      gsap.to(timelineRef.current, { timeScale: 1, duration: 0.5 });
    }
  };

  return (
    <section id="testimonials" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Student Success"
          title={<>Our students and parents <span className="text-brand-orange">love us</span></>}
          subtitle="See why learners trust Instructis for their exam preparation, skill development, and career goals."
        />
      </div>

      {/* Auto-scrolling carousel */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={trackRef}
          className="flex gap-5 px-4"
          style={{ width: 'max-content' }}
        >
          {items.map((test, idx) => (
            <div
              key={idx}
              className={`${test.bgColor} p-7 rounded-2xl flex flex-col w-[320px] md:w-[360px] flex-shrink-0 border border-transparent hover:shadow-card transition-shadow duration-300`}
            >
              <div className="flex gap-0.5 mb-4 text-brand-orange">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-gray-700 font-medium text-sm mb-6 flex-grow leading-relaxed">"{test.quote}"</p>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{test.author}</h4>
                <p className="text-xs text-gray-500">{test.grade}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
