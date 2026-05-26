import { useRef } from 'react'
import './Playground.css'
import { playground } from '../data.js'

const TILT_MAX = 9 // degrees of cursor-driven rotation

function Card({ src }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (0.5 - py) * (TILT_MAX * 2)
    const ry = (px - 0.5) * (TILT_MAX * 2)
    el.style.setProperty('--rx', `${rx}deg`)
    el.style.setProperty('--ry', `${ry}deg`)
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.removeProperty('--rx')
    el.style.removeProperty('--ry')
  }

  return (
    <div className="pg__card-frame" data-reveal-card>
      <figure
        ref={ref}
        className="pg__card"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <img
          src={src}
          alt=""
          className="pg__img"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          draggable={false}
        />
      </figure>
    </div>
  )
}

export default function Playground() {
  return (
    <div className="pg__feed">
      {playground.map((src, i) => (
        <Card key={i} src={src} />
      ))}
    </div>
  )
}
