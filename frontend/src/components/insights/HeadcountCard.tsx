export function HeadcountCard({
  loading,
  error,
  data,
}: {
  loading: boolean
  error: string | null
  data?: Array<{
    country: string
    count: number
  }>
}) {
  if (!data && !loading && !error) {
    return null
  }

  const total = data ? data.reduce((sum, item) => sum + item.count, 0) : 0
  const topCountries = data ? data.sort((a, b) => b.count - a.count).slice(0, 3) : []

  return (
    <article className="card card-stat">
      <h3>Global Headcount</h3>
      {error ? (
        <p style={{ color: '#e74c3c' }}>Error: {error}</p>
      ) : loading ? (
        <>
          <div className="skeleton" style={{ height: '2rem', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ height: '1rem', width: '70%' }} />
        </>
      ) : (
        <>
          <p className="stat-value">{total.toLocaleString()}</p>
          <p>Active employees across {data?.length ?? 0} countries</p>
          {topCountries.length > 0 && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <strong>Top Countries:</strong>
              {topCountries.map((c) => (
                <div key={c.country}>
                  {c.country}: {c.count.toLocaleString()}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </article>
  )
}
