export type HeadcountRow = { country: string; count: number }
export type DepartmentRow = { department: string; avg: number }
export type TopEarnerRow = { id: string; full_name: string; salary: number }
export type SalaryBucket = { range: [number, number]; count: number }
export type SalaryDistribution = { buckets: SalaryBucket[]; total: number }
export type SalaryStats = { min: number; max: number; avg: number }

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

export function normalizeSalaryStats(data: unknown): SalaryStats | null {
  if (!data || typeof data !== 'object') return null
  const row = data as Record<string, unknown>
  return {
    min: toNumber(row.min),
    max: toNumber(row.max),
    avg: toNumber(row.avg),
  }
}

export function normalizeHeadcount(data: unknown): HeadcountRow[] {
  if (!Array.isArray(data)) return []
  return data
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const row = item as Record<string, unknown>
      const country = String(row.country ?? '')
      if (!country) return null
      return { country, count: toNumber(row.count) }
    })
    .filter((item): item is HeadcountRow => item !== null)
}

export function normalizeDepartments(data: unknown): DepartmentRow[] {
  if (!Array.isArray(data)) return []
  return data
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const row = item as Record<string, unknown>
      const department = String(row.department ?? '')
      if (!department) return null
      return { department, avg: toNumber(row.avg ?? row.avg_salary) }
    })
    .filter((item): item is DepartmentRow => item !== null)
}

export function normalizeTopEarners(data: unknown): TopEarnerRow[] {
  if (!Array.isArray(data)) return []
  return data
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const row = item as Record<string, unknown>
      const id = String(row.id ?? '')
      const full_name = String(row.full_name ?? '')
      if (!id || !full_name) return null
      return { id, full_name, salary: toNumber(row.salary) }
    })
    .filter((item): item is TopEarnerRow => item !== null)
}

export function normalizeSalaryDistribution(data: unknown): SalaryDistribution | null {
  if (!data || typeof data !== 'object') return null
  const row = data as Record<string, unknown>
  const bucketsRaw = Array.isArray(row.buckets) ? row.buckets : []
  const buckets: SalaryBucket[] = bucketsRaw
    .map((bucket) => {
      if (!bucket || typeof bucket !== 'object') return null
      const entry = bucket as Record<string, unknown>
      const rangeRaw = entry.range
      if (!Array.isArray(rangeRaw) || rangeRaw.length < 2) return null
      return {
        range: [toNumber(rangeRaw[0]), toNumber(rangeRaw[1])] as [number, number],
        count: toNumber(entry.count),
      }
    })
    .filter((item): item is SalaryBucket => item !== null)

  return {
    buckets,
    total: toNumber(row.total),
  }
}
