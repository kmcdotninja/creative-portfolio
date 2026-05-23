import { useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { setLenis } from '../lib/lenisStore.js'

gsap.registerPlugin(ScrollTrigger)

// Soft "expo.out"-style cubic — settles slowly, never bounces
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

export function useScrollAnimations(pathname) {
  // ---- Lenis: set up once ----
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    })
    setLenis(lenis)

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    lenis.on('scroll', ScrollTrigger.update)

    // Smooth scroll-to-anchor for in-document hash links
    const onAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: 0, duration: 1.2 })
    }
    document.addEventListener('click', onAnchorClick)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', onAnchorClick)
      window.removeEventListener('load', refresh)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  // ---- Reveal animations: re-attach when route changes ----
  // useLayoutEffect (not useEffect) so the fromTo initial hidden state is
  // committed BEFORE the browser's first paint of the new page. Without this,
  // the new route can paint with reveal elements fully visible for one frame
  // and then snap to opacity 0, which looks like a flicker.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: EASE,
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      gsap.utils.toArray('[data-reveal-stagger]').forEach((row) => {
        gsap.fromTo(
          row.children,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: EASE,
            stagger: 0.08,
            scrollTrigger: {
              trigger: row,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      // Playful per-card reveal: drop in with a touch of random rotation
      // and a soft overshoot. Each card has its own scrollTrigger so the
      // motion follows the scroll instead of firing in one big batch.
      gsap.utils.toArray('[data-reveal-card]').forEach((el) => {
        const rotation = gsap.utils.random(-5, 5, 0.1)
        const xOffset = gsap.utils.random(-12, 12, 1)
        gsap.fromTo(
          el,
          {
            opacity: 0,
            scale: 0.86,
            rotation,
            y: 36,
            x: xOffset,
            transformOrigin: '50% 100%',
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            y: 0,
            x: 0,
            duration: 0.85,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })
    })
    ScrollTrigger.refresh()
    // Signal that the page's reveal setup is ready — the router waits on
    // this before kicking off a hash-target smooth scroll so it doesn't
    // race with the fromTo initial state.
    window.dispatchEvent(new Event('app:reveal-ready'))

    return () => {
      ctx?.revert()
    }
  }, [pathname])
}
