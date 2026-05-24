import './LastUpdated.css'

// __LAST_COMMIT_DATE__ is injected by Vite at build time from `git log -1`.
const RAW = typeof __LAST_COMMIT_DATE__ !== 'undefined' ? __LAST_COMMIT_DATE__ : null

const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export default function LastUpdated() {
  const date = RAW ? new Date(RAW) : null
  if (!date || Number.isNaN(date.getTime())) return null

  return (
    <span
      className="last-updated"
      title={date.toISOString()}
      aria-label={`Last commit ${formatter.format(date)}`}
    >
      <span className="last-updated__label">Last commit</span>
      <span className="last-updated__date">{formatter.format(date)}</span>
    </span>
  )
}
