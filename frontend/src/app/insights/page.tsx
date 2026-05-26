'use client'

import { useCallback, useEffect, useState } from 'react'
import { SalaryStatsCard } from '../../components/insights/SalaryStatsCard'
import { HeadcountCard } from '../../components/insights/HeadcountCard'
import { DepartmentBreakdownCard } from '../../components/insights/DepartmentBreakdownCard'
import { TopEarnersCard } from '../../components/insights/TopEarnersCard'
import { SalaryDistributionCard } from '../../components/insights/SalaryDistributionCard'
import { Alert } from '../../components/ui/Alert'
import {
  fetchSalaryStats,
  fetchHeadcount,
  fetchDepartmentBreakdown,
  fetchTopEarners,
  fetchSalaryDistribution,
} from '../../lib/api'
import {
  normalizeDepartments,
  normalizeHeadcount,
  normalizeSalaryDistribution,
  normalizeSalaryStats,
  normalizeTopEarners,
  type DepartmentRow,
  type HeadcountRow,
  type SalaryDistribution,
  type SalaryStats,
  type TopEarnerRow,
} from '../../lib/insights'

type LoadingState = {
  stats: boolean
  headcount: boolean
  departments: boolean
  topEarners: boolean
  distribution: boolean
}

type ErrorState = {
  stats: string | null
  headcount: string | null
  departments: string | null
  topEarners: string | null
  distribution: string | null
}

const initialLoading: LoadingState = {
  stats: true,
  headcount: true,
  departments: true,
  topEarners: true,
  distribution: true,
}

const initialErrors: ErrorState = {
  stats: null,
  headcount: null,
  departments: null,
  topEarners: null,
  distribution: null,
}

export default function InsightsPage() {
  const [salaryStats, setSalaryStats] = useState<SalaryStats | null>(null)
  const [headcount, setHeadcount] = useState<HeadcountRow[]>([])
  const [departments, setDepartments] = useState<DepartmentRow[]>([])
  const [topEarners, setTopEarners] = useState<TopEarnerRow[]>([])
  const [distribution, setDistribution] = useState<SalaryDistribution | null>(null)

  const [loading, setLoading] = useState<LoadingState>(initialLoading)
  const [errors, setErrors] = useState<ErrorState>(initialErrors)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const loadSalaryStats = useCallback(async () => {
    setLoading((current) => ({ ...current, stats: true }))
    try {
      const data = await fetchSalaryStats()
      setSalaryStats(normalizeSalaryStats(data))
      setErrors((current) => ({ ...current, stats: null }))
    } catch (error) {
      setErrors((current) => ({
        ...current,
        stats: error instanceof Error ? error.message : 'Failed to load salary stats',
      }))
    } finally {
      setLoading((current) => ({ ...current, stats: false }))
    }
  }, [])

  const loadHeadcount = useCallback(async () => {
    setLoading((current) => ({ ...current, headcount: true }))
    try {
      const data = await fetchHeadcount()
      setHeadcount(normalizeHeadcount(data))
      setErrors((current) => ({ ...current, headcount: null }))
    } catch (error) {
      setErrors((current) => ({
        ...current,
        headcount: error instanceof Error ? error.message : 'Failed to load headcount',
      }))
    } finally {
      setLoading((current) => ({ ...current, headcount: false }))
    }
  }, [])

  const loadDepartments = useCallback(async () => {
    setLoading((current) => ({ ...current, departments: true }))
    try {
      const data = await fetchDepartmentBreakdown()
      setDepartments(normalizeDepartments(data))
      setErrors((current) => ({ ...current, departments: null }))
    } catch (error) {
      setErrors((current) => ({
        ...current,
        departments: error instanceof Error ? error.message : 'Failed to load departments',
      }))
    } finally {
      setLoading((current) => ({ ...current, departments: false }))
    }
  }, [])

  const loadTopEarners = useCallback(async () => {
    setLoading((current) => ({ ...current, topEarners: true }))
    try {
      const data = await fetchTopEarners(10)
      setTopEarners(normalizeTopEarners(data))
      setErrors((current) => ({ ...current, topEarners: null }))
    } catch (error) {
      setErrors((current) => ({
        ...current,
        topEarners: error instanceof Error ? error.message : 'Failed to load top earners',
      }))
    } finally {
      setLoading((current) => ({ ...current, topEarners: false }))
    }
  }, [])

  const loadDistribution = useCallback(async () => {
    setLoading((current) => ({ ...current, distribution: true }))
    try {
      const data = await fetchSalaryDistribution(10)
      setDistribution(normalizeSalaryDistribution(data))
      setErrors((current) => ({ ...current, distribution: null }))
    } catch (error) {
      setErrors((current) => ({
        ...current,
        distribution: error instanceof Error ? error.message : 'Failed to load distribution',
      }))
    } finally {
      setLoading((current) => ({ ...current, distribution: false }))
    }
  }, [])

  const loadAllInsights = useCallback(async () => {
    setGlobalError(null)
    await Promise.all([
      loadSalaryStats(),
      loadHeadcount(),
      loadDepartments(),
      loadTopEarners(),
      loadDistribution(),
    ])
  }, [loadDepartments, loadDistribution, loadHeadcount, loadSalaryStats, loadTopEarners])

  useEffect(() => {
    loadAllInsights()
  }, [loadAllInsights])

  const isLoading = Object.values(loading).some(Boolean)
  const hasErrors = Object.values(errors).some(Boolean)

  useEffect(() => {
    if (!isLoading && hasErrors && !salaryStats && headcount.length === 0) {
      setGlobalError('Some insights could not be loaded. Retry individual cards or refresh all.')
    } else {
      setGlobalError(null)
    }
  }, [hasErrors, headcount.length, isLoading, salaryStats])

  return (
    <main className="insights-page">
      <section className="page-header">
        <div>
          <h1>Insights</h1>
          <p>Explore salary analytics and operational metrics for your workforce.</p>
        </div>
        <div className="page-header-actions">
          <button type="button" className="button-secondary" onClick={loadAllInsights} disabled={isLoading}>
            {isLoading ? 'Refreshing…' : 'Refresh all'}
          </button>
        </div>
      </section>

      {globalError ? (
        <Alert variant="info" onDismiss={() => setGlobalError(null)}>
          {globalError}
        </Alert>
      ) : null}

      <section className="insights-dashboard" aria-label="Workforce insights">
        <div className="insights-kpi">
          <SalaryStatsCard
            loading={loading.stats}
            error={errors.stats}
            data={salaryStats ?? undefined}
            onRetry={loadSalaryStats}
          />
        </div>
        <div className="insights-kpi">
          <HeadcountCard
            loading={loading.headcount}
            error={errors.headcount}
            data={headcount}
            onRetry={loadHeadcount}
          />
        </div>
        <div className="insights-panel">
          <TopEarnersCard
            loading={loading.topEarners}
            error={errors.topEarners}
            data={topEarners}
            onRetry={loadTopEarners}
          />
        </div>
        <div className="insights-panel">
          <DepartmentBreakdownCard
            loading={loading.departments}
            error={errors.departments}
            data={departments}
            onRetry={loadDepartments}
          />
        </div>
        <div className="insights-chart">
          <SalaryDistributionCard
            loading={loading.distribution}
            error={errors.distribution}
            data={distribution ?? undefined}
            onRetry={loadDistribution}
          />
        </div>
      </section>
    </main>
  )
}
