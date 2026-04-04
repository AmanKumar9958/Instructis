import { useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import heroImage from '../../assets/hero_image.webp';

export default function Hero() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    grade: '',
    targetExam: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // 1. Send via FormSubmit.co
      const response = await fetch("https://formsubmit.co/ajax/info@codewithaman.tech", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: "New Student Booking Request!",
          Name: formData.fullName,
          Mobile: formData.mobile,
          Grade: formData.grade,
          "Target Exam": formData.targetExam
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      // 2. Save backup to Firestore
      const bookingsRef = collection(db, 'bookings');
      await addDoc(bookingsRef, {
        ...formData,
        createdAt: serverTimestamp()
      });

      setStatus('success');
      setFormData({ fullName: '', mobile: '', grade: '', targetExam: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section className="bg-brand-light-purple min-h-[calc(100vh-4rem)] pt-4 pb-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side: Headline and Graphic */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight mb-2">
              Learn from <br />
              <span className="text-brand-purple">India's best teachers</span>
            </h1>
            <p className="text-base md:text-lg text-gray-700 mb-6 max-w-lg">
              Comprehensive learning programs & classes for all students. Become lifelong learners with Instructis' engaging video lessons and personalised learning journeys.
            </p>
            <div className="mt-1 relative mx-auto lg:mx-0 max-w-sm w-full">
              {/* Soft geometric blobs behind the character */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] rounded-full bg-pink-50 -z-10"></div>
              <div className="absolute top-[10%] right-[10%] w-[80%] h-[80%] rounded-full bg-brand-light-purple/40 -z-10 mix-blend-multiply"></div>
              <div className="absolute bottom-[20%] left-[5%] w-[60%] h-[60%] rounded-full bg-orange-50 -z-10 mix-blend-multiply"></div>

              {/* Placing the AI generated Hero Illustration */}
              <img
                src={heroImage}
                alt="Instructis Learning Graphic"
                className="w-full relative z-10"
              />
            </div>
          </div>

          {/* Right Side: Lead Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md mx-auto lg:mx-0 w-full relative z-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Book Doubt Session</h3>

            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  ✓
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Request Received!</h4>
                <p className="text-gray-600">We've sent your details to our team and will contact you shortly.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-brand-purple font-semibold hover:underline"
                >
                  Book another session
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                    Something went wrong. Please try again later.
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Your Details</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                <div>
                  <select
                    name="grade"
                    required
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple text-gray-500"
                  >
                    <option value="">Select Grade</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                    <option value="dropper">Class 12 - Dropper</option>
                  </select>
                </div>
                <div>
                  <select
                    name="targetExam"
                    required
                    value={formData.targetExam}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple text-gray-500"
                  >
                    <option value="">Select Target Exam</option>
                    <option value="jee">JEE Main & Advanced</option>
                    <option value="neet">NEET (UG)</option>
                    <option value="boards">Board Exams</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`w-full text-white font-bold py-4 rounded-lg transition-colors mt-2 text-lg shadow-md ${status === 'loading'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-brand-orange hover:bg-brand-orange-dark'
                    }`}
                >
                  {status === 'loading' ? 'Sending...' : 'Schedule a Demo'}
                </button>
              </form>
            )}
            <p className="text-xs text-center text-gray-500 mt-4">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 bg-brand-purple rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 bg-brand-orange rounded-full opacity-10 blur-3xl"></div>
    </section>
  );
}
