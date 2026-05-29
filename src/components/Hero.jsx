import './Hero.css'
import TopNav from './TopNav.jsx'
import RevealHeadline from './RevealHeadline.jsx'
import { useSnd } from '../hooks/useSnd.js'

const HEADLINE_LINES = [
  'Product designer',
  'crafting brands, products',
  'and websites',
]

export default function Hero() {
  const { play, SOUNDS } = useSnd()

  return (
    <section className="intro">
      <TopNav />

      <h1 className="sr-only">
        Yahaya Muhammad — Product Designer & UX Designer
      </h1>
      <RevealHeadline className="intro__big" lines={HEADLINE_LINES} />

      <div className="intro__about" data-reveal>
        <p className="intro__bio">
          Currently designing at Kutuby to make Islamic studies more fun and engaging for kids.
        </p>
        <a
          href="#work"
          className="intro__scroll"
          onClick={() => play(SOUNDS.BUTTON)}
        >
          ↓ SCROLL FOR MORE
        </a>
      </div>
    </section>
  )
}
