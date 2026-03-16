import { useEffect, useState } from 'react'
import doctor from '../assets/doctor.svg'
import engineer from '../assets/engineer.svg'
import slider1 from '../assets/slider_1.webp'
import slider2 from '../assets/slider_2.webp'
import slider3 from '../assets/slider_3.webp'

const sliderImages = [slider1, slider2, slider3]

const goals = [
    { title: 'NEET Aspirant', image: doctor },
    { title: 'JEE Aspirant', image: engineer },
]

const highlights = [
    {
        title: 'Learning Experience',
        description: 'Concept-first teaching for Physics, Chemistry, Biology, and Mathematics with daily support.',
        tone: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    },
    {
        title: 'Expert Instructors',
        description: 'Mentors with proven JEE and NEET track records, focused on rank-oriented strategy.',
        tone: 'bg-amber-50 border-amber-100 text-amber-700',
    },
    {
        title: 'Score Improvement System',
        description: 'Test analytics, revision plans, and doubt-solving workflows that improve exam performance.',
        tone: 'bg-cyan-50 border-cyan-100 text-cyan-700',
    },
]

const courseCategories = [
    { id: 'class-11', label: 'Class 11' },
    { id: 'class-12', label: 'Class 12' },
    { id: 'dropper', label: 'Dropper' },
]

const coursesByCategory = {
    'class-11': [
        {
            title: 'JEE Foundation PCM (Class 11)',
            mode: 'Live + Recorded',
            duration: '9 Months',
            description: 'Strong concept building for Physics, Chemistry, and Mathematics with weekly rank tests.',
        },
        {
            title: 'NEET Foundation PCB (Class 11)',
            mode: 'Live Interactive',
            duration: '8 Months',
            description: 'NCERT-aligned Physics, Chemistry, and Biology schedule with chapter-level assessments.',
        },
        {
            title: 'JEE + Olympiad Problem Solving',
            mode: 'Self Paced + Live Mentoring',
            duration: '10 Months',
            description: 'High-quality worksheets and challenge sessions for advanced problem solving practice.',
        },
    ],
    'class-12': [
        {
            title: 'NEET Target Batch 12',
            mode: 'Live + Test Series',
            duration: '12 Months',
            description: 'Complete biology-focused track with NCERT intensive preparation and mocks.',
        },
        {
            title: 'JEE Main Focus 12',
            mode: 'Live + Recorded',
            duration: '11 Months',
            description: 'Accelerated PCM track with daily practice problems and performance analytics.',
        },
        {
            title: 'JEE + NEET Boards Integrated Program',
            mode: 'Hybrid Learning',
            duration: '10 Months',
            description: 'Balanced schedule for board exams and competitive entrance preparation.',
        },
    ],
    dropper: [
        {
            title: 'NEET Dropper Pro',
            mode: 'Full Day Mentored',
            duration: '12 Months',
            description: 'Structured repeater plan with adaptive tests and personalized mentor calls.',
        },
        {
            title: 'JEE Advanced Repeaters',
            mode: 'Live Classroom',
            duration: '12 Months',
            description: 'Advanced-level problem solving bootcamp for top-rank engineering aspirants.',
        },
        {
            title: 'Rapid Revision + Grand Test Series',
            mode: 'Intensive Hybrid',
            duration: '5 Months',
            description: 'Final attempt acceleration with full syllabus tests, ranking insights, and paper strategy.',
        },
    ],
}

const testimonials = [
    {
        name: 'Ananya Verma',
        role: 'NEET Aspirant',
        rating: '5.0',
        feedback:
            'The structured classes and daily practice sheets helped me improve my Biology score significantly and stay consistent.',
    },
    {
        name: 'Rohit Sharma',
        role: 'JEE Student, Class 12',
        rating: '4.9',
        feedback:
            'Doubt sessions are super effective, and the mock tests feel very close to real exam patterns.',
    },
    {
        name: 'Priya Mehta',
        role: 'Parent',
        rating: '4.8',
        feedback:
            'Mentors keep us updated on progress regularly. The dashboard and test reports are clear and motivating.',
    },
]

