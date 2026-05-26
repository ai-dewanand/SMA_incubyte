export function TopEarnersCard({
  loading,
  error,
  data,
}: {
  loading: boolean
  error: string | null
  data?: Array<{
    id: string
    full_name: string
    salary: number
  }>
}) {
  if (!data && !loading && !error) {
    return null
  }

  const formatCurrency = (num: number) => `$${(num / 1000).toFixed(0)}k`

  return (
    <article className="card card-stat">
      <h3>Top 10 Earners</h3>
      {error ? (
        <p style={{ color: '#e74c3c' }}>Error: {error}</p>
      ) : loading ? (
        <>
          <div className="skeleton" style={{ height: '2rem', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ height: '1rem', width: '70%' }} />
        </>
      ) : (
        <>
          {data && data.length > 0 ? (
            <table
              style={{
                width: '100%',
                fontSize: '0.85rem',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '0.5rem' }}>Name</th>
                  <th style={{ textAlign: 'right', paddingBottom: '0.5rem' }}>Salary</th>
                </tr>
              </thead>
              <tbody>
                {data.map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.5rem 0' }}>{emp.full_name}</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 'bold' }}>
                      {formatCurrency(emp.salary)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No top earners data available</p>
          )}
        </>
      )}
    </article>
  )
}
