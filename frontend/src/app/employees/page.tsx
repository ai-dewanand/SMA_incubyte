'use client'

import { useEffect, useMemo, useState } from 'react'
import { EmployeeTable, type EmployeeRecord } from '../../components/employees/EmployeeTable'
import { fetchEmployees } from '../../lib/api'

function formatSalary(value: unknown): string {
  if (typeof value === 'string') {
    const num = Number(value)
    if (!Number.isNaN(num)) {
      return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    }
    return value
  }
  if (typeof value === 'number') {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  }
  return String(value)
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEmployees() {
      try {
        const payload = await fetchEmployees()
        const normalized = payload.map((item: any) => ({
          id: item.id,
          full_name: item.full_name,
          email: item.email,
          job_title: item.job_title,
          department: item.department,
          country: item.country,
          salary: formatSalary(item.salary),
        }))
        setEmployees(normalized)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Failed to load employees')
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [])

  return (
    <main>
      <section className="page-header">
        <h1>Employee Directory</h1>
        <p>Browse active team members and key salary details.</p>
      </section>

      {loading ? (
        <div className="panel">
          <p className="empty-state">Loading employees…</p>
        </div>
      ) : error ? (
        <div className="panel">
          <p className="empty-state">{error}</p>
        </div>
      ) : (
        <EmployeeTable employees={employees} />
      )}
    </main>
  )
}
