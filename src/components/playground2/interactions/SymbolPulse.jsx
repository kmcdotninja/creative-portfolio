import { AnimatePresence, motion } from 'framer-motion'

export const SYMBOLS = [
  '✦', '★',
  '✶', '✷', '✸', '✴', '✵',
  '✱', '✳', '❉', '❋',
  '❄', '❅',
]

// Leading mark. No continuous rotation. Each glyph swap is a quick
// cross-fade (~80 ms) — fast enough to keep the ticker reading as
// "shimmer," soft enough that the transition itself isn't visible as a
// hard cut. The pulse on `blinking` marks the word-change beat.
export function SymbolPulse({ index, color, blinking }) {
  return (
    <span className="pg2-symbol" style={{ color }}>
      <motion.span
        className="pg2-symbol__inner"
        animate={
          blinking
            ? { scale: [1, 1.2, 1], opacity: [1, 0.45, 1] }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={index}
            className="pg2-symbol__glyph"
            initial={{ opacity: 0, scale: 0.85, y: 2 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -2 }}
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
          >
            {SYMBOLS[index % SYMBOLS.length]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  )
}
