import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/faculty-marks-upload', label: 'Faculty Marks Upload' },
]

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinkClassName = ({ isActive }) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition ${
      isActive ? 'bg-sky-100 text-sky-700' : 'text-black hover:bg-neutral-100'
    }`

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="text-2xl font-semibold tracking-wide text-black">Instructis</div>

        <div className="hidden items-center gap-3 md:flex">
          <nav className="flex items-center gap-2" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClassName}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/login"
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Login
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="grid h-10 w-10 place-items-center rounded-lg text-black transition hover:bg-neutral-100 md:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav className="border-t border-neutral-200 bg-white px-4 py-3 md:hidden" aria-label="Mobile primary">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClassName}
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-1 rounded-lg bg-sky-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              Login
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
