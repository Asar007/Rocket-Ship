import { useEffect, useRef } from 'react'
import { ensureScrollTrigger, getGsap } from '../lib/gsap.js'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    let trigger
    let cancelled = false

    ensureScrollTrigger().then((ScrollTrigger) => {
      if (cancelled || !barRef.current || !ScrollTrigger) return
      const gsap = getGsap()

      gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' })

      trigger = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          gsap.to(barRef.current, {
            scaleX: self.progress,
            duration: 0.15,
            ease: 'power2.out',
            overwrite: true,
          })
        },
      })
    })

    return () => {
      cancelled = true
      trigger?.kill()
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-gradient-to-r from-gold-400 via-gold-500 to-electric-400 shadow-[0_0_12px_rgba(240,198,116,0.7)]"
      />
    </div>
  )
}
