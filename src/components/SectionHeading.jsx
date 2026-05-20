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
  useScrollReveal(
    rootRef,
    ({ gsap, ScrollTrigger, el }) => {
      if (reduce) {
        gsap.set(el.querySelectorAll('[data-sh-item]'), { opacity: 1, y: 0 })
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

      // Underline scrubs against scroll progress for an active feel
      let scrubTrigger
      if (underline) {
        scrubTrigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 0.6,
          onUpdate: (self) => {
            gsap.to(underline, { scaleX: self.progress, duration: 0.1, overwrite: true })
          },
        })
      }

      return () => {
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
    <div ref={rootRef} className={`flex max-w-3xl flex-col gap-4 ${alignCls}`}>
      {eyebrow && (
        <div data-sh-item className="inline-flex items-center gap-2">
          <span data-sh-line className="h-px w-8 bg-gold-400/60" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      )}
      <h2
        data-sh-item
        className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl"
      >
        {renderedTitle}
      </h2>
      {subtitle && (
        <p
          data-sh-item
          className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg"
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
