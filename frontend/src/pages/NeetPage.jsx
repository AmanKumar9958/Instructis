import Reveal from '../components/Reveal'

/* ── data ─────────────────────────────────────────────────────────────── */

const examOverview = {
  fullForm: 'National Eligibility cum Entrance Test (Undergraduate)',
  conductedBy: 'National Testing Agency (NTA)',
  mode: 'Pen and Paper (OMR-based)',
  duration: '3 Hours 20 Minutes',
  totalQuestions: 200,
  attemptableQuestions: 180,
  totalMarks: 720,
  marking: '+4 for correct, -1 for incorrect',
  frequency: 'Once a year (May)',
  purpose: 'Admission to MBBS, BDS, BAMS, BSMS, BUMS, BHMS & other medical courses',
}

const examSections = [
  {
    subject: 'Physics',
    sectionA: '35 MCQs (all compulsory)',
    sectionB: '15 MCQs (attempt any 10)',
    totalMarks: 180,
    color: 'bg-sky-50 border-sky-100 text-sky-700',
  },
  {
    subject: 'Chemistry',
    sectionA: '35 MCQs (all compulsory)',
    sectionB: '15 MCQs (attempt any 10)',
    totalMarks: 180,
    color: 'bg-green-50 border-green-100 text-green-700',
  },
  {
    subject: 'Botany',
    sectionA: '35 MCQs (all compulsory)',
    sectionB: '15 MCQs (attempt any 10)',
    totalMarks: 180,
    color: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  },
  {
    subject: 'Zoology',
    sectionA: '35 MCQs (all compulsory)',
    sectionB: '15 MCQs (attempt any 10)',
    totalMarks: 180,
    color: 'bg-teal-50 border-teal-100 text-teal-700',
  },
]

const subjectGuides = [
  {
    subject: 'Biology (Botany + Zoology)',
    icon: '🌿',
    color: 'bg-emerald-50 border-emerald-100',
    accent: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    weightage: '50% (360 marks)',
    keyTopics: [
      'Cell Structure, Cell Division (Mitosis & Meiosis)',
      'Human Physiology (Digestion, Respiration, Nervous System)',
      'Plant Physiology (Photosynthesis, Respiration, Growth)',
      'Genetics & Evolution (Mendel, Molecular Basis)',
      'Biotechnology & Its Applications',
      'Ecology & Environment (Biodiversity, Biomes)',
    ],
    tips: 'NCERT is the Bible for NEET Biology. Read line-by-line, pay attention to diagrams, and revise frequently with active recall techniques.',
  },
  {
    subject: 'Physics',
    icon: '⚛️',
    color: 'bg-sky-50 border-sky-100',
    accent: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-700',
    weightage: '25% (180 marks)',
    keyTopics: [
      'Mechanics (Laws of Motion, Work–Energy, Rotational Motion)',
      'Electrostatics & Current Electricity',
      'Magnetic Effects of Current & Magnetism',
      'Ray Optics & Wave Optics',
      'Modern Physics (Dual Nature, Atoms, Nuclei)',
      'Thermodynamics & Properties of Matter',
    ],
    tips: 'Focus on NCERT concepts but solve numerical problems daily. NEET Physics rewards students who can apply formulae quickly under time pressure.',
  },
  {
    subject: 'Chemistry',
    icon: '🧪',
    color: 'bg-amber-50 border-amber-100',
    accent: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    weightage: '25% (180 marks)',
    keyTopics: [
      'Physical Chemistry: Mole Concept, Chemical Equilibrium, Electrochemistry',
      'Organic Chemistry: Biomolecules, Polymers, Named Reactions',
      'Inorganic Chemistry: p-block, d-block, Coordination Compounds',
      'Chemical Bonding & Molecular Structure',
      'Periodic Table & Periodic Trends',
      'Solutions & Surface Chemistry',
    ],
    tips: 'Inorganic and Organic Chemistry together contribute to majority of NEET Chemistry questions. NCERT examples and in-text questions are must-do.',
  },
]

const preparationStrategy = [
  {
    step: '01',
    title: 'NCERT Mastery',
    description:
      'Read every NCERT Biology, Physics, and Chemistry textbook from Class 11 and 12 with highlighter notes. Most NEET questions are directly from NCERT.',
    color: 'border-emerald-400 text-emerald-700',
    bg: 'bg-emerald-50',
  },
  {
    step: '02',
    title: 'Concept-Wise Practice',
    description:
      'After completing each chapter, solve 50–100 NEET-style MCQs from that chapter. Use quality question banks and previous year NEET papers.',
    color: 'border-amber-400 text-amber-700',
    bg: 'bg-amber-50',
  },
  {
    step: '03',
    title: 'Weekly Mock Tests',
    description:
      'Simulate real exam conditions with timed full-syllabus mocks every week. Analyse each result to find weak areas and prioritize them.',
    color: 'border-sky-400 text-sky-700',
    bg: 'bg-sky-50',
  },
  {
    step: '04',
    title: 'Rapid Revision Cycles',
    description:
      'Every 3 weeks, revise completed chapters using short notes, diagrams, and flashcards. Spaced repetition prevents forgetting critical facts.',
    color: 'border-rose-400 text-rose-700',
    bg: 'bg-rose-50',
  },
  {
    step: '05',
    title: 'Biology Deep Dive',
    description:
      'Biology is 50% of NEET marks. Dedicate at least 55% of your daily study time to Biology. Focus on diagrams, life cycles, and technical terms.',
    color: 'border-teal-400 text-teal-700',
    bg: 'bg-teal-50',
  },
  {
    step: '06',
    title: 'Error Analysis',
    description:
      'Maintain an error log. Note every wrong answer with the reason for the mistake. Revisit this log before every mock test to avoid repeating errors.',
    color: 'border-violet-400 text-violet-700',
    bg: 'bg-violet-50',
  },
]

