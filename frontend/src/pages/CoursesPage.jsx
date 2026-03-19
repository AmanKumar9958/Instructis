import { useEffect, useState } from 'react'
import Reveal from '../components/Reveal'

const popularCourses = [
  {
    title: 'JEE Main + Advanced Rank Booster',
    duration: '12 Months',
    mode: 'Live + Recorded',
    description:
      'Structured physics, chemistry, and maths training with weekly tests and detailed analytics.',
  },
  {
    title: 'NEET Elite Medical Prep',
    duration: '12 Months',
    mode: 'Live + Practice Lab',
    description:
      'NCERT-focused biology depth sessions with high-yield chemistry and physics problem solving.',
  },
  {
    title: 'JEE Crash Course Sprint',
    duration: '16 Weeks',
    mode: 'Intensive Live',
    description:
      'Fast-paced revision, previous-year question drills, and strategy sessions for final exam push.',
  },
]

const allCourses = {
  JEE: [
    'JEE Foundation (Class 11)',
    'JEE Foundation (Class 12)',
    'JEE Main Target Batch',
    'JEE Advanced Problem Solving Program',
    'JEE Revision and Mock Test Series',
  ],
  NEET: [
    'NEET Foundation (Class 11)',
    'NEET Foundation (Class 12)',
    'NEET Biology Mastery Program',
    'NEET Physics and Chemistry Precision Batch',
    'NEET Final Revision and Full Syllabus Test Series',
  ],
}

const quotes = [
  'Success is the sum of small efforts, repeated day in and day out.',
  'Discipline is choosing between what you want now and what you want most.',
  "Your future rank is built by today's focused hours.",
]

const successStories = [
  {
    name: 'Aarav Sharma',
    exam: 'JEE Advanced',
    result: 'AIR 312',
    story:
      'From scoring below 50% in mocks to securing AIR 312 by following a strict revision and test analysis plan.',
  },
  {
    name: 'Ananya Patel',
    exam: 'NEET',
    result: 'Score 685/720',
    story:
      'Improved biology retention with active recall and NCERT mapping, achieving a top medical admission score.',
  },
  {
    name: 'Kabir Verma',
    exam: 'JEE Main',
    result: '99.74 Percentile',
    story:
      'Turned weak chemistry into a strong section through daily micro-goals and timed mixed-topic practice.',
  },
]


const CoursesPage = () => {
  const [activeStory, setActiveStory] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % successStories.length)
    }, 3500)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <section className="w-full rounded-3xl bg-linear-to-br from-emerald-50 via-white to-cyan-50 p-4 shadow-xl shadow-stone-200 sm:p-6 lg:p-10">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-500 via-emerald-400 to-cyan-400 p-6 text-white sm:p-8 lg:p-12">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute -bottom-12 left-16 h-44 w-44 rounded-full bg-emerald-200/30 blur-2xl" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">
              Instructis Courses
            </p>
            <h1 className="relative mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Build Your Dream Rank with Focused JEE and NEET Preparation
            </h1>
            <p className="relative mt-4 max-w-2xl text-sm text-emerald-50 sm:text-base lg:text-lg">
              Live classes, strategy roadmaps, expert mentorship, and performance analytics designed for serious aspirants.
            </p>
            <div className="relative mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:text-base">
                Enroll Now
              </button>
              <button className="rounded-full border border-white/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:text-base">
                Download Syllabus
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {popularCourses.map((course, i) => (
            <Reveal key={course.title} direction="up" delay={i * 100}>
              <article
                className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Popular</p>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900">{course.title}</h3>
                <p className="mt-3 text-sm text-neutral-600">{course.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-emerald-800">
                  <span className="rounded-full bg-emerald-100 px-3 py-1">{course.duration}</span>
                  <span className="rounded-full bg-cyan-50 px-3 py-1">{course.mode}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {Object.entries(allCourses).map(([exam, courses], i) => (
            <Reveal key={exam} direction={i === 0 ? 'left' : 'right'}>
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-neutral-900">{exam} Preparation Courses</h2>
                <ul className="mt-4 space-y-3">
                  {courses.map((course) => (
                    <li
                      key={course}
                      className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-neutral-700 sm:text-base"
                    >
                      {course}
                    </li>
                  ))}
                </ul>
                <button className="mt-5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:text-base">
                  Explore {exam} Batches
                </button>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900">Motivation Corner</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {quotes.map((quote, i) => (
                <Reveal key={quote} direction="scale" delay={i * 100}>
                  <blockquote
                    className="rounded-2xl border-l-4 border-emerald-500 bg-emerald-50 p-4 text-sm italic text-neutral-700 sm:text-base"
                  >
                    "{quote}"
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-8 rounded-2xl bg-emerald-900 p-6 text-white shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-semibold">Success Stories</h2>
              <p className="text-sm text-emerald-100">Auto-rotating every 3.5 seconds</p>
            </div>

            <div className="mt-5 rounded-2xl bg-emerald-800 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                {successStories[activeStory].exam}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{successStories[activeStory].name}</h3>
              <p className="mt-1 text-sm font-medium text-emerald-100">{successStories[activeStory].result}</p>
              <p className="mt-3 text-sm text-cyan-50 sm:text-base">{successStories[activeStory].story}</p>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {successStories.map((story, index) => (
                <button
                  key={story.name}
                  aria-label={`Show success story ${index + 1}`}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    activeStory === index ? 'bg-cyan-300' : 'bg-emerald-700 hover:bg-emerald-600'
                  }`}
                  onClick={() => setActiveStory(index)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal direction="scale">
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">Ready to Start Your Preparation?</h2>
                <p className="mt-2 text-sm text-neutral-600 sm:text-base">
                  Join a batch, take a demo class, and begin your path to top ranks.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:text-base">
                  Book Free Demo
                </button>
                <button className="rounded-full border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:text-base">
                  Talk to Counsellor
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default CoursesPage
