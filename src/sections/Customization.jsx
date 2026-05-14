import { motion } from 'framer-motion'
import {
  Activity,
  Boxes,
  Building2,
  Cog,
  Construction,
  FileBox,
  Hammer,
  Layers,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'

const SECTORS = [
  'Energy',
  'Refinery',
  'Process',
  'Aerospace',
  'Defence',
  'Marine',
  'Power',
  'Heavy industry',
]

const PROCESS = [
  {
    id: 'brief',
    title: 'Brief',
    body: 'Site survey, loads, materials and statutory constraints captured by a senior engineer.',
    icon: FileBox,
  },
  {
    id: 'engineering',
    title: 'Engineering',
    body: 'Parametric CAD, FEA stress analysis, drawing pack reviewed and signed.',
    icon: Cog,
  },
  {
    id: 'sourcing',
    title: 'Sourcing',
    body: 'Mill-certified plates and sections sourced direct, traceable per heat number.',
    icon: Boxes,
  },
  {
    id: 'fab',
    title: 'Fabrication',
    body: 'CNC cutting, qualified welders, blast & paint — all in our Chennai works.',
    icon: Hammer,
  },
  {
    id: 'qa',
    title: 'Inspection',
    body: 'NDT, dimensional checks and third-party witness sign-off before despatch.',
    icon: ShieldCheck,
  },
  {
    id: 'erection',
    title: 'Erection',
    body: 'Certified rigging, site erection, commissioning and full handover pack.',
    icon: Construction,
  },
]

const CAPABILITIES = [
  {
    id: 'alloy',
    title: 'Custom alloys & coatings',
    body: 'Carbon, stainless, duplex, Inconel — picked for the corrosive cycle in your plant.',
    icon: Layers,
    span: 'lg:col-span-2',
  },
  {
    id: 'load',
    title: 'Heavy-load rated',
    body: 'Members engineered up to 250 t SWL with documented FEA back-up.',
    icon: Building2,
    span: 'lg:col-span-2',
  },
  {
    id: 'modular',
    title: 'Modular delivery',
    body: 'Shop-assembled, road-transportable modules — minimise site weld time.',
    icon: Boxes,
    span: 'lg:col-span-2',
  },
  {
    id: 'iso',
    title: 'ISO 9001 : 2015',
    body: 'Quality system audited and certified — full traceability, project by project.',
    icon: ShieldCheck,
    span: 'lg:col-span-3',
  },
  {
    id: 'iot',
    title: 'IoT-ready frames',
    body: 'Pre-built conduits and sensor mounts for downstream instrumentation.',
    icon: Activity,
    span: 'lg:col-span-3',
  },
]

export default function Customization() {
  return (
    <section id="customization" className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute right-[-10%] top-[8%] h-[420px] w-[420px] rounded-full bg-electric-500/12 blur-3xl" />
        <div className="absolute left-[-10%] bottom-[20%] h-[420px] w-[420px] rounded-full bg-gold-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Customization"
          title="We custom-fabricate anything you can specify."
          accentWord="anything"
          subtitle="A refinery stair tower one week, a space-grade structural module the next. Every project starts from a blank page and a senior engineer — there's no catalogue we're picking from."
        />

        {/* === Range + sectors callout === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-12 flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-5 backdrop-blur md:flex-row md:items-center md:justify-between md:gap-10 md:px-7"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
            <p className="max-w-2xl text-[14px] leading-relaxed text-white/80">
              <span className="font-display text-[17px] font-semibold text-gold-300">
                If it can be engineered, we will build it.
              </span>
              <br />
              From a stair handrail to flight-class structural hardware — every brief is bespoke, every drawing reviewed by a chartered engineer.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.28em] text-white/55">
            {SECTORS.map((s, i) => (
              <span key={s} className="flex items-center gap-4">
                <span>{s}</span>
                {i < SECTORS.length - 1 && (
                  <span className="text-white/20" aria-hidden>
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </motion.div>

        {/* === Process Timeline === */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Build journey"
            title="From sketch to commissioned asset."
            accentWord="commissioned"
            subtitle="A documented six-stage process keeps every project on time, on spec and audit-ready."
            align="left"
          />

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.2, 0.7, 0.2, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/25"
              >
                <div className="font-mono text-[10px] tracking-[0.3em] text-gold-400">
                  STEP · {String(i + 1).padStart(2, '0')}
                </div>
                <p.icon className="mt-5 h-6 w-6 text-electric-400 transition-transform duration-500 group-hover:scale-110" />
                <h4 className="mt-3 font-display text-lg font-semibold text-white">{p.title}</h4>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">{p.body}</p>
                {i < PROCESS.length - 1 && (
                  <span className="absolute right-[-1px] top-1/2 hidden h-px w-3 bg-gradient-to-r from-white/30 to-transparent lg:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* === Capabilities mosaic === */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Capabilities"
            title="Custom doesn't stop at dimensions."
            accentWord="Custom"
            subtitle="Every project draws on a complete in-house spine of design, fabrication and certification."
            align="left"
          />

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/25 ${cap.span}`}
              >
                <cap.icon className="h-6 w-6 text-gold-400 transition-transform duration-500 group-hover:rotate-6" />
                <h4 className="mt-4 font-display text-base font-semibold text-white">
                  {cap.title}
                </h4>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/55">{cap.body}</p>
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gold-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