const successStories = [
  {
    name: 'Ananya Patel',
    result: '685 / 720',
    exam: 'NEET UG',
    quote:
      'Active recall and NCERT mapping with Instructis faculty completely changed how I studied Biology. I went from dreading it to scoring 350+ in Biology alone.',
    improvement: 'Biology: 62% → 97%',
  },
  {
    name: 'Riya Joshi',
    result: 'AIR 447',
    exam: 'NEET UG',
    quote:
      'The structured timetable and weekly performance reviews kept me on track throughout the year. I always knew exactly where I stood.',
    improvement: 'Overall Rank improved from 8,000+ to 447',
  },
  {
    name: 'Arjun Nair',
    result: '672 / 720',
    exam: 'NEET UG (Dropper)',
    quote:
      'As a dropper, I was demoralized after my first attempt. Instructis rebuilt my strategy and confidence from the ground up.',
    improvement: 'Score improved by 218 marks in one year',
  },
]

const importantChapters = [
  {
    subject: 'Biology',
    chapters: [
      'Cell Biology & Cell Division',
      'Human Physiology (all systems)',
      'Genetics & Molecular Biology',
      'Plant Kingdom & Animal Kingdom',
      'Reproduction in Plants & Animals',
      'Biotechnology',
      'Ecology & Environment',
    ],
    color: 'bg-emerald-900 text-white',
    badge: 'bg-emerald-700',
  },
  {
    subject: 'Physics',
    chapters: [
      'Modern Physics',
      'Electrostatics & Current',
      'Optics',
      'Laws of Motion & Work–Energy',
      'Magnetic Effects',
      'Semiconductor Devices',
      'Thermodynamics',
    ],
    color: 'bg-sky-900 text-white',
    badge: 'bg-sky-700',
  },
  {
    subject: 'Chemistry',
    chapters: [
      'Biomolecules & Polymers',
      'Coordination Compounds',
      'Chemical Bonding',
      'p-block Elements',
      'Organic Reaction Mechanisms',
      'Mole Concept & Equilibrium',
      'Solutions & Electrochemistry',
    ],
    color: 'bg-amber-900 text-white',
    badge: 'bg-amber-700',
  },
]

const faqs = [
  {
    q: 'Who is eligible to appear for NEET UG?',
    a: 'Students who have passed Class 12 with Physics, Chemistry, Biology/Biotechnology as compulsory subjects and have scored at least 50% aggregate (40% for SC/ST/OBC) are eligible.',
  },
  {
    q: 'How many times can I attempt NEET?',
    a: 'As per 2023 NTA guidelines, there is no restriction on the number of NEET attempts. Students can appear until they are 25 years old (30 for reserved categories).',
  },
  {
    q: 'Is NEET required for all medical courses?',
    a: 'Yes. NEET is mandatory for all MBBS, BDS, BAMS, BSMS, BUMS, BHMS, and BVSc&AH courses in India, whether government or private.',
  },
  {
    q: 'What is a good score for government medical college?',
    a: 'A score of 600+ (out of 720) is generally considered competitive for government medical colleges. For top AIIMS and JIPMER, you need 680+ and a very high percentile.',
  },
]

/* ── Scroll-reveal wrapper ────────────────────────────────────────────── */

