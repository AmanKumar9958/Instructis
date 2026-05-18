

export default function Advantage() {
  const points = [
    {
      title: "Conceptual clarity through visualisation",
      description: "Visual learning helps students understand complex concepts easily."
    },
    {
      title: "Personalised learning programs",
      description: "Tailored to every student's unique learning pace and style."
    },
    {
      title: "Unmatched individual attention",
      description: "Dedicated mentors to ensure every doubt is resolved."
    },
    {
      title: "Comprehensive study material",
      description: "Curated resources designed by experts for thorough preparation."
    },
    {
      title: "Regular mock tests",
      description: "Assess performance with real exam-like test series and detailed analysis."
    }
  ];

  return (
    <section className="py-20 bg-brand-light-purple/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8">
              Get the Instructis <br/><span className="text-brand-purple">advantage</span>
            </h2>
            <div className="space-y-8">
              {points.map((point, idx) => (
                <div key={idx} className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <span className="text-2xl font-bold text-brand-orange">{idx + 1}.</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold text-gray-900">{point.title}</h4>
                    <p className="mt-2 text-gray-600">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-orange rounded-3xl transform rotate-3 opacity-20"></div>
            <img 
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Classroom teaching on board" 
              width="800"
              height="500"
              loading="lazy"
              decoding="async"
              className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
