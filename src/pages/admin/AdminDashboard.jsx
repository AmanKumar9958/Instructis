import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../firebase/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { BookOpen, Users, GraduationCap, ArrowRight, TrendingUp, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ batches: 0, teachers: 0, students: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [batchSnap, teacherSnap, studentSnap] = await Promise.all([
          getDocs(collection(db, 'batches')),
          getDocs(query(collection(db, 'users'), where('role', '==', 'Faculty'))),
          getDocs(query(collection(db, 'users'), where('role', '==', 'Student'))),
        ])
        setStats({
          batches: batchSnap.size,
          teachers: teacherSnap.size,
          students: studentSnap.size,
        })
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    {
      label: 'Total Batches',
      value: stats.batches,
      icon: BookOpen,
      color: 'from-brand-purple to-accent-indigo',
      shadowColor: 'shadow-brand-purple/15',
      link: '/admin/batches',
      linkLabel: 'Manage Batches',
    },
    {
      label: 'Total Teachers',
      value: stats.teachers,
      icon: Users,
      color: 'from-brand-orange to-accent-amber',
      shadowColor: 'shadow-brand-orange/15',
      link: '/admin/teachers',
      linkLabel: 'Manage Teachers',
    },
    {
      label: 'Total Students',
      value: stats.students,
      icon: GraduationCap,
      color: 'from-accent-emerald to-accent-cyan',
      shadowColor: 'shadow-accent-emerald/15',
      link: '/admin/students',
      linkLabel: 'Manage Students',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-purple mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          Overview
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 font-medium mt-1 text-sm">
          Welcome back! Here's what's happening across your platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`relative bg-white rounded-2xl border border-gray-100 p-6 shadow-lg ${card.shadowColor} overflow-hidden group hover:shadow-xl transition-shadow duration-300`}
          >
            {/* Background glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${card.color} opacity-[0.06] group-hover:opacity-[0.1] transition-opacity`} />

            <div className="relative">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-md`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{card.label}</p>

              {loading ? (
                <div className="h-9 w-16 bg-gray-100 rounded-lg animate-pulse" />
              ) : (
                <p className="text-3xl font-black text-gray-900 tracking-tight">{card.value}</p>
              )}

              <Link
                to={card.link}
                className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-brand-purple hover:text-brand-purple-dark transition-colors group/link"
              >
                {card.linkLabel}
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { to: '/admin/batches', label: 'Create New Batch', desc: 'Add a new course batch', icon: BookOpen, color: 'text-brand-purple bg-brand-light-purple' },
            { to: '/admin/teachers', label: 'Approve Teachers', desc: 'Review pending faculty', icon: Users, color: 'text-brand-orange bg-orange-50' },
            { to: '/admin/students', label: 'Assign Students', desc: 'Assign batches to students', icon: GraduationCap, color: 'text-accent-emerald bg-emerald-50' },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center flex-shrink-0`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 group-hover:text-brand-purple transition-colors">{action.label}</p>
                <p className="text-xs text-gray-400">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
