import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import ProjectModal from '../components/ProjectModal.jsx'

import crewModule from '../assets/projects/crew-module-mockup.png'
import sslvCore from '../assets/projects/sslv-core-simulator.png'
import sslvBase from '../assets/projects/sslv-base-structure.png'
import platesA from '../assets/projects/connection-plates-a.png'
import platesB from '../assets/projects/connection-plates-b.png'
import domeErection from '../assets/projects/dome-erection.png'
import latticeTower from '../assets/projects/lattice-tower.png'
import spaceframe from '../assets/projects/spaceframe-fab.png'
import precisionBracket from '../assets/projects/precision-bracket.png'
import processVessel from '../assets/projects/process-vessel.png'
import rotaryDrum from '../assets/projects/rotary-drum.png'
import coolingTower from '../assets/projects/cooling-tower.png'

// NOTE: stories/locations/years are mock placeholders grouped by what the
// photographs show — to be replaced with the client's real project copy.
const PROJECTS = [
  {
    id: 'p1',
    title: 'Crew Training Simulator (CTS)',
    storyTitle: 'Crew Training Simulator (CTS)',
    location: 'VSSC, Trivandrum · Chennai Works',
    year: '2024',
    tags: ['Aerospace', 'ISRO', 'Gaganyaan'],
    blurb:
      'An exact replica of the Gaganyaan crew capsule — built and handed over to ISRO/HSFC within 90 days.',
    images: [crewModule],
    story: [
      "Gaganyaan is the Indian Space Research Organisation's (ISRO) ambitious mission to send three humans per flight to Low Earth Orbit (LEO) for a three-day mission and back to Earth. The Crew Training Simulator (CTS) is an exact replica of the actual capsule in which the crew will be on board the GSLV rocket and return to Earth.",
      'The CTS houses crew seats, life-support equipment, mission-control computers and interfaces, sleeping pods, food, and life-support medicines.',
      'A CTS was manufactured within a 90-day period and successfully handed over to ISRO/HSFC Director, Shri M. Mohan — the handover video shows immense satisfaction and happiness from the customer.',
      'The CTS was officially inaugurated by Shri Narendra Modi, Prime Minister of India, at the space summit held at VSSC, Trivandrum.',
    ],
  },
  {
    id: 'p1b',
    title: 'SSLV Core & Base Simulators',
    location: 'Sriharikota · Chennai Works',
    year: '2024',
    tags: ['Aerospace', 'Simulators', 'Precision'],
    blurb:
      'Core-base simulators for ISRO’s Small Satellite Launch Vehicle (SSLV) programme, built to flight-representative tolerances for integration and training.',
    images: [sslvCore, sslvBase],
  },
  {
    id: 'p2',
    title: 'CNC-Drilled Connection Plates',
    location: 'Guindy Works, Chennai',
    year: '2023',
    tags: ['Fabrication', 'CNC', 'Coated'],
    blurb:
      'Batch production of CNC-drilled, shot-blasted and epoxy-coated gusset and connection plates for structural steel packages.',
    images: [platesA, platesB],
  },
  {
    id: 'p3',
    title: 'Steel Domes, Towers & Space-Frames',
    location: 'South India — multi-site',
    year: '2024',
    tags: ['Structural', 'On-site', 'Turnkey'],
    blurb:
      'Design-assist fabrication and on-site erection of geodesic domes, conical lattice towers and curved architectural space-frames.',
    images: [domeErection, spaceframe, latticeTower],
  },
  {
    id: 'p4',
    title: 'Precision Jigs, Fixtures & Brackets',
    location: 'Machine Shop, Chennai',
    year: '2025',
    tags: ['Machining', 'Tooling', 'Tight-tolerance'],
    blurb:
      'Multi-axis machined aluminium fixtures and load brackets finished to micron tolerances for aerospace and instrumentation clients.',
    images: [precisionBracket],
  },
  {
    id: 'p5',
    title: 'Process Vessels & Rotary Equipment',
    location: 'Guindy Works, Chennai',
    year: '2023',
    tags: ['Mechanical', 'Vessels', 'Fabrication'],
    blurb:
      'Heavy process vessels and rotary drum assemblies — rolled, welded and finished for chemical and manufacturing plants.',
    images: [processVessel, rotaryDrum],
  },
  {
    id: 'p6',
    title: 'Counter-Flow Cooling Tower',
    location: 'Coimbatore, TN',
    year: '2022',
    tags: ['Mechanical', 'Tankage', 'Retrofit'],
    blurb:
      'Shop fabrication and assembly of an induced-draft counter-flow cooling tower shell and internals.',
    images: [coolingTower],
  },
]

export default function Projects() {
  const [active, setActive] = useState(null)

  return (
    <section id="projects" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Selected work"
            title="Projects we're proud of."
            accentWord="proud"
            subtitle="A snapshot of recent turnkey, fabrication and field-erection work across South India."
          />
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-display text-sm text-white/85 backdrop-blur hover:border-gold-400/40 hover:text-white"
          >
            View capability deck
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
              onClick={() => setActive(p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActive(p)
                }
              }}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
            >
              {/* Photo */}
              <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Top overlay — year + photo count + arrow */}
                <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-white/15 bg-navy-950/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-white/80 backdrop-blur">
                      {p.year}
                    </span>
                    {p.images.length > 1 && (
                      <span className="rounded-full border border-white/15 bg-navy-950/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-white/70 backdrop-blur">
                        {p.images.length} PHOTOS
                      </span>
                    )}
                  </div>
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-navy-950/70 text-gold-400 backdrop-blur transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-gold-400/60">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/85 to-transparent" />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs text-white/55">
                  <MapPin className="h-3 w-3 text-gold-400" />
                  <span className="font-mono tracking-wider">{p.location}</span>
                </div>
                <h4 className="mt-2 font-display text-lg font-semibold leading-snug text-white">
                  {p.title}
                </h4>
                <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                  {p.blurb}
                </p>

                {/* Extra photos strip */}
                {p.images.length > 1 && (
                  <div className="mt-4 flex gap-2">
                    {p.images.slice(1).map((src, idx) => (
                      <div
                        key={idx}
                        className="h-12 w-16 overflow-hidden rounded-lg border border-white/10"
                      >
                        <img
                          src={src}
                          alt={`${p.title} — ${idx + 2}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-white/65"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {active && (
        <ProjectModal project={active} onClose={() => setActive(null)} />
      )}
    </section>
  )
}
