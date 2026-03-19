import { createPortal } from 'react-dom'

const LoadingOverlay = ({ isOpen, label = 'Please wait...' }) => {
  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/35 px-4 backdrop-blur-md">
      <div className="flex w-full max-w-xs flex-col items-center rounded-2xl bg-white/95 p-6 shadow-2xl shadow-black/20">
        <div className="relative h-16 w-16">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600" />
          <div className="absolute inset-3 animate-spin rounded-full border-4 border-emerald-200 border-r-emerald-500 [animation-direction:reverse] [animation-duration:1.2s]" />
          <div className="absolute inset-0 m-auto h-2.5 w-2.5 animate-pulse rounded-full bg-sky-600" />
        </div>
        <p className="mt-4 text-sm font-semibold text-neutral-700">{label}</p>
      </div>
    </div>,
    document.body
  )
}

export default LoadingOverlay
