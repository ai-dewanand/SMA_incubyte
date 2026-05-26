export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export async function fetcher<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)

  if (!res.ok) {
    let errorMessage = `Fetch failed: ${res.status} ${res.statusText}`

    try {
      const body = await res.json()
      if (body.detail) {
        errorMessage = body.detail
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

export async function fetchEmployees() {
  return fetcher<unknown[]>(`${API_BASE}/api/v1/employees`)
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
