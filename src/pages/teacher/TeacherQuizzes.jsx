import { useState, useEffect } from 'react'
import { collection, addDoc, serverTimestamp, getDocs, query } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/admin/Toast'
import { Plus, Trash2, Save, FileQuestion, BookOpen, Clock, Loader2, ChevronRight, CheckCircle2 } from 'lucide-react'

export default function TeacherQuizzes() {
  const { user } = useAuth()
  const toast = useToast()
  
  const [batches, setBatches] = useState([])
  const [loadingBatches, setLoadingBatches] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Step 1: Quiz Metadata
  const [metadata, setMetadata] = useState({
    batch_id: '',
    chapter_name: '',
    topic_name: '',
    duration_mins: 30
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
        if (user.assigned_batches && user.assigned_batches.length > 0) {
          const batchesQuery = query(collection(db, 'batches'))
          const batchesSnapshot = await getDocs(batchesQuery)
          const allBatches = batchesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          const assigned = allBatches.filter(b => user.assigned_batches.includes(b.id))
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

  const handleAddQuestion = () => {
    setQuestions([...questions, { ...emptyQuestion }])
  }

  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) return
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
    if (!metadata.batch_id || !metadata.chapter_name || !metadata.topic_name || !metadata.duration_mins) {
      toast.error("Please fill all quiz metadata fields")
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

      const quizData = {
        ...metadata,
        duration_mins: Number(metadata.duration_mins),
        teacher_id: user.uid,
        total_marks,
        questions: questions.map(q => ({
          ...q,
          marks: Number(q.marks),
          neg_marks: Number(q.neg_marks),
          correct_index: Number(q.correct_index)
        })),
        created_at: serverTimestamp()
      }

      await addDoc(collection(db, 'quizzes'), quizData)
      
      toast.success("Quiz saved successfully!")
      
      // Reset form
      setMetadata(prev => ({ ...prev, chapter_name: '', topic_name: '', duration_mins: 30 }))
      setQuestions([{ ...emptyQuestion }])
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast.error("Failed to save quiz")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quiz Builder Engine</h1>
        <p className="text-gray-500 text-sm mt-1">Create dynamic assessments for your assigned batches</p>
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
                  Publish Quiz
                </>
              )}
            </button>
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
                {questions.length > 1 && (
                  <button 
                    onClick={() => handleRemoveQuestion(qIndex)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
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
    </div>
  )
}
