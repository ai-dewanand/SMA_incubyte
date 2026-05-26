export function SalaryDistributionCard({
  loading,
  error,
  data,
}: {
  loading: boolean
  error: string | null
  data?: {
    buckets: Array<{
      range: [number, number]
      count: number
    }>
    total: number
  }
}) {
  if (!data && !loading && !error) {
    return null
  }

  const formatCurrency = (num: number) => `$${(num / 1000).toFixed(0)}k`
  const maxCount = data ? Math.max(...data.buckets.map((b) => b.count), 1) : 1

  return (
    <article className="card card-stat">
      <h3>Salary Distribution</h3>
      {error ? (
        <p style={{ color: '#e74c3c' }}>Error: {error}</p>
      ) : loading ? (
        <>
          <div className="skeleton" style={{ height: '2rem', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ height: '1rem', width: '70%' }} />
        </>
      ) : data && data.buckets.length > 0 ? (
        <div style={{ marginTop: '1rem' }}>
          {data.buckets.map((bucket, i) => (
            <div
              key={i}
              style={{
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div style={{ minWidth: '110px', fontSize: '0.85rem' }}>
                {formatCurrency(bucket.range[0])} - {formatCurrency(bucket.range[1])}
              </div>
              <div
                style={{
                  flex: 1,
                  height: '20px',
                  background: '#3498db',
                  borderRadius: '4px',
                  width: `${(bucket.count / maxCount) * 100}%`,
                  minWidth: '2px',
                }}
              />
              <div style={{ minWidth: '50px', textAlign: 'right', fontSize: '0.85rem' }}>
                {bucket.count}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No distribution data available</p>
      )}
    </article>
  )
}
