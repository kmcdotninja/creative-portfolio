import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import './RevealHeadline.css'

// Soft expo.out — the same settle curve the scroll reveals use, expressed as
// a cubic-bezier so Framer Motion matches the rest of the site's motion feel.
const REVEAL_EASE = [0.16, 1, 0.3, 1]

// Shared load reveal for the big display headlines (desktop HeroCentered and
// mobile Hero). Each line sits inside an overflow-clipped mask and slides up
// from below, staggered. `className` is the existing headline class so the
// caller keeps full control of typography; only the per-line mask is added.
export default function RevealHeadline({ lines, className }) {
  const reduced = useReducedMotion()

  // Container orchestrates the per-line stagger; each line slides its inner
  // text up out of the clip. Under Reduced Motion we drop the transform and
  // just fade so nothing slides.
  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.12, delayChildren: 0.15 },
    },
  }
  const inner = {
    hidden: reduced ? { opacity: 0 } : { y: '110%' },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: reduced ? 0.4 : 0.9, ease: REVEAL_EASE },
    },
  }

  return (
    <motion.p
      className={className}
      aria-hidden="true"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {lines.map((line) => (
        <span key={line} className="hl-line">
          <motion.span className="hl-line__inner" variants={inner}>
            {line}
          </motion.span>
        </span>
      ))}
    </motion.p>
  )
}
