import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const location = useLocation()
  const { user, hasRole } = useAuth()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (!hasRole(allowedRoles)) {
    return (
      <section className="w-full max-w-3xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-xl shadow-rose-100">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-700">Access Restricted</p>
        <h1 className="mt-3 text-3xl font-semibold text-rose-900 md:text-4xl">You do not have permission</h1>
        <p className="mt-3 text-base text-rose-700 md:text-lg">
          Your account role does not have access to this page.
        </p>
      </section>
    )
  }

  return children
}

export default ProtectedRoute
