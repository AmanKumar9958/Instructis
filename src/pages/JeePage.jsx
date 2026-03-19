import Reveal from '../components/Reveal'

/* ── data ─────────────────────────────────────────────────────────────── */

const examPattern = [
  {
    exam: 'JEE Main',
    mode: 'CBT (Computer Based Test)',
    duration: '3 Hours',
    sections: [
      { subject: 'Physics', questions: 30, marks: 100 },
      { subject: 'Chemistry', questions: 30, marks: 100 },
      { subject: 'Mathematics', questions: 30, marks: 100 },
    ],
    totalMarks: 300,
    negative: '-1 for wrong MCQ answer',
    sessions: 'January & April (2 sessions per year)',
  },
  {
    exam: 'JEE Advanced',
    mode: 'CBT (2 Papers)',
    duration: '3 Hours per paper',
    sections: [
      { subject: 'Physics', questions: '18–20', marks: '~60' },
      { subject: 'Chemistry', questions: '18–20', marks: '~60' },
      { subject: 'Mathematics', questions: '18–20', marks: '~60' },
    ],
    totalMarks: '~180 per paper (360 total)',
    negative: 'Partial negative marking based on question type',
    sessions: 'Once a year (May–June)',
  },
]

const subjectGuides = [
  {
    subject: 'Physics',
    icon: '⚛️',
    color: 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800',
    accent: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    keyTopics: [
      'Mechanics (Kinematics, Laws of Motion, Work–Energy)',
      'Electrostatics & Current Electricity',
      'Waves & Oscillations',
      'Optics (Ray & Wave)',
      'Modern Physics (Photoelectric, Atomic Models)',
      'Thermodynamics & Kinetic Theory',
    ],
    tips: 'Focus on building strong conceptual clarity. Practice numerical problems daily and review formulas weekly.',
    weightage: '~35%',
  },
  {
    subject: 'Chemistry',
    icon: '🧪',
    color: 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800',
    accent: 'text-green-700 dark:text-green-300',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    keyTopics: [
      'Physical Chemistry: Mole Concept, Thermodynamics, Electrochemistry',
      'Organic Chemistry: GOC, Reactions, Named Reactions',
      'Inorganic Chemistry: P-block, D-block, Coordination Compounds',
      'Chemical Bonding & Molecular Structure',
      'Equilibrium (Chemical & Ionic)',
      'Surface Chemistry & Polymers',
    ],
    tips: 'Inorganic requires regular revision. Physical Chemistry needs consistent problem practice. Organic reaction mechanisms are high-yield.',
    weightage: '~33%',
  },
  {
    subject: 'Mathematics',
    icon: '📐',
    color: 'bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800',
    accent: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    keyTopics: [
      'Algebra: Complex Numbers, Matrices, Permutations & Combinations',
      'Calculus: Limits, Continuity, Differentiation, Integration',
      'Coordinate Geometry: Circles, Parabola, Ellipse, Hyperbola',
      'Vectors & 3D Geometry',
      'Probability & Statistics',
      'Trigonometry & Inverse Trigonometric Functions',
    ],
    tips: 'Practice is paramount. Solve past JEE papers topic-wise. Speed and accuracy in calculation are critical for JEE Main.',
    weightage: '~32%',
  },
]

const preparationTimeline = [
  {
    phase: 'Phase 1',
    period: 'June – September',
    label: 'Foundation Building',
    color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-700',
    accent: 'text-emerald-700 dark:text-emerald-300',
    tasks: [
      'Complete NCERT textbooks for all 3 subjects',
      'Build concept clarity with reference books',
      'Solve chapter-end exercises rigorously',
      'Start maintaining a formula & reaction notebook',
    ],
  },
  {
    phase: 'Phase 2',
    period: 'October – December',
    label: 'Advanced Problem Solving',
    color: 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700',
    accent: 'text-amber-700 dark:text-amber-300',
    tasks: [
      'Move to JEE-level problem solving (HC Verma, DC Pandey)',
      'Practice previous year JEE Main questions',
      'Attempt weekly full-length mock tests',
      'Identify and strengthen weak chapters',
    ],
  },
  {
    phase: 'Phase 3',
    period: 'January – March',
    label: 'Revision & Mocks',
    color: 'border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 dark:border-cyan-700',
    accent: 'text-cyan-700 dark:text-cyan-300',
    tasks: [
      'Attempt full JEE Main mock tests 3×/week',
      'Complete all JEE Advanced previous year papers',
      'Rapid revision using short notes',
      'Analyse performance metrics and fix error patterns',
    ],
  },
  {
    phase: 'Phase 4',
    period: 'April – June',
    label: 'Final Sprint',
    color: 'border-rose-400 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-700',
    accent: 'text-rose-700 dark:text-rose-300',
    tasks: [
      'Daily revision of high-weightage chapters',
      'Solve Grand Test Series under exam conditions',
      'Focus on time management strategies',
      'Maintain mental health, sleep schedule, and confidence',
    ],
  },
]