const HomePage = () => {
    const [activeSlide, setActiveSlide] = useState(0)
    const [selectedCategory, setSelectedCategory] = useState('class-12')

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % sliderImages.length)
        }, 3500)

        return () => clearInterval(timer)
    }, [])

    const goToPrevious = () => {
        setActiveSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
    }

    const goToNext = () => {
        setActiveSlide((prev) => (prev + 1) % sliderImages.length)
    }

    return (
        <section className="w-full space-y-8">
            <div className="-mx-4 w-[calc(100%+2rem)] rounded-none bg-linear-to-br from-emerald-50 via-white to-cyan-50 px-4 py-8 shadow-xl shadow-stone-200 md:-mx-6 md:w-[calc(100%+3rem)] md:rounded-3xl md:px-8 md:py-10">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                    <div>
                        <p className="inline-flex rounded-full border border-emerald-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                            Instructis JEE | NEET Academy
                        </p>
                        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
                            Grow Your Exam Performance with Smart JEE and NEET Preparation
                        </h1>
                        <p className="mt-4 max-w-xl text-base text-slate-600 md:text-lg">
                            Learn with structured batches, expert mentors, and data-backed test analysis for top engineering and medical entrance results.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                Get Started
                            </button>
                            <button
                                type="button"
                                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50"
                            >
                                Explore Courses
                            </button>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-600">
                            <p>
                                <span className="font-bold text-slate-900">15k+</span> Students Trained
                            </p>
                            <p>
                                <span className="font-bold text-slate-900">300+</span> Weekly Practice Sets
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative overflow-hidden rounded-4xl border border-emerald-100 bg-white p-3 shadow-lg shadow-emerald-100/60">
                            <div className="relative h-64 overflow-hidden rounded-3xl md:h-80">
                                {sliderImages.map((image, index) => (
                                    <img
                                        key={image}
                                        src={image}
                                        alt={`Instructis highlight ${index + 1}`}
                                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                                            activeSlide === index ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={goToPrevious}
                                aria-label="Previous slide"
                                className="absolute left-5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-900 shadow transition hover:bg-white"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={goToNext}
                                aria-label="Next slide"
                                className="absolute right-5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-900 shadow transition hover:bg-white"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-emerald-100 bg-white px-3 py-2 shadow-sm">
                            {sliderImages.map((_, index) => (
                                <button
                                    key={`dot-${index}`}
                                    type="button"
                                    onClick={() => setActiveSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                    className={`h-2.5 w-2.5 rounded-full transition ${
                                        activeSlide === index ? 'bg-emerald-500' : 'bg-neutral-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full rounded-3xl bg-white px-4 py-8 shadow-xl shadow-stone-200 md:px-8">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Core Features</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Interactive Learning for JEE and NEET</h2>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {highlights.map((item) => (
                        <article key={item.title} className={`rounded-2xl border p-6 ${item.tone}`}>
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                        </article>
                    ))}
                </div>
            </div>

            <div className="w-full rounded-3xl bg-linear-to-r from-emerald-50 to-cyan-50 px-4 py-8 shadow-xl shadow-stone-200 md:px-8">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                    <div className="relative mx-auto w-full max-w-md">
                        <img
                            src={slider2}
                            alt="Instructis JEE NEET coaching"
                            className="h-full w-full rounded-4xl object-cover shadow-lg"
                        />
                        <div className="absolute -right-3 bottom-4 rounded-2xl bg-white px-4 py-3 shadow-md">
                            <p className="text-sm font-semibold text-slate-900">Top Rank Mentorship</p>
                            <p className="text-xs text-slate-500">Daily doubt-solving and performance tracking</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">About Instructis</p>
                        <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                            Focused Preparation for Medical and Engineering Entrances
                        </h2>
                        <p className="mt-4 text-base text-slate-600">
                            Instructis combines top faculty guidance, competitive practice, and strategic revision planning to help students excel in JEE and NEET examinations.
                        </p>
                        <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                            <p className="rounded-xl bg-white px-4 py-3">Comprehensive PCM and PCB roadmaps</p>
                            <p className="rounded-xl bg-white px-4 py-3">Weekly test series with rank insights</p>
                            <p className="rounded-xl bg-white px-4 py-3">Personalized study and revision plans</p>
                            <p className="rounded-xl bg-white px-4 py-3">Parent progress updates and mentoring</p>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-6 text-emerald-700">
                            <div>
                                <p className="text-3xl font-bold">30+</p>
                                <p className="text-sm text-slate-600">Expert Faculty</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">6k+</p>
                                <p className="text-sm text-slate-600">Selections & Top Ranks</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full rounded-3xl bg-white px-4 py-8 text-center shadow-xl shadow-stone-200 md:px-8">
                <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">Choose Your Goal</h2>
                <p className="mt-2 text-base font-medium text-emerald-600 md:text-xl">
                    Start your JEE or NEET journey with the right batch.
                </p>

                <div className="mx-auto mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
                    {goals.map((goal) => (
                        <div key={goal.title} className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4">
                            <img src={goal.image} alt={goal.title} className="mx-auto h-28 w-28 rounded-2xl object-contain md:h-32 md:w-32" />
                            <p className="mt-3 text-xl font-semibold text-slate-900 md:text-2xl">{goal.title}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full rounded-3xl bg-white px-4 py-8 text-center shadow-xl shadow-stone-200 md:px-8">
                <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">Our Courses</h2>
                <p className="mx-auto mt-3 max-w-4xl text-base text-emerald-600 md:text-xl">
                    Program tracks built for Class 11, Class 12, and droppers targeting JEE and NEET.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    {courseCategories.map((category) => {
                        const isActive = selectedCategory === category.id

                        return (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setSelectedCategory(category.id)}
                                className={`rounded-xl border px-5 py-2 text-sm font-semibold transition md:text-base ${
                                    isActive
                                        ? 'border-emerald-600 bg-emerald-600 text-white'
                                        : 'border-slate-300 bg-white text-slate-900 hover:border-emerald-300 hover:bg-emerald-50'
                                }`}
                            >
                                {category.label}
                            </button>
                        )
                    })}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 text-left md:grid-cols-2 xl:grid-cols-3">
                    {coursesByCategory[selectedCategory].map((course) => (
                        <article
                            key={course.title}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
                        >
                            <h3 className="text-xl font-semibold text-slate-900">{course.title}</h3>
                            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-emerald-700">{course.mode}</p>
                            <p className="mt-1 text-sm text-slate-500">Duration: {course.duration}</p>
                            <p className="mt-4 text-base text-slate-600">{course.description}</p>
                            <button
                                type="button"
                                className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                            >
                                View Details
                            </button>
                        </article>
                    ))}
                </div>
            </div>

            <div className="w-full rounded-3xl bg-white px-4 py-8 text-center shadow-xl shadow-stone-200 md:px-8">
                <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">Success Voices</h2>
                <p className="mx-auto mt-3 max-w-3xl text-base text-emerald-600 md:text-lg">
                    Learners and parents sharing their Instructis JEE and NEET preparation experience.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {testimonials.map((item) => (
                        <article key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                                    <p className="text-sm text-slate-500">{item.role}</p>
                                </div>
                                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                                    {item.rating} ★
                                </span>
                            </div>
                            <p className="mt-4 text-base text-slate-600">“{item.feedback}”</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HomePage
