import { InsightCard } from './InsightCard'

export function SalaryStatsCard({
  loading,
  error,
  data,
  onRetry,
}: {
  loading: boolean
  error: string | null
  data?: {
    min: number
    max: number
    avg: number
  }
  onRetry?: () => void
}) {
  const formatCurrency = (num: number) =>
    num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  if (!data && !loading && !error) {
    return null
  }

  const value = data ? formatCurrency(data.avg) : '—'

  return (
    <InsightCard
      title="Salary Statistics"
      value={value}
      description="Average salary across the organization"
      details={
        data
          ? [
              { label: 'Min', text: formatCurrency(data.min) },
              { label: 'Max', text: formatCurrency(data.max) },
            ]
          : undefined
      }
      loading={loading}
      error={error}
      onRetry={onRetry}
    />
  )
}
