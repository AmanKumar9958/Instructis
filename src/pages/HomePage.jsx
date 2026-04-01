import Reveal from '../components/Reveal'
import { Link } from 'react-router-dom'

const heroImage =
  'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80&sat=-10'

const pathways = [
  {
    title: 'JEE (Main + Advanced)',
    copy: 'Structured Physics, Chemistry, and Mathematics prep with rank-focused mocks and analytics.',
    points: ['Paper pattern, marking scheme, and previous year trends', 'Speed + accuracy drills to maximise percentile', 'Doubt rooms and late-night mentor support'],
    color: 'from-sky-500/15 to-indigo-500/15 border-sky-200 dark:border-sky-800',
    link: '/jee',
  },
  {
    title: 'NEET (UG)',
    copy: 'NCERT-first Biology, Physics, and Chemistry mastery with daily practice and rapid revision.',
    points: ['Weightage-first study plan with NCERT checkpoints', 'Grand tests with OMR-style evaluation', 'Crash revision playlists before exam'],
    color: 'from-purple-500/15 to-fuchsia-500/15 border-purple-200 dark:border-purple-800',
    link: '/neet',
  },
]

const highlights = [
  { title: 'Rank-minded mentors', text: 'Faculty with JEE/NEET track records and outcome-driven sessions.' },
  { title: 'Live + recorded support', text: 'Attend live, revisit recordings, and chat with mentors for doubts.' },
  { title: 'Analytics that guide you', text: 'Topic heatmaps, time-spent reports, and error patterns highlighted.' },
]

const microSections = [
  {
    title: 'Exam deep-dives',
    desc: 'Know the paper pattern, marking scheme, and sectional strategy before you start.',
    pill: 'Patterns & schemes',
  },
  {
    title: 'Adaptive practice',
    desc: 'Practice sheets adjust to your accuracy so you spend time where it matters most.',
    pill: 'Smart practice',
  },
  {
    title: 'Mentor sessions',
    desc: 'Weekly 1:1 check-ins keep you accountable and remove blockers quickly.',
    pill: '1:1 guidance',
  },
]