const successStories = [
  {
    name: 'Aarav Sharma',
    result: 'AIR 312',
    exam: 'JEE Advanced',
    quote:
      'Instructis helped me shift from random studying to structured daily goals. The test analytics showed me exactly where I was losing marks.',
    improvement: 'Mock 42% → Final Rank 312',
  },
  {
    name: 'Kabir Verma',
    result: '99.74 Percentile',
    exam: 'JEE Main',
    quote:
      'Chemistry used to be my weakest link. The daily micro-goal sessions at Instructis turned it into a strength within 3 months.',
    improvement: 'Chemistry: 48% → 91%',
  },
  {
    name: 'Shreya Agarwal',
    result: 'AIR 189',
    exam: 'JEE Advanced',
    quote:
      'The doubt-clearing sessions were available even late at night. I never felt stuck for long, which was crucial in the final months.',
    improvement: 'Joined as Class 11 student, achieved top-100 target',
  },
]

const faqs = [
  {
    q: 'Who is eligible to appear for JEE Main?',
    a: 'Students who have passed or are appearing in Class 12 (PCM) with at least 75% aggregate marks (65% for SC/ST) are eligible. There is no age bar.',
  },
  {
    q: 'How many attempts are allowed for JEE Main?',
    a: 'Students can attempt JEE Main up to 3 consecutive years (6 sessions total). JEE Advanced can be attempted a maximum of 2 consecutive times.',
  },
  {
    q: 'What is the cut-off to qualify for JEE Advanced?',
    a: 'Top ~2.5 lakh students from JEE Main qualify for JEE Advanced. Category-wise cut-offs apply (General, OBC-NCL, SC, ST, PwD).',
  },
  {
    q: 'Is Class 12 percentage required for IIT admission?',
    a: 'Yes. Candidates must have 75% aggregate (65% for SC/ST) in Class 12 OR be in the top-20 percentile of their respective board to accept an IIT seat.',
  },
]

/* ── Scroll-reveal wrapper ────────────────────────────────────────────── */

