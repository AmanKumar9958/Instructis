import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../hooks/useAuth'
import { BookOpen, Users, Calendar, Clock, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react'
import examData from '../../data/examData'
import { aiMlCourses } from '../../data/aiMlData'
import { codingCourses } from '../../data/codingData'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [assignedBatches, setAssignedBatches] = useState([])
  const [faculty, setFaculty] = useState([])
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
            // If > 10, we must chunk. We'll do multiple queries.
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

      } catch (err) {
        console.error("Error fetching student dashboard:", err)
        setError("Failed to load dashboard data.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

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

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-purple/10 to-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple font-bold text-3xl overflow-hidden flex-shrink-0 shadow-inner">
            {user?.profile_url ? (
              <img src={user.profile_url} alt={user?.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              user?.name?.charAt(0) || 'S'
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{user?.name || 'Student'}</h1>
            <p className="text-gray-500 mb-4">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-gray-600">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <BookOpen className="w-4 h-4 text-brand-purple" />
                  Your Active Batches ({assignedBatches.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {assignedBatches.map(b => (
                    <span key={b.id} className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-50 border border-gray-100 text-sm font-semibold text-gray-800 shadow-sm">
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-purple" />
          Your Faculty
        </h2>
        {faculty.length > 0 ? (
          <div className="space-y-6">
            {assignedBatches.map(batch => {
              const batchFaculty = faculty.filter(f =>
                (f.assigned_batches && f.assigned_batches.includes(batch.id)) ||
                (f.fallback_batch_id === batch.id) // support the fallback mechanism
              )

              if (batchFaculty.length === 0) return null

              return (
                <div key={batch.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <BookOpen className="w-5 h-5 text-brand-orange" />
                    {batch.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {batchFaculty.map(f => (
                      <div key={f.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-brand-purple/30 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600 font-bold flex-shrink-0 overflow-hidden border border-gray-100">
                          {f.profile_url ? (
                            <img src={f.profile_url} alt={f.name} className="w-full h-full object-cover" />
                          ) : (
                            f.name?.charAt(0) || 'F'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{f.name || 'Faculty Member'}</h4>
                          {/* <p className="text-xs text-gray-500 truncate">{f.email}</p> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
            No faculty members are assigned to your batches yet.
          </div>
        )}
      </div>
    </div>
  )
}
