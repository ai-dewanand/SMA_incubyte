'use client'

import { useCallback, useEffect, useState } from 'react'
import { EmployeeForm, type EmployeeFormData } from '../../components/employees/EmployeeForm'
import {
  EmployeeTable,
  type EmployeeFilters,
  type EmployeeRecord,
} from '../../components/employees/EmployeeTable'
import { Alert } from '../../components/ui/Alert'
import { ErrorState } from '../../components/ui/ErrorState'
import { Spinner } from '../../components/ui/Spinner'
import { TableSkeleton } from '../../components/ui/TableSkeleton'
import { createEmployee, deleteEmployee, fetchEmployees, updateEmployee } from '../../lib/api'

const DEFAULT_PAGE_SIZE = 25
const SEARCH_DEBOUNCE_MS = 350

const emptyFilters: EmployeeFilters = {
  country: '',
  department: '',
  job_title: '',
  employment_type: '',
}

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

function normalizeEmployee(item: Record<string, unknown>): EmployeeRecord {
  return {
    id: String(item.id),
    full_name: String(item.full_name),
    email: String(item.email),
    job_title: String(item.job_title),
    department: String(item.department),
    country: String(item.country),
    salary: formatSalary(item.salary),
    currency: item.currency ? String(item.currency) : undefined,
    employment_type: item.employment_type ? String(item.employment_type) : undefined,
    hired_at: item.hired_at ? String(item.hired_at) : undefined,
  }
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState<EmployeeFilters>(emptyFilters)
  const [debouncedFilters, setDebouncedFilters] = useState<EmployeeFilters>(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeEmployee, setActiveEmployee] = useState<EmployeeFormData | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<string[]>([])

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedFilters(filters), SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [filters])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, debouncedFilters, pageSize])

  const loadEmployees = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const offset = (page - 1) * pageSize
      const response = await fetchEmployees({
        limit: pageSize,
        offset,
        search: debouncedSearch || undefined,
        country: debouncedFilters.country.trim() || undefined,
        department: debouncedFilters.department.trim() || undefined,
        job_title: debouncedFilters.job_title.trim() || undefined,
        employment_type: debouncedFilters.employment_type || undefined,
        sort_by: 'full_name',
        sort_order: 'asc',
      })
      setEmployees(response.items.map(normalizeEmployee))
      setTotal(response.total)

      const pageCount = Math.max(1, Math.ceil(response.total / pageSize))
      if (page > pageCount) {
        setPage(pageCount)
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load employees')
      setEmployees([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [debouncedFilters, debouncedSearch, page, pageSize])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  useEffect(() => {
    if (!actionMessage) return
    const timer = window.setTimeout(() => setActionMessage(null), 5000)
    return () => window.clearTimeout(timer)
  }, [actionMessage])

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
    const confirmed = window.confirm('Delete this employee? They will be marked inactive.')
    if (!confirmed) return

    setError(null)
    setDeletingIds((current) => [...current, employeeId])
    try {
      await deleteEmployee(employeeId)
      setActionMessage('Employee deleted successfully.')
      await loadEmployees()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to delete employee')
    } finally {
      setDeletingIds((current) => current.filter((id) => id !== employeeId))
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
      await loadEmployees()
      setShowForm(false)
      setActiveEmployee(null)
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Failed to save employee'
      setError(message)
      throw caught
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setActiveEmployee(null)
  }

  const showInitialSkeleton = loading && employees.length === 0 && total === 0

  return (
    <main>
      <section className="page-header">
        <div>
          <h1>Employee Directory</h1>
          <p>
            Browse {total > 0 ? `${total.toLocaleString()} ` : ''}
            active team members with server-side search and pagination.
          </p>
        </div>
        <div className="page-header-actions">
          <button type="button" className="button-secondary" onClick={loadEmployees} disabled={loading}>
            Refresh
          </button>
          <button type="button" className="button-primary" onClick={handleAddEmployee}>
            Add employee
          </button>
        </div>
      </section>

      {actionMessage ? (
        <Alert variant="success" onDismiss={() => setActionMessage(null)}>
          {actionMessage}
        </Alert>
      ) : null}

      {error && !showInitialSkeleton ? (
        <Alert variant="error" onDismiss={() => setError(null)} title="Something went wrong">
          {error}
        </Alert>
      ) : null}

      {showForm ? (
        <EmployeeForm
          initialData={activeEmployee ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={activeEmployee ? 'Update Employee' : 'Create Employee'}
        />
      ) : null}

      {showInitialSkeleton ? (
        <section className="panel" aria-busy="true">
          <Spinner label="Loading employees…" />
          <TableSkeleton />
        </section>
      ) : error && employees.length === 0 && total === 0 ? (
        <section className="panel">
          <ErrorState message={error} onRetry={loadEmployees} />
        </section>
      ) : (
        <EmployeeTable
          employees={employees}
          total={total}
          page={page}
          pageSize={pageSize}
          search={search}
          filters={filters}
          loading={loading}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSearchChange={setSearch}
          onFiltersChange={setFilters}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          deletingIds={deletingIds}
        />
      )}
    </main>
  )
}
