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
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const [savingBatch, setSavingBatch] = useState(false)

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

      const batchList = batchSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      const map = {}
      batchList.forEach((b) => { map[b.id] = b.name })

      setBatches(batchList.filter((b) => b.status === 'active'))
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
    setSelectedBatchId(student.assigned_batch_id || '')
  }

  const handleAssignBatch = async (e) => {
    e.preventDefault()
    if (!assignTarget || !selectedBatchId) return
    setSavingBatch(true)
    try {
      await updateDoc(doc(db, 'users', assignTarget.id), {
        assigned_batch_id: selectedBatchId,
      })
      toast.success(`Batch assigned to ${assignTarget.name || assignTarget.email}`)
      setAssignTarget(null)
      await fetchData()
    } catch (err) {
      console.error('Assign batch error:', err)
      toast.error('Failed to assign batch')
    } finally {
      setSavingBatch(false)
    }
  }

  // Remove from batch
  const handleRemoveBatch = async (student) => {
    setRemovingBatchId(student.id)
    try {
      await updateDoc(doc(db, 'users', student.id), {
        assigned_batch_id: null,
      })
      toast.success(`${student.name || student.email} removed from batch`)
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
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                {student.profile_url ? (
                  <img src={student.profile_url} alt="" className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'S')}&background=random`; }} />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-accent-emerald text-xs font-bold">
                    {(student.name || student.email || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-900">{student.name || '—'}</span>
              </div>
            </td>
            <td className="px-5 py-4 text-sm text-gray-500">{student.email || '—'}</td>
            <td className="px-5 py-4">
              {student.assigned_batch_id && batchMap[student.assigned_batch_id] ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-light-purple text-brand-purple text-xs font-bold border border-brand-purple/10">
                  <BookOpen className="w-3 h-3" />
                  {batchMap[student.assigned_batch_id]}
                </span>
              ) : (
                <span className="text-xs text-gray-300 font-medium">No Batch</span>
              )}
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
                {student.assigned_batch_id && (
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
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Batch *</label>
            <select
              required
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all bg-white"
            >
              <option value="">Choose a batch...</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {batches.length === 0 && (
              <p className="text-xs text-amber-500 mt-1.5">No active batches found. Create a batch first.</p>
            )}
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
              disabled={savingBatch || !selectedBatchId}
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
    </div>
  )
}
