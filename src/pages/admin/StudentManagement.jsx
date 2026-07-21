import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebase'
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'
import { GraduationCap, BookOpen, Trash2, XCircle } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { useToast } from '../../components/admin/Toast'
import examData from '../../data/examData'
import { aiMlCourses } from '../../data/aiMlData'
import { codingCourses } from '../../data/codingData'

const COLUMNS = [
  { label: 'Name' },
  { label: 'Email' },
  { label: 'Assigned Batch' },
  { label: 'Actions' },
]

export default function StudentManagement() {
  const toast = useToast()
  const [students, setStudents] = useState([])
  const [batches, setBatches] = useState([])
  const [batchMap, setBatchMap] = useState({})
  const [loading, setLoading] = useState(true)

  // Assign batch modal
  const [assignTarget, setAssignTarget] = useState(null)
  const [selectedBatches, setSelectedBatches] = useState([])
  const [savingBatch, setSavingBatch] = useState(false)

  // Student details modal
  const [detailsTarget, setDetailsTarget] = useState(null)

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Remove from batch
  const [removingBatchId, setRemovingBatchId] = useState(null)

  const fetchData = async () => {
    try {
      const [studentSnap, batchSnap] = await Promise.all([
        getDocs(query(collection(db, 'users'), where('role', '==', 'Student'))),
        getDocs(collection(db, 'batches')),
      ])

      const firebaseBatchList = batchSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      
      const staticBatches = [
        ...examData.map(e => ({ id: e.id, name: e.shortName || e.name, status: 'active' })),
        ...aiMlCourses.map(c => ({ id: c.title.toLowerCase().replace(/\s+/g, '-'), name: c.title, status: 'active' })),
        ...codingCourses.map(c => ({ id: c.title.toLowerCase().replace(/\s+/g, '-'), name: c.title, status: 'active' }))
      ];

      const allBatches = [...staticBatches, ...firebaseBatchList];
      const uniqueBatchesMap = new Map();
      allBatches.forEach(b => uniqueBatchesMap.set(b.id, b));
      const finalBatchList = Array.from(uniqueBatchesMap.values());

      const map = {}
      finalBatchList.forEach((b) => { map[b.id] = b.name })

      setBatches(finalBatchList.filter((b) => b.status === 'active'))
      setBatchMap(map)
      setStudents(studentSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error('Failed to fetch data:', err)
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Assign / change batch
  const openAssignBatch = (student) => {
    setAssignTarget(student)
    if (student.assigned_batches && Array.isArray(student.assigned_batches)) {
      setSelectedBatches(student.assigned_batches)
    } else if (student.assigned_batch_id) {
      setSelectedBatches([student.assigned_batch_id])
    } else {
      setSelectedBatches([])
    }
  }

  const handleAssignBatch = async (e) => {
    e.preventDefault()
    if (!assignTarget) return
    setSavingBatch(true)
    try {
      await updateDoc(doc(db, 'users', assignTarget.id), {
        assigned_batches: selectedBatches,
        assigned_batch_id: null,
      })
      toast.success(`Batches assigned to ${assignTarget.name || assignTarget.email}`)
      setAssignTarget(null)
      await fetchData()
    } catch (err) {
      console.error('Assign batch error:', err)
      toast.error('Failed to assign batch')
    } finally {
      setSavingBatch(false)
    }
  }

  const toggleBatchSelection = (batchId) => {
    setSelectedBatches(prev => 
      prev.includes(batchId) ? prev.filter(id => id !== batchId) : [...prev, batchId]
    )
  }

  // Remove from batch
  const handleRemoveBatch = async (student) => {
    setRemovingBatchId(student.id)
    try {
      await updateDoc(doc(db, 'users', student.id), {
        assigned_batches: [],
        assigned_batch_id: null,
      })
      toast.success(`All batches removed for ${student.name || student.email}`)
      await fetchData()
    } catch (err) {
      console.error('Remove batch error:', err)
      toast.error('Failed to remove from batch')
    } finally {
      setRemovingBatchId(null)
    }
  }

  // Delete student
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'users', deleteTarget.id))
      toast.success(`${deleteTarget.name || deleteTarget.email} removed`)
      setDeleteTarget(null)
      await fetchData()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to remove student')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-emerald mb-1">
          <GraduationCap className="w-3.5 h-3.5" />
          Student Management
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Students</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">
          Assign batches and manage student enrollment.
        </p>
      </div>

      {/* Table */}
      <DataTable
        columns={COLUMNS}
        data={students}
        loading={loading}
        emptyMessage="No students registered yet."
        renderRow={(student) => (
          <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
            <td className="px-5 py-4 cursor-pointer group" onClick={() => setDetailsTarget(student)}>
              <div className="flex items-center gap-3">
                {student.photoURL ? (
                  <img src={student.photoURL} alt="" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-accent-emerald text-xs font-bold">
                    {(student.name || student.email || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-900 group-hover:text-brand-purple transition-colors">{student.name || '—'}</span>
              </div>
            </td>
            <td className="px-5 py-4 text-sm text-gray-500 cursor-pointer" onClick={() => setDetailsTarget(student)}>{student.email || '—'}</td>
            <td className="px-5 py-4 cursor-pointer" onClick={() => setDetailsTarget(student)}>
              {(() => {
                const assignedCount = student.assigned_batches?.length || (student.assigned_batch_id ? 1 : 0);
                if (assignedCount > 0) {
                  return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-light-purple text-brand-purple text-xs font-bold border border-brand-purple/10">
                      <BookOpen className="w-3 h-3" />
                      {assignedCount} {assignedCount === 1 ? 'Batch' : 'Batches'} Assigned
                    </span>
                  )
                }
                return <span className="text-xs text-gray-300 font-medium">No Batch</span>
              })()}
            </td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-1">
                {/* Assign batch */}
                <button
                  onClick={() => openAssignBatch(student)}
                  className="p-2 rounded-lg text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors"
                  title="Assign Batch"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
                {/* Remove from batch */}
                {(student.assigned_batches?.length > 0 || student.assigned_batch_id) && (
                  <button
                    onClick={() => handleRemoveBatch(student)}
                    disabled={removingBatchId === student.id}
                    className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors disabled:opacity-50"
                    title="Remove from Batch"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
                {/* Delete student */}
                <button
                  onClick={() => setDeleteTarget(student)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove Student"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Assign Batch Modal */}
      <Modal
        isOpen={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title="Assign Batch"
      >
        <form onSubmit={handleAssignBatch} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-accent-emerald" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{assignTarget?.name || assignTarget?.email}</p>
              <p className="text-xs text-gray-400">{assignTarget?.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Batches</label>
            <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-100 rounded-xl p-2 bg-white">
              {batches.map((b) => (
                <label key={b.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                  <input
                    type="checkbox"
                    checked={selectedBatches.includes(b.id)}
                    onChange={() => toggleBatchSelection(b.id)}
                    className="w-4 h-4 text-brand-purple rounded border-gray-300 focus:ring-brand-purple"
                  />
                  <span className="text-sm font-medium text-gray-700">{b.name}</span>
                </label>
              ))}
              {batches.length === 0 && (
                <p className="text-xs text-amber-500 p-2">No active batches found. Create a batch first.</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAssignTarget(null)}
              className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingBatch}
              className="px-5 py-2.5 text-sm font-bold text-white bg-brand-purple hover:bg-brand-purple-dark rounded-xl transition-colors shadow-sm shadow-brand-purple/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {savingBatch && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Assign Batch
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove Student"
        message={`Are you sure you want to permanently remove "${deleteTarget?.name || deleteTarget?.email}"? This will delete their account data.`}
      />

      {/* Student Details Modal */}
      <Modal
        isOpen={!!detailsTarget}
        onClose={() => setDetailsTarget(null)}
        title="Student Details"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
            {detailsTarget?.photoURL ? (
              <img src={detailsTarget.photoURL} alt="" className="w-16 h-16 rounded-xl object-cover shadow-sm" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl font-bold">
                {(detailsTarget?.name || detailsTarget?.email || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-900">{detailsTarget?.name || 'No Name'}</h3>
              <p className="text-sm text-gray-500">{detailsTarget?.email}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-purple" />
              Assigned Batches
            </h4>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {(() => {
                const assignedIds = detailsTarget?.assigned_batches || (detailsTarget?.assigned_batch_id ? [detailsTarget.assigned_batch_id] : []);
                if (assignedIds.length === 0) {
                  return <p className="text-sm text-gray-400 italic">No batches assigned yet.</p>
                }
                return assignedIds.map(id => (
                  <div key={id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <span className="text-sm font-semibold text-gray-800">{batchMap[id] || id}</span>
                    <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded">ID: {id}</span>
                  </div>
                ))
              })()}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
