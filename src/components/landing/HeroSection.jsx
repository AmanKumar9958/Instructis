import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

const stats = [
  { value: '15k+', label: 'Students mentored' },
  { value: '320+', label: 'Practice sets' },
  { value: '98%', label: 'Success rate' },
  { value: '50+', label: 'Expert mentors' },
]

const handleBtnHover = (e, isEnter) => {
  gsap.to(e.currentTarget, {
    scale: isEnter ? 1.06 : 1,
    duration: 0.2,
    ease: 'power2.out',
  })
}

const HeroSection = () => {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-badge', { opacity: 0, y: -24, duration: 0.55 })
        .from('.hero-title', { opacity: 0, y: 48, duration: 0.7 }, '-=0.25')
        .from('.hero-subtitle', { opacity: 0, y: 32, duration: 0.6 }, '-=0.45')
        .from('.hero-cta', { opacity: 0, y: 24, duration: 0.5 }, '-=0.4')
        .from('.hero-stat', { opacity: 0, y: 20, stagger: 0.1, duration: 0.45 }, '-=0.3')
        .from('.hero-visual', { opacity: 0, x: 64, duration: 0.8, ease: 'power3.out' }, '-=0.85')
        .from('.hero-float', { opacity: 0, scale: 0.8, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.2')
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="-mx-4 w-[calc(100%+2rem)] overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-green-50 px-4 pb-16 pt-12 md:-mx-6 md:w-[calc(100%+3rem)] md:px-10 md:pb-24 md:pt-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* ── Left copy ── */}
          <div className="space-y-7">
            <span className="hero-badge inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              India&apos;s Trusted JEE &amp; NEET Platform
            </span>

            <h1 className="hero-title text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Crack{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                JEE &amp; NEET
              </span>{' '}
              with Expert Guidance
            </h1>

            <p className="hero-subtitle max-w-lg text-lg leading-relaxed text-slate-600">
              Personalized mentoring, structured batches, and data-driven analytics—built to take you from preparation to a top rank.
            </p>

            <div className="hero-cta flex flex-wrap gap-4">
              <a
                href="#cta"
                className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-300/50 transition"
                onMouseEnter={(e) => handleBtnHover(e, true)}
                onMouseLeave={(e) => handleBtnHover(e, false)}
              >
                Start Learning Free
              </a>
              <Link
                to="/courses"
                className="rounded-full border-2 border-indigo-200 bg-white px-8 py-3.5 text-sm font-semibold text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-50"
                onMouseEnter={(e) => handleBtnHover(e, true)}
                onMouseLeave={(e) => handleBtnHover(e, false)}
              >
                Explore Courses
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 border-t border-slate-100 pt-6">
              {stats.map((s) => (
                <div key={s.label} className="hero-stat">
                  <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-wider text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right visual ── */}
          <div className="hero-visual relative">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-green-200/40 blur-3xl"
            />
            <img
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80"
              alt="Student preparing for JEE and NEET"
              className="relative z-10 max-h-[480px] w-full rounded-3xl object-cover shadow-2xl shadow-indigo-200/50"
              loading="eager"
            />

            {/* floating success badge */}
            <div className="hero-float absolute -bottom-5 left-6 z-20 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-slate-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Success Rate</p>
                <p className="text-lg font-extrabold text-green-500">98%</p>
              </div>
            </div>

            {/* floating students badge */}
            <div className="hero-float absolute -top-5 right-6 z-20 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-slate-100">
              <p className="text-[11px] font-medium text-slate-500">Active Students</p>
              <p className="text-lg font-extrabold text-indigo-600">15,000+</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
