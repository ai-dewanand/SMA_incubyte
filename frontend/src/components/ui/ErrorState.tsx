type ErrorStateProps = {
  message: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({ message, onRetry, retryLabel = 'Try again' }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="button-secondary" onClick={onRetry}>
          {retryLabel}
        </button>
      ) : null}
    </div>
  )
}
