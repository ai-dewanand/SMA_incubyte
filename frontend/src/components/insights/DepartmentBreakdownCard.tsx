export function DepartmentBreakdownCard({
  loading,
  error,
  data,
}: {
  loading: boolean
  error: string | null
  data?: Array<{
    department: string
    avg: number
  }>
}) {
  if (!data && !loading && !error) {
    return null
  }

  const formatCurrency = (num: number) => `$${(num / 1000).toFixed(1)}k`
  const topDept = data ? data.sort((a, b) => b.avg - a.avg)[0] : null

  return (
    <article className="card card-stat">
      <h3>Department Breakdown</h3>
      {error ? (
        <p style={{ color: '#e74c3c' }}>Error: {error}</p>
      ) : loading ? (
        <>
          <div className="skeleton" style={{ height: '2rem', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ height: '1rem', width: '70%' }} />
        </>
      ) : (
        <>
          <p className="stat-value">{data?.length ?? 0} Departments</p>
          {topDept && <p>Highest: {topDept.department} ({formatCurrency(topDept.avg)})</p>}
          {data && (
            <table
              style={{
                marginTop: '1rem',
                width: '100%',
                fontSize: '0.85rem',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '0.5rem' }}>Department</th>
                  <th style={{ textAlign: 'right', paddingBottom: '0.5rem' }}>Avg Salary</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((d) => (
                  <tr key={d.department} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.5rem 0' }}>{d.department}</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem 0' }}>
                      {formatCurrency(d.avg)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </article>
  )
}
