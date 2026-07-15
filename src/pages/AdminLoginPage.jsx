import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getFriendlyErrorMessage } from '../utils/errors'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { user, role, loginSuperAdmin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    if (user && role === 'SuperAdmin') {
      navigate('/', { replace: true })
    }
  }, [user, role, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginSuperAdmin(email, password)
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(129,52,175,0.25)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(99,102,241,0.2)_0%,transparent_60%),radial-gradient(ellipse_at_50%_80%,rgba(255,108,55,0.12)_0%,transparent_60%)]" />
        {/* Floating orbs */}
        <div className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full bg-brand-purple/20 blur-[100px] animate-float" />
        <div className="absolute bottom-[20%] right-[15%] w-64 h-64 rounded-full bg-accent-indigo/15 blur-[80px] animate-float-delayed" />
        <div className="absolute top-[60%] left-[60%] w-48 h-48 rounded-full bg-brand-orange/10 blur-[80px] animate-float" />
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
          <div className="h-1 bg-gradient-to-r from-brand-purple via-accent-indigo to-brand-purple" />

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple/20 to-accent-indigo/20 border border-white/[0.08] mb-5 shadow-[0_0_30px_rgba(129,52,175,0.2)]">
                <svg className="w-8 h-8 text-brand-purple-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-purple-light/80 mb-3">Instructis</p>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Admin Portal
              </h1>
              <p className="text-white/40 mt-3 text-sm font-medium leading-relaxed">
                Secure access for system administrators
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 font-medium">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'email' ? 'text-brand-purple-light' : 'text-white/25'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 text-sm font-medium outline-none transition-all focus:border-brand-purple/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(129,52,175,0.1)]"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'password' ? 'text-brand-purple-light' : 'text-white/25'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 text-sm font-medium outline-none transition-all focus:border-brand-purple/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(129,52,175,0.1)]"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-4 rounded-xl bg-gradient-to-r from-brand-purple to-accent-indigo text-white font-bold text-sm transition-all hover:shadow-[0_0_30px_rgba(129,52,175,0.35)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-brand-purple-dark to-accent-indigo opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Authenticating...
                    </>
                  ) : (
                    'Sign In as Admin'
                  )}
                </span>
              </button>
            </form>

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
