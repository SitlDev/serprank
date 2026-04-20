import React from 'react'
import { AlertCircle, CheckCircle, InfoIcon, XCircle } from 'lucide-react'

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  onClose?: () => void
}

const alertStyles = {
  success: {
    bg: 'bg-brand-50',
    border: 'border-brand-200',
    icon: 'text-brand-600',
    text: 'text-brand-800',
    Icon: CheckCircle,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    text: 'text-red-800',
    Icon: XCircle,
  },
  warning: {
    bg: 'bg-accent-50',
    border: 'border-accent-200',
    icon: 'text-accent-600',
    text: 'text-accent-800',
    Icon: AlertCircle,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-800',
    Icon: InfoIcon,
  },
}

export const Alert = ({ type, title, message, onClose }: AlertProps) => {
  const style = alertStyles[type]
  const Icon = style.Icon

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 flex items-start gap-3 mb-4`}>
      <Icon className={`${style.icon} flex-shrink-0 mt-0.5`} size={20} />
      <div className="flex-1 min-w-0">
        {title && <p className={`${style.text} font-semibold`}>{title}</p>}
        <p className={`${style.text} text-sm break-words whitespace-pre-wrap`}>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className={`${style.icon} hover:opacity-70 transition flex-shrink-0`}>
          ✕
        </button>
      )}
    </div>
  )
}
