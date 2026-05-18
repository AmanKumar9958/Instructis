import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div>
            <h3 className="text-2xl font-bold text-brand-purple mb-4">About Us</h3>
            <p className="text-gray-600 mb-6 font-medium">
              Instructis is India's rapidly growing ed-tech platform and the creator of India's most loved learning resources. Launched to provide highly personalised and effective learning programs for aspirants of competitive exams like JEE and NEET.
            </p>
            <p className="text-gray-600 mb-4">
              Our niche is creating personalised learning experiences for every type of learner. The Instructis way of learning provides students a platform where they can learn, engage and be excited about charting their own path.
            </p>
            <p className="text-gray-600">
              We are a team of passionate educators, technologists, and creators dedicated to making quality education accessible and engaging. Our mission is to empower students with the tools and confidence they need to succeed in their academic journeys and beyond.
            </p>
            <p className="text-gray-600 mt-4">
              Explore our focused programs for{' '}
              <Link className="text-brand-purple font-semibold hover:underline" to="/jee">JEE coaching</Link>,{' '}
              <Link className="text-brand-purple font-semibold hover:underline" to="/neet">NEET coaching</Link>, and{' '}
              <Link className="text-brand-purple font-semibold hover:underline" to="/centers">offline centers across India</Link>.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-brand-purple mb-4">Why Choose Us?</h3>
            <p className="text-gray-600 mb-6 font-medium">
              Learning is pivotal for a student's success in academics and life. The Digital Age is deeply shaping the way students learn. At Instructis, we encourage students to embrace this fast-changing world.
            </p>
            <p className="text-gray-600 mb-4">
              We craft learning journeys for every student that address their unique needs. We believe in the power of one-to-one learning that allows students to be holistically involved in their education.
            </p>
            <p className="text-gray-600">
              We combine cutting-edge technology with proven pedagogical methods to deliver exceptional results. Our students benefit from interactive sessions, comprehensive study materials, and continuous mentorship to ensure they never lose track.
            </p>
            <p className="text-gray-600 mt-4">
              Whether you are targeting JEE Main, JEE Advanced, or NEET UG, our mentors help you build strong fundamentals, exam temperament, and consistent practice routines.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
