import { motion } from 'framer-motion'
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
            <motion.div
              className="pg2-neon__track"
              // Two identical halves: when the first slides off-left by exactly
              // its own width (`-50%` of the doubled track), the second one
              // sits in the same spot. The repeat then restarts at 0 % which
              // is visually identical — seamless, never appears to stop.
              animate={active ? { x: ['0%', '-50%'] } : false}
              transition={{
                duration: row.duration,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear',
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
            </motion.div>
            {/* Edge fade — characters dissolve into the bezel at both ends. */}
            <div className="pg2-neon__bezel" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  )
}
