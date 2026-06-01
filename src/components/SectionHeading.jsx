import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

export default function SectionHeading({
  eyebrow,
  title,
  accentWord,
  subtitle,
  align = 'left',
}) {
  const reduce = useReducedMotion()
  const rootRef = useRef(null)
  const alignCls =
    align === 'center'
      ? 'items-center text-center mx-auto'
      : 'items-start text-left'

  // GSAP scroll-driven reveal: triggers as the heading enters the viewport.
  // The accent underline is *scrubbed* against scroll so it grows with the
  // user's progress through the heading.
  // On mobile we skip the heavy reveal entirely — content stays visible — so
  // the GSAP/ScrollTrigger load race never strands the heading off-screen
  // (which manifested as huge empty patches above each section on phones).
  useScrollReveal(
    rootRef,
    ({ gsap, ScrollTrigger, el }) => {
      const isMobile =
        typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches

      if (reduce || isMobile) {
        gsap.set(el.querySelectorAll('[data-sh-item]'), {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
        })
        const line = el.querySelector('[data-sh-line]')
        const under = el.querySelector('[data-sh-underline]')
        if (line) gsap.set(line, { scaleX: 1 })
        if (under) gsap.set(under, { scaleX: 1, transformOrigin: 'left center' })
        return
      }

      const items = el.querySelectorAll('[data-sh-item]')
      const eyebrowLine = el.querySelector('[data-sh-line]')
      const underline = el.querySelector('[data-sh-underline]')

      gsap.set(items, { opacity: 0, y: 28, filter: 'blur(8px)' })
      if (eyebrowLine) gsap.set(eyebrowLine, { scaleX: 0, transformOrigin: 'left center' })
      if (underline) gsap.set(underline, { scaleX: 0, transformOrigin: 'left center' })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })

      if (eyebrowLine) tl.to(eyebrowLine, { scaleX: 1, duration: 0.6 }, 0)
      tl.to(items, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.1 }, 0.05)

      // Underline scrubs against scroll progress for an active feel.
      // quickTo reuses ONE tween instead of allocating a fresh gsap.to()
      // on every scroll frame (this onUpdate fires ~60×/s, and there's a
      // SectionHeading on every section) — identical motion, far less CPU.
      let scrubTrigger
      if (underline) {
        const setUnderline = gsap.quickTo(underline, 'scaleX', {
          duration: 0.1,
          overwrite: true,
        })
        scrubTrigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 0.6,
          onUpdate: (self) => setUnderline(self.progress),
        })
      }

      // Safety net: if the trigger has not fired within 1.5s of mount (e.g.
      // ScrollTrigger arrived late on a slow phone), reveal the heading so
      // the user never sees an invisible patch.
      const safety = setTimeout(() => {
        gsap.set(items, { opacity: 1, y: 0, filter: 'blur(0px)' })
        if (eyebrowLine) gsap.set(eyebrowLine, { scaleX: 1 })
      }, 1500)

      return () => {
        clearTimeout(safety)
        tl.scrollTrigger?.kill()
        tl.kill()
        scrubTrigger?.kill()
      }
    },
    [reduce, title, accentWord, subtitle, eyebrow],
  )

  const renderedTitle = accentWord
    ? title.split(new RegExp(`(${accentWord})`, 'gi')).map((part, i) =>
        part.toLowerCase() === accentWord.toLowerCase() ? (
          <span key={i} className="relative inline-block">
            <span className="bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              {part}
            </span>
            <span
              data-sh-underline
              className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent"
            />
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )
    : title

  return (
    <div ref={rootRef} className={`flex max-w-3xl flex-col gap-3 sm:gap-4 ${alignCls}`}>
      {eyebrow && (
        <div data-sh-item className="inline-flex items-center gap-2">
          <span data-sh-line className="h-px w-8 bg-gold-400/60" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      )}
      <h2
        data-sh-item
        className="font-display font-semibold leading-[1.1] tracking-tight text-white"
        style={{ fontSize: 'clamp(1.65rem, 1.1rem + 2.4vw, 3rem)' }}
      >
        {renderedTitle}
      </h2>
      {subtitle && (
        <p
          data-sh-item
          className="max-w-2xl leading-relaxed text-white/70"
          style={{ fontSize: 'clamp(1.05rem, 0.95rem + 0.55vw, 1.25rem)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
