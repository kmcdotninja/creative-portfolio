import { useEffect } from 'react'
import './HeroStrip.css'
import TopNav from './TopNav.jsx'

// Dann-Petty-style minimal hero: a single text strip below the nav, then
// work begins immediately. Kept as a separate component so Hero.jsx and
// HeroCentered.jsx (the previous full-viewport hero) can be swapped back
// in via App.jsx without touching anything else.
export default function HeroStrip() {
  // App.jsx gates the loader on `app:portion-ready` (fired by the 3D
  // model in the old hero). This strip doesn't render Portion, so we
  // dispatch the event ourselves so the loader can dismiss.
  useEffect(() => {
    window.dispatchEvent(new Event('app:portion-ready'))
  }, [])

  return (
    <section className="hstrip">
      <TopNav />
      <h1 className="sr-only">
        Yahaya Muhammad — Product Designer & UX Designer
      </h1>
      <div className="hstrip__inner">
        <p className="hstrip__line">
          Product designer crafting brands, products and websites. Currently
          at Kutuby making Islamic studies more fun for kids.
        </p>
      </div>
    </section>
  )
}
