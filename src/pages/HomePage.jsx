import CTASection from '../components/landing/CTASection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HeroSection from '../components/landing/HeroSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'

const HomePage = () => {
  return (
    <div className="w-full space-y-0">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}

export default HomePage
