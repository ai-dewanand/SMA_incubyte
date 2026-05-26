export function InsightCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <article className="card card-stat">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
      <p>{description}</p>
    </article>
  )
}
