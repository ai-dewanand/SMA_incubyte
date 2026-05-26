export function InsightCard({
  title,
  value,
  description,
  details,
  loading,
  error,
}: {
  title: string
  value: string | number
  description?: string
  details?: Array<{ label: string; text: string }>
  loading?: boolean
  error?: string | null
}) {
  if (error) {
    return (
      <article className="card card-stat card-error">
        <h3>{title}</h3>
        <p style={{ color: '#e74c3c' }}>Error: {error}</p>
      </article>
    )
  }

  if (loading) {
    return (
      <article className="card card-stat card-loading">
        <h3>{title}</h3>
        <div className="skeleton" style={{ height: '2rem', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ height: '1rem', width: '70%' }} />
      </article>
    )
  }

  return (
    <article className="card card-stat">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
      {description && <p>{description}</p>}
      {details && (
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          {details.map((detail) => (
            <div key={detail.label} style={{ marginBottom: '0.5rem' }}>
              <strong>{detail.label}:</strong> {detail.text}
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

