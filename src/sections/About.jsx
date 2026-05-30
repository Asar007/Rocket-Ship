import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Factory, Droplets, FlaskConical } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import { GlobalSpotlight } from '../components/MagicBento.jsx'
import modiPhoto from '../assets/projects/cts/modi.jpeg'

const CAPABILITIES = [
  {
    tag: 'SPACE',
    title: 'ISRO launch programmes',
    body:
      'Design, development, manufacture and installation of rocket vibration-simulation systems, zero-G testing rigs, rocket equipment handling and ground systems for launch, across PSLV, GSLV, GSLV Mk III and the Gaganyaan mission.',
    icon: Rocket,
  },
  {
    tag: 'PAPER',
    title: 'Paper industry turnkey plants',
    body:
      'Turnkey equipment for the manufacture of Milk of Lime, plus raw-water and effluent treatment plants for paper mills.',
    icon: Factory,
  },
  {
    tag: 'SUGAR',
    title: 'Sugar industry ETP',
    body:
      'Effluent treatment plants engineered and supplied for sugar processing operations.',
    icon: Droplets,
  },
  {
    tag: 'PETROCHEM',
    title: 'Petrochemical ETP & water treatment',
    body:
      'Effluent treatment plants and water-treatment equipment for petrochemical clients.',
    icon: FlaskConical,
  },
]

export default function About({ mediaSlot = null }) {
  const gridRef = useRef(null)

  return (
    <section id="about" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About the firm"
          title="Engineering for Space. Built for Industry."
          accentWord="Space"
          subtitle="Founded in 2009, Madras Swastic Engineers provides service and engineering support to ISRO and to the paper, sugar and petrochemical industries, from rocket test systems to turnkey treatment plants."
        />

        {/* Inauguration photo — sits above the Our story panel */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-navy-900 sm:mt-12"
        >
          <div className="flex max-h-[70vh] w-full items-center justify-center">
            <img
              src={modiPhoto}
              alt="Inauguration ceremony at VSSC, Trivandrum"
              loading="lazy"
              decoding="async"
              className="max-h-[70vh] w-auto max-w-full object-contain"
            />
          </div>
          <figcaption className="flex items-center gap-3 border-t border-white/10 px-5 py-3 sm:px-6 sm:py-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-400 sm:text-[11px]">
              VSSC · Trivandrum
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/55 sm:text-sm">Handover &amp; inauguration</span>
          </figcaption>
        </motion.figure>

        {/* Optional media (e.g. shop-floor video) rendered directly below the inauguration photo */}
        {mediaSlot && <div className="mt-8 sm:mt-12">{mediaSlot}</div>}

        <GlobalSpotlight
          gridRef={gridRef}
          sectionSelector=".mb-glow-section"
          cardSelector=".mb-glow-card"
          spotlightRadius={260}
        />
        <div
          ref={gridRef}
          className="mb-glow-section mt-8 grid grid-cols-1 gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-12"
        >
          {/* Story panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="glass relative overflow-hidden rounded-3xl p-5 sm:p-7 lg:col-span-5 lg:p-9"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-electric-500/30 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gold-500/25 blur-3xl" />

            <span className="eyebrow">Our story</span>
            <h3
              className="mt-3 font-display font-semibold leading-tight text-white"
              style={{ fontSize: 'clamp(1.35rem, 1rem + 1.4vw, 1.875rem)' }}
            >
              Supporting India&rsquo;s space programme and core industries since 2009.
            </h3>
            <p className="mt-5 text-lg leading-relaxed text-white/75 sm:text-xl">
              Founded in 2009, Madras Swastic Engineers is a Chennai-based
              heavy and precision metal fabrication firm delivering turnkey
              industrial engineering in-house, covering design, fabrication,
              installation and commissioning. The firm serves space and
              aerospace programmes alongside the paper, sugar and petrochemical
              sectors, supplying everything from flight-grade precision
              assemblies and launch-vehicle handling systems to full process
              and treatment plants across India and export markets.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {[
                ['2009', 'Established'],
                ['ISRO', 'Space programmes'],
                ['4', 'Industry sectors'],
                ['Turnkey', 'Delivery model'],
              ].map(([k, v]) => (
                <div
                  key={v}
                  className="mb-glow-card relative rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div className="font-display text-lg font-semibold text-white">{k}</div>
                  <div className="text-xs uppercase tracking-[0.15em] text-white/55">{v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Capabilities */}
          <div className="relative lg:col-span-7">
            {/* Vertical rail */}
            <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:left-6" />

            <ul className="space-y-4 sm:space-y-5">
              {CAPABILITIES.map((m, i) => (
                <motion.li
                  key={m.tag}
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

                  <div className="mb-glow-card relative glass group rounded-2xl p-6 transition-all duration-500 hover:border-white/20 hover:shadow-glow-blue sm:p-7">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-sm tracking-[0.25em] text-gold-400">
                        {m.tag}
                      </span>
                      <span className="h-px flex-1 bg-white/10" />
                    </div>
                    <h4 className="mt-3 font-display text-2xl font-semibold text-white sm:text-3xl">
                      {m.title}
                    </h4>
                    <p className="mt-2 text-base leading-relaxed text-white/70 sm:text-lg">{m.body}</p>
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
