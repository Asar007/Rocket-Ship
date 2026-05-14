import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Anchor,
  ArrowUpRight,
  Boxes,
  Building2,
  Cog,
  Construction,
  FileBox,
  Hammer,
  Layers,
  Settings2,
  ShieldCheck,
  Sparkles,
  Wand2,
  Wrench,
} from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import { openCallback } from '../components/CallbackDialog.jsx'

/* =========================================================
   Anatomy hotspots — six places where real customisation lives
   ========================================================= */

const HOTSPOTS = [
  {
    id: 1,
    title: 'Base & anchorage',
    body: 'Foundations surveyed at your site. Chemical anchors, levelling shims and grout pads specified to soil class and dynamic load profile.',
    icon: Anchor,
    point: { x: 195, y: 374 },
    target: { x: 168, y: 363, w: 56, h: 22 },
  },
  {
    id: 2,
    title: 'Primary members',
    body: 'Section sizes derived from FEA. Hot-rolled, fabricated I-beams or built-up plate girders — picked for load case, fatigue cycle and erection method.',
    icon: Building2,
    point: { x: 300, y: 88 },
    target: { x: 88, y: 88, w: 424, h: 18 },
  },
  {
    id: 3,
    title: 'Welds & joints',
    body: 'Qualified 6G procedures, certified welders. NDT (UT / RT / MT / PT) and dimensional checks per project class. Bolted joints to IS 4000.',
    icon: Hammer,
    point: { x: 105, y: 122 },
    target: { x: 92, y: 100, w: 28, h: 28 },
  },
  {
    id: 4,
    title: 'Surface protection',
    body: 'Blast-clean to SA 2½, primer plus epoxy or PU topcoat. Galvanising, Inconel cladding and intumescent fireproofing available for harsher cycles.',
    icon: Layers,
    point: { x: 480, y: 220 },
    target: { x: 462, y: 108, w: 36, h: 250 },
  },
  {
    id: 5,
    title: 'Lifting & access',
    body: 'Padeyes, ladders, walkways and chequer-plate landings designed in, fitted in the shop. Site never weld-fits an access item.',
    icon: Wrench,
    point: { x: 388, y: 240 },
    target: { x: 374, y: 132, w: 22, h: 232 },
  },
  {
    id: 6,
    title: 'Instrumentation pads',
    body: 'Pre-tapped boss pads, cable trays and conduit routes for downstream IoT, SCADA and process instrumentation — no retrofit cutting at site.',
    icon: Settings2,
    point: { x: 280, y: 224 },
    target: { x: 254, y: 218, w: 60, h: 22 },
  },
]

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

/* =========================================================
   Annotated anatomy diagram — generic structural frame
   ========================================================= */

