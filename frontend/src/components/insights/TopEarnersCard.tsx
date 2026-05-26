import { InsightCard } from './InsightCard'

export function TopEarnersCard({
  loading,
  error,
  data,
  onRetry,
}: {
  loading: boolean
  error: string | null
  data?: Array<{
    id: string
    full_name: string
    salary: number
  }>
  onRetry?: () => void
}) {
  if (!data && !loading && !error) {
    return null
  }

  const formatCurrency = (num: number) =>
    num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  return (
    <InsightCard title="Top Earners" loading={loading} error={error} onRetry={onRetry} scrollable>
      {data && data.length > 0 ? (
        <ol className="insight-ranked-list">
          {data.map((employee, index) => (
            <li key={employee.id} className="insight-ranked-item">
              <span className="insight-rank">{index + 1}</span>
              <span className="insight-ranked-name">{employee.full_name}</span>
              <span className="insight-ranked-value">{formatCurrency(employee.salary)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="insight-empty">No top earners data available.</p>
      )}
    </InsightCard>
  )
}
