import SectionHeader from '../SectionHeader';
import FAQAccordion from '../FAQAccordion';
import faqData from '../../data/faqData';

export default function FAQSection() {
  return (
    <section className="py-20 bg-surface-secondary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="FAQ"
          title={<>Frequently asked <span className="gradient-text-purple">questions</span></>}
          subtitle="Everything you need to know about Instructis and our programs."
        />
        <FAQAccordion items={faqData.homepage} />
      </div>
    </section>
  );
}
