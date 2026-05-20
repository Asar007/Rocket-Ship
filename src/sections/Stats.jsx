import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Calendar, Users, Clock } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import { ParticleCard, GlobalSpotlight } from '../components/MagicBento.jsx'
import { ensureScrollTrigger, getGsap } from '../lib/gsap.js'

const NUMBERS = [
  { icon: Briefcase, label: 'Projects completed', value: 200, suffix: '' },
  { icon: Calendar, label: 'Years of operation', value: 17, suffix: '' },
  { icon: Users, label: 'Team members', value: 100, suffix: '' },
  { icon: Clock, label: 'Hours worked', value: 6260, suffix: '' },
]

export default function Stats() {
  const gridRef = useRef(null)
  const cardsWrapRef = useRef(null)

  // GSAP scroll scrub: stagger the counter cards in and draw each
  // sparkline path against scroll progress.
  useEffect(() => {
    let cancelled = false
    let triggers = []

    ensureScrollTrigger().then((ScrollTrigger) => {
      if (cancelled || !cardsWrapRef.current || !ScrollTrigger) return
      const gsap = getGsap()
      const wrap = cardsWrapRef.current
      const cards = wrap.querySelectorAll('[data-stat-card]')
      const paths = wrap.querySelectorAll('[data-spark]')

      gsap.set(cards, { opacity: 0, y: 36 })
      paths.forEach((p) => {
        p.style.strokeDasharray = '1'
        p.style.strokeDashoffset = '1'
      })

      const entryTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
      entryTl.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
      })

      const scrubTrigger = ScrollTrigger.create({
        trigger: wrap,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 0.6,
        onUpdate: (self) => {
          const offset = 1 - self.progress
          paths.forEach((p) => {
            p.style.strokeDashoffset = String(offset)
          })
        },
      })

      triggers.push(entryTl.scrollTrigger, scrubTrigger)
    })

    return () => {
      cancelled = true
      triggers.forEach((t) => t?.kill())
    }
  }, [])

  return (
    <section className="section-pad relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="By the numbers"
          title="Track record, measured."
          accentWord="measured"
          subtitle="A snapshot of our work since 2009, across space, paper, sugar and petrochemical projects."
        />

        <div className="mt-14">
          {/* Counters */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8"
          >
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-electric-500/25 blur-3xl" />
            <span className="eyebrow">Quantified output</span>
            <h3 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
              Steel, hours, and reliability, in real numbers.
            </h3>

            <GlobalSpotlight
              gridRef={gridRef}
              sectionSelector=".mb-glow-section"
              cardSelector=".mb-glow-card"
              spotlightRadius={240}
            />
            <div
              ref={(node) => {
                gridRef.current = node
                cardsWrapRef.current = node
              }}
              className="mb-glow-section mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
            >
              {NUMBERS.map((n) => (
                <ParticleCard
                  key={n.label}
                  enableTilt={false}
                  enableMagnetism={false}
                  particleCount={6}
                  data-stat-card
                  className="mb-glow-card group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-500 hover:border-gold-400/30 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-2 text-gold-400">
                    <n.icon className="h-4 w-4" />
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/55">
                      {n.label}
                    </span>
                  </div>
                  <div className="mt-3 font-display text-4xl font-semibold leading-none text-white sm:text-5xl">
                    <AnimatedCounter value={n.value} suffix={n.suffix} />
                  </div>
                  {/* mini sparkline */}
                  <svg viewBox="0 0 120 30" className="mt-4 h-6 w-full" fill="none">
                    <defs>
                      <linearGradient id={`spark-${n.label}`} x1="0" x2="1">
                        <stop offset="0" stopColor="#5aa6ff" stopOpacity="0.2" />
                        <stop offset="0.5" stopColor="#5aa6ff" />
                        <stop offset="1" stopColor="#f0c674" />
                      </linearGradient>
                    </defs>
                    <path
                      data-spark
                      pathLength="1"
                      d="M0 22 L15 18 L30 20 L45 14 L60 16 L75 9 L90 12 L105 5 L120 8"
                      stroke={`url(#spark-${n.label})`}
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </ParticleCard>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
