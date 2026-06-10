import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-brand-purple mb-4">About Us</h3>
            <p className="text-gray-600 mb-6 font-medium">
              Instructis is India's rapidly growing learning platform offering structured programs for competitive exams, AI & Machine Learning, coding, and career-oriented paths. We combine expert mentorship with cutting-edge technology to deliver personalised learning at scale.
            </p>
            <p className="text-gray-600 mb-4">
              Our mission is to create personalised learning experiences for every type of learner — whether you're preparing for JEE, NEET, UPSC, learning to code, or exploring AI.
            </p>
            <p className="text-gray-600 mt-4">
              Explore our programs for{' '}
              <Link className="text-brand-purple font-semibold hover:underline" to="/competitive-exams">competitive exams</Link>,{' '}
              <Link className="text-brand-purple font-semibold hover:underline" to="/ai-ml">AI & Machine Learning</Link>,{' '}
              <Link className="text-brand-purple font-semibold hover:underline" to="/coding">coding</Link>, and{' '}
              <Link className="text-brand-purple font-semibold hover:underline" to="/partner">partner with us</Link>.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-brand-purple mb-4">Why Choose Us?</h3>
            <p className="text-gray-600 mb-6 font-medium">
              Learning is pivotal for success in academics and career. At Instructis, we encourage students to embrace the fast-changing world with structured, mentor-led programs.
            </p>
            <p className="text-gray-600 mb-4">
              We craft learning journeys for every student that address their unique needs. We believe in the power of one-to-one learning that allows students to be holistically involved in their education.
            </p>
            <p className="text-gray-600">
              We combine cutting-edge technology with proven pedagogical methods to deliver exceptional results. From competitive exam preparation to industry-ready skill development — our mentors help you build strong fundamentals and consistent practice routines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