function AnatomyDiagram({ activeId, onHotspot }) {
  const active = HOTSPOTS.find((h) => h.id === activeId)
  const stroke = '#cfd7e3'

  return (
    <svg viewBox="0 0 600 440" className="h-full w-full">
      <defs>
        <pattern id="anat-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M 24 0 L 0 0 0 24"
            fill="none"
            stroke="rgba(255,255,255,0.045)"
            strokeWidth="0.8"
          />
        </pattern>
        <linearGradient id="anat-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5aa6ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#5aa6ff" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <rect width="600" height="440" fill="url(#anat-grid)" />

      {/* Ground hatch */}
      <line x1="40" y1="385" x2="560" y2="385" stroke="rgba(240,198,116,0.55)" strokeWidth="1.3" />
      {Array.from({ length: 30 }).map((_, i) => (
        <line
          key={i}
          x1={40 + i * 18}
          y1="385"
          x2={32 + i * 18}
          y2="395"
          stroke="rgba(240,198,116,0.45)"
          strokeWidth="1"
        />
      ))}

      {/* Active-target highlight (drawn under structure) */}
      {active && (
        <motion.rect
          key={active.id}
          x={active.target.x}
          y={active.target.y}
          width={active.target.w}
          height={active.target.h}
          fill="rgba(240,198,116,0.16)"
          stroke="#f0c674"
          strokeWidth="2"
          rx="4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        />
      )}

      {/* Surface-protection paint band on rightmost column (#4 target) */}
      <rect x="462" y="108" width="36" height="250" fill="url(#anat-paint)" opacity="0.7" />

      {/* Base plates */}
      <rect x="84" y="365" width="46" height="20" fill="rgba(255,255,255,0.06)" stroke={stroke} strokeWidth="2" />
      <rect x="172" y="365" width="46" height="20" fill="rgba(255,255,255,0.06)" stroke={stroke} strokeWidth="2" />
      <rect x="378" y="365" width="46" height="20" fill="rgba(255,255,255,0.06)" stroke={stroke} strokeWidth="2" />
      <rect x="468" y="365" width="46" height="20" fill="rgba(255,255,255,0.06)" stroke={stroke} strokeWidth="2" />

      {/* Primary top beam */}
      <rect x="88" y="88" width="424" height="18" fill="rgba(255,255,255,0.07)" stroke={stroke} strokeWidth="2.5" />

      {/* Columns */}
      <line x1="107" y1="365" x2="107" y2="106" stroke={stroke} strokeWidth="3.2" />
      <line x1="195" y1="365" x2="195" y2="106" stroke={stroke} strokeWidth="3.2" />
      <line x1="401" y1="365" x2="401" y2="106" stroke={stroke} strokeWidth="3.2" />
      <line x1="491" y1="365" x2="491" y2="106" stroke={stroke} strokeWidth="3.2" />

      {/* X-bracing in side bays */}
      <line x1="107" y1="365" x2="195" y2="106" stroke={stroke} strokeWidth="1.4" opacity="0.5" />
      <line x1="195" y1="365" x2="107" y2="106" stroke={stroke} strokeWidth="1.4" opacity="0.5" />
      <line x1="401" y1="365" x2="491" y2="106" stroke={stroke} strokeWidth="1.4" opacity="0.5" />
      <line x1="491" y1="365" x2="401" y2="106" stroke={stroke} strokeWidth="1.4" opacity="0.5" />

      {/* Mid-span equipment platform */}
      <rect
        x="220"
        y="240"
        width="160"
        height="14"
        fill="rgba(240,198,116,0.06)"
        stroke="#f0c674"
        strokeWidth="1.8"
      />
      <line x1="245" y1="254" x2="245" y2="365" stroke={stroke} strokeWidth="1.5" opacity="0.55" strokeDasharray="3 4" />
      <line x1="355" y1="254" x2="355" y2="365" stroke={stroke} strokeWidth="1.5" opacity="0.55" strokeDasharray="3 4" />

      {/* Instrumentation pad on platform (#6 target lives here) */}
      <rect
        x="254"
        y="218"
        width="60"
        height="22"
        fill="rgba(90,166,255,0.14)"
        stroke="#5aa6ff"
        strokeWidth="1.4"
        rx="2"
      />
      {[265, 278, 291, 304].map((cx) => (
        <circle key={cx} cx={cx} cy="229" r="2" fill="#5aa6ff" />
      ))}

      {/* Weld marks at primary joints */}
      {[
        [107, 106],
        [195, 106],
        [401, 106],
        [491, 106],
        [220, 247],
        [380, 247],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.4" fill="#f0c674" />
      ))}

      {/* Access ladder (between columns 3 and 4-ish) */}
      <line x1="378" y1="132" x2="378" y2="362" stroke={stroke} strokeWidth="1.8" />
      <line x1="392" y1="132" x2="392" y2="362" stroke={stroke} strokeWidth="1.8" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={i}
          x1="378"
          y1={155 + i * 24}
          x2="392"
          y2={155 + i * 24}
          stroke={stroke}
          strokeWidth="1.3"
        />
      ))}

      {/* Padeye on top beam */}
      <path
        d="M 295 88 q 0 -16 10 -16 q 10 0 10 16 z"
        fill="rgba(255,255,255,0.06)"
        stroke={stroke}
        strokeWidth="1.6"
      />
      <circle cx="305" cy="76" r="2.8" fill="#03061a" stroke={stroke} strokeWidth="1.4" />

      {/* Hotspot markers */}
      {HOTSPOTS.map((h) => {
        const isActive = h.id === activeId
        return (
          <g
            key={h.id}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHotspot(h.id)}
            onFocus={() => onHotspot(h.id)}
            onClick={() => onHotspot(h.id)}
            tabIndex={0}
          >
            {isActive && (
              <motion.circle
                cx={h.point.x}
                cy={h.point.y}
                r="18"
                fill="rgba(240,198,116,0.22)"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            <circle
              cx={h.point.x}
              cy={h.point.y}
              r="13"
              fill="#03061a"
              stroke={isActive ? '#f0c674' : 'rgba(240,198,116,0.55)'}
              strokeWidth="1.6"
            />
            <text
              x={h.point.x}
              y={h.point.y + 4}
              textAnchor="middle"
              fontFamily="Montserrat, sans-serif"
              fontWeight="600"
              fontSize="11"
              fill={isActive ? '#f0c674' : 'rgba(240,198,116,0.85)'}
            >
              {h.id}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* =========================================================
   Section
   ========================================================= */

export default function Customization() {
  const [activeHotspot, setActiveHotspot] = useState(1)
  const active = HOTSPOTS.find((h) => h.id === activeHotspot)
  const ActiveIcon = active.icon

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
          subtitle="A refinery stair tower one week, a space-grade structural module the next. Every project starts from a blank page and a senior engineer — there's no catalogue we're picking from. The diagram below shows where customisation actually lives inside a real build."
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

        {/* === Anatomy of a custom build === */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="glass-strong relative mt-10 overflow-hidden rounded-[28px]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Diagram */}
            <div className="border-b border-white/10 p-6 sm:p-8 lg:col-span-7 lg:border-b-0 lg:border-r">
              <div className="mb-3 flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-gold-400" />
                <span className="eyebrow text-white/65">Anatomy of a custom build</span>
              </div>

              <div className="relative aspect-[5/3.5] w-full overflow-hidden rounded-2xl border border-white/10 bg-navy-950/40">
                <AnatomyDiagram activeId={activeHotspot} onHotspot={setActiveHotspot} />
              </div>

              <p className="mt-4 text-[12px] leading-relaxed text-white/45">
                Hover a numbered marker — or pick from the list — to see what's tailored in each part of a real build. The drawing is generic; the customisation is real.
              </p>
            </div>

            {/* Active hotspot detail + picker */}
            <div className="p-6 sm:p-8 lg:col-span-5">
              <div className="text-[11px] tracking-[0.3em] uppercase text-white/45">
                What we tailor
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-gold-400/40 bg-gold-400/10">
                      <ActiveIcon className="h-4 w-4 text-gold-300" />
                    </span>
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.3em] text-gold-400">
                        {String(active.id).padStart(2, '0')} / 06
                      </div>
                      <h4 className="font-display text-xl font-semibold text-white">
                        {active.title}
                      </h4>
                    </div>
                  </div>
                  <p className="mt-5 text-[13.5px] leading-relaxed text-white/72">
                    {active.body}
                  </p>
                </motion.div>
              </AnimatePresence>

              <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {HOTSPOTS.map((h) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(h.id)}
                      onMouseEnter={() => setActiveHotspot(h.id)}
                      onFocus={() => setActiveHotspot(h.id)}
                      className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-[12px] font-medium transition-all duration-200 ${
                        h.id === activeHotspot
                          ? 'border-gold-400/50 bg-gold-400/[0.08] text-white'
                          : 'border-white/10 bg-white/[0.02] text-white/65 hover:border-white/25 hover:text-white/90'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-gold-400">
                        {String(h.id).padStart(2, '0')}
                      </span>
                      <span>{h.title}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={openCallback}
                className="btn-primary liquid-glass liquid-glass-pill mt-7 w-full justify-center"
              >
                Contact us
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* === Process Timeline === */}
        <div className="mt-24">
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
