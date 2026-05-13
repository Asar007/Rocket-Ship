import { motion } from 'framer-motion'
import { Gem, Timer, LineChart, ArrowUpRight } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'

const CARDS = [
  {
    id: 'quality',
    eyebrow: '01 / Quality',
    title: 'Built to Outlast.',
    body:
      'Every weld, plate and bolt passes a documented inspection protocol. We hold ourselves to standards our clients use as benchmarks.',
    icon: Gem,
    metric: 'ISO 9001 : 2015',
    accent: 'from-electric-400/50 via-electric-500/30 to-transparent',
  },
  {
    id: 'time',
    eyebrow: '02 / Delivery',
    title: 'Timelines, Hit.',
    body:
      'On-the-day project handovers are our default. Critical-path scheduling, in-house fabrication and a 90-strong field team make it possible.',
    icon: Timer,
    metric: '96.4% on-time',
    accent: 'from-gold-400/50 via-gold-500/30 to-transparent',
  },
  {
    id: 'cost',
    eyebrow: '03 / Efficiency',
    title: 'Honest Economics.',
    body:
      'Transparent BOQs, in-house engineering and direct material sourcing — we pass the savings to you, not into a bloated middle layer.',
    icon: LineChart,
    metric: 'Avg. 18% cost-saving',
    accent: 'from-electric-400/50 via-gold-400/30 to-transparent',
  },
]

export default function WhyChooseUs() {
  return (
    <section id="services" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why choose us"
          title="Three commitments. No compromises."
          accentWord="commitments"
          subtitle="Engineering is a promise made with steel. We keep ours through process, people, and discipline."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
              className="glow-ring group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-glow-blue"
            >
              {/* Top accent line */}
              <div
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${c.accent}`}
              />
              {/* Background glow on hover */}
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${c.accent} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100`}
              />

              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur transition-all duration-500 group-hover:border-gold-400/40 group-hover:shadow-glow-gold">
                  <c.icon className="h-5 w-5 text-gold-400" strokeWidth={1.8} />
                </span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-white/45">
                  {c.eyebrow}
                </span>
              </div>

              <h3 className="mt-8 font-display text-2xl font-semibold leading-tight text-white">
                {c.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65">{c.body}</p>

              <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="font-mono text-[11px] tracking-[0.2em] text-gold-400">
                  {c.metric}
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-gold-400/40 group-hover:text-gold-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
