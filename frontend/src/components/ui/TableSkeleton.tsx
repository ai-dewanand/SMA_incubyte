type TableSkeletonProps = {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 6, columns = 7 }: TableSkeletonProps) {
  return (
    <div className="table-scroll" aria-hidden="true">
      <table className="table table-skeleton">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index}>
                <div className="skeleton skeleton-cell" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((__, colIndex) => (
                <td key={colIndex}>
                  <div className="skeleton skeleton-cell" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
