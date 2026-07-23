import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ToastProvider } from '../admin/Toast'
import {
  LayoutDashboard,
  Video,
  FileQuestion,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Loader2,
  UploadCloud,
  History,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/teacher/classes', label: 'Live Classes', icon: Video },
  { to: '/teacher/quizzes', label: 'Quizzes', icon: FileQuestion },
  { to: '/teacher/marks-upload', label: 'Marks Upload', icon: UploadCloud },
  { to: '/teacher/marks-history', label: 'Marks History', icon: History },
  { to: '/teacher/students', label: 'My Students', icon: Users },
]

export default function TeacherLayout() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // Guard — redirect non-faculty
  if (role !== 'Faculty') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl border border-red-100 p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-6">You need Faculty privileges to access this panel.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-brand-purple text-white font-bold rounded-xl text-sm hover:bg-brand-purple-dark transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/')
    } finally {
      setLoggingOut(false)
    }
  }

  const Sidebar = ({ isMobile = false }) => (
    <aside className={`${isMobile ? 'w-full' : 'w-64'} flex flex-col bg-[#0F0F14] text-white h-full`}>
      {/* Brand header */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black tracking-tight">
              INSTRUCTIS<span className="text-brand-orange">.</span>
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 mt-0.5">Faculty Panel</p>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-white/60" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/25'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
              }`
            }
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span className="flex-1">{item.label}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all" />
          </NavLink>
        ))}
      </nav>

      {/* Faculty profile & logout */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple-light text-xs font-bold flex-shrink-0">
            {user?.displayName?.charAt(0) || user?.name?.charAt(0) || 'F'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white/80 truncate">{user?.displayName || user?.name || 'Faculty'}</p>
            <p className="text-[10px] text-brand-orange font-semibold uppercase tracking-wider">Faculty</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
        >
          {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          {loggingOut ? 'Signing out...' : 'Logout'}
        </button>
      </div>
    </aside>
  )

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-gray-50/80">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex h-screen sticky top-0">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-72 h-full animate-[slideInLeft_0.2s_ease-out]">
              <Sidebar isMobile />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          {/* Top bar (mobile) */}
          <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-black text-brand-purple tracking-tight">
              INSTRUCTIS<span className="text-brand-orange">.</span>
            </h1>
            <div className="w-9" /> {/* spacer for centering */}
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
