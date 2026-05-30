import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Factory, Rocket, Orbit, Satellite } from 'lucide-react'
import logo from '../assets/logo.png'
import imgHeavy from '../assets/projects/process-vessel.webp'
import imgGaganyaan from '../assets/projects/crew-module-mockup.webp'
import imgSimulator from '../assets/projects/sslv-core-simulator.webp'
import imgStation from '../assets/projects/bas/outside-1.jpeg'

const CHAPTERS = [
  {
    no: '01',
    year: '2009',
    eyebrow: 'Origins',
    title: 'Founded in Chennai.',
    body:
      'Madras Swastic Engineers begins life as a precision fabrication and turnkey engineering firm in Guindy Industrial Estate, taking on what no one else in the corridor would attempt.',
    icon: Sparkles,
    image: logo,
    // logo is a transparent emblem, not a photo — contain + pad it instead
    // of cropping edge-to-edge like the fabrication shots.
    contain: true,
    padded: true,
  },
  {
    no: '02',
    year: '2012',
    eyebrow: 'Heavy industry',
    title: 'Plants for paper, sugar, petrochem.',
    body:
      'Turnkey delivery of Milk-of-Lime equipment, raw-water and effluent treatment plants, engineered, fabricated, installed and commissioned. The four-sector industrial backbone takes shape.',
    icon: Factory,
    image: imgHeavy,
  },
  {
    no: '03',
    year: '2016',
    eyebrow: 'To space',
    title: 'Partnered with ISRO.',
    body:
      'Selected to design and manufacture rocket vibration-simulation systems, zero-G test rigs, equipment handling and ground systems across PSLV, GSLV and GSLV Mk III.',
    icon: Rocket,
    image: imgSimulator,
  },
  {
    no: '04',
    year: 'Today',
    eyebrow: 'Gaganyaan',
    title: 'Carrying India to orbit.',
    body:
      'Fabrication partner on the Gaganyaan crew-module programme, India\'s first crewed spaceflight. Every weld, ring and panel held to flight standard.',
    icon: Orbit,
    image: imgGaganyaan,
  },
  {
    no: '05',
    year: 'Next',
    eyebrow: 'Space station',
    title: 'Modules for India\'s space station.',
    body:
      'Fabrication partner on the Bharatiya Antariksh Station — India\'s own crewed orbital outpost — carrying two decades of flight-standard work into a permanent human presence in space.',
    icon: Satellite,
    image: imgStation,
    // show the full space-station render — don't crop it edge-to-edge.
    contain: true,
  },
]

export default function AboutJourney() {
  const sectionRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  // Track which chapter is centered for the sticky visual to react to.
  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('[data-chapter]')
    if (!els || !els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number(e.target.getAttribute('data-chapter'))
            if (!Number.isNaN(i)) setActiveIdx(i)
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const active = CHAPTERS[activeIdx]

  return (
    <section
      ref={sectionRef}
      className="section-pad relative"
      aria-label="Madras Swastic Engineers journey"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-gold-400/60" />
          <span className="eyebrow">The journey</span>
        </div>
        <h2
          className="mt-4 max-w-3xl font-display font-semibold leading-[1.1] tracking-tight text-white"
          style={{ fontSize: 'clamp(1.75rem, 1.1rem + 3vw, 3rem)' }}
        >
          From a Chennai shop floor to{' '}
          <span className="bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
            India's first crewed spaceflight.
          </span>
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:mt-14 lg:grid-cols-12 lg:gap-10">
          {/* Sticky visual stage — hidden on mobile to save scroll real-estate;
              the chapter timeline carries the story alone below the breakpoint. */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="glass relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 p-8">
                {/* Active chapter visual — fills the card and crossfades as the
                    reader scrolls between chapters. Photos crop edge-to-edge;
                    the chapter-01 logo is contained and padded. */}
                <motion.img
                  key={`${active.no}-img`}
                  src={active.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  initial={{ opacity: 0, scale: active.contain ? 0.94 : 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
                  className={`absolute inset-0 h-full w-full ${
                    active.contain
                      ? `object-contain ${active.padded ? 'p-14 sm:p-16' : ''}`
                      : 'object-cover'
                  }`}
                />
                {/* Bottom-only fade — keeps the chapter/year legend readable
                    while leaving the photo at full brightness above it. */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent" />

                {/* Bottom legend */}
                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                  <motion.div
                    key={`${active.no}-meta`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-300">
                      Chapter {active.no}
                    </div>
                    <div className="mt-1 font-display text-2xl font-semibold text-white">
                      {active.year}
                    </div>
                  </motion.div>

                  {/* Progress dots */}
                  <div className="flex flex-col items-end gap-2">
                    {CHAPTERS.map((c, i) => (
                      <span
                        key={c.no}
                        className={`h-1.5 transition-all duration-500 ${
                          i === activeIdx
                            ? 'w-6 bg-gold-400'
                            : 'w-3 bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling chapter column */}
          <div className="relative lg:col-span-7">
            {/* vertical rail — aligned to the dot center (left-0 + w-7/2 = 14px) */}
            <div className="absolute left-[13.5px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

            <ol className="space-y-12 sm:space-y-20 lg:space-y-28">
              {CHAPTERS.map((c, i) => {
                const Icon = c.icon
                return (
                  <motion.li
                    key={c.no}
                    data-chapter={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1, margin: '0px 0px -10% 0px' }}
                    transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
                    className="relative pl-12 sm:pl-16"
                  >
                    {/* Dot on rail */}
                    <span
                      className={`absolute left-0 top-1 grid h-7 w-7 place-items-center rounded-full border bg-navy-900/80 backdrop-blur transition-all duration-500 ${
                        i === activeIdx
                          ? 'border-gold-400/60 shadow-glow-gold'
                          : 'border-white/15'
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 transition-colors duration-500 ${
                          i === activeIdx ? 'text-gold-300' : 'text-white/50'
                        }`}
                      />
                    </span>

                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs tracking-[0.3em] text-gold-400">
                        {c.no}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">
                        {c.eyebrow} · {c.year}
                      </span>
                      <span className="h-px flex-1 bg-white/10" />
                    </div>

                    <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
                      {c.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/65">
                      {c.body}
                    </p>
                  </motion.li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
