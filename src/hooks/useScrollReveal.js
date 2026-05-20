import { useEffect } from 'react'
import { ensureScrollTrigger, getGsap } from '../lib/gsap.js'

/**
 * Run a GSAP timeline tied to a ScrollTrigger when the target element scrolls
 * into view. The `build` function receives ({ gsap, ScrollTrigger, el })
 * and should return either a timeline/tween or a teardown function.
 */
export function useScrollReveal(ref, build, deps = []) {
  useEffect(() => {
    let cancelled = false
    let created

    ensureScrollTrigger().then((ScrollTrigger) => {
      if (cancelled || !ref.current || !ScrollTrigger) return
      const gsap = getGsap()
      created = build({ gsap, ScrollTrigger, el: ref.current })
    })

    return () => {
      cancelled = true
      if (created && typeof created.kill === 'function') created.kill()
      else if (typeof created === 'function') created()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
