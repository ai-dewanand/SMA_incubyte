export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export async function fetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url)

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Fetch failed: ${res.status} ${res.statusText} - ${body}`)
  }

  return res.json() as Promise<T>
}

export async function fetchEmployees() {
  return fetcher<unknown[]>(`${API_BASE}/api/v1/employees`)
}
