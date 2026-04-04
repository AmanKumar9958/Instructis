import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Instructis is the best app for my daughter to strengthen her Science basics.",
      author: "Mother of Devananda",
      grade: "Class 11 | Bangalore",
      bgColor: "bg-pink-50"
    },
    {
      quote: "My son understands Math and Physics better with Instructis.",
      author: "Father of Souradip",
      grade: "Class 12 | Kolkata",
      bgColor: "bg-orange-50"
    },
    {
      quote: "Instructis helped me understand the concepts for JEE through real-life examples.",
      author: "Suraj Peela",
      grade: "JEE Aspirant | Hyderabad",
      bgColor: "bg-blue-50"
    },
    {
      quote: "The mock tests feel exactly like the real NEET format. Highly recommend it!",
      author: "Priya Sharma",
      grade: "NEET Aspirant | Delhi",
      bgColor: "bg-green-50"
    },
    {
      quote: "Her confidence in Mathematics has improved drastically over 3 months.",
      author: "Father of Riya",
      grade: "Class 11 | Mumbai",
      bgColor: "bg-yellow-50"
    },
    {
      quote: "Best faculty out there. They break down complex topics seamlessly.",
      author: "Aniket Verma",
      grade: "JEE Aspirant | Pune",
      bgColor: "bg-purple-50"
    },
    {
      quote: "I was struggling with Chemistry but the interactive videos changed everything.",
      author: "Sneha Nair",
      grade: "Class 12 | Kochi",
      bgColor: "bg-pink-50"
    },
    {
      quote: "As a parent, I love the detailed progress reports provided every week.",
      author: "Mother of Aryan",
      grade: "JEE Aspirant | Jaipur",
      bgColor: "bg-blue-50"
    },
    {
      quote: "Absolutely brilliant platform for targeted board exam revisions.",
      author: "Rohit Das",
      grade: "Class 12 | Guwahati",
      bgColor: "bg-orange-50"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Recalculate slides when itemsPerSlide changes
  const numSlides = Math.ceil(testimonials.length / itemsPerSlide);

  // Guard to ensure index doesn't overshoot when resizing
  useEffect(() => {
    if (currentIndex >= numSlides && numSlides > 0) {
      setCurrentIndex(numSlides - 1);
    }
  }, [numSlides, currentIndex]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % numSlides);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + numSlides) % numSlides);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-16">
          Our students and parents <span className="text-brand-orange">love us</span>
        </h2>
        
        {/* Carousel Container */}
        <div className="overflow-hidden relative px-2">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: numSlides }).map((_, slideIdx) => (
              <div key={slideIdx} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.slice(slideIdx * itemsPerSlide, (slideIdx + 1) * itemsPerSlide).map((test, idx) => (
                    <div key={idx} className={`${test.bgColor} p-8 md:p-10 rounded-2xl flex flex-col h-full border border-transparent`}>
                      <div className="flex justify-center mb-6 text-brand-orange">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                      </div>
                      <p className="text-gray-700 font-medium italic mb-8 flex-grow">"{test.quote}"</p>
                      <div>
                        <h4 className="font-bold text-gray-900">{test.author}</h4>
                        <p className="text-sm text-gray-500">{test.grade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Carousel Controls */}
        <div className="flex justify-center items-center mt-12 space-x-6">
          <button 
            onClick={prevSlide}
            className="bg-brand-light-purple hover:bg-brand-purple hover:text-white text-brand-purple p-4 rounded-full transition-colors flex items-center justify-center shadow-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: numSlides }).map((_, idx) => (
               <button 
                 key={idx}
                 onClick={() => setCurrentIndex(idx)}
                 className={`w-3 h-3 rounded-full transition-colors ${currentIndex === idx ? 'bg-brand-orange' : 'bg-gray-200'}`}
                 aria-label={`Go to slide ${idx + 1}`}
               />
            ))}
          </div>

          <button 
            onClick={nextSlide}
            className="bg-orange-50 hover:bg-brand-orange hover:text-white text-brand-orange p-4 rounded-full transition-colors flex items-center justify-center shadow-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-16">
          <a href="#" className="inline-block border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white font-bold py-3 px-8 rounded-full transition-colors">
            1000s of reviews by happy students
          </a>
        </div>
      </div>
    </section>
  );
}
