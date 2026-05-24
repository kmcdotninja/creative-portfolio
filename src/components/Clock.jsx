import { useEffect, useState } from 'react'
import './Clock.css'

// Kaduna shares Africa/Lagos (WAT, UTC+1).
const TIME_ZONE = 'Africa/Lagos'
const ZONE_LABEL = 'GMT+1'

const formatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: TIME_ZONE,
})

export default function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="clock" aria-label="Kaduna time (GMT+1)">
      <span className="clock__dot" />
      <span className="clock__time">{formatter.format(now)}</span>
      <span className="clock__zone">{ZONE_LABEL}</span>
    </div>
  )
}
