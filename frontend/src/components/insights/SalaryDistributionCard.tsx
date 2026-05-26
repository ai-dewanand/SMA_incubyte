import { InsightCard } from './InsightCard'

export function SalaryDistributionCard({
  loading,
  error,
  data,
  onRetry,
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
  onRetry?: () => void
}) {
  if (!data && !loading && !error) {
    return null
  }

  const formatCurrency = (num: number) => `$${(num / 1000).toFixed(0)}k`
  const maxCount = data ? Math.max(...data.buckets.map((bucket) => bucket.count), 1) : 1

  return (
    <InsightCard
      title="Salary Distribution"
      description={data ? `${data.total.toLocaleString()} employees in sample` : undefined}
      loading={loading}
      error={error}
      onRetry={onRetry}
      className="card-span-2"
    >
      {data && data.buckets.length > 0 ? (
        <div className="insight-details">
          {data.buckets.map((bucket, index) => (
            <div className="distribution-row" key={index}>
              <div className="distribution-label">
                {formatCurrency(bucket.range[0])} – {formatCurrency(bucket.range[1])}
              </div>
              <div className="distribution-track" aria-hidden="true">
                <div
                  className="distribution-bar"
                  style={{ width: `${(bucket.count / maxCount) * 100}%` }}
                />
              </div>
              <div className="distribution-count">{bucket.count}</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No distribution data available.</p>
      )}
    </InsightCard>
  )
}
