import { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import ProjectModal from '../components/ProjectModal.jsx'

// Staggered cascade: cards reveal one after another with a soft
// blur-in / lift, instead of all firing at once.
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] },
  },
}
const cardVariantsReduced = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
}

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
    storyStyle: 'capsule',
    blurb:
      'An exact replica of the Gaganyaan crew capsule, built and handed over to ISRO/HSFC within 90 days.',
    images: [crewModule],
    story: [
      "Gaganyaan is the Indian Space Research Organisation's (ISRO) ambitious mission to send three humans per flight to Low Earth Orbit (LEO) for a three-day mission and back to Earth. The Crew Training Simulator (CTS) is an exact replica of the actual capsule in which the crew will be on board the GSLV rocket and return to Earth.",
      'The CTS houses crew seats, life-support equipment, mission-control computers and interfaces, sleeping pods, food, and life-support medicines.',
      'A CTS was manufactured within a 90-day period and successfully handed over to ISRO/HSFC Director, Shri M. Mohan. The handover video shows immense satisfaction and happiness from the customer.',
      'The CTS was officially inaugurated by Shri Narendra Modi, Prime Minister of India, at the space summit held at VSSC, Trivandrum.',
    ],
  },
  {
    id: 'p1b',
    title: 'SSLV Core & Base Simulators',
    storyTitle: 'Simulating the SSLV, end to end',
    location: 'Sriharikota · Chennai Works',
    year: '2024',
    tags: ['Aerospace', 'Simulators', 'Precision'],
    storyStyle: 'timeline',
    blurb:
      'Flight-representative core and base simulators for ISRO’s Small Satellite Launch Vehicle (SSLV), engineered to mirror real interface envelopes for integration rehearsals, mass-property checks and crew training.',
    images: [sslvCore, sslvBase],
    story: [
      'The brief: build a one-to-one mechanical twin of the SSLV core and base sections so ISRO can rehearse stage integration without risking flight hardware.',
      'Every interface ring, bolt circle and umbilical port is captured from VSSC drawings and re-cut in our jigs to flight-representative tolerances.',
      'Heavy plate is rolled into the core cylinder; the base structure is cast and machined as one piece, then dye-penetrant inspected before paint.',
      'Trial assembly is photographed and laser-scanned at our Chennai works, so the simulator lands at Sriharikota ready to mate on the first try.',
      'Both simulators are now in active duty for stage handling, transport-mode validation and training of the SSLV ground crew.',
    ],
  },
  {
    id: 'p1c',
    title: 'GSLV-5.4 Dia Meter Heat Shield Fixture',
    storyTitle: 'A 5.4-metre cage for a rocket’s nose',
    location: 'VSSC · Chennai Works',
    year: '2024',
    tags: ['Aerospace', 'ISRO', 'GSLV'],
    storyStyle: 'cinematic',
    blurb:
      'Large-diameter handling and assembly fixture for the GSLV 5.4 m heat shield. A circumferential lattice cage built to support, rotate and inspect the shield through every stage of integration without distorting its flight geometry.',
    images: [domeErection, latticeTower],
    story: [
      'A 5.4-metre heat shield cannot rest on its own skin. The fixture exists so the shield can be lifted, rotated and worked on without a millimetre of deformation.',
      'Every node is CNC-cut from heavy section and welded under a master jig — load paths verified by FEA before a single arc is struck.',
      'Trial-erected on a dust-blown pad at our Chennai works, the cage is dimensionally checked by total station against the flight geometry it has to protect.',
      'Crawler cranes pick it from three points, exactly as ISRO will, so the lifting plan is proved on our floor before it ever leaves the shop.',
      'Dispatched to VSSC with full QA dossier, weld maps and load-test reports — ready to cradle the heat shield through integration.',
    ],
  },
  {
    id: 'p1d',
    title: 'PSLV Core Base Shroud Assembly',
    storyTitle: 'The shroud that wraps the workhorse',
    location: 'VSSC · Chennai Works',
    year: '2024',
    tags: ['Aerospace', 'ISRO', 'PSLV'],
    storyStyle: 'sticky',
    blurb:
      'Core base shroud assembly for ISRO’s PSLV — the launch vehicle that has put more than four hundred satellites into orbit. Rolled, seam-welded and lock-fitted in-house to flight-grade surface and dimensional tolerances.',
    images: [processVessel],
    story: [
      'The PSLV is India’s most prolific launcher, and every flight starts with a base shroud that has to seat perfectly on the core stage.',
      'Heavy aluminium plate is rolled into a single tapered shell, with longitudinal seams welded and X-ray inspected before any fit-out begins.',
      'Internal mounting bosses, conduit cut-outs and umbilical pass-throughs are machined to drawing on our boring bed in a single setup.',
      'A flight-yellow protective coat is applied so the shroud reads cleanly during integration photographs and post-flight inspection.',
      'Final dimensional report is signed off against VSSC drawings and the shroud is crated for transport to Sriharikota.',
    ],
  },
  {
    id: 'p1e',
    title: 'VSSC Conical Pressure Chamber',
    storyTitle: 'A pressure vessel, machined like an instrument',
    location: 'VSSC · Chennai Works',
    year: '2024',
    tags: ['Aerospace', 'ISRO', 'VSSC'],
    storyStyle: 'kenburns',
    blurb:
      'Large conical pressure chamber for the Vikram Sarabhai Space Centre — designed for repeated proof-pressure cycles and built on our heavy horizontal boring mill to keep concentricity inside microns end-to-end.',
    images: [rotaryDrum],
    story: [
      'A conical pressure chamber for VSSC, rolled from heavy plate and finished as a single concentric body.',
      'The shell is set up on the horizontal boring mill so every flange face is cut in one reference frame, holding true concentricity from cone to cone.',
      'Each weld is radiographed, then the chamber is hydrostatically proof-tested at 1.5× working pressure before it leaves the shop.',
      'A 2K polyurethane coat protects the outer skin; the inside is passivated for compatibility with the test fluids VSSC will run through it.',
      'Final acceptance is signed off jointly by VSSC inspectors at our works, and the chamber is shipped on a custom cradle to the test bay.',
    ],
  },
  {
    id: 'p1f',
    title: 'PSLV Heat Shield',
    storyTitle: 'An aluminium cage at Mach 8',
    location: 'VSSC · Chennai Works',
    year: '2024',
    tags: ['Aerospace', 'ISRO', 'PSLV'],
    storyStyle: 'sticky',
    blurb:
      'Aluminium PSLV heat shield assembly — a ribbed monocoque framework that protects the payload through the worst of atmospheric flight, fabricated and finished at our Chennai works for ISRO.',
    images: [spaceframe],
    story: [
      'The PSLV heat shield is what stands between the satellite and the violence of atmospheric flight. Every rib has to be light, true, and exact.',
      'Aircraft-grade aluminium ribs are profile-cut, heat-treated, and assembled on a master jig that fixes the curvature within fractions of a millimetre.',
      'Joints are TIG-welded by certified aerospace welders, then dye-penetrant inspected; every seam is logged against a weld map.',
      'A trial fit-up with the mating ring is done in our high-bay before the skin panels are bonded on and the assembly is sent for surface finishing.',
      'Finished in mission-silver and signed off against the VSSC quality plan, the heat shield is crated and dispatched to Sriharikota for integration.',
    ],
  },
  {
    id: 'p2',
    title: 'CNC-Drilled Connection Plates',
    storyTitle: 'A thousand plates, no surprises',
    location: 'Guindy Works, Chennai',
    year: '2023',
    tags: ['Fabrication', 'CNC', 'Coated'],
    storyStyle: 'timeline',
    blurb:
      'High-volume batch production of CNC-drilled, shot-blasted and epoxy-coated gusset and connection plates — engineered, marked and stacked in delivery order so they bolt up on site without a single field correction.',
    images: [platesA, platesB],
    story: [
      'A large structural steel package is only as fast as its connection plates. Get those wrong on a thousand pieces and the whole site stalls.',
      'Plates are nested on a CNC plasma bed for minimum scrap, then transferred to a beam-line drill for hole groups that match the bolt-up drawing exactly.',
      'Every plate is shot-blasted to Sa 2½ and primed within the same shift, so the surface is fresh when the epoxy top-coat is applied.',
      'Quality control samples one in twenty plates for hole position, diameter and edge prep before the batch is bundled and labelled by erection sequence.',
      'Stacked and shrink-wrapped in the order they will be picked on site, the plates ship out ready to bolt — no re-drilling, no field cutting.',
    ],
  },
  {
    id: 'p4',
    title: 'Precision Jigs, Fixtures & Brackets',
    storyTitle: 'Micron-level tooling for million-rupee assemblies',
    location: 'Machine Shop, Chennai',
    year: '2025',
    tags: ['Machining', 'Tooling', 'Tight-tolerance'],
    storyStyle: 'kenburns',
    blurb:
      'Multi-axis machined aluminium fixtures and load brackets for aerospace and instrumentation clients — surface finish, flatness and bolt-circle concentricity held inside microns so the parts they cradle stay true.',
    images: [precisionBracket],
    story: [
      'A fixture is only worth what it holds. Ours hold flight hardware, so every surface gets treated like the part it will support.',
      'Aluminium billet is roughed on a 5-axis machining centre, then stress-relieved overnight so the final finish cuts don’t walk.',
      'Critical bores and locating pins are finished in a second setup against the same datums, holding concentricity to within a few microns.',
      'CMM inspection is done in-house, with each fixture leaving the shop accompanied by a dimensional report and a serial-marked location plan.',
      'Anodised to a hard-coat finish for wear life, the brackets and jigs go straight into integration cells with no rework on arrival.',
    ],
  },
  {
    id: 'p6',
    title: 'Counter-Flow Cooling Tower',
    storyTitle: 'One Tower, Built to Breathe',
    location: 'Coimbatore, TN',
    year: '2022',
    tags: ['Mechanical', 'Tankage', 'Retrofit'],
    storyStyle: 'kenburns',
    blurb:
      'Shop fabrication and assembly of an induced-draft counter-flow cooling tower shell and internals.',
    images: [coolingTower],
    story: [
      'A single induced-draft, counter-flow tower: shell, fan deck and internals fabricated entirely in-house.',
      'Heavy plate is rolled and seam-welded into the tapered shell, then stress-relieved before any fit-out begins.',
      'Every FRP louvre and drift eliminator is fitted, aligned and water-tested before the unit leaves the shop.',
      'The fan deck, gearbox and drive shaft are laser-aligned and trial-run under load to prove vibration limits.',
      'Lifted in as a single module and commissioned on a live plant, with zero downtime to the existing line.',
      'Handed over with full hydraulic and thermal performance reports, ahead of the contracted schedule.',
    ],
  },
]

