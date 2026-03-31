import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import Reveal from '../components/Reveal'

const contactDetails = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
        ),
        label: 'Email Us',
        value: 'support@instructis.in',
        href: 'mailto:support@instructis.in',
        tone: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800',
        iconBg: 'bg-sky-100 dark:bg-sky-900/40',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
        ),
        label: 'Call Us',
        value: '+91 98765 43210',
        href: 'tel:+919876543210',
        tone: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
        ),
        label: 'Visit Us',
        value: '42, Learning Hub Road, New Delhi — 110001',
        href: 'https://maps.google.com',
        tone: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800',
        iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
        label: 'Office Hours',
        value: 'Mon – Sat: 9 AM – 7 PM',
        href: null,
        tone: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
        iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    },
]

const faqs = [
    {
        question: 'How do I enroll in a batch?',
        answer: 'You can enroll by clicking "Enroll Now" on any course card, or by reaching out to our admissions team via email or phone. We will guide you through the process.',
    },
    {
        question: 'Are demo classes available before enrollment?',
        answer: 'Yes! We offer free demo classes for all our JEE and NEET batches. Book a demo session and experience our teaching methodology before committing.',
    },
    {
        question: 'Do you offer online and offline classes?',
        answer: 'We offer live online classes, recorded sessions, and hybrid modes depending on the program. Check individual course pages for the mode of delivery.',
    },
    {
        question: 'How are doubts handled?',
        answer: 'Dedicated doubt-solving sessions are conducted daily for each subject. Students can also raise doubts via our learning portal and get responses within 24 hours.',
    },
]

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' }

