import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Reveal from './Reveal';

/**
 * FAQ Accordion with smooth height transitions.
 * Props: items (array of { question, answer }), className
 */
export default function FAQAccordion({ items = [], className = '' }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <Reveal key={idx} direction="up" delay={idx * 60}>
            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:shadow-card transition-shadow duration-300">
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left gap-4"
                aria-expanded={isOpen}
              >
                <span className="text-base md:text-lg font-semibold text-gray-900">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 md:px-6 pb-5 md:pb-6 text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
