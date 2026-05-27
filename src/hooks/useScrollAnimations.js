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

    // Lazy-loaded images and webfonts grow the page height AFTER our
    // initial ScrollTrigger.refresh runs. Without re-refreshing, every
    // trigger below the fold has stale start/end positions and reveals
    // stop firing where they should. Debounce so a burst of image loads
    // collapses into one refresh.
    let imgRefreshTimer
    const onAssetLoad = (e) => {
      const tag = e.target?.tagName
      if (tag !== 'IMG' && tag !== 'VIDEO') return
      clearTimeout(imgRefreshTimer)
      imgRefreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120)
    }
    // `load` doesn't bubble, so capture-phase is the only way to catch
    // it from one document-level listener.
    document.addEventListener('load', onAssetLoad, true)

    // The loader applies `html.is-loading { overflow: hidden; height: 100% }`
    // which shrinks the document while triggers are first calculated.
    // Refresh again the instant that class comes off so triggers
    // recompute against the real page height.
    const html = document.documentElement
    const classObserver = new MutationObserver(() => {
      if (!html.classList.contains('is-loading')) {
        setTimeout(() => ScrollTrigger.refresh(), 50)
      }
    })
    classObserver.observe(html, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', onAnchorClick)
      window.removeEventListener('load', refresh)
      document.removeEventListener('load', onAssetLoad, true)
      classObserver.disconnect()
      clearTimeout(imgRefreshTimer)
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
      // The trigger lives on a transparent .pg__card-frame wrapper, so
      // GSAP's transform never collides with the inner .pg__card's CSS
      // hover tilt — the two transforms compose cleanly through nesting.
      // `toggleActions: 'play none none reverse'` makes the cards
      // converge as you scroll DOWN into the trigger and diverge back to
      // their scattered start as you scroll UP past it — animation runs
      // every pass instead of locking in place after the first play.
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
              end: 'bottom 10%',
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

    // Belt-and-suspenders refreshes for any image that loads in the
    // narrow window between markup mounting and the capture-phase load
    // listener catching its event. Cheap (<1ms each) and silently makes
    // the "first scroll-down works, second navigation ceases" class of
    // bug go away.
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 300)
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      ctx?.revert()
    }
  }, [pathname])
}
