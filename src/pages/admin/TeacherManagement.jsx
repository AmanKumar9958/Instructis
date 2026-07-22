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
import { BookOpen, XCircle } from 'lucide-react'
import examData from '../../data/examData'
import { aiMlCourses } from '../../data/aiMlData'
import { codingCourses } from '../../data/codingData'

const COLUMNS = [
  { label: 'Name' },
  { label: 'Email' },
  { label: 'Teacher ID' },
  { label: 'Status' },
  { label: 'Assigned Batches' },
  { label: 'Actions' },
]

export default function TeacherManagement() {
  const toast = useToast()
  const [teachers, setTeachers] = useState([])
  const [batches, setBatches] = useState([])
  const [batchMap, setBatchMap] = useState({})
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

  // Assign batch modal
  const [assignBatchTarget, setAssignBatchTarget] = useState(null)
  const [selectedBatches, setSelectedBatches] = useState([])
  const [savingBatch, setSavingBatch] = useState(false)
  
  // Details Modal
  const [detailsTarget, setDetailsTarget] = useState(null)
  const [removingBatchId, setRemovingBatchId] = useState(null)

  const fetchData = async () => {
    try {
      const [teacherSnap, batchSnap] = await Promise.all([
        getDocs(query(collection(db, 'users'), where('role', '==', 'Faculty'))),
        getDocs(collection(db, 'batches'))
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
      setTeachers(teacherSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error('Failed to fetch data:', err)
      toast.error('Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
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
      await fetchData()
    } catch (err) {
      console.error('Toggle whitelist error:', err)
      toast.error('Failed to update status')
    } finally {
      setTogglingId(null)
    }
  }

  const openAssignId = (teacher) => {
    setAssignTarget(teacher)
    const currentId = teacher.teacher_id || ''
    setTeacherIdInput(currentId.startsWith('INS-') ? currentId.substring(4) : currentId)
  }

  const handleAssignId = async (e) => {
    e.preventDefault()
    if (!assignTarget) return
    const finalId = `INS-${teacherIdInput.trim()}`
    
    setSavingId(true)
    try {
      // Check for duplicates
      const q = query(
        collection(db, 'users'), 
        where('role', '==', 'Faculty'), 
        where('teacher_id', '==', finalId)
      )
      const snap = await getDocs(q)
      const isDuplicate = snap.docs.some(d => d.id !== assignTarget.id)
      
      if (isDuplicate) {
        toast.error(`Teacher ID "${finalId}" is already assigned.`)
        setSavingId(false)
        return
      }

      await updateDoc(doc(db, 'users', assignTarget.id), {
        teacher_id: finalId,
      })
      toast.success(`Teacher ID set to "${finalId}"`)
      setAssignTarget(null)
      await fetchData()
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
      await fetchData()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to remove teacher')
    } finally {
      setDeleting(false)
    }
  }

  // Assign / change batch
  const openAssignBatch = (teacher) => {
    setAssignBatchTarget(teacher)
    if (teacher.assigned_batches && Array.isArray(teacher.assigned_batches)) {
      setSelectedBatches(teacher.assigned_batches)
    } else {
      setSelectedBatches([])
    }
  }

  const handleAssignBatch = async (e) => {
    e.preventDefault()
    if (!assignBatchTarget) return
    setSavingBatch(true)
    try {
      await updateDoc(doc(db, 'users', assignBatchTarget.id), {
        assigned_batches: selectedBatches,
      })
      toast.success(`Batches assigned to ${assignBatchTarget.name || assignBatchTarget.email}`)
      setAssignBatchTarget(null)
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
  const handleRemoveBatch = async (teacher) => {
    setRemovingBatchId(teacher.id)
    try {
      await updateDoc(doc(db, 'users', teacher.id), {
        assigned_batches: [],
      })
      toast.success(`All batches removed for ${teacher.name || teacher.email}`)
      await fetchData()
    } catch (err) {
      console.error('Remove batch error:', err)
      toast.error('Failed to remove batches')
    } finally {
      setRemovingBatchId(null)
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
            <td className="px-5 py-4 cursor-pointer group" onClick={() => setDetailsTarget(teacher)}>
              <div className="flex items-center gap-3">
                {teacher.profile_url ? (
                  <img src={teacher.profile_url} alt="" className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name || 'T')}&background=random`; }} />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-brand-light-purple flex items-center justify-center text-brand-purple text-xs font-bold">
                    {(teacher.name || teacher.email || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-900 group-hover:text-brand-purple transition-colors">{teacher.name || '—'}</span>
              </div>
            </td>
            <td className="px-5 py-4 text-sm text-gray-500 cursor-pointer" onClick={() => setDetailsTarget(teacher)}>{teacher.email || '—'}</td>
            <td className="px-5 py-4 cursor-pointer" onClick={() => setDetailsTarget(teacher)}>
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
            <td className="px-5 py-4 cursor-pointer" onClick={() => setDetailsTarget(teacher)}>
              {(() => {
                const assignedCount = teacher.assigned_batches?.length || 0;
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
                {/* Toggle whitelist */}
                <button
                  onClick={() => handleToggleWhitelist(teacher)}
                  disabled={togglingId === teacher.id}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                    teacher.is_whitelisted
                      ? 'text-red-600 bg-red-50 hover:bg-red-100 border-red-200'
                      : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                  } disabled:opacity-50`}
                >
                  {teacher.is_whitelisted ? 'Make Inactive' : 'Make Active'}
                </button>
                {/* Assign ID */}
                <button
                  onClick={() => openAssignId(teacher)}
                  className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                  title="Assign ID"
                >
                  <IdCard className="w-4 h-4" />
                </button>
                {/* Assign Batch */}
                <button
                  onClick={() => openAssignBatch(teacher)}
                  className="p-2 rounded-lg text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors"
                  title="Assign Batches"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
                {/* Remove from batch */}
                {teacher.assigned_batches?.length > 0 && (
                  <button
                    onClick={() => handleRemoveBatch(teacher)}
                    disabled={removingBatchId === teacher.id}
                    className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors disabled:opacity-50"
                    title="Remove all batches"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
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
            <div className="flex items-center">
              <span className="px-4 py-2.5 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 font-semibold text-sm">
                INS-
              </span>
              <input
                type="text"
                required
                value={teacherIdInput}
                onChange={(e) => setTeacherIdInput(e.target.value)}
                placeholder="101"
                className="w-full px-4 py-2.5 rounded-r-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
              />
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
        message={`Are you sure you want to permanently remove "${deleteTarget?.name || deleteTarget?.email}"? This action cannot be undone.`}
      />

      {/* Assign Batch Modal */}
      <Modal
        isOpen={!!assignBatchTarget}
        onClose={() => setAssignBatchTarget(null)}
        title="Assign Batches"
      >
        <form onSubmit={handleAssignBatch} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-accent-emerald" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{assignBatchTarget?.name || assignBatchTarget?.email}</p>
              <p className="text-xs text-gray-400">{assignBatchTarget?.email}</p>
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
              onClick={() => setAssignBatchTarget(null)}
              className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingBatch}
              className="px-5 py-2.5 text-sm font-bold text-white bg-brand-purple hover:bg-brand-purple-dark rounded-xl transition-colors shadow-sm shadow-brand-purple/20 flex items-center gap-2"
            >
              {savingBatch && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Teacher Details Modal */}
      <Modal
        isOpen={!!detailsTarget}
        onClose={() => setDetailsTarget(null)}
        title="Teacher Details"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
            {detailsTarget?.profile_url ? (
              <img src={detailsTarget.profile_url} alt="" className="w-16 h-16 rounded-xl object-cover shadow-sm" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-brand-light-purple flex items-center justify-center text-brand-purple text-2xl font-bold">
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
                const assignedIds = detailsTarget?.assigned_batches || [];
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