function ProjectCard({ project: p, onOpen }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  // Scroll-linked parallax: the photo drifts slightly slower than the
  // card as it travels through the viewport (depth).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const parY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])

  // Pointer-driven 3D tilt + moving sheen.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(my, { stiffness: 150, damping: 18 })
  const rotateY = useSpring(mx, { stiffness: 150, damping: 18 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const sheen = useTransform(
    [gx, gy],
    ([x, y]) =>
      `radial-gradient(240px circle at ${x}% ${y}%, rgba(255,255,255,0.16), transparent 60%)`,
  )

  const onMove = (e) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    mx.set((px - 0.5) * 10)
    my.set(-(py - 0.5) * 10)
    gx.set(px * 100)
    gy.set(py * 100)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
    gx.set(50)
    gy.set(50)
  }

  return (
    <motion.article
      ref={ref}
      variants={reduce ? cardVariantsReduced : cardVariants}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => onOpen(p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(p)
        }
      }}
      style={
        reduce
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900 }
      }
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-colors duration-500 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 will-change-transform"
    >
      {/* Photo */}
      <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
        <motion.img
          src={p.images[0]}
          alt={p.title}
          loading="lazy"
          decoding="async"
          style={reduce ? undefined : { y: parY, scale: 1.18 }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Moving sheen on hover */}
        {!reduce && (
          <motion.div
            aria-hidden
            style={{ background: sheen }}
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100"
          />
        )}

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
                  alt={`${p.title} photo ${idx + 2}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
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
  )
}

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
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-display text-sm text-white/85 backdrop-blur hover:border-gold-400/40 hover:text-white"
          >
            View capability deck
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        </div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={setActive} />
          ))}
        </motion.div>
      </div>

      {active && (
        <ProjectModal project={active} onClose={() => setActive(null)} />
      )}
    </section>
  )
}
