import { motion } from 'framer-motion'
import AnimatedCounter from '../components/AnimatedCounter.jsx'

const METRICS = [
  { value: 2009, label: 'Established', sub: 'Chennai · Guindy' },
  { value: 4, label: 'ISRO programmes', sub: 'PSLV · GSLV · Mk III · Gaganyaan' },
  { value: 4, label: 'Industry sectors', sub: 'Space · Paper · Sugar · Petrochem' },
  { value: 100, suffix: '%', label: 'Turnkey delivery', sub: 'Design → commission' },
]

export default function AboutMetrics() {
  return (
    <section className="section-pad relative">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-8 lg:p-10"
        >
          {/* corner washes */}
          <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-gold-500/15 blur-3xl" />
          <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-electric-500/15 blur-3xl" />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-gold-400/60" />
                <span className="eyebrow">Proof</span>
              </div>
              <h2
                className="mt-3 font-display font-semibold leading-tight text-white"
                style={{ fontSize: 'clamp(1.4rem, 1rem + 1.6vw, 1.875rem)' }}
              >
                Quantified credibility.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/55">
              Numbers that frame what we've done and what we're trusted to do
              next.
            </p>
          </div>

          {/* gold hairline */}
          <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-gold-400/30 to-transparent sm:my-8" />

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
                className="relative"
              >
                <div
                  className="font-display font-semibold leading-none tracking-tight text-white"
                  style={{ fontSize: 'clamp(2.25rem, 1.4rem + 4vw, 4.5rem)' }}
                >
                  <span className="bg-gradient-to-br from-white via-white to-gold-300 bg-clip-text text-transparent">
                    <AnimatedCounter value={m.value} suffix={m.suffix || ''} />
                  </span>
                </div>
                <div className="mt-4 h-px w-10 bg-gold-400/60" />
                <div className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.28em] text-gold-300">
                  {m.label}
                </div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-white/55">
                  {m.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
