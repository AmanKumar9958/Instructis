import { BookOpen, Calculator, Stethoscope, Award } from 'lucide-react';

export default function Programs() {
  const courses = [
    {
      title: "Class 11 & 12",
      description: "Comprehensive learning programs with top faculty, specifically crafted for board exam excellence alongside competitive preparation.",
      icon: <BookOpen className="w-8 h-8 text-brand-purple" />,
      link: "Explore Boards",
      bgColor: "bg-pink-50",
    },
    {
      title: "JEE Preparation",
      description: "Advanced curriculum, mock tests, and personalized doubt resolution for JEE Main & Advanced aspirants.",
      icon: <Calculator className="w-8 h-8 text-brand-orange" />,
      link: "Explore JEE",
      bgColor: "bg-orange-50",
    },
    {
      title: "NEET Aspirants",
      description: "In-depth Biology, Physics, and Chemistry modules tailored strictly for NEET UG success.",
      icon: <Stethoscope className="w-8 h-8 text-brand-purple" />,
      link: "Explore NEET",
      bgColor: "bg-blue-50",
    },
    {
      title: "Test Series",
      description: "All India Level Test Series (AILTS) for real-time assessment and benchmarking against peers.",
      icon: <Award className="w-8 h-8 text-brand-orange" />,
      link: "View Tests",
      bgColor: "bg-green-50",
    }
  ];

  return (
    <section className="py-20 bg-white">
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
              <a href="#" className="font-semibold text-brand-purple hover:text-brand-purple-dark hover:underline flex items-center">
                {course.link} <span className="ml-1">&rarr;</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
