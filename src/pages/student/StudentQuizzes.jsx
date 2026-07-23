import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import {
  FileQuestion, BookOpen, Clock, Calendar, CircleDot, Award,
  ChevronDown, Loader2, Search, Lock, PlayCircle, CheckCircle2
} from 'lucide-react'
import examData from '../../data/examData'
import { aiMlCourses } from '../../data/aiMlData'
import { codingCourses } from '../../data/codingData'

export default function StudentQuizzes() {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedQuizIds, setExpandedQuizIds] = useState(new Set())
  const [selectedBatchId, setSelectedBatchId] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [attemptsMap, setAttemptsMap] = useState({})

  useEffect(() => {
    async function fetchQuizzes() {
      if (!user) return
      setLoading(true)
      try {
        let assignedBatchesArr = user.assigned_batches || []
        try {
          const userDocRef = doc(db, 'users', user.uid)
          const userDocSnap = await getDoc(userDocRef)
          if (userDocSnap.exists()) {
            assignedBatchesArr = userDocSnap.data().assigned_batches || assignedBatchesArr
          }
        } catch (err) {
          console.warn("Could not fetch fresh user", err)
        }

        if (assignedBatchesArr.length === 0) {
          setLoading(false)
          return
        }

        // Resolve batch names
        let firebaseBatchList = []
        try {
          const batchesSnapshot = await getDocs(query(collection(db, 'batches')))
          firebaseBatchList = batchesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        } catch (batchErr) {
          console.warn("Could not fetch batches", batchErr)
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
        setBatches(assigned)

        // Fetch quizzes for assigned batches
        const allQuizzes = []
        const chunks = []
        for (let i = 0; i < assignedBatchesArr.length; i += 10) {
          chunks.push(assignedBatchesArr.slice(i, i + 10))
        }
        for (const chunk of chunks) {
          const q = query(collection(db, 'quizzes'), where('batch_id', 'in', chunk))
          const snap = await getDocs(q)
          snap.forEach(d => allQuizzes.push({ id: d.id, ...d.data() }))
        }

        // Deduplicate and sort
        const uniqueMap = new Map()
        allQuizzes.forEach(q => uniqueMap.set(q.id, q))
        const deduped = Array.from(uniqueMap.values())
        deduped.sort((a, b) => {
          const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at || 0)
          const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at || 0)
          return dateB - dateA
        })
        setQuizzes(deduped)

        // Fetch User Attempts (graceful — won't break quiz listing if rules aren't set)
        try {
          const attemptsQ = query(collection(db, 'quiz_attempts'), where('student_id', '==', user.uid))
          const attemptsSnap = await getDocs(attemptsQ)
          const attMap = {}
          attemptsSnap.forEach(d => { attMap[d.data().quiz_id] = d.data() })
          setAttemptsMap(attMap)
        } catch (attErr) {
          console.warn("Could not fetch attempts (permissions). Quiz listing will still work.", attErr)
        }
      } catch (err) {
        console.error("Error fetching quizzes:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [user])

  const toggleQuizExpanded = (quizId) => {
    setExpandedQuizIds(prev => {
      const next = new Set(prev)
      if (next.has(quizId)) next.delete(quizId)
      else next.add(quizId)
      return next
    })
  }

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesBatch = selectedBatchId === 'all' || quiz.batch_id === selectedBatchId
    const matchesSearch = !searchQuery ||
      quiz.chapter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.topic_name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesBatch && matchesSearch
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
        <p className="text-gray-500 text-sm mt-1">Practice assessments assigned by your faculty</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Batch Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar snap-x">
          <button
            onClick={() => setSelectedBatchId('all')}
            className={`snap-start flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedBatchId === 'all'
                ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-purple/30'
            }`}
          >
            All Batches
          </button>
          {batches.map(batch => (
            <button
              key={batch.id}
              onClick={() => setSelectedBatchId(batch.id)}
              className={`snap-start flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedBatchId === batch.id
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-purple/30'
              }`}
            >
              {batch.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Quiz List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="w-7 h-7 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {searchQuery || selectedBatchId !== 'all' ? 'No matching quizzes' : 'No quizzes available'}
          </h3>
          <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
            {searchQuery || selectedBatchId !== 'all'
              ? 'Try adjusting your filters or search query.'
              : 'Your teachers haven\'t assigned any quizzes yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuizzes.map(quiz => {
            const isExpanded = expandedQuizIds.has(quiz.id)
            const dateObj = quiz.created_at?.toDate ? quiz.created_at.toDate() : new Date(quiz.created_at || Date.now())
            const questionCount = quiz.questions?.length || 0
            const batchObj = batches.find(b => b.id === quiz.batch_id)

            return (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                {/* Header */}
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
                      {attemptsMap[quiz.id] && (
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Attempted
                        </span>
                      )}
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

                {/* Expanded Section based on attempt status */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/30">
                    <div className="p-6">
                      {(() => {
                        const attempt = attemptsMap[quiz.id]
                        const isExpired = quiz.expiry_time && Date.now() > quiz.expiry_time.toMillis()
                        
                        if (!attempt) {
                          if (isExpired) {
                            return (
                              <div className="text-center py-6">
                                <Lock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                <h4 className="font-bold text-gray-700">Quiz Expired</h4>
                                <p className="text-sm text-gray-500 mt-1">This quiz is no longer accepting submissions.</p>
                              </div>
                            )
                          }
                          return (
                            <div className="text-center py-6">
                              <h4 className="font-bold text-gray-900 mb-2">Ready to start?</h4>
                              <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">Make sure you have a stable internet connection. Do not switch tabs during the test.</p>
                              <Link 
                                to={`/student/quiz/${quiz.id}`}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-orange hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-orange/20 hover:-translate-y-0.5 active:translate-y-0"
                              >
                                <PlayCircle className="w-5 h-5" /> Start Quiz
                              </Link>
                            </div>
                          )
                        }

                        if (!quiz.reveal_marks) {
                          return (
                            <div className="text-center py-6">
                              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                              <h4 className="font-bold text-gray-900">Submitted Successfully</h4>
                              <p className="text-sm text-gray-500 mt-1">Waiting for faculty to reveal marks.</p>
                            </div>
                          )
                        }

                        return (
                          <div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center justify-between shadow-sm">
                              <div>
                                <p className="text-sm font-semibold text-gray-500">Your Score</p>
                                <p className="text-2xl font-black text-brand-purple">{attempt.score} <span className="text-sm text-gray-400">/ {attempt.total_marks}</span></p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-500 mb-1">Status</p>
                                {attempt.tab_switches > 0 ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold text-xs border border-red-200">
                                    Flagged ({attempt.tab_switches})
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-bold text-xs border border-emerald-200">
                                    Clear
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                              <Award className="w-4 h-4 text-brand-purple" />
                              Performance Breakdown
                            </h4>
                            <div className="space-y-4">
                              {quiz.questions?.map((q, qIdx) => {
                                const selectedOpt = attempt.answers?.[qIdx]
                                const isCorrect = selectedOpt === q.correct_index
                                const isSkipped = selectedOpt === undefined
                                
                                return (
                                  <div key={qIdx} className={`bg-white rounded-xl border p-4 ${isCorrect ? 'border-emerald-200' : isSkipped ? 'border-gray-200' : 'border-red-200'}`}>
                                    <p className="font-semibold text-gray-800 text-sm mb-3">
                                      <span className="text-gray-400 mr-1.5">Q{qIdx + 1}.</span>
                                      {q.question_text}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {q.options.map((opt, optIdx) => {
                                        const isThisSelected = selectedOpt === optIdx
                                        const isThisCorrect = q.correct_index === optIdx
                                        
                                        let borderClass = "border-gray-100 bg-white text-gray-600"
                                        if (isThisCorrect) borderClass = "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold shadow-sm"
                                        else if (isThisSelected && !isThisCorrect) borderClass = "border-red-500 bg-red-50 text-red-800 font-semibold"
                                        
                                        return (
                                          <div key={optIdx} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${borderClass}`}>
                                            <span className="w-5 h-5 rounded-md bg-white border border-black/10 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                              {String.fromCharCode(65 + optIdx)}
                                            </span>
                                            <span className="truncate">{opt}</span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-3 text-xs font-bold">
                                      {isCorrect ? (
                                        <span className="text-emerald-500">+{q.marks} Marks Earned</span>
                                      ) : isSkipped ? (
                                        <span className="text-gray-400">0 Marks (Skipped)</span>
                                      ) : (
                                        <span className="text-red-500">-{q.neg_marks} Marks (Incorrect)</span>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
