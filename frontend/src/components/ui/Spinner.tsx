type SpinnerProps = {
  label?: string
  size?: 'sm' | 'md'
}

export function Spinner({ label = 'Loading', size = 'md' }: SpinnerProps) {
  return (
    <div className={`spinner-wrap spinner-${size}`} role="status" aria-live="polite" aria-busy="true">
      <span className="spinner" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      {label ? <span className="spinner-label">{label}</span> : null}
    </div>
  )
}
