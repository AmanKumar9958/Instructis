import SectionHeader from '../SectionHeader';
import CategoryCard from '../CategoryCard';
import categoryData from '../../data/categoryData';
import Reveal from '../Reveal';

export default function Programs() {
  return (
    <section id="programs" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Explore"
          title={<>Find your perfect <span className="gradient-text-purple">learning path</span></>}
          subtitle="From competitive exams to cutting-edge technology — choose the program that aligns with your goals."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categoryData.map((category, idx) => (
            <Reveal key={category.id} direction="up" delay={idx * 100}>
              <CategoryCard category={category} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
