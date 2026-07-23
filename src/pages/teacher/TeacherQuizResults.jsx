import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useToast } from '../../components/admin/Toast'
import { ArrowLeft, Loader2, Users, AlertTriangle, Eye, EyeOff, Search } from 'lucide-react'

export default function TeacherQuizResults() {
  const { quizId } = useParams()
  const toast = useToast()
  
  const [quiz, setQuiz] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingReveal, setTogglingReveal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchData() {
      if (!quizId) return
      setLoading(true)
      try {
        // Fetch Quiz Data
        const quizRef = doc(db, 'quizzes', quizId)
        const quizSnap = await getDoc(quizRef)
        
        if (!quizSnap.exists()) {
          toast.error("Quiz not found")
          setLoading(false)
          return
        }
        
        setQuiz({ id: quizSnap.id, ...quizSnap.data() })

        // Fetch Quiz Attempts
        const attemptsQuery = query(
          collection(db, 'quiz_attempts'),
          where('quiz_id', '==', quizId)
        )
        const attemptsSnap = await getDocs(attemptsQuery)
        const fetchedAttempts = attemptsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        
        // Sort attempts by score descending
        fetchedAttempts.sort((a, b) => b.score - a.score)
        
        setAttempts(fetchedAttempts)
      } catch (err) {
        console.error("Error fetching results:", err)
        toast.error("Failed to load results")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [quizId])

  const handleToggleReveal = async () => {
    if (!quiz) return
    setTogglingReveal(true)
    try {
      const newRevealState = !quiz.reveal_marks
      await updateDoc(doc(db, 'quizzes', quizId), {
        reveal_marks: newRevealState
      })
      
      setQuiz(prev => ({ ...prev, reveal_marks: newRevealState }))
      toast.success(newRevealState ? "Marks are now visible to students." : "Marks are now hidden from students.")
    } catch (err) {
      console.error("Error toggling reveal_marks:", err)
      toast.error("Failed to update marks visibility")
    } finally {
      setTogglingReveal(false)
    }
  }

  const filteredAttempts = attempts.filter(a => 
    a.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.roll_number?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quiz not found</h2>
        <Link to="/teacher/quizzes" className="text-brand-purple hover:underline">Go back to Quizzes</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/teacher/quizzes" 
          className="p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {quiz.chapter_name} {quiz.topic_name && `— ${quiz.topic_name}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Actions & Stats */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Visibility Settings</h3>
            <p className="text-sm text-gray-500 mb-5">
              Control whether students can see their scores and correct answers after attempting the quiz.
            </p>
            
            <button
              onClick={handleToggleReveal}
              disabled={togglingReveal}
              className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                quiz.reveal_marks 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' 
                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
              } disabled:opacity-50`}
            >
              {togglingReveal ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                quiz.reveal_marks ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />
              )}
              {quiz.reveal_marks ? "Hide Marks from Students" : "Reveal Marks to Students"}
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-semibold">Total Attempts</span>
                </div>
                <span className="font-bold text-gray-900">{attempts.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Flagged (Tab Switches)</span>
                </div>
                <span className="font-bold text-red-600">
                  {attempts.filter(a => a.tab_switches > 0).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900">Student Attempts</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:bg-white transition-all w-full sm:w-64"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto flex-1">
              {attempts.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p>No students have attempted this quiz yet.</p>
                </div>
              ) : filteredAttempts.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p>No students match your search.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50/50 text-gray-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Roll No / Email</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4 text-center">Tab Switches</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAttempts.map((attempt) => (
                      <tr key={attempt.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">{attempt.student_name}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {attempt.roll_number || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-brand-purple">{attempt.score}</span>
                          <span className="text-gray-400"> / {attempt.total_marks || quiz.total_marks}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {attempt.tab_switches > 0 ? (
                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-red-100 text-red-600 font-bold text-xs">
                              {attempt.tab_switches} violations
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
