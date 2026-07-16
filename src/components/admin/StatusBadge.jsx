const VARIANTS = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-gray-100 text-gray-500 border-gray-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  revoked: 'bg-red-50 text-red-600 border-red-200',
}

export default function StatusBadge({ status }) {
  const key = status?.toLowerCase() || 'pending'
  const classes = VARIANTS[key] || VARIANTS.pending

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        key === 'active' || key === 'approved' ? 'bg-emerald-500' :
        key === 'archived' ? 'bg-gray-400' :
        key === 'revoked' ? 'bg-red-500' :
        'bg-amber-500'
      }`} />
      {status || 'Pending'}
    </span>
  )
}
