export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

function formatApiErrorDetail(detail: unknown): string {
  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'object' && item !== null && 'msg' in item) {
          return String((item as { msg: string }).msg)
        }
        return String(item)
      })
      .join('; ')
  }

  if (typeof detail === 'object' && detail !== null) {
    return JSON.stringify(detail)
  }

  return 'Request failed. Please try again.'
}

export async function fetcher<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  let res: Response

  try {
    res = await fetch(url, options)
  } catch {
    throw new Error('Unable to reach the API. Check that the backend is running and try again.')
  }

  if (!res.ok) {
    let errorMessage = `Request failed (${res.status})`

    try {
      const body = await res.json()
      if (body?.detail !== undefined) {
        errorMessage = formatApiErrorDetail(body.detail)
      } else if (body?.message) {
        errorMessage = String(body.message)
      }
    } catch {
      try {
        const text = await res.text()
        if (text) {
          errorMessage = text.slice(0, 200)
        }
      } catch {
        // ignore
      }
    }

    throw new Error(errorMessage)
  }

  if (res.status === 204) {
    return {} as T
  }

  return res.json() as Promise<T>
}

export type EmployeeListParams = {
  limit?: number
  offset?: number
  search?: string
  country?: string
  department?: string
  job_title?: string
  employment_type?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export type EmployeeListResponse = {
  items: Record<string, unknown>[]
  total: number
  limit: number
  offset: number
}

export async function fetchEmployees(params: EmployeeListParams = {}) {
  const query = new URLSearchParams()

  if (params.limit !== undefined) query.set('limit', String(params.limit))
  if (params.offset !== undefined) query.set('offset', String(params.offset))
  if (params.search) query.set('search', params.search)
  if (params.country) query.set('country', params.country)
  if (params.department) query.set('department', params.department)
  if (params.job_title) query.set('job_title', params.job_title)
  if (params.employment_type) query.set('employment_type', params.employment_type)
  if (params.sort_by) query.set('sort_by', params.sort_by)
  if (params.sort_order) query.set('sort_order', params.sort_order)

  const suffix = query.toString() ? `?${query.toString()}` : ''
  return fetcher<EmployeeListResponse>(`${API_BASE}/api/v1/employees${suffix}`)
}

export async function createEmployee(payload: Record<string, unknown>) {
  return fetcher<unknown>(`${API_BASE}/api/v1/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function updateEmployee(employeeId: string, payload: Record<string, unknown>) {
  return fetcher<unknown>(`${API_BASE}/api/v1/employees/${employeeId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function deleteEmployee(employeeId: string) {
  return fetcher<unknown>(`${API_BASE}/api/v1/employees/${employeeId}`, {
    method: 'DELETE',
  })
}

// Insights API
export async function fetchSalaryStats() {
  return fetcher<{
    min: number
    max: number
    avg: number
  }>(`${API_BASE}/api/v1/insights/salary-stats`)
}

export async function fetchSalaryByTitle() {
  return fetcher<
    Array<{
      job_title: string
      avg_salary: number
      count: number
    }>
  >(`${API_BASE}/api/v1/insights/salary-by-title`)
}

export async function fetchTopEarners(limit: number = 10) {
  return fetcher<
    Array<{
      id: string
      full_name: string
      salary: number
    }>
  >(`${API_BASE}/api/v1/insights/top-earners?limit=${limit}`)
}

export async function fetchDepartmentBreakdown() {
  return fetcher<
    Array<{
      department: string
      avg: number
    }>
  >(`${API_BASE}/api/v1/insights/department-breakdown`)
}

export async function fetchHeadcount(country?: string) {
  const params = country ? `?country=${country}` : ''
  return fetcher<
    Array<{
      country: string
      count: number
    }>
  >(`${API_BASE}/api/v1/insights/headcount${params}`)
}

export async function fetchSalaryDistribution(buckets: number = 10) {
  return fetcher<{
    buckets: Array<{
      range: [number, number]
      count: number
    }>
    total: number
  }>(`${API_BASE}/api/v1/insights/salary-distribution?buckets=${buckets}`)
}
