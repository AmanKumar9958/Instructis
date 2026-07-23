import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/admin/Toast'
import { Video, Calendar, Clock, Link as LinkIcon, Plus, Trash2, PowerOff, Loader2 } from 'lucide-react'
import examData from '../../data/examData'
import { aiMlCourses } from '../../data/aiMlData'
import { codingCourses } from '../../data/codingData'

export default function TeacherClasses() {
  const { user } = useAuth()
  const toast = useToast()
  
  const [classes, setClasses] = useState([])
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    batch_id: '',
    meet_link: '',
    scheduled_date: '',
    scheduled_time: ''
  })

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      if (!user) return
      setLoading(true)
      try {
        // Fetch Batches assigned to teacher
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
            setFormData(prev => ({ ...prev, batch_id: assigned[0].id }))
          }
        }

        // Fetch Live Classes
        const classesQuery = query(
          collection(db, 'live_classes'),
          where('teacher_id', '==', user.uid)
        )
        const classesSnapshot = await getDocs(classesQuery)
        const fetchedClasses = classesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Sort locally since we might not have a composite index for teacher_id + scheduled_at
        fetchedClasses.sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))
        setClasses(fetchedClasses)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load classes or batches")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user])

  const formatMeetLink = (link) => {
    if (!link) return ''
    let formatted = link.trim()
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted
    }
    return formatted
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.batch_id || !formData.meet_link || !formData.scheduled_date || !formData.scheduled_time) {
      toast.error("Please fill all fields")
      return
    }

    setSubmitting(true)
    try {
      const scheduledAt = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`)
      const selectedBatch = batches.find(b => b.id === formData.batch_id)
      
      const newClassData = {
        title: formData.title,
        batch_id: formData.batch_id,
        target_group: selectedBatch ? selectedBatch.name : 'General',
        meet_link: formatMeetLink(formData.meet_link),
        teacher_name: user.name || user.email || 'Instructor',
        teacher_id: user.uid,
        scheduled_at: Timestamp.fromDate(scheduledAt),
        is_active: true,
        created_at: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, 'live_classes'), newClassData)
      
      setClasses([{ id: docRef.id, ...newClassData }, ...classes])
      toast.success("Live class scheduled successfully!")
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        title: '',
        meet_link: '',
        scheduled_date: '',
        scheduled_time: ''
      }))
    } catch (error) {
      console.error("Error creating class:", error)
      toast.error("Failed to schedule class")
    } finally {
      setSubmitting(false)
    }
  }

  const toggleClassStatus = async (classId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'live_classes', classId), {
        is_active: !currentStatus
      })
      setClasses(classes.map(c => c.id === classId ? { ...c, is_active: !currentStatus } : c))
      toast.success(`Class marked as ${!currentStatus ? 'Active' : 'Ended'}`)
    } catch (error) {
      console.error("Error updating class status:", error)
      toast.error("Failed to update status")
    }
  }

  const deleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return
    try {
      await deleteDoc(doc(db, 'live_classes', classId))
      setClasses(classes.filter(c => c.id !== classId))
      toast.success("Class deleted")
    } catch (error) {
      console.error("Error deleting class:", error)
      toast.error("Failed to delete class")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
        <p className="text-gray-500 text-sm mt-1">Schedule and manage your live video sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-purple" />
              Schedule New Class
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                  placeholder="e.g. Newton's Laws of Motion"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Batch</label>
                <select
                  value={formData.batch_id}
                  onChange={(e) => setFormData({...formData, batch_id: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all bg-white"
                >
                  <option value="" disabled>Select a batch...</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.id}>{batch.name}</option>
                  ))}
                </select>
                {batches.length === 0 && !loading && (
                  <p className="text-xs text-red-500 mt-1">You have no assigned batches.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meet Link</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.meet_link}
                    onChange={(e) => setFormData({...formData, meet_link: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                    placeholder="meet.google.com/abc-defg-hij"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time</label>
                  <input
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || batches.length === 0}
                className="w-full mt-2 bg-brand-purple hover:bg-brand-purple-dark text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Schedule Class'}
              </button>
            </form>
          </div>
        </div>

        {/* Classes List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Video className="w-5 h-5 text-brand-orange" />
              Your Upcoming & Past Classes
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : classes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Video className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No classes scheduled</h3>
                <p className="text-gray-500 text-sm mt-1 max-w-sm">You haven't scheduled any live classes yet. Create one using the form.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map(cls => {
                  const dateObj = cls.scheduled_at?.toDate ? cls.scheduled_at.toDate() : new Date(cls.scheduled_at)
                  const batch = batches.find(b => b.id === cls.batch_id)
                  
                  return (
                    <div key={cls.id} className={`p-5 rounded-2xl border transition-all ${cls.is_active ? 'bg-white border-gray-200 shadow-sm hover:shadow-md' : 'bg-gray-50 border-gray-100 opacity-75'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${cls.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                          {cls.is_active ? 'Active' : 'Ended'}
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => toggleClassStatus(cls.id, cls.is_active)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title={cls.is_active ? "End Session" : "Mark Active"}
                          >
                            <PowerOff className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteClass(cls.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1" title={cls.title}>{cls.title}</h3>
                      <p className="text-xs font-medium text-brand-purple mb-4">{batch?.name || 'Unknown Batch'}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      <a 
                        href={cls.meet_link} 
                        target="_blank" 
                        rel="noreferrer"
                        className={`block w-full py-2.5 rounded-xl text-center text-sm font-bold transition-colors ${
                          cls.is_active 
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed pointer-events-none'
                        }`}
                      >
                        Join Meeting
                      </a>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
