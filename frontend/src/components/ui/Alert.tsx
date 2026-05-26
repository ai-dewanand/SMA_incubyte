'use client'

import type { ReactNode } from 'react'

type AlertVariant = 'success' | 'error' | 'info'

const variantClass: Record<AlertVariant, string> = {
  success: 'alert alert-success',
  error: 'alert alert-error',
  info: 'alert alert-info',
}

type AlertProps = {
  variant: AlertVariant
  children: ReactNode
  onDismiss?: () => void
  title?: string
}

export function Alert({ variant, children, onDismiss, title }: AlertProps) {
  return (
    <div className={variantClass[variant]} role="alert" aria-live="polite">
      <div className="alert-body">
        {title ? <strong className="alert-title">{title}</strong> : null}
        <p className="alert-message">{children}</p>
      </div>
      {onDismiss ? (
        <button type="button" className="alert-dismiss" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      ) : null}
    </div>
  )
}
