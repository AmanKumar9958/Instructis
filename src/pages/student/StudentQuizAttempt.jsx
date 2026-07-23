import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/admin/Toast'
import { 
  Clock, AlertTriangle, ShieldAlert, Loader2, ArrowLeft, 
  CheckCircle2, CircleDot, PlayCircle, Lock
} from 'lucide-react'

export default function StudentQuizAttempt() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()

  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stage, setStage] = useState('loading') // loading, pre-quiz, active, submitting, completed
  const [error, setError] = useState(null)

  // Attempt State
  const [timeLeft, setTimeLeft] = useState(0)
  const [answers, setAnswers] = useState({}) // { qIdx: optIdx }
  const [tabSwitches, setTabSwitches] = useState(0)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  
  // Refs for event listeners and timer to avoid stale closures
  const timerRef = useRef(null)
  const tabSwitchesRef = useRef(0)
  const stageRef = useRef('loading')
  const answersRef = useRef({})

  useEffect(() => {
    stageRef.current = stage
    answersRef.current = answers
    tabSwitchesRef.current = tabSwitches
  }, [stage, answers, tabSwitches])

  // Initial Fetch & Validation
  useEffect(() => {
    async function initQuiz() {
      if (!user || !quizId) return
      setLoading(true)
      try {
        // Check if already attempted (graceful — won't block quiz if rules aren't set)
        let hasAttempted = false;
        try {
          const attemptsQuery = query(
            collection(db, 'quiz_attempts'),
            where('student_id', '==', user.uid)
          )
          const attemptsSnap = await getDocs(attemptsQuery)
          hasAttempted = attemptsSnap.docs.some(docSnap => docSnap.data().quiz_id === quizId)
        } catch (err) {
          console.warn("Could not check previous attempts (permissions). Proceeding anyway.", err)
        }

        if (hasAttempted) {
          setError("You have already attempted this quiz.")
          setStage('error')
          return
        }

        let quizSnap;
        try {
          quizSnap = await getDoc(doc(db, 'quizzes', quizId))
        } catch (err) {
          setError("Quiz fetch failed: " + err.message)
          setStage('error')
          return
        }
        if (!quizSnap.exists()) {
          setError("Quiz not found.")
          setStage('error')
          return
        }
        
        const qData = quizSnap.data()
        setQuiz({ id: quizSnap.id, ...qData })
        setTimeLeft(qData.duration_mins * 60)
        setStage('pre-quiz')

      } catch (err) {
        console.error("Init error:", err)
        setError("Failed to load quiz.")
        setStage('error')
      } finally {
        setLoading(false)
      }
    }
    initQuiz()
  }, [quizId, user])

  // Timer Effect
  useEffect(() => {
    if (stage === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleAutoSubmit("Time's up!")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [stage])

  // Anti-Cheating Effect (Tab Visibility)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && stageRef.current === 'active') {
        const newCount = tabSwitchesRef.current + 1
        setTabSwitches(newCount)
        
        if (newCount === 1) {
          setShowWarningModal(true)
        } else if (newCount >= 2) {
          setShowWarningModal(false)
          handleAutoSubmit("Test Auto-Submitted due to violation of anti-cheating rules (tab switching).")
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const startQuiz = () => {
    // Check expiry before starting
    const now = Date.now()
    if (quiz.expiry_time && now > quiz.expiry_time.toMillis()) {
      toast.error("Quiz has expired.")
      setError("This quiz has expired and can no longer be attempted.")
      setStage('error')
      return
    }
    
    // Request fullscreen (optional enhancement)
    try {
      document.documentElement.requestFullscreen().catch(() => {})
    } catch(e) {}
    
    setStage('active')
  }

  const selectOption = (qIdx, optIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }))
  }

  const submitQuiz = async (reason = null) => {
    setStage('submitting')
    if (timerRef.current) clearInterval(timerRef.current)
    
    try {
      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }

      const finalAnswers = answersRef.current
      const finalSwitches = tabSwitchesRef.current

      // Calculate score
      let score = 0
      quiz.questions.forEach((q, idx) => {
        const selected = finalAnswers[idx]
        if (selected === undefined) return // Unanswered
        
        if (selected === q.correct_index) {
          score += q.marks
        } else {
          score -= q.neg_marks
        }
      })

      const attemptData = {
        quiz_id: quiz.id,
        student_id: user.uid,
        student_name: user.name || user.displayName || 'Student',
        roll_number: user.email || '', // Fallback to email if roll number isn't stored
        score,
        total_marks: quiz.total_marks,
        submitted_at: serverTimestamp(),
        tab_switches: finalSwitches,
        answers: finalAnswers,
        auto_submit_reason: reason || null
      }

      await addDoc(collection(db, 'quiz_attempts'), attemptData)
      
      setStage('completed')
      
      if (reason) {
        toast.error(reason, { duration: 5000 })
      } else {
        toast.success("Quiz submitted successfully!")
      }

    } catch (err) {
      console.error("Submission error:", err)
      toast.error("Failed to submit quiz. Please don't close the page and try again.")
      setStage('active') // let them try again
    }
  }

  const handleAutoSubmit = (reason) => {
    submitQuiz(reason)
  }

  const handleManualSubmit = () => {
    setShowConfirmModal(true)
  }

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (loading || stage === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
      </div>
    )
  }

  if (stage === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-gray-100 shadow-lg">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Notice</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/student/quizzes')}
            className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (stage === 'completed') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-gray-100 shadow-lg">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Submitted</h2>
          <p className="text-gray-500 mb-8">
            Your attempt has been recorded securely. You can view your results in the Quizzes hub once the faculty reveals the marks.
          </p>
          <button 
            onClick={() => navigate('/student/quizzes')}
            className="w-full py-3.5 bg-brand-purple text-white font-bold rounded-xl hover:bg-brand-purple-dark transition-colors shadow-lg shadow-brand-purple/20"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (stage === 'pre-quiz') {
    const isExpired = quiz.expiry_time && Date.now() > quiz.expiry_time.toMillis()
    
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          
          <button 
            onClick={() => navigate('/student/quizzes')}
            className="flex items-center gap-2 text-gray-500 font-semibold mb-6 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="bg-brand-purple p-8 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h1 className="text-2xl md:text-3xl font-black mb-2 relative z-10">{quiz.chapter_name}</h1>
              {quiz.topic_name && <p className="text-brand-purple-light font-medium relative z-10">{quiz.topic_name}</p>}
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500 font-bold text-sm mb-1">
                    <Clock className="w-4 h-4" /> Duration
                  </div>
                  <p className="text-xl font-black text-gray-900">{quiz.duration_mins} mins</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500 font-bold text-sm mb-1">
                    <CircleDot className="w-4 h-4" /> Marks
                  </div>
                  <p className="text-xl font-black text-gray-900">{quiz.total_marks}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-red-50 border border-red-100 mb-8">
                <h3 className="flex items-center gap-2 text-red-600 font-bold mb-2">
                  <ShieldAlert className="w-5 h-5" />
                  Anti-Cheating Rules
                </h3>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1.5 font-medium">
                  <li>Do not switch tabs or minimize the browser during the quiz.</li>
                  <li>First violation will result in a strict warning.</li>
                  <li>Second violation will instantly auto-submit your test.</li>
                  <li>Ensure you have a stable internet connection before starting.</li>
                </ul>
              </div>

              {isExpired ? (
                <div className="w-full py-4 rounded-xl font-bold bg-gray-100 text-gray-400 text-center flex items-center justify-center gap-2 border border-gray-200 cursor-not-allowed">
                  <Lock className="w-5 h-5" /> Quiz Expired
                </div>
              ) : (
                <button
                  onClick={startQuiz}
                  className="w-full py-4 rounded-xl font-bold bg-brand-orange hover:bg-amber-500 text-white transition-all shadow-lg shadow-brand-orange/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Quiz Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 select-none pb-24">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-4">
            <h2 className="font-bold text-gray-900 truncate">{quiz.chapter_name}</h2>
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-0.5">
              <span>{quiz.questions.length} Questions</span>
              <span>{Object.keys(answers).length} Answered</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg font-black text-lg flex items-center gap-2 border ${
              timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-gray-100 text-gray-800 border-gray-200'
            }`}>
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={handleManualSubmit}
              disabled={stage === 'submitting'}
              className="px-6 py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white font-bold rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              {stage === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 w-full fixed top-[72px] z-40">
        <div 
          className="h-full bg-brand-purple transition-all duration-300"
          style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        {quiz.questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm" id={`q-${qIdx}`}>
            
            <div className="flex items-start justify-between mb-4 gap-4">
              <h3 className="font-bold text-gray-900 text-lg leading-relaxed">
                <span className="text-gray-400 mr-2">Q{qIdx + 1}.</span>
                {q.question_text}
              </h3>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 flex-shrink-0 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <span>+{q.marks}</span>
                <span className="text-red-400">-{q.neg_marks}</span>
              </div>
            </div>

            <div className="space-y-3">
              {q.options.map((opt, optIdx) => {
                const isSelected = answers[qIdx] === optIdx
                return (
                  <button
                    key={optIdx}
                    onClick={() => selectOption(qIdx, optIdx)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-brand-purple bg-brand-purple/5' 
                        : 'border-gray-100 bg-white hover:border-brand-purple/30 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'border-brand-purple' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-brand-purple" />}
                    </div>
                    <span className={`flex-1 font-medium ${isSelected ? 'text-brand-purple font-semibold' : 'text-gray-700'}`}>
                      {opt}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Warning Overlay Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-red-500 shadow-2xl animate-[zoomIn_0.3s_ease-out]">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 text-center mb-2">Warning 1/2</h2>
            <p className="text-red-600 font-bold text-center mb-4 text-sm">Tab switching is strictly prohibited.</p>
            <p className="text-gray-600 text-center text-sm mb-8 leading-relaxed">
              We detected that you navigated away from the quiz window. This is a strict violation of the rules. 
              <br/><br/>
              <strong>If you switch tabs again, your test will be automatically submitted with a penalty flag.</strong>
            </p>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
            >
              I Understand. Return to Quiz
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Submit Quiz?</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Are you sure you want to submit? You have answered <strong>{Object.keys(answers).length}</strong> out of <strong>{quiz.questions.length}</strong> questions. You cannot change your answers after this.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false)
                  submitQuiz()
                }}
                className="flex-1 py-3 px-4 bg-brand-purple text-white font-bold rounded-xl hover:bg-brand-purple-dark transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
