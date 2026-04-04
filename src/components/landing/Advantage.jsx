import { CheckCircle2 } from 'lucide-react';

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
                    <CheckCircle2 className="w-8 h-8 text-brand-orange" />
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
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Students learning together" 
              className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
