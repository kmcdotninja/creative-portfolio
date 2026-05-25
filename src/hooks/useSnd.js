import { useCallback, useEffect } from 'react'
import SndImport from 'snd-lib'

// snd-lib ships as CJS with `exports.default = Snd`. Vite's ESM interop
// hands us a wrapper, so the real constructor can be one or two `.default`
// levels deep. Unwrap defensively.
const Snd = SndImport?.default?.default || SndImport?.default || SndImport

// One Snd instance per kit so we can play sounds from multiple kits
// without paying the cost of swapping the active kit on every call.
// Instances are module-level singletons so React mounts don't re-create
// them.
const instances = {}
const loadPromises = {}

function getInstance(kit) {
  if (!instances[kit]) {
    instances[kit] = new Snd({ easySetup: false })
  }
  return instances[kit]
}

function ensureKit(kit) {
  if (loadPromises[kit]) return loadPromises[kit]
  loadPromises[kit] = getInstance(kit)
    .load(kit)
    .catch(() => {
      // ignore — audio just won't play
    })
  return loadPromises[kit]
}

// snd-lib's bundled kits. The industrial kit (SND03) has mechanical /
// hardware-flavoured sounds; we use it for the mobile menu transitions
// so the UI feels physical rather than synthetic.
export const KITS = {
  DEFAULT: '01',
  ALT: '02',
  INDUSTRIAL: '03',
}

export function useSnd(kit = KITS.DEFAULT) {
  useEffect(() => {
    ensureKit(kit)
  }, [kit])

  const play = useCallback(
    (sound, options) => {
      if (!sound) return
      const targetKit = options?.kit ?? kit
      try {
        getInstance(targetKit).play(sound, options)
      } catch {
        // ignore — autoplay may be blocked until a user gesture
      }
    },
    [kit],
  )

  // SOUNDS keys are stable strings ('button', 'celebration', etc.).
  // Inline them so we don't depend on the static class field being resolved
  // before the function runs.
  const SOUNDS = {
    BUTTON: 'button',
    CAUTION: 'caution',
    CELEBRATION: 'celebration',
    DISABLED: 'disabled',
    NOTIFICATION: 'notification',
    PROGRESS_LOOP: 'progress_loop',
    RINGTONE_LOOP: 'ringtone_loop',
    SELECT: 'select',
    SWIPE: 'swipe',
    TAP: 'tap',
    TOGGLE_ON: 'toggle_on',
    TOGGLE_OFF: 'toggle_off',
    TRANSITION_DOWN: 'transition_down',
    TRANSITION_UP: 'transition_up',
    TYPE: 'type',
  }

  return { play, SOUNDS, KITS }
}
