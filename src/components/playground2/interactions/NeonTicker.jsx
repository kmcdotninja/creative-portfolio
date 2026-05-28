import './NeonTicker.css'

const TICKERS = [
  {
    color: 'white',
    text: 'MOTION DESIGN STUDIO  ·  EXPERIMENTS IN GESTURE  ·  STUDIO OPEN  ·  ',
    duration: 22,
  },
  {
    color: 'red',
    text: 'TINDER SWIPE STACK NOW PLAYING  ·  LIQUID DOCK ON  ·  STAY WITH US  ·  ',
    duration: 17,
  },
  {
    color: 'green',
    text: '+2.4% AAPL  ·  +5.7% NVDA  ·  +3.1% GOOGL  ·  +6.9% META  ·  +1.8% MSFT  ·  ',
    duration: 26,
  },
]

export default function NeonTicker({ active = true }) {
  return (
    <div className="pg2-neon">
      <div className="pg2-neon__stack">
        {TICKERS.map((row) => (
          <div
            key={row.color}
            className={`pg2-neon__row pg2-neon__row--${row.color}`}
          >
            {/* LED dot-matrix backdrop, scoped to this row's pill. */}
            <div className="pg2-neon__grid" aria-hidden="true" />

            {/* Marquee runs as a pure CSS animation — the browser compositor
                drives the transform, so it stays smooth even on mobile where
                a JS-driven (rAF + React) loop tends to micro-stall on the
                seam. Pause when out of view to save battery / GPU. */}
            <div
              className="pg2-neon__track"
              style={{
                animationDuration: `${row.duration}s`,
                animationPlayState: active ? 'running' : 'paused',
              }}
            >
              <div className="pg2-neon__half">
                <span className="pg2-neon__text">{row.text}</span>
                <span className="pg2-neon__text">{row.text}</span>
                <span className="pg2-neon__text">{row.text}</span>
              </div>
              <div className="pg2-neon__half" aria-hidden="true">
                <span className="pg2-neon__text">{row.text}</span>
                <span className="pg2-neon__text">{row.text}</span>
                <span className="pg2-neon__text">{row.text}</span>
              </div>
            </div>

            {/* Edge fade — characters dissolve into the bezel at both ends. */}
            <div className="pg2-neon__bezel" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  )
}