/* ── Component ───────────────────────────────────────────────────────── */
const NeetPage = () => {
  return (
    <section className="w-full space-y-8">
      {/* Hero */}
      <div className="-mx-4 w-[calc(100%+2rem)] rounded-none bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-4 py-10 shadow-xl md:-mx-6 md:w-[calc(100%+3rem)] md:rounded-3xl md:px-10 md:py-14">
        <Reveal>
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            Instructis NEET Programme
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">
            Achieve a Top NEET Score and Secure Your Medical Seat
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-emerald-100 md:text-lg">
            Master Biology, Physics, and Chemistry with NCERT-aligned learning, expert mentorship, and exam-focused practice at Instructis.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-center text-white">
            {[
              { value: '1.1M+', label: 'Students appear for NEET each year' },
              { value: '720', label: 'Maximum marks possible' },
              { value: '600+', label: 'Score target for govt. medical college' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-emerald-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Exam Overview */}
      <div className="w-full rounded-3xl bg-white px-4 py-8 shadow-xl shadow-stone-200 md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Exam at a Glance</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">NEET UG Overview</h2>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'Conducted By', value: examOverview.conductedBy },
            { label: 'Mode', value: examOverview.mode },
            { label: 'Duration', value: examOverview.duration },
            { label: 'Total Questions', value: `${examOverview.totalQuestions} (attempt ${examOverview.attemptableQuestions})` },
            { label: 'Total Marks', value: examOverview.totalMarks },
            { label: 'Marking Scheme', value: examOverview.marking },
          ].map((item, i) => (
            <Reveal key={item.label} direction="up" delay={i * 60}>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-600">{item.label}</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{item.value}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Section-wise breakdown */}
        <Reveal delay={200}>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-emerald-100">
            <table className="w-full min-w-[500px] text-sm">
              <thead className="bg-emerald-50">
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Section A</th>
                  <th className="px-4 py-3">Section B</th>
                  <th className="px-4 py-3 text-right">Max Marks</th>
                </tr>
              </thead>
              <tbody>
                {examSections.map((sec, i) => (
                  <tr key={sec.subject} className={`border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className={`px-4 py-3 font-semibold ${sec.color.split(' ').pop()}`}>{sec.subject}</td>
                    <td className="px-4 py-3 text-slate-600">{sec.sectionA}</td>
                    <td className="px-4 py-3 text-slate-600">{sec.sectionB}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">{sec.totalMarks}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-emerald-200 bg-emerald-50 font-bold text-slate-900">
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-slate-600" />
                  <td className="px-4 py-3 text-slate-600" />
                  <td className="px-4 py-3 text-right">720</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>

      {/* Subject Guides */}
      <div className="w-full rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-8 shadow-xl shadow-stone-200 md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Subject Breakdown</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">How to Prepare Each Subject</h2>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {subjectGuides.map((sub, i) => (
            <Reveal key={sub.subject} direction="up" delay={i * 120}>
              <article className={`h-full rounded-2xl border p-6 ${sub.color}`}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{sub.icon}</span>
                  <div>
                    <h3 className={`text-lg font-bold ${sub.accent}`}>{sub.subject}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sub.badge}`}>
                      {sub.weightage}
                    </span>
                  </div>
                </div>
                <ul className="mt-5 space-y-2">
                  {sub.keyTopics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 shrink-0 text-slate-400">›</span>
                      {topic}
                    </li>
                  ))}
                </ul>
                <p className={`mt-5 rounded-xl bg-white/70 p-3 text-sm italic ${sub.accent}`}>{sub.tips}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Preparation Strategy */}
      <div className="w-full rounded-3xl bg-white px-4 py-8 shadow-xl shadow-stone-200 md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Winning Strategy</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">6-Step NEET Preparation Strategy</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
              A proven six-step approach followed by Instructis top scorers to consistently achieve 650+.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {preparationStrategy.map((step, i) => (
            <Reveal key={step.step} direction="up" delay={i * 80}>
              <div className={`rounded-2xl border-l-4 p-6 ${step.bg} ${step.color.split(' ')[0]}`}>
                <span className={`text-3xl font-black ${step.color.split(' ')[1]}`}>{step.step}</span>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Important Chapters */}
      <div className="w-full rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-8 shadow-xl md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">High-Yield Topics</p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">Most Important NEET Chapters</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-400">
              These chapters appear repeatedly in NEET papers and contribute the most to your score.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {importantChapters.map((item, i) => (
            <Reveal key={item.subject} direction="up" delay={i * 100}>
              <div className={`rounded-2xl p-6 ${item.color}`}>
                <h3 className="text-xl font-bold">{item.subject}</h3>
                <ul className="mt-4 space-y-2">
                  {item.chapters.map((ch) => (
                    <li key={ch} className="flex items-start gap-2 text-sm opacity-90">
                      <span className="mt-0.5 shrink-0">✦</span>
                      {ch}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="w-full rounded-3xl bg-white px-4 py-8 shadow-xl shadow-stone-200 md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Student Achievements</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">NEET Success Stories from Instructis</h2>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {successStories.map((story, i) => (
            <Reveal key={story.name} direction="scale" delay={i * 100}>
              <article className="flex h-full flex-col rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{story.name}</h3>
                    <p className="text-sm text-emerald-600">{story.exam}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                    {story.result}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-sm italic text-slate-600">"{story.quote}"</p>
                <p className="mt-4 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
                  📈 {story.improvement}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="w-full rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-8 shadow-xl shadow-stone-200 md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Common Questions</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">NEET FAQs</h2>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} direction="up" delay={i * 80}>
              <div className="rounded-2xl border border-emerald-200 bg-white p-5">
                <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Reveal direction="scale">
        <div className="w-full rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-10 text-center shadow-xl md:px-8">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Start Your NEET Preparation with Instructis</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-emerald-100 md:text-base">
            Join thousands of successful NEET aspirants. Get access to expert biology faculty, structured batches, and comprehensive mock tests.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Book a Free Demo Class
            </button>
            <button
              type="button"
              className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View NEET Batches
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default NeetPage
