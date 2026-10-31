import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export function Alert({ type = 'info', message, onClose, className = '' }) {
  if (!message) return null

  const styles = {
    success: 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200',
    error: 'bg-rose-950/40 border-rose-800/80 text-rose-200',
    info: 'bg-blue-950/40 border-blue-800/80 text-blue-200',
    warning: 'bg-amber-950/40 border-amber-800/80 text-amber-200',
  }

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  }

  const Icon = icons[type] || Info

  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-3 px-4 py-3 rounded-lg border text-sm leading-relaxed ${styles[type]} ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10 transition-colors shrink-0"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

