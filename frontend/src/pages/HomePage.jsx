import { useEffect, useState } from 'react'
import sixToTen from '../assets/6-10.svg'
import doctor from '../assets/doctor.svg'
import engineer from '../assets/engineer.svg'
import slider1 from '../assets/slider_1.webp'
import slider2 from '../assets/slider_2.webp'
import slider3 from '../assets/slider_3.webp'

const sliderImages = [slider1, slider2, slider3]

const goals = [
    { title: 'Doctor', image: doctor },
    { title: 'Engineer', image: engineer },
    { title: '6-10th', image: sixToTen },
]

const courseCategories = [
    { id: 'class-11', label: 'Class 11th' },
    { id: 'class-12', label: 'Class 12th' },
    { id: 'class-12-plus', label: 'Class 12th+' },
]

const coursesByCategory = {
    'class-11': [
        {
            title: 'Foundation Physics 11',
            mode: 'Live + Recorded',
            duration: '9 Months',
            description: 'Build strong concepts with weekly tests, doubt clearing, and chapter-wise practice.',
        },
        {
            title: 'Chemistry Core 11',
            mode: 'Live Interactive',
            duration: '8 Months',
            description: 'Covers Physical, Organic, and Inorganic chemistry with revision drills.',
        },
        {
            title: 'Mathematics Mastery 11',
            mode: 'Self Paced + Live Mentoring',
            duration: '10 Months',
            description: 'Topic-wise problem solving sessions designed for school and olympiad readiness.',
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
            title: 'Boards + Entrance Combo',
            mode: 'Hybrid Learning',
            duration: '10 Months',
            description: 'Balanced schedule for board exams and competitive entrance preparation.',
        },
    ],
    'class-12-plus': [
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
            title: 'Scholarship Preparation Track',
            mode: 'Weekend Intensive',
            duration: '6 Months',
            description: 'Targeted preparation for scholarship exams with curated test simulations.',
        },
    ],
}

const testimonials = [
    {
        name: 'Ananya Verma',
        role: 'NEET Aspirant',
        rating: '5.0',
        feedback:
            'The structured classes and daily practice sheets helped me improve my Biology score significantly.',
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
            'Mentors keep us updated on progress regularly. The learning dashboard is clear and easy to track.',
    },
]

const HomePage = () => {
    const [activeSlide, setActiveSlide] = useState(0)
    const [selectedCategory, setSelectedCategory] = useState('class-12-plus')

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
            <div className="-mx-4 w-[calc(100%+2rem)] overflow-hidden rounded-none bg-white shadow-xl shadow-stone-200 md:-mx-6 md:w-[calc(100%+3rem)] md:rounded-3xl">
            <div className="relative h-52 overflow-hidden md:h-72 md:rounded-2xl lg:h-80">
                    {sliderImages.map((image, index) => (
                        <img
                            key={image}
                            src={image}
                            alt={`Home slider ${index + 1}`}
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                                activeSlide === index ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    ))}

                    <button
                        type="button"
                        onClick={goToPrevious}
                        aria-label="Previous slide"
                        className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-900 shadow transition hover:bg-white"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={goToNext}
                        aria-label="Next slide"
                        className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-900 shadow transition hover:bg-white"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className="mt-4 flex justify-center gap-2">
                    {sliderImages.map((_, index) => (
                        <button
                            key={`dot-${index}`}
                            type="button"
                            onClick={() => setActiveSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2 w-2 rounded-full transition ${
                                activeSlide === index ? 'bg-sky-500' : 'bg-neutral-300'
                            }`}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full py-2 text-center">
                <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                    Select your goal
                </h2>
                <p className="mt-2 text-xl font-semibold text-sky-500 md:text-3xl">
                    to explore our courses
                </p>

                <div className="mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {goals.map((goal) => (
                        <div key={goal.title} className="mx-auto w-full max-w-fit">
                            <div className="rounded-3xl bg-slate-100 p-3 shadow-sm">
                                <img src={goal.image} alt={goal.title} className="mx-auto h-28 w-28 rounded-2xl object-contain md:h-32 md:w-32" />
                            </div>
                            <p className="mt-3 text-xl font-semibold text-slate-900 md:text-2xl">{goal.title}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Courses Section */}
            <div className="w-full rounded-3xl bg-white px-4 py-8 text-center shadow-xl shadow-stone-200 md:px-8 md:mt-20">
                <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">Our Courses</h2>
                <p className="mx-auto mt-3 max-w-4xl text-base text-sky-500 md:text-2xl">
                    Explore our programs designed for Foundation, JEE, and NEET aspirants
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    {courseCategories.map((category) => {
                        const isActive = selectedCategory === category.id

                        return (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setSelectedCategory(category.id)}
                                className={`rounded-xl border px-5 py-2 text-base font-semibold transition ${
                                    isActive
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-slate-300 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50 hover:cursor-pointer'
                                }`}
                            >
                                {category.label}
                            </button>
                        )
                    })}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {coursesByCategory[selectedCategory].map((course) => (
                        <article
                            key={course.title}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm"
                        >
                            <h3 className="text-xl font-semibold text-slate-900">{course.title}</h3>
                            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-blue-700">{course.mode}</p>
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

            <div className="w-full rounded-3xl bg-white px-4 py-8 text-center shadow-xl shadow-stone-200 md:px-8 md:mt-20">
                <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">What Students Say</h2>
                <p className="mx-auto mt-3 max-w-3xl text-base text-sky-500 md:text-lg">
                    Hear from learners and parents about their experience with our courses.
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
