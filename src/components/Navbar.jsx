import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../context/ThemeContext'
import { ROLES } from '../utils/roles'
import LoginModal from './LoginModal'
import logo from '../assets/logo.webp'

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { user, profile, role, loginWithGoogle, logout, authActionLoading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const userBadgeClass =
    'rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
  const formatRole = (val) => (val || ROLES.STUDENT).replace(/_/g, ' ')

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleGoogleLogin = async (selectedRole) => {
    await loginWithGoogle(selectedRole)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur transition-shadow dark:bg-gray-950/90 ${
        isScrolled ? 'shadow-md shadow-slate-200/70 dark:shadow-black/40' : 'shadow-none'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <NavLink to="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight text-black dark:text-white">
          <img src={logo} alt="Instructis Logo" className="h-9 w-9 object-contain" />
          Instructis
        </NavLink>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            )}
          </button>

          {user && (
            <div className={`hidden items-center gap-2 ${userBadgeClass} md:flex`} aria-label="Current user">
              <span className="line-clamp-1 max-w-[140px]" title={profile?.displayName || user.displayName || 'User'}>
                {profile?.displayName || user.displayName || 'User'}
              </span>
              <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[10px] tracking-[0.08em] text-sky-700 dark:bg-sky-900 dark:text-sky-300">
                {formatRole(role)}
              </span>
            </div>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:-translate-y-[1px] hover:border-sky-300 hover:bg-sky-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-sky-700 dark:hover:bg-sky-900/40"
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200/70 transition hover:-translate-y-[1px] hover:shadow-xl dark:shadow-sky-900/40"
            >
              Login
            </button>
          )}

          {user && (
            <div className={`${userBadgeClass} md:hidden`} aria-label="Current user">
              {formatRole(role)}
            </div>
          )}
        </div>
      </div>

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
