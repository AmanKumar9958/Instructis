import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../hooks/useAuth'
import {
  Video, FileQuestion, Users, ShieldCheck, BookOpen, ArrowRight,
  Plus, UploadCloud, Calendar, Clock, Sparkles, TrendingUp,
  CircleDot, Layers
} from 'lucide-react'
import examData from '../../data/examData'
import { aiMlCourses } from '../../data/aiMlData'
import { codingCourses } from '../../data/codingData'

/* ── Animated Counter ── */
function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (value === 0) { setDisplay(0); return }
    let start = 0
    const startTime = performance.now()

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }

    ref.current = requestAnimationFrame(tick)
    return () => ref.current && cancelAnimationFrame(ref.current)
  }, [value, duration])

  return <span>{display}</span>
}

/* ── Greeting helper ── */
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ classes: 0, quizzes: 0, students: 0 })
  const [assignedBatches, setAssignedBatches] = useState([])
  const [recentClasses, setRecentClasses] = useState([])
  const [recentQuizzes, setRecentQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!user) return

      try {
        // Fetch classes (resilient)
        let classesCount = 0
        let fetchedClasses = []
        try {
          const classesQuery = query(collection(db, 'live_classes'), where('teacher_id', '==', user.uid))
          const classesSnapshot = await getDocs(classesQuery)
          classesCount = classesSnapshot.size
          fetchedClasses = classesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          // Sort locally and take last 5
          fetchedClasses.sort((a, b) => {
            const dateA = a.scheduled_at?.toDate ? a.scheduled_at.toDate() : new Date(a.scheduled_at)
            const dateB = b.scheduled_at?.toDate ? b.scheduled_at.toDate() : new Date(b.scheduled_at)
            return dateB - dateA
          })
          setRecentClasses(fetchedClasses.slice(0, 5))
        } catch (clsErr) {
          console.warn("Could not fetch classes", clsErr)
        }

        // Fetch quizzes (resilient)
        let quizzesCount = 0
        try {
          const quizzesQuery = query(collection(db, 'quizzes'), where('teacher_id', '==', user.uid))
          const quizzesSnapshot = await getDocs(quizzesQuery)
          quizzesCount = quizzesSnapshot.size
          const fetchedQuizzes = quizzesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          fetchedQuizzes.sort((a, b) => {
            const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at || 0)
            const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at || 0)
            return dateB - dateA
          })
          setRecentQuizzes(fetchedQuizzes.slice(0, 5))
        } catch (quizErr) {
          console.warn("Could not fetch quizzes", quizErr)
        }

        let assignedBatchesArr = user.assigned_batches || []
        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userDocSnap = await getDoc(userDocRef)
          const freshUser = userDocSnap.exists() ? { ...user, ...userDocSnap.data() } : user
          assignedBatchesArr = freshUser.assigned_batches || []
        } catch (usrErr) {
          console.warn("Could not fetch fresh user", usrErr)
        }

        let studentCount = 0
        if (assignedBatchesArr.length > 0) {
          // Fetch batches names
          let firebaseBatchList = []
          try {
            const batchesQuery = query(collection(db, 'batches'))
            const batchesSnapshot = await getDocs(batchesQuery)
            firebaseBatchList = batchesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          } catch (batchErr) {
             console.warn("Could not fetch batches collection", batchErr)
          }

          const staticBatches = [
            ...examData.map(e => ({ id: e.id, name: e.shortName || e.name })),
            ...aiMlCourses.map(c => ({ id: c.title.toLowerCase().replace(/\s+/g, '-'), name: c.title })),
            ...codingCourses.map(c => ({ id: c.title.toLowerCase().replace(/\s+/g, '-'), name: c.title }))
          ]

          const allSystemBatches = [...staticBatches, ...firebaseBatchList]
          const uniqueBatchesMap = new Map()
          allSystemBatches.forEach(b => uniqueBatchesMap.set(b.id, b))
          const finalBatchList = Array.from(uniqueBatchesMap.values())

          const assigned = finalBatchList.filter(b => assignedBatchesArr.includes(b.id))
          setAssignedBatches(assigned)

          // Fetch students
          try {
            if (assignedBatchesArr.length <= 10) {
              const studentsQuery = query(
                collection(db, 'users'),
                where('role', '==', 'Student'),
                where('assigned_batches', 'array-contains-any', assignedBatchesArr)
              )
              const studentsSnapshot = await getDocs(studentsQuery)
              studentCount = studentsSnapshot.size
            } else {
              let total = 0
              for (let i = 0; i < assignedBatchesArr.length; i += 10) {
                const chunk = assignedBatchesArr.slice(i, i + 10)
                const q = query(
                  collection(db, 'users'),
                  where('role', '==', 'Student'),
                  where('assigned_batches', 'array-contains-any', chunk)
                )
                const snap = await getDocs(q)
                total += snap.size
              }
              studentCount = total
            }
          } catch (stuErr) {
            console.warn("Could not fetch students", stuErr)
          }
        }

        setStats({
          classes: classesCount,
          students: studentCount,
          quizzes: quizzesCount
        })
      } catch (err) {
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  const profileImageUrl = user?.profile_url || user?.photoURL || ''
  const greeting = getGreeting()

  const statCards = [
    {
      label: 'Classes Hosted',
      value: stats.classes,
      icon: Video,
      color: 'from-brand-orange to-amber-500',
      shadowColor: 'shadow-brand-orange/15',
      link: '/teacher/classes',
      linkLabel: 'Manage Classes',
    },
    {
      label: 'Active Quizzes',
      value: stats.quizzes,
      icon: FileQuestion,
      color: 'from-brand-purple to-accent-indigo',
      shadowColor: 'shadow-brand-purple/15',
      link: '/teacher/quizzes',
      linkLabel: 'Manage Quizzes',
    },
    {
      label: 'Total Students',
      value: stats.students,
      icon: Users,
      color: 'from-accent-emerald to-accent-cyan',
      shadowColor: 'shadow-accent-emerald/15',
      link: '/teacher/students',
      linkLabel: 'View Students',
    },
  ]

  const quickActions = [
    { to: '/teacher/classes', label: 'Schedule Class', desc: 'Create a live session', icon: Plus, color: 'text-brand-orange bg-orange-50 group-hover:bg-orange-100' },
    { to: '/teacher/quizzes', label: 'Create Quiz', desc: 'Build an assessment', icon: FileQuestion, color: 'text-brand-purple bg-purple-50 group-hover:bg-purple-100' },
    { to: '/teacher/students', label: 'View Students', desc: 'Browse batch enrollees', icon: Users, color: 'text-accent-emerald bg-emerald-50 group-hover:bg-emerald-100' },
    { to: '/teacher/marks-upload', label: 'Upload Marks', desc: 'Upload student scores', icon: UploadCloud, color: 'text-accent-blue bg-blue-50 group-hover:bg-blue-100' },
  ]

  return (
    <div className="space-y-8">

      {/* ═══ Hero Welcome Banner ═══ */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          animation: 'zoomIn 0.5s ease-out both',
        }}
      >
        {/* Gradient mesh background */}
        <div className="absolute inset-0 gradient-mesh opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent" />
        {/* Decorative orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-brand-purple/15 to-transparent blur-3xl animate-float" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-brand-orange/10 to-transparent blur-3xl animate-float-delayed" />

        <div className="relative p-6 md:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/80 backdrop-blur-sm shadow-elevated flex items-center justify-center text-brand-purple font-bold text-3xl overflow-hidden ring-4 ring-white/50">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'F')}&background=random`
                    }}
                  />
                ) : (
                  user?.name?.charAt(0) || 'F'
                )}
              </div>
              {/* Online dot */}
              {user?.is_whitelisted && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg border-[3px] border-white flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-purple/70">{greeting}</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-1">
                {user?.name || 'Faculty Member'}
              </h1>
              <p className="text-gray-500 text-sm md:text-base mb-3">{user?.email}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {user?.is_whitelisted && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 backdrop-blur-sm text-emerald-700 text-xs font-bold border border-emerald-200/60 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Active Faculty
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm text-gray-600 text-xs font-semibold border border-gray-200/60 shadow-sm">
                  <span className="text-gray-400">ID:</span>
                  {user?.teacher_id || user?.uid?.substring(0, 8)}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-purple/5 backdrop-blur-sm text-brand-purple text-xs font-bold border border-brand-purple/10 shadow-sm">
                  <Layers className="w-3.5 h-3.5" />
                  {assignedBatches.length} Batch{assignedBatches.length !== 1 ? 'es' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Stats Grid ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className={`relative bg-white rounded-2xl border border-gray-100 p-6 shadow-lg ${card.shadowColor} overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
            style={{
              animation: 'zoomIn 0.4s ease-out both',
              animationDelay: `${150 + i * 100}ms`,
            }}
          >
            {/* Background glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${card.color} opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500`} />

            <div className="relative">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-md`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{card.label}</p>

              {loading ? (
                <div className="h-9 w-16 bg-gray-100 rounded-lg animate-pulse" />
              ) : (
                <p className="text-3xl font-black text-gray-900 tracking-tight">
                  <AnimatedNumber value={card.value} />
                </p>
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

      {/* ═══ Quick Actions ═══ */}
      <div
        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        style={{
          animation: 'zoomIn 0.4s ease-out both',
          animationDelay: '500ms',
        }}
      >
        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.to + action.label}
              to={action.to}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center flex-shrink-0 transition-colors`}>
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

      {/* ═══ Recent Activity ═══ */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        style={{
          animation: 'zoomIn 0.4s ease-out both',
          animationDelay: '600ms',
        }}
      >
        {/* Recent Classes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Video className="w-4.5 h-4.5 text-brand-orange" />
              Recent Classes
            </h2>
            <Link to="/teacher/classes" className="text-xs font-bold text-brand-purple hover:text-brand-purple-dark transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentClasses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <Video className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-900">No classes yet</p>
              <p className="text-xs text-gray-400 mt-1">Schedule your first live class</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentClasses.map((cls) => {
                const dateObj = cls.scheduled_at?.toDate ? cls.scheduled_at.toDate() : new Date(cls.scheduled_at)
                return (
                  <div
                    key={cls.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-colors group"
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cls.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate group-hover:text-brand-purple transition-colors">{cls.title}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${cls.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cls.is_active ? 'Live' : 'Ended'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Quizzes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <FileQuestion className="w-4.5 h-4.5 text-brand-purple" />
              Recent Quizzes
            </h2>
            <Link to="/teacher/quizzes" className="text-xs font-bold text-brand-purple hover:text-brand-purple-dark transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentQuizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <FileQuestion className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-900">No quizzes yet</p>
              <p className="text-xs text-gray-400 mt-1">Create your first quiz</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentQuizzes.map((quiz) => {
                const dateObj = quiz.created_at?.toDate ? quiz.created_at.toDate() : new Date(quiz.created_at || Date.now())
                const questionCount = quiz.questions?.length || 0
                return (
                  <div
                    key={quiz.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-brand-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate group-hover:text-brand-purple transition-colors">
                        {quiz.chapter_name || 'Untitled Quiz'}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-400">{quiz.topic_name || '—'}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <CircleDot className="w-3 h-3" />
                          {questionCount} Q{questionCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400 flex-shrink-0">
                      {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Assigned Batches ═══ */}
      {assignedBatches.length > 0 && (
        <div
          style={{
            animation: 'zoomIn 0.4s ease-out both',
            animationDelay: '700ms',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-purple" />
              Your Batches
            </h2>
            <Link to="/teacher/students" className="text-xs font-bold text-brand-purple hover:text-brand-purple-dark transition-colors flex items-center gap-1">
              View Students <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x">
            {assignedBatches.map((batch, i) => {
              // Cycle through accent colors
              const accents = [
                'from-brand-purple to-accent-indigo',
                'from-brand-orange to-amber-500',
                'from-accent-emerald to-accent-cyan',
                'from-accent-blue to-accent-indigo',
                'from-accent-rose to-pink-500',
              ]
              const accent = accents[i % accents.length]

              return (
                <Link
                  key={batch.id}
                  to="/teacher/students"
                  className="snap-start flex-shrink-0 w-56 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group relative overflow-hidden"
                >
                  {/* Accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent}`} />

                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center mb-3 shadow-md`}>
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-brand-purple transition-colors">
                    {batch.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    View enrolled students
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
