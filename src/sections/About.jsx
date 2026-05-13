import { motion } from 'framer-motion'
import { Factory, ShieldCheck, Award, Building2 } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'

const MILESTONES = [
  {
    year: '1998',
    title: 'Founded in Chennai',
    body:
      'Madras Swastic Engineers begins as a small fabrication workshop serving local refineries.',
    icon: Building2,
  },
  {
    year: '2006',
    title: 'ISO 9001 Certified',
    body:
      'Quality management systems formalized; first multi-state turnkey contract for a petrochem client.',
    icon: ShieldCheck,
  },
  {
    year: '2014',
    title: 'New Plant — Sriperumbudur',
    body:
      '42,000 sq.ft. manufacturing facility commissioned. Heavy steel, piping and skid assembly under one roof.',
    icon: Factory,
  },
  {
    year: '2023',
    title: 'Industry Excellence Award',
    body:
      'Recognised for zero-incident execution across 12 simultaneous on-site projects.',
    icon: Award,
  },
]

export default function About() {
  return (
    <section id="about" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About the firm"
          title="Built on Precision. Driven by People."
          accentWord="Precision"
          subtitle="Three decades of engineering work across India's industrial backbone — refineries, power plants, manufacturing floors. We treat every drawing like it matters, because it does."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Story panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="glass relative overflow-hidden rounded-3xl p-7 sm:p-9 lg:col-span-5"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-electric-500/30 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gold-500/25 blur-3xl" />

            <span className="eyebrow">Our story</span>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
              From a single fabrication bay to a multi-site industrial partner.
            </h3>
            <p className="mt-5 text-[15px] leading-relaxed text-white/70">
              We started with three engineers, two welders and a stubborn belief that Indian
              industry deserved better execution. Today, we operate two manufacturing facilities
              and a 90-strong on-site team — and we still take every drawing home at night.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 text-sm">
              {[
                ['90+', 'Field engineers'],
                ['42k sq.ft.', 'Manufacturing'],
                ['12', 'Active sites'],
                ['0', 'Lost-time incidents 2024'],
              ].map(([k, v]) => (
                <div
                  key={v}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div className="font-display text-lg font-semibold text-white">{k}</div>
                  <div className="text-xs uppercase tracking-[0.15em] text-white/55">{v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <div className="relative lg:col-span-7">
            {/* Vertical rail */}
            <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:left-6" />

            <ul className="space-y-5">
              {MILESTONES.map((m, i) => (
                <motion.li
                  key={m.year}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
                  className="relative pl-12 sm:pl-16"
                >
                  {/* Dot */}
                  <span className="absolute left-0 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-navy-900/70 backdrop-blur sm:left-2">
                    <m.icon className="h-3.5 w-3.5 text-gold-400" />
                  </span>

                  <div className="glass group rounded-2xl p-5 transition-all duration-500 hover:border-white/20 hover:shadow-glow-blue">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs tracking-[0.25em] text-gold-400">
                        {m.year}
                      </span>
                      <span className="h-px flex-1 bg-white/10" />
                    </div>
                    <h4 className="mt-2 font-display text-lg font-semibold text-white">
                      {m.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">{m.body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
