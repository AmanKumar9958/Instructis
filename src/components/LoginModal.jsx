import { useState } from 'react'
import { createPortal } from 'react-dom'
import { ROLE_OPTIONS } from '../utils/roles'

const LoginModal = ({ isOpen, onClose, onLogin, loading }) => {
    const [selectedRole, setSelectedRole] = useState('')
    const [error, setError] = useState('')

    if (!isOpen) {
        return null
    }

    const handleSubmit = async () => {
        if (!selectedRole) {
        setError('Please select your role before signing in.')
        return
        }

        setError('')

        try {
        await onLogin(selectedRole)
        setSelectedRole('')
        onClose()
        } catch (loginError) {
        setError(loginError.message || 'Sign in failed. Please try again.')
        }
    }

    return createPortal(
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/35 px-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        >
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl shadow-black/20 md:p-8 dark:bg-gray-800 dark:shadow-none">
            <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-400">Instructis</p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white">Sign in</h2>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700 hover:cursor-pointer dark:text-neutral-400 dark:hover:bg-gray-700 dark:hover:text-neutral-200"
                aria-label="Close login modal"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>

            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">Choose your role and continue with Google.</p>

            <label className="mt-6 block">
            <span className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Role</span>
            <select
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-sky-400 hover:cursor-pointer dark:border-neutral-600 dark:bg-gray-700 dark:text-white"
            >
                <option value="">Select role</option>
                {ROLE_OPTIONS.map((roleOption) => (
                <option key={roleOption.value} value={roleOption.value}>
                    {roleOption.label}
                </option>
                ))}
            </select>
            </label>

            {error && <p className="mt-3 text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>}

            <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-neutral-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                <path
                fill="#EA4335"
                d="M12 10.2v3.95h5.5c-.24 1.27-.98 2.35-2.1 3.07l3.39 2.63c1.98-1.82 3.11-4.5 3.11-7.68 0-.73-.07-1.43-.19-2.1H12z"
                />
                <path
                fill="#34A853"
                d="M12 22c2.97 0 5.46-.98 7.28-2.65l-3.39-2.63c-.94.63-2.15 1-3.89 1-2.99 0-5.52-2.02-6.43-4.73H2.07v2.97A10 10 0 0012 22z"
                />
                <path
                fill="#4A90E2"
                d="M5.57 12.99a5.99 5.99 0 010-3.98V6.04H2.07a10 10 0 000 8.92l3.5-2.97z"
                />
                <path
                fill="#FBBC05"
                d="M12 6.28c1.62 0 3.08.56 4.23 1.65l3.17-3.17C17.45 2.94 14.97 2 12 2A10 10 0 002.07 6.04l3.5 2.97C6.48 8.3 9.01 6.28 12 6.28z"
                />
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
            </button>
        </div>
        </div>,
        document.body
    )
}

export default LoginModal
