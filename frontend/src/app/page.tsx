export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <h1>SMA Incubyte Salary Management</h1>
        <p>
          A minimal HR insights dashboard for employee salary data, department metrics,
          and earnings analytics.
        </p>
      </section>

      <section className="grid cards">
        <article className="card">
          <h2>Employee Directory</h2>
          <p>View employee records, job titles, departments, and salary details.</p>
          <a href="/employees">Open employee list →</a>
        </article>

        <article className="card">
          <h2>Insights</h2>
          <p>Browse salary statistics, top earners, department breakdowns, and headcount.</p>
          <a href="/insights">Open insights →</a>
        </article>
      </section>
    </main>
  )
}