const HomePage = () => {
  return (
    <section className="w-full space-y-12">
      <div className="-mx-4 w-[calc(100%+2rem)] overflow-hidden rounded-none bg-gradient-to-br from-sky-50 via-white to-purple-50 px-4 pb-12 pt-10 shadow-xl shadow-slate-200/60 md:-mx-6 md:w-[calc(100%+3rem)] md:rounded-3xl md:px-10 md:pb-14 md:pt-14 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 dark:shadow-black/30">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal direction="left">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm ring-1 ring-sky-100 dark:bg-slate-900 dark:text-sky-300 dark:ring-slate-800">
                Book Your Session
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-5xl dark:text-white">
                Personal mentoring for <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">JEE &amp; NEET</span>{' '}
                preparation
              </h1>
              <p className="max-w-2xl text-base text-slate-600 md:text-lg dark:text-slate-200">
                A modern, student-first space with calm gradients and focused layouts—built to keep you on track for ranks without clutter.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#session-form"
                  className="rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/60 transition hover:-translate-y-[1px] hover:shadow-xl dark:shadow-indigo-900/40"
                >
                  Book Session
                </a>
                <Link
                  to="/courses"
                  className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:-translate-y-[1px] hover:border-sky-200 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-700 dark:hover:bg-slate-800"
                >
                  View Courses
                </Link>
              </div>
              <div className="grid w-full max-w-xl grid-cols-2 gap-4 text-left text-sm text-slate-600 dark:text-slate-300">
                <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur dark:bg-white/5 dark:ring-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">15k+</p>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Students mentored</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur dark:bg-white/5 dark:ring-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">320+</p>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Weekly practice sets</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="relative flex justify-end">
              <div className="absolute -left-8 -top-10 h-32 w-32 rounded-full bg-sky-200/60 blur-3xl dark:bg-indigo-900/40" aria-hidden="true" />
              <div className="absolute bottom-6 right-2 h-24 w-24 rounded-full bg-purple-200/60 blur-3xl dark:bg-purple-900/40" aria-hidden="true" />

              <form
                id="session-form"
                className="relative z-[1] w-full max-w-md rounded-3xl bg-white/90 p-6 shadow-2xl shadow-sky-200/60 ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/90 dark:shadow-black/40 dark:ring-slate-800"
                onSubmit={(event) => event.preventDefault()}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Book your session</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Get a personalised call in 24 hours</h2>

                <div className="mt-4 space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Full name
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your name"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-600 dark:focus:ring-sky-900/50"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Email
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-600 dark:focus:ring-sky-900/50"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Goal
                    <select
                      name="goal"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-600 dark:focus:ring-sky-900/50"
                    >
                      <option>JEE</option>
                      <option>NEET</option>
                    </select>
                  </label>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Preferred slot
                    <input
                      type="text"
                      name="slot"
                      placeholder="E.g., Weekday evening"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-600 dark:focus:ring-sky-900/50"
                    />
                  </label>
                  <button
                    type="submit"
                    className="mt-4 w-full rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/60 transition hover:-translate-y-[1px] hover:shadow-xl dark:shadow-indigo-900/40"
                  >
                    Book Session
                  </button>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    A mentor will contact you with batch options and a free diagnostic test link.
                  </p>
                </div>
              </form>

              <div className="relative -ml-16 hidden h-full max-h-[420px] w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-sky-200/50 md:block dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40">
                <img src={heroImage} alt="Students studying" className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/30 via-transparent to-indigo-600/30" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {pathways.map((item, idx) => (
          <Reveal key={item.title} direction="up" delay={idx * 120}>
            <article className={`h-full rounded-3xl border bg-gradient-to-br ${item.color} p-6 shadow-lg shadow-slate-200/60 dark:shadow-black/30`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Exam track</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                </div>
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur dark:bg-white/10 dark:text-slate-200">
                  2025-26
                </span>
              </div>
              <p className="mt-3 text-base text-slate-600 dark:text-slate-200">{item.copy}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-[3px] h-2 w-2 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between">
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:-translate-y-[1px] hover:ring-sky-300 dark:bg-slate-900 dark:text-white dark:ring-slate-800 dark:hover:ring-sky-700"
                >
                  Explore
                  <span aria-hidden className="text-lg">→</span>
                </Link>
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Tap for detailed pattern</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="rounded-3xl bg-white px-4 py-8 shadow-xl shadow-slate-200/60 md:px-8 dark:bg-slate-900 dark:shadow-black/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Designed for students</p>
              <h2 className="text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">A calm, modern study space</h2>
              <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-300">
                Smooth hover states, soft gradients, and generous spacing make it easy to focus on what matters—your next milestone.
              </p>
            </div>
            <div className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="rounded-full bg-sky-100 px-4 py-2 font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">
                Responsive
              </span>
              <span className="rounded-full bg-indigo-100 px-4 py-2 font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                Dark / Light
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm transition hover:-translate-y-[3px] hover:shadow-md dark:border-slate-800 dark:bg-slate-800/60"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-600 group-hover:text-indigo-600 dark:text-sky-300">
                  {item.title}
                </p>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 px-4 py-10 text-white shadow-xl shadow-slate-300/30 md:px-10 dark:shadow-black/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">On-scroll delight</p>
              <h3 className="text-3xl font-bold leading-tight md:text-4xl">
                Slide-up sections, hover glows, and smooth focus states keep the experience lively.
              </h3>
              <p className="max-w-2xl text-base text-indigo-100">
                Cards lift on hover, CTAs glow softly, and sections fade up as you scroll—delivering a modern feel without distractions.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-white/10 px-4 py-2 font-semibold text-indigo-50">CSS animations</span>
                <span className="rounded-full bg-white/10 px-4 py-2 font-semibold text-indigo-50">Smooth hover</span>
                <span className="rounded-full bg-white/10 px-4 py-2 font-semibold text-indigo-50">Performance friendly</span>
              </div>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 shadow-lg shadow-black/30 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-100">Navigation shortcuts</p>
              <p className="mt-3 text-lg font-semibold">JEE &amp; NEET detail pages</p>
              <p className="mt-2 max-w-md text-sm text-indigo-100">
                Click the Explore buttons above to open dedicated pages that already cover exam pattern, marking scheme, timelines, and FAQs.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  to="/jee"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-[1px]"
                >
                  Go to JEE
                </Link>
                <Link
                  to="/neet"
                  className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-[1px]"
                >
                  Go to NEET
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {microSections.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/50 transition hover:-translate-y-[3px] hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40"
            >
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">
                {item.pill}
              </span>
              <h4 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

export default HomePage
