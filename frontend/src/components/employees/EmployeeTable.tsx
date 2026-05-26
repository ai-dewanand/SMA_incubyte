'use client'

import { useEffect, useMemo, useState } from 'react'

export type EmployeeRecord = {
  id: string
  full_name: string
  email: string
  job_title: string
  department: string
  country: string
  salary: string
}

const PAGE_SIZE = 8

export function EmployeeTable({ employees }: { employees: EmployeeRecord[] }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const normalizedQuery = query.trim().toLowerCase()

  const filteredEmployees = useMemo(() => {
    if (!normalizedQuery) {
      return employees
    }

    return employees.filter((employee) => {
      return [
        employee.full_name,
        employee.email,
        employee.job_title,
        employee.department,
        employee.country,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    })
  }, [employees, normalizedQuery])

  useEffect(() => {
    setPage(1)
  }, [normalizedQuery])

  const pageCount = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE))
  const startIndex = (page - 1) * PAGE_SIZE
  const pageEmployees = filteredEmployees.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <section className="panel">
      <div className="table-toolbar">
        <div>
          <p className="table-summary">
            Showing {pageEmployees.length} of {filteredEmployees.length} employees
          </p>
        </div>
        <div className="search-group">
          <label htmlFor="employee-search">Search</label>
          <input
            id="employee-search"
            type="search"
            placeholder="Search by name, email, title, department, country"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Job title</th>
            <th>Department</th>
            <th>Country</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {pageEmployees.length > 0 ? (
            pageEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.full_name}</td>
                <td>{employee.email}</td>
                <td>{employee.job_title}</td>
                <td>{employee.department}</td>
                <td>{employee.country}</td>
                <td>{employee.salary}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="empty-state">
                No employees match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {pageCount}
        </span>
        <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount}>
          Next
        </button>
      </div>
    </section>
  )
}
