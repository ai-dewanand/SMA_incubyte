'use client'

import { useEffect, useState } from 'react'
import { SalaryStatsCard } from '../../components/insights/SalaryStatsCard'
import { HeadcountCard } from '../../components/insights/HeadcountCard'
import { DepartmentBreakdownCard } from '../../components/insights/DepartmentBreakdownCard'
import { TopEarnersCard } from '../../components/insights/TopEarnersCard'
import { SalaryDistributionCard } from '../../components/insights/SalaryDistributionCard'
import {
  fetchSalaryStats,
  fetchHeadcount,
  fetchDepartmentBreakdown,
  fetchTopEarners,
  fetchSalaryDistribution,
} from '../../lib/api'

interface SalaryStats {
  min: number
  max: number
  avg: number
}

interface HeadcountData {
  country: string
  count: number
}

interface DepartmentData {
  department: string
  avg: number
}

interface TopEarner {
  id: string
  full_name: string
  salary: number
}

interface SalaryBucket {
  range: [number, number]
  count: number
}

interface SalaryDistribution {
  buckets: SalaryBucket[]
  total: number
}

export default function InsightsPage() {
  const [salaryStats, setSalaryStats] = useState<SalaryStats | null>(null)
  const [headcount, setHeadcount] = useState<HeadcountData[]>([])
  const [departments, setDepartments] = useState<DepartmentData[]>([])
  const [topEarners, setTopEarners] = useState<TopEarner[]>([])
  const [distribution, setDistribution] = useState<SalaryDistribution | null>(null)

  const [loading, setLoading] = useState({
    stats: false,
    headcount: false,
    departments: false,
    topEarners: false,
    distribution: false,
  })

  const [errors, setErrors] = useState({
    stats: null as string | null,
    headcount: null as string | null,
    departments: null as string | null,
    topEarners: null as string | null,
    distribution: null as string | null,
  })

  useEffect(() => {
    const fetchInsights = async () => {
      // Fetch salary stats
      setLoading((p) => ({ ...p, stats: true }))
      try {
        const data = await fetchSalaryStats()
        setSalaryStats(data)
        setErrors((p) => ({ ...p, stats: null }))
      } catch (e) {
        setErrors((p) => ({
          ...p,
          stats: e instanceof Error ? e.message : 'Failed to load salary stats',
        }))
      } finally {
        setLoading((p) => ({ ...p, stats: false }))
      }

      // Fetch headcount
      setLoading((p) => ({ ...p, headcount: true }))
      try {
        const data = await fetchHeadcount()
        setHeadcount(data)
        setErrors((p) => ({ ...p, headcount: null }))
      } catch (e) {
        setErrors((p) => ({
          ...p,
          headcount: e instanceof Error ? e.message : 'Failed to load headcount',
        }))
      } finally {
        setLoading((p) => ({ ...p, headcount: false }))
      }

      // Fetch department breakdown
      setLoading((p) => ({ ...p, departments: true }))
      try {
        const data = await fetchDepartmentBreakdown()
        setDepartments(data)
        setErrors((p) => ({ ...p, departments: null }))
      } catch (e) {
        setErrors((p) => ({
          ...p,
          departments: e instanceof Error ? e.message : 'Failed to load departments',
        }))
      } finally {
        setLoading((p) => ({ ...p, departments: false }))
      }

      // Fetch top earners
      setLoading((p) => ({ ...p, topEarners: true }))
      try {
        const data = await fetchTopEarners(10)
        setTopEarners(data)
        setErrors((p) => ({ ...p, topEarners: null }))
      } catch (e) {
        setErrors((p) => ({
          ...p,
          topEarners: e instanceof Error ? e.message : 'Failed to load top earners',
        }))
      } finally {
        setLoading((p) => ({ ...p, topEarners: false }))
      }

      // Fetch salary distribution
      setLoading((p) => ({ ...p, distribution: true }))
      try {
        const data = await fetchSalaryDistribution(10)
        setDistribution(data)
        setErrors((p) => ({ ...p, distribution: null }))
      } catch (e) {
        setErrors((p) => ({
          ...p,
          distribution: e instanceof Error ? e.message : 'Failed to load distribution',
        }))
      } finally {
        setLoading((p) => ({ ...p, distribution: false }))
      }
    }

    fetchInsights()
  }, [])

  return (
    <main>
      <section className="page-header">
        <h1>Insights</h1>
        <p>Explore salary analytics and operational metrics for your workforce.</p>
      </section>

      <section className="grid cards">
        <SalaryStatsCard
          loading={loading.stats}
          error={errors.stats}
          data={salaryStats ?? undefined}
        />
        <HeadcountCard
          loading={loading.headcount}
          error={errors.headcount}
          data={headcount}
        />
        <DepartmentBreakdownCard
          loading={loading.departments}
          error={errors.departments}
          data={departments}
        />
        <TopEarnersCard
          loading={loading.topEarners}
          error={errors.topEarners}
          data={topEarners}
        />
        <SalaryDistributionCard
          loading={loading.distribution}
          error={errors.distribution}
          data={distribution ?? undefined}
        />
      </section>
    </main>
  )
}

