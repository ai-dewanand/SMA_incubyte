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
  const buckets = data?.buckets ?? []
  const maxCount = buckets.length > 0 ? Math.max(...buckets.map((bucket) => bucket.count), 1) : 1

  return (
    <InsightCard
      title="Salary Distribution"
      description={data ? `${data.total.toLocaleString()} employees` : undefined}
      loading={loading}
      error={error}
      onRetry={onRetry}
    >
      {buckets.length > 0 ? (
        <div className="distribution-grid">
          {buckets.map((bucket, index) => (
            <div className="distribution-cell" key={index}>
              <div className="distribution-cell-header">
                <span className="distribution-label">
                  {formatCurrency(bucket.range[0])}–{formatCurrency(bucket.range[1])}
                </span>
                <span className="distribution-count">{bucket.count.toLocaleString()}</span>
              </div>
              <div className="distribution-track" aria-hidden="true">
                <div
                  className="distribution-bar"
                  style={{ width: `${(bucket.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="insight-empty">No distribution data available.</p>
      )}
    </InsightCard>
  )
}
