import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TextPressure from '../components/TextPressure.jsx'

const ROTATING = ['SPACE', 'INDIA', 'INDUSTRY', 'TOMORROW']

export default function AboutManifesto() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ROTATING.length), 2400)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="section-pad relative overflow-hidden">
      {/* ambient washes */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute left-[-10%] top-[-20%] h-[420px] w-[420px] rounded-full bg-electric-500/15 blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[460px] w-[460px] rounded-full bg-gold-500/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-gold-400/60" />
          <span className="eyebrow">Manifesto</span>
        </div>

        {/* TextPressure giant headline */}
        <div className="relative mt-6 h-[180px] select-none sm:h-[240px] md:h-[300px] lg:h-[360px]">
          <TextPressure
            text="BUILT TO LAUNCH"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#FFFFFF"
            strokeColor="#D4AF37"
            minFontSize={56}
          />
        </div>

        {/* Rotating word manifesto line */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 font-display text-3xl font-light tracking-tight text-white/85 sm:text-4xl md:text-5xl">
            <span>We engineer for</span>
            <span className="relative inline-flex h-[1.05em] min-w-[5.5ch] overflow-hidden align-baseline sm:min-w-[7ch] md:min-w-[8ch]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROTATING[idx]}
                  initial={{ y: '105%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-105%', opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
                  className="bg-gradient-to-br from-gold-300 via-gold-400 to-gold-500 bg-clip-text font-semibold text-transparent"
                >
                  {ROTATING[idx]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
            From the Bay of Bengal to low Earth orbit. Engineering India's
            hardest builds since 2009 — rockets, refineries, pulp plants,
            clean water.
          </p>
        </div>

        {/* gold hairline divider */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
      </div>
    </section>
  )
}
