import './HeroCentered.css'
import TopNav from './TopNav.jsx'
import RevealHeadline from './RevealHeadline.jsx'
import { useSnd } from '../hooks/useSnd.js'

const HEADLINE_LINES = [
  'Product designer',
  'crafting brands, products',
  'and websites',
]

export default function HeroCentered() {
  const { play, SOUNDS } = useSnd()

  return (
    <section className="introC">
      <TopNav />

      <h1 className="sr-only">
        Yahaya Muhammad — Product Designer & UX Designer
      </h1>

      {/* Casual stickers anchored to the headline — same SVG set the
          playground StickerStack uses (4 = thumbtack pinning "PRODUCT",
          8 = brain trailing "BRANDS,"). Decorative only (aria-hidden)
          and width-gated so they never crowd the headline on tablet. */}
      <img
        className="introC__sticker introC__sticker--pin"
        src="/playground/stickers/4.svg"
        alt=""
        aria-hidden="true"
        width="220"
        height="220"
        loading="eager"
        decoding="async"
        draggable={false}
      />
      <img
        className="introC__sticker introC__sticker--brain"
        src="/playground/stickers/8.svg"
        alt=""
        aria-hidden="true"
        width="485"
        height="340"
        loading="eager"
        decoding="async"
        draggable={false}
      />

      <RevealHeadline className="introC__big" lines={HEADLINE_LINES} />

      <div className="introC__about">
        <p className="introC__bio">
          Currently designing at Kutuby to make Islamic studies more fun and engaging for kids.
        </p>
        <a
          href="#work"
          className="introC__scroll"
          onClick={() => play(SOUNDS.BUTTON)}
        >
          ↓ SCROLL FOR MORE
        </a>
      </div>
    </section>
  )
}
