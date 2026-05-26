import type { ReactNode } from 'react'
import { Spinner } from '../ui/Spinner'

export function InsightCard({
  title,
  value,
  description,
  details,
  loading,
  error,
  onRetry,
  className,
  children,
  scrollable = false,
}: {
  title: string
  value?: string | number
  description?: string
  details?: Array<{ label: string; text: string }>
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  className?: string
  children?: ReactNode
  scrollable?: boolean
}) {
  const cardClass = ['insight-card', className].filter(Boolean).join(' ')

  if (error) {
    return (
      <article className={`${cardClass} insight-card-error`}>
        <header className="insight-card-header">
          <h3>{title}</h3>
        </header>
        <p className="insight-error-text">{error}</p>
        {onRetry ? (
          <button type="button" className="button-secondary button-sm" onClick={onRetry}>
            Retry
          </button>
        ) : null}
      </article>
    )
  }

  if (loading) {
    return (
      <article className={`${cardClass} insight-card-loading`} aria-busy="true">
        <header className="insight-card-header">
          <h3>{title}</h3>
        </header>
        <Spinner label="Loading…" size="sm" />
      </article>
    )
  }

  return (
    <article className={cardClass}>
      <header className="insight-card-header">
        <h3>{title}</h3>
        {description ? <p className="insight-card-subtitle">{description}</p> : null}
      </header>

      {value !== undefined ? <p className="insight-stat-value">{value}</p> : null}

      {details && details.length > 0 ? (
        <dl className="insight-kpi-row">
          {details.map((detail) => (
            <div key={detail.label} className="insight-kpi-item">
              <dt>{detail.label}</dt>
              <dd>{detail.text}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {children ? (
        <div className={scrollable ? 'insight-card-body insight-scroll' : 'insight-card-body'}>
          {children}
        </div>
      ) : null}
    </article>
  )
}