/* ── Component ───────────────────────────────────────────────────────── */
const JeePage = () => {
  return (
    <section className="w-full space-y-8">
      {/* Hero */}
      <div className="-mx-4 w-[calc(100%+2rem)] rounded-none bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 px-4 py-10 shadow-xl md:-mx-6 md:w-[calc(100%+3rem)] md:rounded-3xl md:px-10 md:py-14">
        <Reveal>
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            Instructis JEE Programme
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">
            Crack JEE Main &amp; Advanced with Structured, Data-Driven Preparation
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-blue-100 md:text-lg">
            Master Physics, Chemistry, and Mathematics through expert mentorship, targeted practice, and real-time performance analytics.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-center text-white">
            {[
              { value: '2 Lakh+', label: 'Seats in NITs/IIITs' },
              { value: '~23', label: 'IITs across India' },
              { value: '99+', label: 'Percentile possible with right strategy' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Exam Pattern */}
      <div className="w-full rounded-3xl bg-white dark:bg-zinc-900 px-4 py-8 shadow-xl shadow-stone-200 dark:shadow-none md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Exam Structure</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-gray-100 md:text-4xl">JEE Exam Pattern</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-gray-300">
              Understanding the paper structure helps you allocate preparation time more strategically.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {examPattern.map((exam, i) => (
            <Reveal key={exam.exam} direction="up" delay={i * 100}>
              <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/40 dark:bg-blue-900/10 p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100">{exam.exam}</h3>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                  <span className="rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1">{exam.mode}</span>
                  <span className="rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300 px-3 py-1">{exam.duration}</span>
                  <span className="rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-3 py-1">{exam.sessions}</span>
                </div>
                <table className="mt-5 w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-100 dark:border-blue-900 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <th className="pb-2">Subject</th>
                      <th className="pb-2 text-center">Questions</th>
                      <th className="pb-2 text-right">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam.sections.map((s) => (
                      <tr key={s.subject} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2 font-medium text-slate-800 dark:text-slate-200">{s.subject}</td>
                        <td className="py-2 text-center text-slate-600 dark:text-slate-400">{s.questions}</td>
                        <td className="py-2 text-right text-slate-600 dark:text-slate-400">{s.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold text-slate-900 dark:text-slate-100">
                      <td className="pt-3">Total</td>
                      <td />
                      <td className="pt-3 text-right">{exam.totalMarks}</td>
                    </tr>
                  </tfoot>
                </table>
                <p className="mt-4 text-xs text-rose-600 dark:text-rose-400">Negative marking: {exam.negative}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Subject Guides */}
      <div className="w-full rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800 px-4 py-8 shadow-xl shadow-stone-200 dark:shadow-none md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Subject-wise Breakdown</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-gray-100 md:text-4xl">Preparation Guide by Subject</h2>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {subjectGuides.map((sub, i) => (
            <Reveal key={sub.subject} direction="up" delay={i * 120}>
              <article className={`h-full rounded-2xl border p-6 ${sub.color}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{sub.icon}</span>
                  <div>
                    <h3 className={`text-xl font-bold ${sub.accent}`}>{sub.subject}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sub.badge}`}>
                      Weightage {sub.weightage}
                    </span>
                  </div>
                </div>
                <ul className="mt-5 space-y-2">
                  {sub.keyTopics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="mt-0.5 shrink-0 text-slate-400">›</span>
                      {topic}
                    </li>
                  ))}
                </ul>
                <p className={`mt-5 rounded-xl bg-white/70 dark:bg-black/40 p-3 text-sm italic ${sub.accent}`}>{sub.tips}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Preparation Timeline */}
      <div className="w-full rounded-3xl bg-white dark:bg-zinc-900 px-4 py-8 shadow-xl shadow-stone-200 dark:shadow-none md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Study Roadmap</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-gray-100 md:text-4xl">12-Month Preparation Timeline</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-gray-300">
              A structured roadmap helps you balance depth and breadth across the entire JEE syllabus.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {preparationTimeline.map((phase, i) => (
            <Reveal key={phase.phase} direction="up" delay={i * 100}>
              <div className={`rounded-2xl border-l-4 p-6 ${phase.color}`}>
                <span className={`text-xs font-bold uppercase tracking-[0.15em] ${phase.accent}`}>{phase.phase}</span>
                <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">{phase.label}</h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{phase.period}</p>
                <ul className="mt-4 space-y-2">
                  {phase.tasks.map((task) => (
                    <li key={task} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className={`mt-0.5 shrink-0 font-bold ${phase.accent}`}>✓</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="w-full rounded-3xl bg-gradient-to-br from-blue-900 to-cyan-900 px-4 py-8 shadow-xl md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Student Achievements</p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">JEE Success Stories from Instructis</h2>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {successStories.map((story, i) => (
            <Reveal key={story.name} direction="scale" delay={i * 100}>
              <article className="flex h-full flex-col rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{story.name}</h3>
                    <p className="text-sm text-cyan-200">{story.exam}</p>
                  </div>
                  <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-sm font-bold text-cyan-300">
                    {story.result}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-sm italic text-blue-100">"{story.quote}"</p>
                <p className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-cyan-300">
                  📈 {story.improvement}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="w-full rounded-3xl bg-white dark:bg-zinc-900 px-4 py-8 shadow-xl shadow-stone-200 dark:shadow-none md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Common Questions</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-gray-100 md:text-4xl">JEE FAQs</h2>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} direction="up" delay={i * 80}>
              <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/40 dark:bg-blue-900/10 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-gray-100">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-gray-300">{faq.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Reveal direction="scale">
        <div className="w-full rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-10 text-center shadow-xl md:px-8">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Ready to Begin Your JEE Journey?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-blue-100 md:text-base">
            Join Instructis today and get access to expert faculty, structured batches, and proven rank-boosting strategies.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Book a Free Demo Class
            </button>
            <button
              type="button"
              className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View JEE Batches
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default JeePage
