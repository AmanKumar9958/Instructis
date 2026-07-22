import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../hooks/useAuth'
import { Video, FileQuestion, Users, CheckCircle, ShieldCheck, BookOpen } from 'lucide-react'
import examData from '../../data/examData'
import { aiMlCourses } from '../../data/aiMlData'
import { codingCourses } from '../../data/codingData'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ classes: 0, quizzes: 0, students: 0 })
  const [assignedBatches, setAssignedBatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!user) return
      
      try {
        // Fetch classes
        const classesQuery = query(collection(db, 'live_classes'), where('teacher_id', '==', user.uid))
        const classesSnapshot = await getDocs(classesQuery)
        
        // Fetch quizzes
        const quizzesQuery = query(collection(db, 'quizzes'), where('teacher_id', '==', user.uid))
        const quizzesSnapshot = await getDocs(quizzesQuery)
        
        const userDocRef = doc(db, 'users', user.uid)
        const userDocSnap = await getDoc(userDocRef)
        const freshUser = userDocSnap.exists() ? { ...user, ...userDocSnap.data() } : user
        const assignedBatchesArr = freshUser.assigned_batches || []
        
        let studentCount = 0
        if (assignedBatchesArr.length > 0) {
          // Fetch batches names
          const batchesQuery = query(collection(db, 'batches'))
          const batchesSnapshot = await getDocs(batchesQuery)
          const firebaseBatchList = batchesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          
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
          const studentsQuery = query(
            collection(db, 'users'), 
            where('role', '==', 'Student'), // Capitalized 'Student' correctly
            where('assigned_batches', 'array-contains-any', assignedBatchesArr)
          )
          const studentsSnapshot = await getDocs(studentsQuery)
          studentCount = studentsSnapshot.size
        }
        setStats({
          classes: classesSnapshot.size,
          quizzes: quizzesSnapshot.size,
          students: studentCount
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [user])

  const profileImageUrl = user?.profile_url || user?.photoURL || ''

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-purple/10 to-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple font-bold text-3xl overflow-hidden flex-shrink-0 shadow-inner">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt={user?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'F')}&background=random`; }} />
            ) : (
              user?.name?.charAt(0) || 'F'
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user?.name || 'Faculty Member'}</h1>
              {user?.is_whitelisted && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Active Faculty
                </span>
              )}
            </div>
            <p className="text-gray-500 mb-4">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <span className="text-gray-400">ID:</span>
                <span className="text-gray-900">{user?.teacher_id || user?.uid}</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <BookOpen className="w-4 h-4 text-brand-purple" />
                  Assigned Batches ({assignedBatches.length})
                </div>
                {assignedBatches.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {assignedBatches.map(b => (
                      <span key={b.id} className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-50 border border-gray-100 text-sm font-semibold text-gray-800 shadow-sm">
                        {b.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">No batches assigned yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
            <Video className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Total Classes Hosted</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-lg" />
            ) : (
              <p className="text-3xl font-black text-gray-900">{stats.classes}</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
            <FileQuestion className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Active Quizzes</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-lg" />
            ) : (
              <p className="text-3xl font-black text-gray-900">{stats.quizzes}</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Total Students</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-lg" />
            ) : (
              <p className="text-3xl font-black text-gray-900">{stats.students}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
