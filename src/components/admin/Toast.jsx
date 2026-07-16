import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'

const ToastContext = createContext(null)

let toastId = 0

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-500',
    textColor: 'text-emerald-800',
    progressColor: 'bg-emerald-400',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50 border-red-200',
    iconColor: 'text-red-500',
    textColor: 'text-red-800',
    progressColor: 'bg-red-400',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-500',
    textColor: 'text-blue-800',
    progressColor: 'bg-blue-400',
  },
}

function ToastItem({ toast, onDismiss }) {
  const variant = VARIANTS[toast.type] || VARIANTS.info
  const Icon = variant.icon

  return (
    <div
      className={`flex items-start gap-3 w-80 px-4 py-3 rounded-xl border shadow-lg ${variant.bg} animate-[slideIn_0.3s_ease-out] relative overflow-hidden`}
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${variant.iconColor}`} />
      <p className={`text-sm font-medium flex-1 ${variant.textColor}`}>{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className={`p-0.5 rounded-md hover:bg-black/5 transition-colors flex-shrink-0 ${variant.textColor}`}
      >
        <X className="w-4 h-4" />
      </button>
      {/* Auto-dismiss progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5">
        <div
          className={`h-full ${variant.progressColor} animate-[shrink_4s_linear_forwards]`}
        />
      </div>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => dismiss(id), 4000)
  }, [dismiss])

  const toastAPI = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  }

  return (
    <ToastContext.Provider value={toastAPI}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
