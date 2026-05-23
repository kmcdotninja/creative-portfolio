import { useEffect, useState } from 'react'
import { getLenis } from './lenisStore.js'

const NAV_EVENT = 'spa-navigate'

export function usePathname() {
  const [pathname, setPathname] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname,
  )

  useEffect(() => {
    const onChange = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onChange)
    window.addEventListener(NAV_EVENT, onChange)
    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener(NAV_EVENT, onChange)
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

  window.history.pushState({}, '', to)
  window.dispatchEvent(new Event(NAV_EVENT))

  if (url.hash) {
    // Defer past the next paint so the destination section exists.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToHash(url.hash))
    })
  } else {
    window.scrollTo(0, 0)
  }
}
