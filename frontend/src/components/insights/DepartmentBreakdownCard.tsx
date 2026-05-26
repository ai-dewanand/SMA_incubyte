import { InsightCard } from './InsightCard'

export function DepartmentBreakdownCard({
  loading,
  error,
  data,
  onRetry,
}: {
  loading: boolean
  error: string | null
  data?: Array<{
    department: string
    avg: number
  }>
  onRetry?: () => void
}) {
  if (!data && !loading && !error) {
    return null
  }

  const formatCurrency = (num: number) => `$${(num / 1000).toFixed(1)}k`
  const rows = Array.isArray(data) ? [...data].sort((a, b) => b.avg - a.avg) : []
  const topDept = rows[0]
  const maxAvg = topDept?.avg ?? 1

  return (
    <InsightCard
      title="Department Breakdown"
      description={topDept ? `Top: ${topDept.department}` : undefined}
      loading={loading}
      error={error}
      onRetry={onRetry}
      scrollable
    >
      {rows.length > 0 ? (
        <ul className="insight-bar-list">
          {rows.map((department) => (
            <li key={department.department} className="insight-bar-item">
              <div className="insight-bar-meta">
                <span className="insight-bar-label">{department.department}</span>
                <span className="insight-bar-value">{formatCurrency(department.avg)}</span>
              </div>
              <div className="insight-bar-track insight-bar-track-alt" aria-hidden="true">
                <div
                  className="insight-bar-fill"
                  style={{ width: `${(department.avg / maxAvg) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="insight-empty">No department data available.</p>
      )}
    </InsightCard>
  )
}
