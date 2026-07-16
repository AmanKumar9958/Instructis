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
import { Users, IdCard, Trash2, ShieldCheck, ShieldOff } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import StatusBadge from '../../components/admin/StatusBadge'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { useToast } from '../../components/admin/Toast'

const COLUMNS = [
  { label: 'Name' },
  { label: 'Email' },
  { label: 'Teacher ID' },
  { label: 'Status' },
  { label: 'Actions' },
]

export default function TeacherManagement() {
  const toast = useToast()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  // Assign ID modal
  const [assignTarget, setAssignTarget] = useState(null)
  const [teacherIdInput, setTeacherIdInput] = useState('')
  const [savingId, setSavingId] = useState(false)

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Whitelist toggling
  const [togglingId, setTogglingId] = useState(null)

  const fetchTeachers = async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'Faculty'))
      const snap = await getDocs(q)
      setTeachers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error('Failed to fetch teachers:', err)
      toast.error('Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  // Toggle whitelist
  const handleToggleWhitelist = async (teacher) => {
    setTogglingId(teacher.id)
    const newValue = !teacher.is_whitelisted
    try {
      await updateDoc(doc(db, 'users', teacher.id), {
        is_whitelisted: newValue,
      })
      toast.success(newValue ? `${teacher.name || teacher.email} approved` : `${teacher.name || teacher.email} access revoked`)
      await fetchTeachers()
    } catch (err) {
      console.error('Toggle whitelist error:', err)
      toast.error('Failed to update status')
    } finally {
      setTogglingId(null)
    }
  }

  // Assign teacher ID
  const openAssignId = (teacher) => {
    setAssignTarget(teacher)
    setTeacherIdInput(teacher.teacher_id || '')
  }

  const handleAssignId = async (e) => {
    e.preventDefault()
    if (!assignTarget) return
    setSavingId(true)
    try {
      await updateDoc(doc(db, 'users', assignTarget.id), {
        teacher_id: teacherIdInput.trim(),
      })
      toast.success(`Teacher ID set to "${teacherIdInput.trim()}"`)
      setAssignTarget(null)
      await fetchTeachers()
    } catch (err) {
      console.error('Assign ID error:', err)
      toast.error('Failed to assign teacher ID')
    } finally {
      setSavingId(false)
    }
  }

  // Delete teacher
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'users', deleteTarget.id))
      toast.success(`${deleteTarget.name || deleteTarget.email} removed`)
      setDeleteTarget(null)
      await fetchTeachers()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to remove teacher')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange mb-1">
          <Users className="w-3.5 h-3.5" />
          Faculty Management
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Teachers</h1>
        <p className="text-sm text-gray-400 font-medium mt-1">
          Approve, assign IDs, and manage faculty access.
        </p>
      </div>

      {/* Table */}
      <DataTable
        columns={COLUMNS}
        data={teachers}
        loading={loading}
        emptyMessage="No teachers registered yet."
        renderRow={(teacher) => (
          <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors">
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                {teacher.profile_url ? (
                  <img src={teacher.profile_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-brand-light-purple flex items-center justify-center text-brand-purple text-xs font-bold">
                    {(teacher.name || teacher.email || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-900">{teacher.name || '—'}</span>
              </div>
            </td>
            <td className="px-5 py-4 text-sm text-gray-500">{teacher.email || '—'}</td>
            <td className="px-5 py-4">
              {teacher.teacher_id ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  <IdCard className="w-3 h-3" />
                  {teacher.teacher_id}
                </span>
              ) : (
                <span className="text-xs text-gray-300 font-medium">Not Assigned</span>
              )}
            </td>
            <td className="px-5 py-4">
              <StatusBadge status={teacher.is_whitelisted ? 'Approved' : 'Pending'} />
            </td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-1">
                {/* Toggle whitelist */}
                <button
                  onClick={() => handleToggleWhitelist(teacher)}
                  disabled={togglingId === teacher.id}
                  className={`p-2 rounded-lg transition-colors ${
                    teacher.is_whitelisted
                      ? 'text-emerald-500 hover:text-red-500 hover:bg-red-50'
                      : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50'
                  } disabled:opacity-50`}
                  title={teacher.is_whitelisted ? 'Revoke Access' : 'Approve'}
                >
                  {teacher.is_whitelisted ? (
                    <ShieldOff className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </button>
                {/* Assign ID */}
                <button
                  onClick={() => openAssignId(teacher)}
                  className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                  title="Assign ID"
                >
                  <IdCard className="w-4 h-4" />
                </button>
                {/* Delete */}
                <button
                  onClick={() => setDeleteTarget(teacher)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove Teacher"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Assign ID Modal */}
      <Modal
        isOpen={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title="Assign Teacher ID"
      >
        <form onSubmit={handleAssignId} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <IdCard className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{assignTarget?.name || assignTarget?.email}</p>
              <p className="text-xs text-gray-400">{assignTarget?.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teacher ID</label>
            <input
              type="text"
              required
              value={teacherIdInput}
              onChange={(e) => setTeacherIdInput(e.target.value)}
              placeholder="e.g., FAC-102"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
            />
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
              disabled={savingId}
              className="px-5 py-2.5 text-sm font-bold text-white bg-brand-purple hover:bg-brand-purple-dark rounded-xl transition-colors shadow-sm shadow-brand-purple/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {savingId && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Save ID
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
        title="Remove Teacher"
        message={`Are you sure you want to permanently remove "${deleteTarget?.name || deleteTarget?.email}"? This will delete their account data.`}
      />
    </div>
  )
}
