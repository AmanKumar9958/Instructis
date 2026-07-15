import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getFriendlyErrorMessage } from '../utils/errors'

export default function FacultyLoginPage() {
  const navigate = useNavigate()
  const { user, role, loginWithGoogle } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && role === 'Faculty') {
      navigate('/', { replace: true })
    }
  }, [user, role, navigate])

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle('Faculty')
      navigate('/', { replace: true })
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a12]">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(255,108,55,0.2)_0%,transparent_60%),radial-gradient(ellipse_at_70%_70%,rgba(129,52,175,0.22)_0%,transparent_60%),radial-gradient(ellipse_at_50%_10%,rgba(99,102,241,0.12)_0%,transparent_60%)]" />
        {/* Floating orbs */}
        <div className="absolute top-[20%] right-[10%] w-72 h-72 rounded-full bg-brand-orange/15 blur-[100px] animate-float" />
        <div className="absolute bottom-[15%] left-[10%] w-64 h-64 rounded-full bg-brand-purple/20 blur-[80px] animate-float-delayed" />
        <div className="absolute top-[50%] right-[55%] w-48 h-48 rounded-full bg-accent-indigo/10 blur-[80px] animate-float" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Back to Home link */}
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors mb-8 font-medium"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl shadow-[0_8px_60px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-1 bg-gradient-to-r from-brand-orange via-brand-purple to-brand-orange" />

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-purple/20 border border-white/[0.08] mb-5 shadow-[0_0_30px_rgba(255,108,55,0.2)]">
                <svg className="w-8 h-8 text-brand-orange-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.476.89 6.08 2.354M12 6.042c1.73-1.836 4.15-3.042 6.82-3.042.96 0 1.89.148 2.76.42v14.46A8.986 8.986 0 0018.42 18c-2.33 0-4.476.89-6.08 2.354M12 6.042V18" />
                </svg>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-orange-light/80 mb-3">Instructis</p>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Faculty Portal
              </h1>
              <p className="text-white/40 mt-3 text-sm font-medium leading-relaxed">
                Sign in with your Google account to access faculty tools
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 font-medium">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Google sign-in */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="relative w-full py-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white font-semibold text-sm transition-all hover:bg-white/[0.1] hover:border-white/[0.16] hover:shadow-[0_0_30px_rgba(255,108,55,0.15)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none group"
            >
              <span className="flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
                      <path fill="#EA4335" d="M12 10.2v3.95h5.5c-.24 1.27-.98 2.35-2.1 3.07l3.39 2.63c1.98-1.82 3.11-4.5 3.11-7.68 0-.73-.07-1.43-.19-2.1H12z" />
                      <path fill="#34A853" d="M12 22c2.97 0 5.46-.98 7.28-2.65l-3.39-2.63c-.94.63-2.15 1-3.89 1-2.99 0-5.52-2.02-6.43-4.73H2.07v2.97A10 10 0 0012 22z" />
                      <path fill="#4A90E2" d="M5.57 12.99a5.99 5.99 0 010-3.98V6.04H2.07a10 10 0 000 8.92l3.5-2.97z" />
                      <path fill="#FBBC05" d="M12 6.28c1.62 0 3.08.56 4.23 1.65l3.17-3.17C17.45 2.94 14.97 2 12 2A10 10 0 002.07 6.04l3.5 2.97C6.48 8.3 9.01 6.28 12 6.28z" />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.08]" />
              <span className="text-[10px] text-white/20 font-semibold uppercase tracking-widest">Faculty Access</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.08]" />
            </div>

            {/* Info cards */}
            <div className="space-y-3">
              {[
                { icon: '📊', label: 'Upload & manage student marks' },
                { icon: '📚', label: 'Create and manage your classes' },
                { icon: '👥', label: 'Track student enrollment' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.05] px-4 py-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-white/50 font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <p className="text-[10px] text-center text-white/20 mt-8 leading-relaxed">
              By continuing, you agree to Instructis' <span className="underline hover:text-white/40 cursor-pointer transition-colors">Terms</span> and <span className="underline hover:text-white/40 cursor-pointer transition-colors">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
