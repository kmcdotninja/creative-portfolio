import { useEffect, useState } from 'react'
import { getLenis } from './lenisStore.js'

const NAV_EVENT = 'spa-navigate'

export function usePathname() {
  const [pathname, setPathname] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname,
  )

  useEffect(() => {
    const onPop = () => {
      setPathname(window.location.pathname)
      // Browser back/forward: also reset scroll to top so the new route
      // doesn't open at a stale scroll offset.
      if (!window.location.hash) {
        window.scrollTo(0, 0)
        getLenis()?.scrollTo(0, { immediate: true, force: true })
      }
    }
    const onNav = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPop)
    window.addEventListener(NAV_EVENT, onNav)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener(NAV_EVENT, onNav)
    }
  }, [])

  return pathname
}

function scrollToHash(hash) {
  if (!hash) return
  const el = document.querySelector(hash)
  if (!el) return
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.2 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function whenElementReady(hash, onReady, attemptsLeft = 40) {
  const el = document.querySelector(hash)
  if (el) {
    onReady(el)
    return
  }
  if (attemptsLeft <= 0) return
  requestAnimationFrame(() =>
    whenElementReady(hash, onReady, attemptsLeft - 1),
  )
}

function smoothScrollTo(el, duration = 1.4) {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration, lock: true })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function waitFrames(count, cb) {
  if (count <= 0) {
    cb()
    return
  }
  requestAnimationFrame(() => waitFrames(count - 1, cb))
}

function commitNavigation(to, url) {
  const lenis = getLenis()

  // Snap the OLD scroll position to 0 before the route swaps so the new page
  // commits at the top instead of inheriting the previous offset.
  window.scrollTo(0, 0)
  lenis?.scrollTo(0, { immediate: true, force: true })

  let scrolled = false
  const startScroll = () => {
    if (scrolled || !url.hash) return
    const el = document.querySelector(url.hash)
    if (!el) return
    scrolled = true
    window.removeEventListener('app:reveal-ready', startScroll)
    smoothScrollTo(el, 1.4)
  }

  if (url.hash) {
    // The new page's reveal-setup fires this event after its initial hidden
    // states are in place. Starting the smooth scroll at that exact moment
    // gives one continuous motion with no perceptible wait.
    window.addEventListener('app:reveal-ready', startScroll, { once: false })
    // Fallback: if the event never fires (e.g. page without animations),
    // just scroll as soon as the target exists.
    setTimeout(() => {
      if (scrolled) return
      window.removeEventListener('app:reveal-ready', startScroll)
      whenElementReady(url.hash, (el) => {
        if (scrolled) return
        scrolled = true
        smoothScrollTo(el, 1.4)
      })
    }, 1100)
  }

  window.history.pushState({}, '', to)
  window.dispatchEvent(new Event(NAV_EVENT))
}

export function navigate(to) {
  const url = new URL(to, window.location.origin)
  const samePath = url.pathname === window.location.pathname

  if (samePath) {
    if (url.hash) {
      scrollToHash(url.hash)
    } else {
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(0, { duration: 1.2 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return
  }

  // Different route: swap immediately so the transition feels snappy. Hard
  // reset both the native and Lenis scroll positions so the new route always
  // opens at the top regardless of where we were on the previous one.
  commitNavigation(to, url)
}
