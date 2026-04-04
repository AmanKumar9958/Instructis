import Reveal from '../Reveal'

const testimonials = [
  {
    name: 'Aryan Sharma',
    course: 'JEE Advanced 2025',
    rank: 'AIR 412',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote:
      'Instructis completely changed how I approached JEE. The personalized doubt sessions and weekly analytics kept me on track every single week. I went from struggling with mechanics to solving JEE Advanced problems confidently.',
    stars: 5,
  },
  {
    name: 'Priya Verma',
    course: 'NEET UG 2025',
    rank: '680 / 720',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote:
      'The NCERT-first strategy and grand tests made all the difference. My Biology score jumped by 40 marks in just two months. The mentors are incredibly patient and always available for doubt resolution.',
    stars: 5,
  },
  {
    name: 'Rohit Meena',
    course: 'JEE Main 2025',
    rank: '99.4 Percentile',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    quote:
      "I was a dropper and felt lost, but Instructis's structured plan and mock series rebuilt my confidence. The performance analytics showed me exactly where I was losing marks—it's like having a personal coach.",
    stars: 5,
  },
  {
    name: 'Sneha Gupta',
    course: 'NEET UG 2025',
    rank: '650 / 720',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    quote:
      'The live classes are engaging and the recorded sessions are a lifesaver for revision. I loved the crash revision playlists before the exam—they covered everything I needed in a concise format.',
    stars: 5,
  },
  {
    name: 'Karan Patel',
    course: 'JEE Advanced 2025',
    rank: 'AIR 890',
    avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
    quote:
      "The faculty here actually understand how JEE tests concepts. Every session felt productive. The rank-focused mocks were spot-on in difficulty and the detailed solutions helped me understand my mistakes.",
    stars: 5,
  },
  {
    name: 'Ananya Singh',
    course: 'JEE Main 2025',
    rank: '98.7 Percentile',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    quote:
      'Instructis made me believe in myself again after a bad attempt. The mentor assigned to me was supportive and the topic heatmaps showed exactly which chapters needed more work. Highly recommend!',
    stars: 5,
  },
]

const StarRating = ({ count }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill={i < count ? '#F59E0B' : '#E5E7EB'}
        className="h-4 w-4"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
      </svg>
    ))}
  </div>
)

const TestimonialsSection = () => {
  return (
    <section className="-mx-4 w-[calc(100%+2rem)] bg-gradient-to-br from-indigo-50 via-white to-green-50 px-4 py-16 md:-mx-6 md:w-[calc(100%+3rem)] md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal direction="up">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-green-700">
              Student Stories
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-4xl">
              What Our Students{' '}
              <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Say
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
              Real results from real students. Join thousands who turned their JEE &amp; NEET dreams into ranks.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <Reveal key={t.name + t.rank} direction="up" delay={idx * 90}>
              <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-100/60">
                {/* Quote icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mb-3 h-7 w-7 text-indigo-200"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>

                {/* Stars */}
                <StarRating count={t.stars} />

                {/* Quote */}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>

                {/* Divider */}
                <div className="my-4 h-px bg-slate-100" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.course}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    {t.rank}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
