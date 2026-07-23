import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../hooks/useAuth'
import {
  BookOpen, Users, Calendar, Clock, Loader2, AlertCircle, Sparkles,
  Video, FileQuestion, ArrowRight, PlayCircle, ExternalLink, Layers,
  GraduationCap, CheckCircle2, CircleDot, Award, ChevronDown
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
    const startTime = performance.now()

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
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

export default function StudentDashboard() {
  const { user } = useAuth()
  const [assignedBatches, setAssignedBatches] = useState([])
  const [faculty, setFaculty] = useState([])
  const [liveClasses, setLiveClasses] = useState([])
  const [upcomingClasses, setUpcomingClasses] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [expandedQuizIds, setExpandedQuizIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return

      try {
        setLoading(true)
        setError(null)
        // 1. Fetch fresh user doc
        let assignedBatchesArr = user.assigned_batches || []
        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userDocSnap = await getDoc(userDocRef)
          if (userDocSnap.exists()) {
            assignedBatchesArr = userDocSnap.data().assigned_batches || assignedBatchesArr
          }
        } catch (userErr) {
          console.warn("Could not fetch fresh user doc, using cached user data.", userErr)
        }

        if (assignedBatchesArr.length === 0) {
          setAssignedBatches([])
          setFaculty([])
          setLoading(false)
          return
        }

        // 2. Resolve Batch Names
        let firebaseBatchList = []
        try {
          const batchesQuery = query(collection(db, 'batches'))
          const batchesSnapshot = await getDocs(batchesQuery)
          firebaseBatchList = batchesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        } catch (batchErr) {
          console.warn("Could not fetch batches from firestore due to permissions, falling back to static batches.", batchErr)
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

        const resolvedBatches = finalBatchList.filter(b => assignedBatchesArr.includes(b.id))
        setAssignedBatches(resolvedBatches)

        // 3. Fetch Faculty
        let relatedFaculty = []
        try {
          if (assignedBatchesArr.length <= 10) {
            const facultyQuery = query(
              collection(db, 'users'),
              where('role', '==', 'Faculty'),
              where('assigned_batches', 'array-contains-any', assignedBatchesArr)
            )
            const facultySnapshot = await getDocs(facultyQuery)
            relatedFaculty = facultySnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          } else {
            const chunked = []
            for (let i = 0; i < assignedBatchesArr.length; i += 10) {
              chunked.push(assignedBatchesArr.slice(i, i + 10))
            }
            const allFac = []
            for (const chunk of chunked) {
              const q = query(
                collection(db, 'users'),
                where('role', '==', 'Faculty'),
                where('assigned_batches', 'array-contains-any', chunk)
              )
              const snap = await getDocs(q)
              snap.forEach(d => allFac.push({ id: d.id, ...d.data() }))
            }
            // deduplicate
            const uniqueFac = new Map()
            allFac.forEach(f => uniqueFac.set(f.id, f))
            relatedFaculty = Array.from(uniqueFac.values())
          }
        } catch (facultyErr) {
          console.warn("Could not fetch faculty from users collection due to permissions. Proceeding without faculty list or falling back.", facultyErr)

          try {
            const classesRef = collection(db, 'live_classes')
            const chunkedBatches = []
            for (let i = 0; i < assignedBatchesArr.length; i += 10) {
              chunkedBatches.push(assignedBatchesArr.slice(i, i + 10))
            }

            const uniqueTeachers = new Map()
            for (const chunk of chunkedBatches) {
              if (chunk.length === 0) continue
              const q = query(classesRef, where('batch_id', 'in', chunk))
              const snap = await getDocs(q)
              snap.forEach(d => {
                const data = d.data()
                if (data.teacher_name) {
                  const existing = uniqueTeachers.get(data.teacher_name)
                  if (existing) {
                    if (!existing.assigned_batches.includes(data.batch_id)) {
                      existing.assigned_batches.push(data.batch_id)
                    }
                  } else {
                    uniqueTeachers.set(data.teacher_name, {
                      id: data.teacher_name,
                      name: data.teacher_name,
                      assigned_batches: [data.batch_id]
                    })
                  }
                }
              })
            }
            relatedFaculty = Array.from(uniqueTeachers.values())
          } catch (fallbackErr) {
            console.warn("Fallback failed", fallbackErr)
          }
        }
        setFaculty(relatedFaculty)

        // 4. Fetch Live Classes for assigned batches
        try {
          const classesRef = collection(db, 'live_classes')
          const allFetchedClasses = []
          const batchChunks = []
          for (let i = 0; i < assignedBatchesArr.length; i += 10) {
            batchChunks.push(assignedBatchesArr.slice(i, i + 10))
          }
          for (const chunk of batchChunks) {
            const q = query(classesRef, where('batch_id', 'in', chunk))
            const snap = await getDocs(q)
            snap.forEach(d => allFetchedClasses.push({ id: d.id, ...d.data() }))
          }

          const now = Date.now()
          const live = allFetchedClasses.filter(c => c.is_active && (c.scheduled_at?.toMillis() || 0) <= now)
          const upcoming = allFetchedClasses
            .filter(c => (c.scheduled_at?.toMillis() || 0) > now)
            .sort((a, b) => (a.scheduled_at?.toMillis() || 0) - (b.scheduled_at?.toMillis() || 0))
            .slice(0, 3)

          setLiveClasses(live)
          setUpcomingClasses(upcoming)
        } catch (classErr) {
          console.warn("Could not fetch classes", classErr)
        }

        // 5. Fetch Quizzes for assigned batches
        try {
          const allQuizzes = []
          const quizChunks = []
          for (let i = 0; i < assignedBatchesArr.length; i += 10) {
            quizChunks.push(assignedBatchesArr.slice(i, i + 10))
          }
          for (const chunk of quizChunks) {
            const q = query(collection(db, 'quizzes'), where('batch_id', 'in', chunk))
            const snap = await getDocs(q)
            snap.forEach(d => allQuizzes.push({ id: d.id, ...d.data() }))
          }
          // Deduplicate and sort newest first
          const uniqueQuizMap = new Map()
          allQuizzes.forEach(q => uniqueQuizMap.set(q.id, q))
          const dedupedQuizzes = Array.from(uniqueQuizMap.values())
          dedupedQuizzes.sort((a, b) => {
            const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at || 0)
            const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at || 0)
            return dateB - dateA
          })
          setQuizzes(dedupedQuizzes)
        } catch (quizErr) {
          console.warn("Could not fetch quizzes", quizErr)
        }

      } catch (err) {
        console.error("Error fetching student dashboard:", err)
        setError("Failed to load dashboard data.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const toggleQuizExpanded = (quizId) => {
    setExpandedQuizIds(prev => {
      const next = new Set(prev)
      if (next.has(quizId)) next.delete(quizId)
      else next.add(quizId)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <p className="font-medium">{error}</p>
      </div>
    )
  }

  // Empty state handling
  if (assignedBatches.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">No Batches Assigned</h2>
        <p className="text-gray-500 mb-8">
          You have not been assigned to a batch yet. Please contact the administration to get access to your classes and materials.
        </p>
      </div>
    )
  }

  const profileImageUrl = user?.profile_url || user?.photoURL || ''
  const greeting = getGreeting()

  const statCards = [
    {
      label: 'Enrolled Batches',
      value: assignedBatches.length,
      icon: Layers,
      color: 'from-brand-purple to-accent-indigo',
      shadowColor: 'shadow-brand-purple/15',
    },
    {
      label: 'Live Classes',
      value: liveClasses.length,
      icon: PlayCircle,
      color: 'from-red-500 to-rose-500',
      shadowColor: 'shadow-red-500/15',
    },
    {
      label: 'Available Quizzes',
      value: quizzes.length,
      icon: FileQuestion,
      color: 'from-brand-orange to-amber-500',
      shadowColor: 'shadow-brand-orange/15',
    },
    {
      label: 'Faculty Members',
      value: faculty.length,
      icon: GraduationCap,
      color: 'from-accent-emerald to-accent-cyan',
      shadowColor: 'shadow-accent-emerald/15',
    },
  ]

  return (
    <div className="space-y-8">

      {/* ═══ Hero Welcome Banner ═══ */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{ animation: 'zoomIn 0.5s ease-out both' }}
      >
        <div className="absolute inset-0 gradient-mesh opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent" />
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
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'S')}&background=random`
                    }}
                  />
                ) : (
                  user?.name?.charAt(0) || 'S'
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-purple/70">{greeting}</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-1">
                {user?.name || 'Student'}
              </h1>
              <p className="text-gray-500 text-sm md:text-base mb-3">{user?.email}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {assignedBatches.map(b => (
                  <span key={b.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-purple/5 backdrop-blur-sm text-brand-purple text-xs font-bold border border-brand-purple/10 shadow-sm">
                    <BookOpen className="w-3 h-3" />
                    {b.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Stats Grid ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className={`relative bg-white rounded-2xl border border-gray-100 p-5 shadow-lg ${card.shadowColor} overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
            style={{ animation: 'zoomIn 0.4s ease-out both', animationDelay: `${150 + i * 80}ms` }}
          >
            <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500`} />
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-md`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{card.label}</p>
              <p className="text-2xl font-black text-gray-900 tracking-tight">
                <AnimatedNumber value={card.value} />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Live & Upcoming Classes ═══ */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        style={{ animation: 'zoomIn 0.4s ease-out both', animationDelay: '500ms' }}
      >
        {/* Live Now */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-red-500" />
              Live Now
              {liveClasses.length > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold py-0.5 px-2 rounded-full animate-pulse">{liveClasses.length}</span>
              )}
            </h2>
            <Link to="/student/classes" className="text-xs font-bold text-brand-purple hover:text-brand-purple-dark transition-colors flex items-center gap-1">
              All Classes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {liveClasses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <PlayCircle className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-900">No live classes right now</p>
              <p className="text-xs text-gray-400 mt-1">Check upcoming classes below</p>
            </div>
          ) : (
            <div className="space-y-3">
              {liveClasses.map(cls => {
                const dateObj = cls.scheduled_at ? new Date(cls.scheduled_at.toMillis()) : new Date()
                return (
                  <div key={cls.id} className="p-4 rounded-xl border-2 border-red-100 bg-red-50/30">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{cls.title}</h3>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">by {cls.teacher_name || 'Faculty'}</p>
                    <a
                      href={cls.meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                    >
                      Join Now <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-purple" />
              Upcoming Classes
            </h2>
            <Link to="/student/classes" className="text-xs font-bold text-brand-purple hover:text-brand-purple-dark transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-900">No upcoming classes</p>
              <p className="text-xs text-gray-400 mt-1">Your teachers haven't scheduled any yet</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingClasses.map(cls => {
                const dateObj = cls.scheduled_at ? new Date(cls.scheduled_at.toMillis()) : new Date()
                return (
                  <div key={cls.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-brand-purple" />
                    </div>
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
                    <span className="text-xs text-gray-400">{cls.teacher_name}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Available Quizzes ═══ */}
      <div
        style={{ animation: 'zoomIn 0.4s ease-out both', animationDelay: '600ms' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-brand-orange" />
            Available Quizzes
            {quizzes.length > 0 && (
              <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold py-0.5 px-2.5 rounded-full">
                {quizzes.length}
              </span>
            )}
          </h2>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileQuestion className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No quizzes available</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">Your teachers haven't assigned any quizzes to your batches yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map(quiz => {
              const isExpanded = expandedQuizIds.has(quiz.id)
              const dateObj = quiz.created_at?.toDate ? quiz.created_at.toDate() : new Date(quiz.created_at || Date.now())
              const questionCount = quiz.questions?.length || 0
              const batchObj = assignedBatches.find(b => b.id === quiz.batch_id)

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Collapsible Header */}
                  <button
                    onClick={() => toggleQuizExpanded(quiz.id)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-brand-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">
                        {quiz.chapter_name || 'Untitled Quiz'}
                        {quiz.topic_name && (
                          <span className="font-medium text-gray-400"> — {quiz.topic_name}</span>
                        )}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        {batchObj && (
                          <span className="text-xs font-semibold text-brand-purple">{batchObj.name}</span>
                        )}
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <CircleDot className="w-3 h-3" />
                          {questionCount} question{questionCount !== 1 ? 's' : ''}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {quiz.total_marks || 0} marks
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {quiz.duration_mins || '—'} min
                        </span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded Questions */}
                  {isExpanded && quiz.questions && (
                    <div className="border-t border-gray-100 bg-gray-50/30">
                      <div className="p-5 space-y-4">
                        {quiz.questions.map((q, qIdx) => (
                          <div key={qIdx} className="bg-white rounded-xl border border-gray-100 p-4">
                            <p className="font-semibold text-gray-800 text-sm mb-3">
                              <span className="text-gray-400 mr-1.5">Q{qIdx + 1}.</span>
                              {q.question_text}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt, optIdx) => (
                                <div
                                  key={optIdx}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border bg-white border-gray-100 text-gray-600"
                                >
                                  <span className="w-5 h-5 rounded-md bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="truncate">{opt}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                              <span>+{q.marks || 4} marks</span>
                              <span className="text-red-400">-{q.neg_marks || 0} negative</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ═══ Your Faculty ═══ */}
      <div
        style={{ animation: 'zoomIn 0.4s ease-out both', animationDelay: '700ms' }}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-accent-emerald" />
          Your Faculty
        </h2>
        {faculty.length > 0 ? (
          <div className="space-y-5">
            {assignedBatches.map(batch => {
              const batchFaculty = faculty.filter(f =>
                (f.assigned_batches && f.assigned_batches.includes(batch.id)) ||
                (f.fallback_batch_id === batch.id) // support the fallback mechanism
              )

              if (batchFaculty.length === 0) return null

              return (
                <div key={batch.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <BookOpen className="w-4 h-4 text-brand-orange" />
                    {batch.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {batchFaculty.map(f => (
                      <div key={f.id} className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex items-center gap-3 hover:border-brand-purple/30 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600 font-bold text-sm flex-shrink-0 overflow-hidden border border-gray-100">
                          {f.profile_url ? (
                            <img src={f.profile_url} alt={f.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            f.name?.charAt(0) || 'F'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-brand-purple transition-colors">{f.name || 'Faculty Member'}</h4>
                          <p className="text-xs text-gray-400">Faculty</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-900">No faculty assigned yet</p>
            <p className="text-xs text-gray-400 mt-1">Faculty members will appear here once assigned to your batches.</p>
          </div>
        )}
      </div>
    </div>
  )
}
