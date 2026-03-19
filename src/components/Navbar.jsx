import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../context/ThemeContext'
import { ROLES } from '../utils/roles'
import LoginModal from './LoginModal'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/jee', label: 'JEE' },
  { to: '/neet', label: 'NEET' },
  { to: '/faculty-marks-upload', label: 'Faculty Marks Upload' },
]

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const { user, profile, role, hasRole, loginWithGoogle, logout, authActionLoading } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const allowedLinks = navLinks.filter((link) => {
    if (link.to !== '/faculty-marks-upload') {
      return true
    }

    return hasRole([ROLES.FACULTY])
  })

  const handleGoogleLogin = async (selectedRole) => {
    await loginWithGoogle(selectedRole)
    setIsMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setIsMobileMenuOpen(false)
  }

  const navLinkClassName = ({ isActive }) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
      isActive
        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300'
        : 'text-black hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800'
    }`

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-700 dark:bg-gray-900/95">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <NavLink to="/" className="text-2xl font-semibold tracking-wide text-black dark:text-white">
          Instructis
        </NavLink>

        <div className="hidden items-center gap-3 md:flex">
          <nav className="flex items-center gap-2" aria-label="Primary">
            {allowedLinks.map((link) => (
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

          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg bg-neutral-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                {profile?.displayName || user.displayName || 'User'}
                <span className="ml-2 rounded-md bg-sky-100 px-2 py-1 text-[10px] tracking-[0.08em] text-sky-700 dark:bg-sky-900 dark:text-sky-300">
                  {(role || ROLES.STUDENT).replace('_', ' ')}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-red-500 hover:text-white hover:cursor-pointer dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 hover:cursor-pointer dark:bg-sky-600 dark:hover:bg-sky-700"
            >
              Login
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            )}
          </button>
            <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="grid h-10 w-10 place-items-center rounded-lg text-black transition hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
            >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16 d" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-gray-900 md:hidden" aria-label="Mobile primary">
          <div className="flex flex-col gap-2">
            {allowedLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClassName}
              >
                {link.label}
              </NavLink>
            ))}

            {user ? (
              <>
                <div className="mt-1 flex items-center rounded-lg bg-neutral-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {profile?.displayName || user.displayName || 'User'}
                  <span className="ml-2 rounded-md bg-sky-100 px-2 py-1 text-[10px] tracking-[0.08em] text-sky-700 dark:bg-sky-900 dark:text-sky-300">
                    {(role || ROLES.STUDENT).replace('_', ' ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 rounded-lg border border-neutral-300 px-4 py-2 text-center text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsLoginModalOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="mt-1 rounded-lg bg-sky-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleGoogleLogin}
        loading={authActionLoading}
      />
    </header>
  )
}

export default Navbar
