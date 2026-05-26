import './HomePlayground.css'
import { playground } from '../data.js'
import { navigate } from '../lib/router.js'
import { useSnd } from '../hooks/useSnd.js'

const PREVIEW_COUNT = 8

export default function HomePlayground() {
  const { play, SOUNDS } = useSnd()
  const items = playground.slice(0, PREVIEW_COUNT)

  const go = (e) => {
    e.preventDefault()
    play(SOUNDS.BUTTON)
    navigate('/playground')
  }

  return (
    <section className="hpg" aria-label="Playground preview">
      <header className="hpg__head" data-reveal>
        <div className="hpg__heading">
          <h2 className="hpg__title">Playground</h2>
          <p className="hpg__sub">
            A loose archive of small things between projects. Type tests,
            colour studies, posters, screens that never shipped.
          </p>
        </div>
        <a
          href="/playground"
          className="hpg__more"
          onClick={go}
          aria-label="See the full playground"
        >
          See all <span aria-hidden="true">→</span>
        </a>
      </header>

      <div className="hpg__grid" data-reveal>
        {items.map((src, i) => (
          <a
            key={i}
            href="/playground"
            className="hpg__tile"
            onClick={go}
            aria-label={`Open playground (preview ${i + 1})`}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </a>
        ))}
      </div>
    </section>
  )
}
