import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, addDoc, updateDoc, deleteDoc, serverTimestamp, getDocs, query, where, doc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/admin/Toast'
import { Plus, Trash2, Save, FileQuestion, BookOpen, Clock, Loader2, ChevronRight, ChevronDown, CheckCircle2, Calendar, Hash, Award, BarChart, Pencil, X } from 'lucide-react'
import examData from '../../data/examData'
import { aiMlCourses } from '../../data/aiMlData'
import { codingCourses } from '../../data/codingData'

export default function TeacherQuizzes() {
  const { user } = useAuth()
  const toast = useToast()
  
  const [batches, setBatches] = useState([])
  const [loadingBatches, setLoadingBatches] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Previous quizzes
  const [previousQuizzes, setPreviousQuizzes] = useState([])
  const [loadingQuizzes, setLoadingQuizzes] = useState(true)
  const [expandedQuizIds, setExpandedQuizIds] = useState(new Set())
  const [editingQuizId, setEditingQuizId] = useState(null)
  
  // Step 1: Quiz Metadata
  const [metadata, setMetadata] = useState({
    batch_id: '',
    chapter_name: '',
    topic_name: '',
    duration_mins: 30,
    expiry_time: ''
  })

  // Step 2: Questions Array
  const emptyQuestion = {
    question_text: '',
    options: ['', '', '', ''],
    correct_index: 0,
    marks: 4,
    neg_marks: 1
  }
  const [questions, setQuestions] = useState([{ ...emptyQuestion }])

  useEffect(() => {
    async function fetchBatches() {
      if (!user) return
      setLoadingBatches(true)
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

        if (assignedBatchesArr.length > 0) {
          let firebaseBatchList = []
          try {
            const batchesQuery = query(collection(db, 'batches'))
            const batchesSnapshot = await getDocs(batchesQuery)
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
          if (assigned.length > 0) {
            setMetadata(prev => ({ ...prev, batch_id: assigned[0].id }))
          }
        }
      } catch (error) {
        console.error("Error fetching batches:", error)
        toast.error("Failed to load batches")
      } finally {
        setLoadingBatches(false)
      }
    }
    fetchBatches()
  }, [user])

  // Fetch previous quizzes
  const fetchPreviousQuizzes = async () => {
    if (!user) return
    setLoadingQuizzes(true)
    try {
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        where('teacher_id', '==', user.uid)
      )
      const quizzesSnapshot = await getDocs(quizzesQuery)
      const fetched = quizzesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      fetched.sort((a, b) => {
        const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at || 0)
        const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at || 0)
        return dateB - dateA
      })
      setPreviousQuizzes(fetched)
    } catch (err) {
      console.warn('Could not fetch previous quizzes', err)
    } finally {
      setLoadingQuizzes(false)
    }
  }

  useEffect(() => {
    fetchPreviousQuizzes()
  }, [user])

  const toggleQuizExpanded = (quizId) => {
    setExpandedQuizIds(prev => {
      const next = new Set(prev)
      if (next.has(quizId)) next.delete(quizId)
      else next.add(quizId)
      return next
    })
  }

  const handleAddQuestion = () => {
    setQuestions([...questions, { ...emptyQuestion }])
  }

  const handleRemoveQuestion = (index) => {
    const newQ = [...questions]
    newQ.splice(index, 1)
    setQuestions(newQ)
  }

  const updateQuestion = (index, field, value) => {
    const newQ = [...questions]
    newQ[index][field] = value
    setQuestions(newQ)
  }

  const updateOption = (qIndex, optIndex, value) => {
    const newQ = [...questions]
    newQ[qIndex].options[optIndex] = value
    setQuestions(newQ)
  }

  const handleSaveQuiz = async () => {
    // Validation
    if (!metadata.batch_id || !metadata.chapter_name || !metadata.topic_name || !metadata.duration_mins || !metadata.expiry_time) {
      toast.error("Please fill all quiz metadata fields (including Expiry Time)")
      return
    }
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question_text.trim()) {
        toast.error(`Question ${i + 1} text is empty`)
        return
      }
      if (q.options.some(opt => !opt.trim())) {
        toast.error(`All 4 options must be filled for Question ${i + 1}`)
        return
      }
    }

    setSubmitting(true)
    try {
      const total_marks = questions.reduce((sum, q) => sum + Number(q.marks), 0)

      const baseQuizData = {
        ...metadata,
        duration_mins: Number(metadata.duration_mins),
        expiry_time: Timestamp.fromDate(new Date(metadata.expiry_time)),
        teacher_id: user.uid,
        total_marks,
        questions: questions.map(q => ({
          ...q,
          marks: Number(q.marks),
          neg_marks: Number(q.neg_marks),
          correct_index: Number(q.correct_index)
        }))
      }

      if (editingQuizId) {
        await updateDoc(doc(db, 'quizzes', editingQuizId), {
          ...baseQuizData,
          updated_at: serverTimestamp()
        })
        toast.success("Quiz updated successfully!")
      } else {
        await addDoc(collection(db, 'quizzes'), {
          ...baseQuizData,
          reveal_marks: false,
          created_at: serverTimestamp()
        })
        toast.success("Quiz saved successfully!")
      }
      
      // Reset form
      setMetadata(prev => ({ ...prev, chapter_name: '', topic_name: '', duration_mins: 30, expiry_time: '' }))
      setQuestions([{ ...emptyQuestion }])
      setEditingQuizId(null)
      
      // Refresh previous quizzes list
      fetchPreviousQuizzes()
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast.error("Failed to save quiz")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditQuiz = (quiz) => {
    setEditingQuizId(quiz.id)
    
    let expiryStr = ''
    if (quiz.expiry_time) {
      const date = quiz.expiry_time.toDate ? quiz.expiry_time.toDate() : new Date(quiz.expiry_time)
      const pad = (n) => n.toString().padStart(2, '0')
      expiryStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    setMetadata({
      batch_id: quiz.batch_id || '',
      chapter_name: quiz.chapter_name || '',
      topic_name: quiz.topic_name || '',
      duration_mins: quiz.duration_mins || 30,
      expiry_time: expiryStr
    })
    setQuestions(quiz.questions && quiz.questions.length > 0 ? quiz.questions : [{ ...emptyQuestion }])
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) return
    
    try {
      await deleteDoc(doc(db, 'quizzes', quizId))
      toast.success("Quiz deleted successfully")
      
      if (editingQuizId === quizId) {
        setMetadata(prev => ({ ...prev, chapter_name: '', topic_name: '', duration_mins: 30, expiry_time: '' }))
        setQuestions([{ ...emptyQuestion }])
        setEditingQuizId(null)
      }
      
      fetchPreviousQuizzes()
    } catch (err) {
      console.error("Error deleting quiz:", err)
      toast.error("Failed to delete quiz")
    }
  }

  const handleCancelEdit = () => {
    setEditingQuizId(null)
    setMetadata(prev => ({ ...prev, chapter_name: '', topic_name: '', duration_mins: 30, expiry_time: '' }))
    setQuestions([{ ...emptyQuestion }])
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{editingQuizId ? 'Edit Quiz' : 'Quiz Builder Engine'}</h1>
        <p className="text-gray-500 text-sm mt-1">{editingQuizId ? 'Update the details and questions of this quiz.' : 'Create dynamic assessments for your assigned batches'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Step 1: Metadata (Left Col on Desktop) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-purple text-white text-xs flex items-center justify-center font-bold">1</span>
              Quiz Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Batch</label>
                <select
                  value={metadata.batch_id}
                  onChange={(e) => setMetadata({...metadata, batch_id: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all bg-white"
                >
                  <option value="" disabled>Select a batch...</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.id}>{batch.name}</option>
                  ))}
                </select>
                {batches.length === 0 && !loadingBatches && (
                  <p className="text-xs text-red-500 mt-1">No batches available.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" /> Chapter Name
                </label>
                <input
                  type="text"
                  value={metadata.chapter_name}
                  onChange={(e) => setMetadata({...metadata, chapter_name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                  placeholder="e.g. Kinematics"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Topic Name</label>
                <input
                  type="text"
                  value={metadata.topic_name}
                  onChange={(e) => setMetadata({...metadata, topic_name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                  placeholder="e.g. Projectile Motion"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" /> Duration (mins)
                </label>
                <input
                  type="number"
                  min="1"
                  value={metadata.duration_mins}
                  onChange={(e) => setMetadata({...metadata, duration_mins: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" /> Expiry Time
                </label>
                <input
                  type="datetime-local"
                  value={metadata.expiry_time}
                  onChange={(e) => setMetadata({...metadata, expiry_time: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-500">Total Questions:</span>
                <span className="text-lg font-bold text-gray-900">{questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Total Marks:</span>
                <span className="text-lg font-bold text-brand-purple">
                  {questions.reduce((sum, q) => sum + Number(q.marks || 0), 0)}
                </span>
              </div>
            </div>

            <button
              onClick={handleSaveQuiz}
              disabled={submitting || batches.length === 0}
              className="w-full mt-6 bg-brand-purple hover:bg-brand-purple-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all hover:shadow-[0_4px_20px_rgba(129,52,175,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <Save className="w-5 h-5" />
                  {editingQuizId ? 'Update Quiz' : 'Save & Publish Quiz'}
                </>
              )}
            </button>

            {editingQuizId && (
              <button
                onClick={handleCancelEdit}
                className="w-full mt-3 bg-white hover:bg-gray-50 text-gray-600 font-bold py-3.5 px-4 rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* Step 2: Questions (Right Col on Desktop) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center font-bold">2</span>
              Dynamic Question Builder
            </h2>
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative group transition-all hover:border-brand-orange/30">
              
              {/* Question Header */}
              <div className="flex justify-between items-start mb-5">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-gray-400">Q{qIndex + 1}.</span> 
                </h3>
                <button 
                  onClick={() => handleRemoveQuestion(qIndex)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Question Text */}
              <div className="mb-5">
                <textarea
                  rows="2"
                  value={q.question_text}
                  onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all resize-none text-gray-800 font-medium"
                />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="w-5 h-5 rounded-md bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
                        {String.fromCharCode(65 + optIndex)} {/* A, B, C, D */}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                      placeholder={`Option ${optIndex + 1}`}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm
                        ${q.correct_index === optIndex 
                          ? 'border-emerald-300 bg-emerald-50 focus:ring-2 focus:ring-emerald-200' 
                          : 'border-gray-200 focus:border-gray-300 focus:ring-2 focus:ring-gray-100'}`}
                    />
                    {q.correct_index === optIndex && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Settings Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Correct Answer</label>
                  <select
                    value={q.correct_index}
                    onChange={(e) => updateQuestion(qIndex, 'correct_index', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-emerald-700 bg-white outline-none focus:border-emerald-300"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
                
                <div className="w-24">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Marks (+)</label>
                  <input
                    type="number"
                    value={q.marks}
                    onChange={(e) => updateQuestion(qIndex, 'marks', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-900 outline-none text-center"
                  />
                </div>
                
                <div className="w-24">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Negative (-)</label>
                  <input
                    type="number"
                    value={q.neg_marks}
                    onChange={(e) => updateQuestion(qIndex, 'neg_marks', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold text-red-500 outline-none text-center"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddQuestion}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl text-gray-500 font-bold hover:border-brand-purple hover:text-brand-purple hover:bg-brand-purple/5 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Another Question
          </button>
          
        </div>
      </div>

      {/* ═══ Previous Quizzes ═══ */}
      <div className="mt-4">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <FileQuestion className="w-5 h-5 text-brand-purple" />
          Previous Quizzes
          {!loadingQuizzes && (
            <span className="bg-brand-purple/10 text-brand-purple text-xs font-bold py-0.5 px-2.5 rounded-full">
              {previousQuizzes.length}
            </span>
          )}
        </h2>

        {loadingQuizzes ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : previousQuizzes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileQuestion className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No quizzes yet</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">Create your first quiz using the builder above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {previousQuizzes.map((quiz) => {
              const isExpanded = expandedQuizIds.has(quiz.id)
              const dateObj = quiz.created_at?.toDate ? quiz.created_at.toDate() : new Date(quiz.created_at || Date.now())
              const questionCount = quiz.questions?.length || 0
              const batchObj = batches.find(b => b.id === quiz.batch_id)

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
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-brand-purple" />
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
                          <Hash className="w-3 h-3" />
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
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/teacher/quizzes/${quiz.id}/results`}
                        className="px-3 py-1.5 bg-brand-purple/10 text-brand-purple text-xs font-bold rounded-lg hover:bg-brand-purple hover:text-white transition-colors flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BarChart className="w-3.5 h-3.5" />
                        Results
                      </Link>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditQuiz(quiz) }}
                        className="p-1.5 text-gray-400 hover:text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-colors"
                        title="Edit Quiz"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(quiz.id) }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
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
                              {q.options.map((opt, optIdx) => {
                                const isCorrect = Number(q.correct_index) === optIdx
                                return (
                                  <div
                                    key={optIdx}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${
                                      isCorrect
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                                        : 'bg-white border-gray-100 text-gray-600'
                                    }`}
                                  >
                                    <span className={`w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                                      isCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="truncate">{opt}</span>
                                    {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto flex-shrink-0" />}
                                  </div>
                                )
                              })}
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
    </div>
  )
}
