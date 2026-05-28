import { useEffect, useMemo, useRef, useState } from 'react'
import { MODES, VOCAB } from '../data/thinkingVocab.js'
import { ScrambleText } from './ScrambleText.jsx'
import { SymbolPulse, SYMBOLS } from './SymbolPulse.jsx'
import { FloatingToken } from './FloatingToken.jsx'
import './ThinkingStream.css'

const BLINK_MS = 380
const SCRAMBLE_HOLD_MS = 950
// Symbol cycles on its own ticker, independent of the word cadence — so the
// leading mark feels like it's "thinking" continuously while the word holds
// its phrase. Slow enough that each glyph has a beat to register before the
// next one appears, fast enough to still read as a shimmer.
const SYMBOL_TICK_MS = 180

export default function ThinkingStream({
  active = true,
  speed = 1,
  mode = 'analytical',
  accentColor,
  showSymbols = true,
  showCursor = true,
}) {
  const cfg = MODES[mode]
  const accent = accentColor ?? cfg.accent
  const vocab = VOCAB[mode]

  // Reserve enough character cells for the longest word + "..." so the slot
  // never shrinks or grows between scrambles.
  const slotChars = useMemo(
    () => Math.max(...vocab.map((w) => w.length)) + 3,
    [vocab],
  )

  const withDots = (w) => `${w}...`

  const [target, setTarget] = useState(() => withDots(vocab[0]))
  const [symbolIdx, setSymbolIdx] = useState(0)
  const [blinking, setBlinking] = useState(false)
  const wordRef = useRef(vocab[0])

  // Reset to a phrase from the new pool whenever the mode changes.
  useEffect(() => {
    const w = vocab[Math.floor(Math.random() * vocab.length)]
    wordRef.current = w
    setTarget(withDots(w))
  }, [vocab])

  // Fast symbol ticker — picks a new random glyph every SYMBOL_TICK_MS so the
  // leading mark "shimmers" through the pool. Decoupled from the word cycle.
  useEffect(() => {
    if (!active) return undefined
    const id = setInterval(() => {
      setSymbolIdx((i) => {
        // Pick a different glyph than the current one so consecutive frames
        // are always visually distinct.
        let n = Math.floor(Math.random() * SYMBOLS.length)
        if (n === i && SYMBOLS.length > 1) n = (n + 1) % SYMBOLS.length
        return n
      })
    }, Math.max(40, SYMBOL_TICK_MS / Math.max(0.15, speed)))
    return () => clearInterval(id)
  }, [active, speed])

  // Word cycle: blink → scramble → hold. Independent from the symbol ticker.
  useEffect(() => {
    if (!active) return undefined
    let cancelled = false
    let timer

    const step = () => {
      if (cancelled) return
      setBlinking(true)
      timer = setTimeout(() => {
        if (cancelled) return
        setBlinking(false)
        let next = vocab[Math.floor(Math.random() * vocab.length)]
        if (next === wordRef.current && vocab.length > 1) {
          next = vocab[(vocab.indexOf(next) + 1) % vocab.length]
        }
        wordRef.current = next
        setTarget(withDots(next))
        const [lo, hi] = cfg.interval
        const hold = ((lo + Math.random() * (hi - lo)) * 2) / Math.max(0.15, speed)
        timer = setTimeout(step, SCRAMBLE_HOLD_MS + hold)
      }, BLINK_MS)
    }

    const [lo, hi] = cfg.interval
    const initialHold = ((lo + Math.random() * (hi - lo)) * 1.4) / Math.max(0.15, speed)
    timer = setTimeout(step, initialHold)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [active, vocab, cfg, speed])

  return (
    <div className="pg2-think">
      <FloatingToken count={14} />

      <div className="pg2-think__stage">
        <div className="pg2-think__row">
          {showSymbols && (
            <SymbolPulse index={symbolIdx} color={accent} blinking={blinking} />
          )}
          <ScrambleText
            target={target}
            accent={accent}
            showBar={showCursor}
            minChars={slotChars}
          />
        </div>
      </div>
    </div>
  )
}
