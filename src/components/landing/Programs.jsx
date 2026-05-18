import { BookOpen, Calculator, Stethoscope, Award } from 'lucide-react';

export default function Programs() {
  const courses = [
    {
      title: "Class 11 & 12",
      description: "Comprehensive learning programs with top faculty, specifically crafted for board exam excellence alongside competitive preparation.",
      icon: <BookOpen className="w-8 h-8 text-brand-purple" />,
      link: "Explore Boards",
      href: "/#boards",
      bgColor: "bg-pink-50",
    },
    {
      title: "JEE Preparation",
      description: "Advanced curriculum, mock tests, and personalized doubt resolution for JEE Main & Advanced aspirants.",
      icon: <Calculator className="w-8 h-8 text-brand-orange" />,
      link: "Explore JEE",
      href: "/jee",
      bgColor: "bg-orange-50",
    },
    {
      title: "NEET Aspirants",
      description: "In-depth Biology, Physics, and Chemistry modules tailored strictly for NEET UG success.",
      icon: <Stethoscope className="w-8 h-8 text-brand-purple" />,
      link: "Explore NEET",
      href: "/neet",
      bgColor: "bg-blue-50",
    },
    {
      title: "Test Series",
      description: "All India Level Test Series (AILTS) for real-time assessment and benchmarking against peers.",
      icon: <Award className="w-8 h-8 text-brand-orange" />,
      link: "View Tests",
      href: "/#test-series",
      bgColor: "bg-green-50",
    }
  ];

  return (
    <section id="programs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            Comprehensive learning programs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Become lifelong learners with India's best teachers, engaging video lessons and personalised learning journeys tailored for Class 11, Class 12, JEE & NEET.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, idx) => (
            <div key={idx} className={`${course.bgColor} rounded-2xl p-8 flex flex-col items-center text-center group cursor-pointer border border-transparent`}>
              <div className="w-16 h-16 rounded-full bg-brand-light-purple flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform">
                {course.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{course.description}</p>
              <a href={course.href} className="font-semibold text-brand-purple hover:text-brand-purple-dark hover:underline flex items-center">
                {course.link} <span className="ml-1">&rarr;</span>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <article id="jee" className="rounded-3xl border border-orange-100 bg-orange-50/40 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">JEE Coaching for Main & Advanced</h3>
            <p className="text-gray-600 mb-4">
              Target JEE Main and JEE Advanced with a structured preparation plan, daily practice, and mentor-led doubt sessions.
              Our JEE coaching focuses on Physics, Chemistry, and Mathematics with concept-first teaching and exam-grade problem solving.
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>Topic-wise worksheets and rank analytics</li>
              <li>Real exam pattern mock tests and AITS</li>
              <li>Personalised study plans for Class 11 & 12</li>
            </ul>
            <div className="flex flex-wrap gap-4">
              <a href="/#book-session" className="font-semibold text-brand-purple hover:underline">Book a free JEE doubt session</a>
              <a href="/centers" className="font-semibold text-brand-orange hover:underline">Find JEE centers near you</a>
            </div>
          </article>

          <article id="neet" className="rounded-3xl border border-blue-100 bg-blue-50/40 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">NEET Coaching for NEET UG</h3>
            <p className="text-gray-600 mb-4">
              Build strong Biology, Physics, and Chemistry fundamentals with NEET-focused teaching, daily practice, and concept revision.
              Our NEET coaching blends NCERT depth, clinical examples, and exam-style tests.
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>NCERT-first learning with quick revision notes</li>
              <li>NEET mock tests with detailed solutions</li>
              <li>Mentor support for consistency and accuracy</li>
            </ul>
            <div className="flex flex-wrap gap-4">
              <a href="/#book-session" className="font-semibold text-brand-purple hover:underline">Book a free NEET doubt session</a>
              <a href="/centers" className="font-semibold text-brand-orange hover:underline">Find NEET centers near you</a>
            </div>
          </article>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <article id="boards" className="rounded-3xl border border-pink-100 bg-pink-50/40 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Class 11 & 12 Board Exam Coaching</h3>
            <p className="text-gray-600 mb-4">
              Strengthen board exam preparation with concept clarity, chapter-wise tests, and revision support built for Class 11 and Class 12.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/#book-session" className="font-semibold text-brand-purple hover:underline">Schedule a board exam demo</a>
              <a href="/about" className="font-semibold text-brand-orange hover:underline">Learn about Instructis</a>
            </div>
          </article>

          <article id="test-series" className="rounded-3xl border border-green-100 bg-green-50/40 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">All India Test Series</h3>
            <p className="text-gray-600 mb-4">
              Measure progress with JEE and NEET test series that mirror the real exam pattern, difficulty, and time pressure.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/#book-session" className="font-semibold text-brand-purple hover:underline">Get a free test schedule</a>
              <a href="/jee" className="font-semibold text-brand-orange hover:underline">Explore JEE test plans</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
