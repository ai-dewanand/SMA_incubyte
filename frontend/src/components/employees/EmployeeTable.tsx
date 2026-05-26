'use client'

export type EmployeeRecord = {
  id: string
  full_name: string
  email: string
  job_title: string
  department: string
  country: string
  salary: string
  currency?: string
  employment_type?: string
  hired_at?: string
}

export type EmployeeFilters = {
  country: string
  department: string
  job_title: string
  employment_type: string
}

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const
const EMPLOYMENT_TYPES = ['', 'FULL_TIME', 'PART_TIME', 'CONTRACT'] as const

type EmployeeTableProps = {
  employees: EmployeeRecord[]
  total: number
  page: number
  pageSize: number
  search: string
  filters: EmployeeFilters
  loading?: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSearchChange: (search: string) => void
  onFiltersChange: (filters: EmployeeFilters) => void
  onEdit: (employee: EmployeeRecord) => void
  onDelete: (employeeId: string) => void
  deletingIds?: string[]
}

export function EmployeeTable({
  employees,
  total,
  page,
  pageSize,
  search,
  filters,
  loading = false,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onFiltersChange,
  onEdit,
  onDelete,
  deletingIds = [],
}: EmployeeTableProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  const updateFilter = (field: keyof EmployeeFilters, value: string) => {
    onFiltersChange({ ...filters, [field]: value })
  }

  return (
    <section className="panel">
      <div className="table-toolbar">
        <div>
          <p className="table-summary">
            {loading
              ? 'Loading employees…'
              : total === 0
                ? 'No employees found'
                : `Showing ${rangeStart}–${rangeEnd} of ${total.toLocaleString()} employees`}
          </p>
        </div>
        <div className="toolbar-controls">
          <div className="page-size-group">
            <label htmlFor="page-size">Rows per page</label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              disabled={loading}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="search-group">
            <label htmlFor="employee-search">Search</label>
            <input
              id="employee-search"
              type="search"
              placeholder="Name, email, title, department, country"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-group">
          <label htmlFor="filter-country">Country</label>
          <input
            id="filter-country"
            type="text"
            placeholder="Filter by country"
            value={filters.country}
            onChange={(event) => updateFilter('country', event.target.value)}
            disabled={loading}
          />
        </div>
        <div className="search-group">
          <label htmlFor="filter-department">Department</label>
          <input
            id="filter-department"
            type="text"
            placeholder="Filter by department"
            value={filters.department}
            onChange={(event) => updateFilter('department', event.target.value)}
            disabled={loading}
          />
        </div>
        <div className="search-group">
          <label htmlFor="filter-job-title">Job title</label>
          <input
            id="filter-job-title"
            type="text"
            placeholder="Filter by job title"
            value={filters.job_title}
            onChange={(event) => updateFilter('job_title', event.target.value)}
            disabled={loading}
          />
        </div>
        <div className="page-size-group">
          <label htmlFor="filter-employment-type">Employment type</label>
          <select
            id="filter-employment-type"
            value={filters.employment_type}
            onChange={(event) => updateFilter('employment_type', event.target.value)}
            disabled={loading}
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type || 'all'} value={type}>
                {type ? type.replace('_', ' ') : 'All types'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Job title</th>
              <th>Department</th>
              <th>Country</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  Loading…
                </td>
              </tr>
            ) : employees.length > 0 ? (
              employees.map((employee) => {
                const isDeleting = deletingIds.includes(employee.id)
                return (
                  <tr key={employee.id}>
                    <td>{employee.full_name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.job_title}</td>
                    <td>{employee.department}</td>
                    <td>{employee.country}</td>
                    <td>{employee.salary}</td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => onEdit(employee)}
                        disabled={isDeleting}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="button-danger"
                        onClick={() => onDelete(employee.id)}
                        disabled={isDeleting}
                        aria-busy={isDeleting}
                      >
                        {isDeleting ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="empty-state">
                  No employees match your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </button>
        <span>
          Page {page} of {pageCount.toLocaleString()}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount || loading}
        >
          Next
        </button>
      </div>
    </section>
  )
}
