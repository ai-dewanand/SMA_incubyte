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
          <p>Search, filter, and manage employee records with pagination and inline actions.</p>
          <a href="/employees">Open employee list →</a>
        </article>

        <article className="card">
          <h2>Insights</h2>
          <p>Review salary stats, headcount, top earners, and department breakdowns.</p>
          <a href="/insights">Open insights →</a>
        </article>
      </section>
    </main>
  )
}
