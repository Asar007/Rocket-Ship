import { motion } from 'framer-motion'
import { Briefcase, Calendar, Users, Clock } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'
import ProgressRing from '../components/ProgressRing.jsx'

const NUMBERS = [
  { icon: Briefcase, label: 'Projects completed', value: 200, suffix: '' },
  { icon: Calendar, label: 'Years of operation', value: 17, suffix: '' },
  { icon: Users, label: 'Team members', value: 100, suffix: '' },
  { icon: Clock, label: 'Hours worked', value: 6260, suffix: '' },
]

export default function Stats() {
  return (
    <section className="section-pad relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="By the numbers"
          title="Track record, measured."
          accentWord="measured"
          subtitle="A snapshot of our work since 2009 — across space, paper, sugar and petrochemical projects."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Counters */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:col-span-3"
          >
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-electric-500/25 blur-3xl" />
            <span className="eyebrow">Quantified output</span>
            <h3 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
              Steel, hours, and reliability — in real numbers.
            </h3>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
              {NUMBERS.map((n) => (
                <div
                  key={n.label}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-500 hover:border-gold-400/30 hover:bg-white/[0.06]"
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
                      d="M0 22 L15 18 L30 20 L45 14 L60 16 L75 9 L90 12 L105 5 L120 8"
                      stroke={`url(#spark-${n.label})`}
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Progress rings */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
            className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:col-span-2"
          >
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gold-500/20 blur-3xl" />
            <span className="eyebrow">Performance</span>
            <h3 className="mt-3 font-display text-xl font-semibold text-white">
              Operational ratings
            </h3>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <ProgressRing value={0.964} label="On-time" sublabel="Delivery 2024" />
              <ProgressRing value={0.98} label="Client retention" sublabel="Last 5 yrs" />
            </div>

            <div className="mt-6 space-y-3">
              {[
                { k: 'Safety score', v: 0.99 },
                { k: 'Inspection pass-rate', v: 0.96 },
                { k: 'BOQ accuracy', v: 0.92 },
              ].map((m) => (
                <div key={m.k}>
                  <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] uppercase text-white/55">
                    <span>{m.k}</span>
                    <span className="text-gold-400">{Math.round(m.v * 100)}%</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.v * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-electric-400 via-electric-500 to-gold-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
