import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import Reveal from '../Reveal'

const handleBtnHover = (e, isEnter) => {
  gsap.to(e.currentTarget, {
    scale: isEnter ? 1.06 : 1,
    duration: 0.2,
    ease: 'power2.out',
  })
}

const perks = [
  'Free diagnostic test',
  'No credit card required',
  'Personalised study plan',
  'Access to doubt rooms',
]

const CTASection = () => {
  return (
    <section
      id="cta"
      className="-mx-4 w-[calc(100%+2rem)] overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 px-4 py-16 md:-mx-6 md:w-[calc(100%+3rem)] md:px-10 md:py-24"
    >
      {/* Decorative blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-green-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal direction="up">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-100">
            Get Started Today
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white md:text-5xl">
            Ready to Begin Your{' '}
            <span className="text-green-400">Journey?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-indigo-200">
            Join 15,000+ students who are already preparing smarter with Instructis. Start free—no commitment needed.
          </p>

          <ul className="mt-6 flex flex-wrap justify-center gap-3">
            {perks.map((p) => (
              <li
                key={p}
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-indigo-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5 text-green-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="rounded-full bg-green-400 px-10 py-4 text-sm font-bold text-slate-900 shadow-lg shadow-green-500/30 transition"
              onMouseEnter={(e) => handleBtnHover(e, true)}
              onMouseLeave={(e) => handleBtnHover(e, false)}
            >
              Book a Free Session
            </Link>
            <Link
              to="/courses"
              className="rounded-full border-2 border-white/30 bg-transparent px-10 py-4 text-sm font-bold text-white transition hover:border-white/60 hover:bg-white/10"
              onMouseEnter={(e) => handleBtnHover(e, true)}
              onMouseLeave={(e) => handleBtnHover(e, false)}
            >
              Browse Courses
            </Link>
          </div>

          <p className="mt-5 text-xs text-indigo-300">
            Trusted by students from IIT Delhi, AIIMS, and 200+ colleges across India.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default CTASection
