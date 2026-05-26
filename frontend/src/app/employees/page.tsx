'use client'

import { useEffect, useMemo, useState } from 'react'
import { EmployeeForm, type EmployeeFormData } from '../../components/employees/EmployeeForm'
import { EmployeeTable, type EmployeeRecord } from '../../components/employees/EmployeeTable'
import { createEmployee, deleteEmployee, fetchEmployees, updateEmployee } from '../../lib/api'

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

function normalizeEmployee(item: any): EmployeeRecord {
  return {
    id: item.id,
    full_name: item.full_name,
    email: item.email,
    job_title: item.job_title,
    department: item.department,
    country: item.country,
    salary: formatSalary(item.salary),
    currency: item.currency,
    employment_type: item.employment_type,
    hired_at: item.hired_at,
  }
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeEmployee, setActiveEmployee] = useState<EmployeeFormData | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadEmployees() {
      try {
        const payload = await fetchEmployees()
        setEmployees(payload.map(normalizeEmployee))
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Failed to load employees')
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = await fetchEmployees()
      setEmployees(payload.map(normalizeEmployee))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to refresh employees')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = () => {
    setActiveEmployee(null)
    setShowForm(true)
  }

  const handleEditEmployee = (employee: EmployeeRecord) => {
    setActiveEmployee({
      id: employee.id,
      full_name: employee.full_name,
      email: employee.email,
      job_title: employee.job_title,
      department: employee.department,
      country: employee.country,
      salary: employee.salary.replace(/[$,]/g, ''),
      currency: employee.currency ?? 'USD',
      employment_type: employee.employment_type ?? 'FULL_TIME',
      hired_at: employee.hired_at ?? new Date().toISOString().slice(0, 10),
    })
    setShowForm(true)
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    const confirmed = window.confirm('Delete this employee? This action cannot be undone.')
    if (!confirmed) return

    setError(null)
    try {
      await deleteEmployee(employeeId)
      setEmployees((current) => current.filter((employee) => employee.id !== employeeId))
      setActionMessage('Employee deleted successfully.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to delete employee')
    }
  }

  const handleSubmit = async (payload: EmployeeFormData) => {
    const requestPayload = {
      full_name: payload.full_name,
      email: payload.email,
      job_title: payload.job_title,
      department: payload.department,
      country: payload.country,
      salary: Number(payload.salary),
      currency: payload.currency,
      employment_type: payload.employment_type,
      hired_at: payload.hired_at,
    }

    setError(null)
    try {
      if (payload.id) {
        await updateEmployee(payload.id, requestPayload)
        setActionMessage('Employee updated successfully.')
      } else {
        await createEmployee(requestPayload)
        setActionMessage('Employee created successfully.')
      }
      await handleRefresh()
      setShowForm(false)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to save employee')
      throw caught
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setActiveEmployee(null)
    setError(null)
  }

  return (
    <main>
      <section className="page-header">
        <div>
          <h1>Employee Directory</h1>
          <p>Browse active team members and key salary details.</p>
        </div>
        <button type="button" className="button-primary" onClick={handleAddEmployee}>
          Add employee
        </button>
      </section>

      {actionMessage ? <div className="action-message">{actionMessage}</div> : null}
      {error ? <div className="action-error">{error}</div> : null}

      {showForm && (
        <EmployeeForm
          initialData={activeEmployee ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={activeEmployee ? 'Update Employee' : 'Create Employee'}
        />
      )}

      {loading ? (
        <div className="panel">
          <p className="empty-state">Loading employees…</p>
        </div>
      ) : (
        <EmployeeTable employees={employees} onEdit={handleEditEmployee} onDelete={handleDeleteEmployee} />
      )}
    </main>
  )
}
