import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LoginModal from '../components/LoginModal'
import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loginWithGoogle, authActionLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (user) {
      const nextPath = location.state?.from || '/'
      navigate(nextPath, { replace: true })
    }
  }, [location.state, navigate, user])

  const handleLogin = async (selectedRole) => {
    await loginWithGoogle(selectedRole)
    const nextPath = location.state?.from || '/'
    navigate(nextPath, { replace: true })
  }

  return (
    <section className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl shadow-stone-200 md:p-10 dark:bg-gray-800 dark:shadow-none">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">Instructis Portal</p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-900 md:text-4xl dark:text-white">Login Required</h1>
      <p className="mt-3 text-base text-neutral-600 md:text-lg dark:text-neutral-300">
        Continue with Google and pick your role to access your dashboard.
      </p>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700"
        >
          Open Login Popup
        </button>
      </div>

      <LoginModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLogin={handleLogin}
        loading={authActionLoading}
      />
    </section>
  )
}

export default LoginPage