const ContactPage = () => {
    const heroRef = useRef(null)
    const [form, setForm] = useState(INITIAL_FORM)
    const [submitted, setSubmitted] = useState(false)
    const [openFaq, setOpenFaq] = useState(null)

    // Hero entrance animation
    useGSAP(
        () => {
            gsap.from(heroRef.current.querySelectorAll('.hero-item'), {
                opacity: 0,
                y: 40,
                stagger: 0.12,
                duration: 0.85,
                ease: 'power3.out',
            })
        },
        { scope: heroRef }
    )

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // In a real app this would call an API; here we just show a success state.
        setSubmitted(true)
        setForm(INITIAL_FORM)
        setTimeout(() => setSubmitted(false), 5000)
    }

    return (
        <section className="w-full space-y-8">
            {/* Hero */}
            <div
                ref={heroRef}
                className="-mx-4 w-[calc(100%+2rem)] rounded-none bg-linear-to-br from-sky-50 via-white to-violet-50 px-4 py-10 shadow-xl shadow-stone-200 md:-mx-6 md:w-[calc(100%+3rem)] md:rounded-3xl md:px-12 md:py-14 dark:from-sky-950 dark:via-gray-900 dark:to-violet-950 dark:shadow-none"
            >
                <div className="mx-auto max-w-2xl text-center">
                    <p className="hero-item inline-flex rounded-full border border-sky-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:border-sky-800 dark:bg-gray-800 dark:text-sky-300">
                        Get in Touch
                    </p>
                    <h1 className="hero-item mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-5xl dark:text-white">
                        We&apos;d Love to Hear from You
                    </h1>
                    <p className="hero-item mt-4 text-base text-slate-600 md:text-lg dark:text-slate-300">
                        Have questions about admissions, courses, or mentorship? Our team is ready to help you take the next step in your JEE or NEET journey.
                    </p>
                </div>
            </div>

            {/* Contact Details */}
            <Reveal>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {contactDetails.map((item, i) => (
                        <Reveal key={item.label} direction="up" delay={i * 80}>
                            <div className={`flex flex-col gap-3 rounded-2xl border p-5 ${item.tone}`}>
                                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg}`}>
                                    {item.icon}
                                </span>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] opacity-70">{item.label}</p>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            target={item.href.startsWith('http') ? '_blank' : undefined}
                                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className="mt-1 block text-sm font-medium leading-snug hover:underline sm:text-base"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="mt-1 text-sm font-medium leading-snug sm:text-base">{item.value}</p>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Reveal>

            {/* Contact Form + Map Placeholder */}
            <div className="grid gap-6 lg:grid-cols-5">
                {/* Form */}
                <Reveal direction="left" className="lg:col-span-3">
                    <div className="h-full rounded-3xl bg-white px-6 py-8 shadow-xl shadow-stone-200 md:px-8 dark:bg-gray-900 dark:shadow-none">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Send a Message</p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">Drop Us a Line</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Fill in the form and our team will get back to you within one business day.
                        </p>

                        {submitted && (
                            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Message sent! We&apos;ll be in touch shortly.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="contact-name"
                                        name="name"
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Riya Singh"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-600 dark:focus:ring-sky-900/30"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="contact-email"
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="riya@example.com"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-600 dark:focus:ring-sky-900/30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="contact-subject"
                                    name="subject"
                                    type="text"
                                    required
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="Inquiry about JEE batch enrollment"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-600 dark:focus:ring-sky-900/30"
                                />
                            </div>

                            <div>
                                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Tell us how we can help you…"
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-600 dark:focus:ring-sky-900/30"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 active:scale-[0.98] dark:bg-sky-700 dark:hover:bg-sky-600 sm:w-auto"
                            >
                                Send Message →
                            </button>
                        </form>
                    </div>
                </Reveal>

                {/* Map placeholder + quick info */}
                <Reveal direction="right" className="lg:col-span-2">
                    <div className="flex h-full flex-col gap-5">
                        {/* Map visual */}
                        <div className="flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-xl shadow-stone-200 dark:border-slate-700 dark:bg-gray-800 dark:shadow-none">
                            <div className="flex h-full min-h-52 flex-col items-center justify-center gap-3 p-6 text-center">
                                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                                    </svg>
                                </span>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">42, Learning Hub Road</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">New Delhi — 110001, India</p>
                                <a
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-700"
                                >
                                    Open in Maps
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Social links */}
                        <div className="rounded-3xl bg-white px-6 py-5 shadow-xl shadow-stone-200 dark:bg-gray-900 dark:shadow-none">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Follow Us</p>
                            <div className="mt-3 flex flex-wrap gap-3">
                                {[
                                    { label: 'YouTube', color: 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40', href: '#' },
                                    { label: 'Instagram', color: 'bg-pink-50 text-pink-600 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400 dark:hover:bg-pink-900/40', href: '#' },
                                    { label: 'Telegram', color: 'bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:hover:bg-sky-900/40', href: '#' },
                                    { label: 'Twitter / X', color: 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700', href: '#' },
                                ].map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${s.color}`}
                                    >
                                        {s.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* FAQ */}
            <Reveal>
                <div className="w-full rounded-3xl bg-white px-6 py-8 shadow-xl shadow-stone-200 md:px-8 dark:bg-gray-900 dark:shadow-none">
                    <div className="mx-auto max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">FAQ</p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">Frequently Asked Questions</h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Quick answers to common questions about our programs and enrollment.
                        </p>

                        <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
                            {faqs.map((faq, i) => (
                                <Reveal key={faq.question} direction="up" delay={i * 60}>
                                    <div className="py-4">
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="flex w-full items-center justify-between gap-4 text-left"
                                            aria-expanded={openFaq === i}
                                        >
                                            <span className="text-sm font-semibold text-slate-800 sm:text-base dark:text-white">
                                                {faq.question}
                                            </span>
                                            <span className={`shrink-0 text-sky-600 transition-transform duration-300 dark:text-sky-400 ${openFaq === i ? 'rotate-45' : ''}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </span>
                                        </button>
                                        {openFaq === i && (
                                            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                                {faq.answer}
                                            </p>
                                        )}
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </Reveal>

            {/* CTA Banner */}
            <Reveal direction="scale">
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-sky-500 via-sky-400 to-violet-500 px-6 py-10 text-center text-white shadow-xl shadow-stone-200 md:px-12 md:py-14 dark:shadow-none">
                    <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-16 left-8 h-52 w-52 rounded-full bg-violet-300/20 blur-2xl" />
                    <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-sky-100">Ready to Begin?</p>
                    <h2 className="relative mt-3 text-2xl font-bold md:text-3xl">
                        Start Your JEE or NEET Journey Today
                    </h2>
                    <p className="relative mx-auto mt-3 max-w-xl text-sm text-sky-100 md:text-base">
                        Speak with our admissions counsellor, book a free demo class, and find the right batch for you.
                    </p>
                    <div className="relative mt-6 flex flex-wrap justify-center gap-3">
                        <a
                            href="tel:+919876543210"
                            className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
                        >
                            Call Now
                        </a>
                        <a
                            href="mailto:support@instructis.in"
                            className="rounded-full border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Email Us
                        </a>
                    </div>
                </div>
            </Reveal>
        </section>
    )
}

export default ContactPage
