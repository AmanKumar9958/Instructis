import { useEffect, useState } from 'react'
import { db } from '../../firebase/firebase'
import examData from '../../data/examData'
import { aiMlCourses } from '../../data/aiMlData'
import { codingCourses } from '../../data/codingData'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  orderBy,
  query,
} from 'firebase/firestore'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'
import StatusBadge from '../../components/admin/StatusBadge'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { useToast } from '../../components/admin/Toast'

const COLUMNS = [
  { label: 'Name' },
  { label: 'Description' },
  { label: 'Status' },
  { label: 'Created' },
  { label: 'Actions' },
]

const INITIAL_FORM = { name: '', description: '', status: 'active' }

export default function BatchManagement() {
  const toast = useToast()
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBatch, setEditingBatch] = useState(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchBatches = async () => {
    try {
      const q = query(collection(db, 'batches'), orderBy('created_at', 'desc'))
      const snap = await getDocs(q)
      const firebaseBatches = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

      const staticBatches = [
        ...examData.map(e => ({ id: e.id, name: e.shortName || e.name, description: e.tagline || e.description, status: 'active', isStatic: true, created_at: new Date() })),
        ...aiMlCourses.map(c => ({ id: c.title.toLowerCase().replace(/\s+/g, '-'), name: c.title, description: c.description, status: 'active', isStatic: true, created_at: new Date() })),
        ...codingCourses.map(c => ({ id: c.title.toLowerCase().replace(/\s+/g, '-'), name: c.title, description: c.description, status: 'active', isStatic: true, created_at: new Date() }))
      ];

      const allBatches = [...staticBatches, ...firebaseBatches];
      const uniqueBatchesMap = new Map();
      allBatches.forEach(b => uniqueBatchesMap.set(b.id, b));
      setBatches(Array.from(uniqueBatchesMap.values()));
    } catch (err) {
      console.error('Failed to fetch batches:', err)
      toast.error('Failed to load batches')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBatches()
  }, [])

  const openCreate = () => {
    setEditingBatch(null)
    setForm(INITIAL_FORM)
    setShowModal(true)
  }

  const openEdit = (batch) => {
    setEditingBatch(batch)
    setForm({ name: batch.name || '', description: batch.description || '', status: batch.status || 'active' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editingBatch) {
        await updateDoc(doc(db, 'batches', editingBatch.id), {
          name: form.name.trim(),
          description: form.description.trim(),
          status: form.status,
        })
        toast.success('Batch updated successfully')
      } else {
        await addDoc(collection(db, 'batches'), {
          name: form.name.trim(),
          description: form.description.trim(),
          status: form.status,
          created_at: serverTimestamp(),
        })
        toast.success('Batch created successfully')
      }
      setShowModal(false)
      await fetchBatches()
    } catch (err) {
      console.error('Batch save error:', err)
      toast.error('Failed to save batch')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'batches', deleteTarget.id))
      toast.success(`"${deleteTarget.name}" deleted successfully`)
      setDeleteTarget(null)
      await fetchBatches()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Failed to delete batch')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleStatus = async (batch) => {
    const newStatus = batch.status === 'active' ? 'archived' : 'active'
    try {
      if (batch.isStatic) {
        await setDoc(doc(db, 'batches', batch.id), {
          name: batch.name,
          description: batch.description,
          status: newStatus,
          created_at: serverTimestamp(),
          isStaticOverride: true
        })
      } else {
        await updateDoc(doc(db, 'batches', batch.id), { status: newStatus })
      }
      toast.success(`Batch marked as ${newStatus}`)
      await fetchBatches()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status')
    }
  }

  const formatDate = (ts) => {
    if (!ts) return '—'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-purple mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            Course Management
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Batches</h1>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-purple hover:bg-brand-purple-dark text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-brand-purple/20"
        >
          <Plus className="w-4 h-4" />
          Add Batch
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={COLUMNS}
        data={batches}
        loading={loading}
        emptyMessage="No batches yet. Create your first batch!"
        renderRow={(batch) => (
          <tr key={batch.id} className="hover:bg-gray-50/50 transition-colors">
            <td className="px-5 py-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">{batch.name}</span>
                <span className="text-[10px] text-gray-400 font-mono mt-0.5" title="Systematic ID">ID: {batch.id}</span>
              </div>
            </td>
            <td className="px-5 py-4 text-sm text-gray-500 max-w-xs truncate">{batch.description || '—'}</td>
            <td className="px-5 py-4">
              <StatusBadge status={batch.status || 'active'} />
            </td>
            <td className="px-5 py-4 text-sm text-gray-400">{formatDate(batch.created_at)}</td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleStatus(batch)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                    batch.status === 'active'
                      ? 'text-red-600 bg-red-50 hover:bg-red-100 border-red-200'
                      : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                  }`}
                >
                  {batch.status === 'active' ? 'Make Inactive' : 'Make Active'}
                </button>
                {!batch.isStatic && !batch.isStaticOverride && (
                  <>
                    <button
                      onClick={() => openEdit(batch)}
                      className="p-2 rounded-lg text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(batch)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        )}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingBatch ? 'Edit Batch' : 'Create New Batch'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Batch Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., JEE Target 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of this batch..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all bg-white"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold text-white bg-brand-purple hover:bg-brand-purple-dark rounded-xl transition-colors shadow-sm shadow-brand-purple/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {editingBatch ? 'Save Changes' : 'Create Batch'}
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
        title="Delete Batch"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
