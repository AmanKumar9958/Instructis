import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/admin/Toast'
import { Users, Search, Mail, Calendar, BookOpen, Loader2 } from 'lucide-react'

export default function TeacherStudents() {
  const { user } = useAuth()
  const toast = useToast()
  
  const [batches, setBatches] = useState([])
  const [loadingBatches, setLoadingBatches] = useState(true)
  const [selectedBatchId, setSelectedBatchId] = useState(null)
  
  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // 1. Fetch Batches
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
            setSelectedBatchId(assigned[0].id)
          }
        }
      } catch (error) {
        console.error("Error fetching batches:", error)
        toast.error("Failed to load assigned batches")
      } finally {
        setLoadingBatches(false)
      }
    }
    fetchBatches()
  }, [user])

  // 2. Fetch Students for Selected Batch
  useEffect(() => {
    async function fetchStudents() {
      if (!selectedBatchId) {
        setStudents([])
        return
      }
      
      setLoadingStudents(true)
      try {
        const studentsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'student'),
          where('assigned_batch_id', '==', selectedBatchId)
        )
        
        const studentsSnapshot = await getDocs(studentsQuery)
        const fetchedStudents = studentsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        setStudents(fetchedStudents)
      } catch (error) {
        console.error("Error fetching students:", error)
        toast.error("Failed to load students")
      } finally {
        setLoadingStudents(false)
      }
    }
    fetchStudents()
  }, [selectedBatchId])

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    // Handle both Firestore Timestamp and regular Date objects/strings
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and view students enrolled in your batches</p>
        </div>
      </div>

      {/* Batches Tabs */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-purple" />
          Select Batch
        </h2>
        
        {loadingBatches ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 w-64 bg-white rounded-2xl border border-gray-100 shadow-sm flex-shrink-0 animate-pulse p-4">
                <div className="h-4 w-1/2 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-1/3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : batches.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center">
            <p className="text-gray-500">You have no assigned batches.</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {batches.map(batch => {
              const isSelected = selectedBatchId === batch.id
              return (
                <button
                  key={batch.id}
                  onClick={() => setSelectedBatchId(batch.id)}
                  className={`snap-start flex-shrink-0 w-64 p-5 rounded-2xl border transition-all text-left group
                    ${isSelected 
                      ? 'bg-brand-purple border-brand-purple shadow-md shadow-brand-purple/20 text-white translate-y-[-2px]' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-brand-purple/30 hover:shadow-sm'
                    }`}
                >
                  <h3 className={`font-bold mb-1 truncate ${isSelected ? 'text-white' : 'text-gray-900 group-hover:text-brand-purple transition-colors'}`}>
                    {batch.name}
                  </h3>
                  <p className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-500'} line-clamp-2`}>
                    {batch.description || 'No description available'}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Students Data Table */}
      {selectedBatchId && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[400px]">
          {/* Table Header / Toolbar */}
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Enrolled Students 
              <span className="bg-emerald-100 text-emerald-700 text-xs py-0.5 px-2 rounded-full">
                {students.length}
              </span>
            </h2>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl border border-gray-200 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none text-sm transition-all"
              />
            </div>
          </div>

          {/* Table Content */}
          <div className="flex-1 overflow-x-auto">
            {loadingStudents ? (
              <div className="flex flex-col items-center justify-center h-64 text-brand-purple">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-500">Loading students...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No students found</h3>
                <p className="text-gray-500 text-sm mt-1 max-w-sm">
                  {searchQuery ? "No students match your search criteria." : "There are no students enrolled in this batch yet."}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-10">#</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Join Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-gray-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple font-bold text-sm overflow-hidden flex-shrink-0">
                            {student.profile_url ? (
                              <img src={student.profile_url} alt={student.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'S')}&background=random`; }} />
                            ) : (
                              (student.name || '?').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-brand-purple transition-colors">
                              {student.name || 'Unknown Student'}
                            </p>
                            <p className="text-xs text-gray-500">ID: {student.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {student.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(student.accountCreatedAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
