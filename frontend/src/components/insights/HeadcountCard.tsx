import { InsightCard } from './InsightCard'

export function HeadcountCard({
  loading,
  error,
  data,
  onRetry,
}: {
  loading: boolean
  error: string | null
  data?: Array<{
    country: string
    count: number
  }>
  onRetry?: () => void
}) {
  if (!data && !loading && !error) {
    return null
  }

  const total = data ? data.reduce((sum, item) => sum + item.count, 0) : 0
  const topCountries = data ? [...data].sort((a, b) => b.count - a.count).slice(0, 5) : []
  const maxCount = topCountries[0]?.count ?? 1

  return (
    <InsightCard
      title="Global Headcount"
      value={total.toLocaleString()}
      description={`${data?.length ?? 0} countries`}
      loading={loading}
      error={error}
      onRetry={onRetry}
      scrollable={topCountries.length > 4}
    >
      {topCountries.length > 0 ? (
        <ul className="insight-bar-list">
          {topCountries.map((country) => (
            <li key={country.country} className="insight-bar-item">
              <div className="insight-bar-meta">
                <span className="insight-bar-label">{country.country}</span>
                <span className="insight-bar-value">{country.count.toLocaleString()}</span>
              </div>
              <div className="insight-bar-track" aria-hidden="true">
                <div
                  className="insight-bar-fill"
                  style={{ width: `${(country.count / maxCount) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </InsightCard>
  )
}
