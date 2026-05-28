import { useRef } from 'react'
import { useInView } from 'framer-motion'
import './PlaygroundSection.css'

export default function PlaygroundSection({
  title,
  meta,
  span = 'half',
  aspect = 'wide',
  children,
}) {
  // No scroll-reveal on the stage itself — cards just appear in their final
  // state. `useInView` is kept because the interactive children still want
  // the signal (StickerStack pauses, NeonTicker pauses, ThinkingStream
  // pauses when out of view).
  const stageRef = useRef(null)
  const inView = useInView(stageRef, { amount: 0.3, once: false })

  return (
    <figure className={`pg2-section ${span === 'full' ? 'pg2-section--full' : ''}`}>
      <div
        ref={stageRef}
        className={`pg2-section__stage pg2-section__stage--${aspect}`}
      >
        {children({ inView })}
      </div>

      <figcaption className="pg2-section__caption">
        <h2 className="pg2-section__title">{title}</h2>
        {meta && <span className="pg2-section__meta">{meta}</span>}
      </figcaption>
    </figure>
  )
}
