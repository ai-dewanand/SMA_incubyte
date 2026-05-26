import { InsightCard } from '../../components/insights/InsightCard'

const insightData = [
  {
    title: 'Salary Statistics',
    value: 'Min $45,000 · Max $220,000 · Avg $112,500',
    description: 'Quick summary of salary range across the organization.',
  },
  {
    title: 'Top Earners',
    value: '12 employees above $180k',
    description: 'High-level top-earning employees by salary bucket.',
  },
  {
    title: 'Department Breakdown',
    value: 'Engineering leads with 38% of total payroll',
    description: 'Average salary by department and headcount distribution.',
  },
  {
    title: 'Headcount',
    value: '10,000 active employees',
    description: 'Total active headcount across all countries.',
  },
]

export default function InsightsPage() {
  return (
    <main>
      <section className="page-header">
        <h1>Insights</h1>
        <p>Explore salary analytics and operational metrics for your workforce.</p>
      </section>

      <section className="grid cards">
        {insightData.map((insight) => (
          <InsightCard key={insight.title} title={insight.title} value={insight.value} description={insight.description} />
        ))}
      </section>
    </main>
  )
}
