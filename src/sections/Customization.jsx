import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Boxes,
  Building2,
  CheckCircle2,
  Cog,
  Construction,
  FileBox,
  Hammer,
  Layers,
  ShieldCheck,
  Wand2,
} from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'

/* =========================================================
   Static configuration data
   ========================================================= */

const STRUCTURE_TYPES = [
  { id: 'gantry', label: 'Gantry frame' },
  { id: 'truss', label: 'Truss bridge' },
  { id: 'conveyor', label: 'Conveyor line' },
  { id: 'rack', label: 'Pipe rack' },
]

const MATERIALS = [
  { id: 'carbon', label: 'Carbon steel', color: '#9aa6b6' },
  { id: 'stainless', label: 'Stainless 316', color: '#d2dae3' },
  { id: 'duplex', label: 'Duplex 2205', color: '#7d8a9c' },
  { id: 'inconel', label: 'Inconel 625', color: '#cda37a' },
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
    body: 'Carbon, stainless, duplex, Inconel — chosen for the corrosive cycle in your plant.',
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
   Derived engineering math (plausible, not load-bearing 🙂)
   ========================================================= */

function useDerivedSpec({ span, height, load }) {
  return useMemo(() => {
    const selfWeight = (span * 0.18 + height * 0.32 + load * 0.08).toFixed(1)
    const deflectLimit = Math.round((span * 1000) / 250) // L/250 in mm
    const deflectActual = Math.round((span * 1000) / 320) // engineered to L/320
    const bucklingMargin = Math.max(
      12,
      Math.round(((25 - height) / 25) * 55 + 32 - (load / 120) * 18),
    )
    const steelVolume = (span * height * 0.045 + load * 0.12).toFixed(2)
    return { selfWeight, deflectLimit, deflectActual, bucklingMargin, steelVolume }
  }, [span, height, load])
}

/* =========================================================
   Parametric structural schematic — pure SVG
   ========================================================= */

function ParametricSchematic({ type, span, height, blueprint, materialColor }) {
  const W = 600
  const H = 360
  const padX = 60
  const padY = 56
  const drawW = W - padX * 2
  const drawH = H - padY * 2

  const spanRatio = (span - 5) / 35
  const heightRatio = (height - 3) / 22

  const structWidth = drawW * (0.32 + spanRatio * 0.62)
  const structHeight = drawH * (0.32 + heightRatio * 0.62)

  const x0 = (W - structWidth) / 2
  const y0 = H - padY - structHeight
  const x1 = x0 + structWidth
  const y1 = H - padY

  const stroke = blueprint ? '#e6edff' : materialColor
  const fillTone = blueprint ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.06)'
  const dim = blueprint ? 'rgba(230,237,255,0.65)' : 'rgba(240,198,116,0.7)'
  const grid = blueprint ? 'rgba(230,237,255,0.09)' : 'rgba(255,255,255,0.04)'

  const renderStructure = () => {
    if (type === 'gantry') {
      return (
        <g>
          <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
          <line x1={x1} y1={y0} x2={x1} y2={y1} stroke={stroke} strokeWidth={3.5} strokeLinecap="round" />
          <rect
            x={x0 - 8}
            y={y0 - 14}
            width={structWidth + 16}
            height={16}
            fill={fillTone}
            stroke={stroke}
            strokeWidth={2.5}
          />
          <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={stroke} strokeWidth={1.4} opacity={0.55} />
          <line x1={x1} y1={y0} x2={x0} y2={y1} stroke={stroke} strokeWidth={1.4} opacity={0.55} />
          <rect x={x0 - 16} y={y1 - 4} width={32} height={5} fill={stroke} />
          <rect x={x1 - 16} y={y1 - 4} width={32} height={5} fill={stroke} />
        </g>
      )
    }

    if (type === 'truss') {
      const N = Math.max(4, Math.round(structWidth / 50))
      const dx = structWidth / N
      const top = y0
      const bottom = y0 + Math.max(28, structHeight * 0.18)
      return (
        <g>
          <line x1={x0} y1={top} x2={x1} y2={top} stroke={stroke} strokeWidth={3.2} />
          <line x1={x0} y1={bottom} x2={x1} y2={bottom} stroke={stroke} strokeWidth={3.2} />
          {Array.from({ length: N }).map((_, i) => {
            const ax = x0 + i * dx
            const bx = x0 + (i + 1) * dx
            const mx = (ax + bx) / 2
            return (
              <g key={i}>
                <line x1={ax} y1={top} x2={mx} y2={bottom} stroke={stroke} strokeWidth={1.5} />
                <line x1={mx} y1={bottom} x2={bx} y2={top} stroke={stroke} strokeWidth={1.5} />
                {i < N - 1 && (
                  <line x1={bx} y1={top} x2={bx} y2={bottom} stroke={stroke} strokeWidth={1.2} opacity={0.6} />
                )}
              </g>
            )
          })}
          <line x1={x0} y1={bottom} x2={x0} y2={y1} stroke={stroke} strokeWidth={2} strokeDasharray="3 5" opacity={0.45} />
          <line x1={x1} y1={bottom} x2={x1} y2={y1} stroke={stroke} strokeWidth={2} strokeDasharray="3 5" opacity={0.45} />
          <polygon points={`${x0},${y1} ${x0 - 12},${y1 + 12} ${x0 + 12},${y1 + 12}`} fill={stroke} />
          <polygon points={`${x1},${y1} ${x1 - 12},${y1 + 12} ${x1 + 12},${y1 + 12}`} fill={stroke} />
        </g>
      )
    }

    if (type === 'conveyor') {
      const beamY = y0 + structHeight * 0.35
      const beamH = 16
      return (
        <g>
          <rect x={x0} y={beamY} width={structWidth} height={beamH} fill={fillTone} stroke={stroke} strokeWidth={2.4} />
          <line
            x1={x0}
            y1={beamY - 4}
            x2={x1}
            y2={beamY - 4}
            stroke={stroke}
            strokeWidth={1.5}
            opacity={0.6}
            strokeDasharray="6 6"
          />
          <circle cx={x0} cy={beamY + beamH / 2} r={16} fill={fillTone} stroke={stroke} strokeWidth={2.2} />
          <circle cx={x1} cy={beamY + beamH / 2} r={16} fill={fillTone} stroke={stroke} strokeWidth={2.2} />
          <circle cx={x0} cy={beamY + beamH / 2} r={4} fill={stroke} />
          <circle cx={x1} cy={beamY + beamH / 2} r={4} fill={stroke} />
          {Array.from({ length: 4 }).map((_, i) => {
            const lx = x0 + ((i + 1) * structWidth) / 5
            return (
              <g key={i}>
                <line x1={lx} y1={beamY + beamH} x2={lx - 14} y2={y1} stroke={stroke} strokeWidth={1.8} />
                <line x1={lx} y1={beamY + beamH} x2={lx + 14} y2={y1} stroke={stroke} strokeWidth={1.8} />
                <line x1={lx - 14} y1={y1} x2={lx + 14} y2={y1} stroke={stroke} strokeWidth={1.4} opacity={0.5} />
              </g>
            )
          })}
        </g>
      )
    }

    if (type === 'rack') {
      const tiers = Math.max(2, Math.min(5, Math.round(structHeight / 50)))
      return (
        <g>
          <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={stroke} strokeWidth={3.4} />
          <line x1={x1} y1={y0} x2={x1} y2={y1} stroke={stroke} strokeWidth={3.4} />
          {Array.from({ length: tiers }).map((_, i) => {
            const ty = y0 + ((i + 1) * structHeight) / (tiers + 1)
            return (
              <g key={i}>
                <line x1={x0} y1={ty} x2={x1} y2={ty} stroke={stroke} strokeWidth={2.4} />
                {Array.from({ length: Math.max(3, Math.floor(structWidth / 38)) }).map((_, j, arr) => {
                  const cx = x0 + 24 + j * ((structWidth - 48) / Math.max(1, arr.length - 1))
                  return (
                    <circle
                      key={j}
                      cx={cx}
                      cy={ty - 9}
                      r={6}
                      fill={fillTone}
                      stroke={stroke}
                      strokeWidth={1.4}
                      opacity={0.85}
                    />
                  )
                })}
              </g>
            )
          })}
          <rect x={x0 - 16} y={y1 - 4} width={32} height={5} fill={stroke} />
          <rect x={x1 - 16} y={y1 - 4} width={32} height={5} fill={stroke} />
        </g>
      )
    }

    return null
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
      <defs>
        <pattern id="custom-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke={grid} strokeWidth="0.8" />
        </pattern>
      </defs>

      {blueprint && <rect width={W} height={H} fill="#0c244a" />}
      <rect width={W} height={H} fill="url(#custom-grid)" />

      {/* Ground line + hatching */}
      <line x1={padX - 16} y1={y1 + 1} x2={W - padX + 16} y2={y1 + 1} stroke={stroke} strokeWidth={1.4} />
      {Array.from({ length: 32 }).map((_, i) => (
        <line
          key={i}
          x1={padX - 14 + i * 18}
          y1={y1 + 1}
          x2={padX - 14 + i * 18 - 8}
          y2={y1 + 11}
          stroke={stroke}
          strokeWidth={1}
          opacity={0.45}
        />
      ))}

      <motion.g
        key={type}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
      >
        {renderStructure()}
      </motion.g>

      {/* Horizontal span dimension line (above structure) */}
      <g>
        <line x1={x0} y1={y0 - 36} x2={x1} y2={y0 - 36} stroke={dim} strokeWidth={1} />
        <line x1={x0} y1={y0 - 30} x2={x0} y2={y0 - 42} stroke={dim} strokeWidth={1} />
        <line x1={x1} y1={y0 - 30} x2={x1} y2={y0 - 42} stroke={dim} strokeWidth={1} />
        <text
          x={(x0 + x1) / 2}
          y={y0 - 46}
          textAnchor="middle"
          fill={dim}
          fontSize="12"
          fontFamily="Montserrat, sans-serif"
          letterSpacing="0.22em"
        >
          SPAN · {span.toFixed(1)} m
        </text>
      </g>

      {/* Vertical height dimension line (right of structure) */}
      <g>
        <line x1={x1 + 36} y1={y0} x2={x1 + 36} y2={y1} stroke={dim} strokeWidth={1} />
        <line x1={x1 + 30} y1={y0} x2={x1 + 42} y2={y0} stroke={dim} strokeWidth={1} />
        <line x1={x1 + 30} y1={y1} x2={x1 + 42} y2={y1} stroke={dim} strokeWidth={1} />
        <text
          x={x1 + 48}
          y={(y0 + y1) / 2 + 4}
          fill={dim}
          fontSize="12"
          fontFamily="Montserrat, sans-serif"
          letterSpacing="0.22em"
        >
          {height.toFixed(1)} m
        </text>
      </g>
    </svg>
  )
}

/* =========================================================
   Small UI helpers
   ========================================================= */

function Slider({ label, value, min, max, step, unit, onChange }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[12.5px] tracking-wide text-white/65">{label}</span>
        <span className="font-mono text-[13px] font-medium tabular-nums text-white">
          {Number.isInteger(step) ? value.toFixed(0) : value.toFixed(1)}{' '}
          <span className="text-white/45">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider-custom mt-2 w-full"
      />
    </div>
  )
}

function ReadoutPair({ label, value }) {
  return (
    <div>
      <div className="font-mono text-[9px] tracking-[0.22em] text-white/45">{label}</div>
      <div className="font-display text-sm font-semibold text-white">{value}</div>
    </div>
  )
}

/* =========================================================
   Section
   ========================================================= */

export default function Customization() {
  const [type, setType] = useState('gantry')
  const [material, setMaterial] = useState(MATERIALS[0])
  const [span, setSpan] = useState(18)
  const [height, setHeight] = useState(8)
  const [load, setLoad] = useState(30)
  const [blueprint, setBlueprint] = useState(false)

  const spec = useDerivedSpec({ span, height, load })

  const checks = [
    {
      label: 'Deflection',
      detail: `${spec.deflectActual} mm vs L/250 limit (${spec.deflectLimit} mm)`,
      status: spec.deflectActual < spec.deflectLimit ? 'pass' : 'warn',
    },
    {
      label: 'Buckling reserve',
      detail: `${spec.bucklingMargin}% margin over Euler critical`,
      status: spec.bucklingMargin > 28 ? 'pass' : 'warn',
    },
    {
      label: 'Self-weight',
      detail: `${spec.selfWeight} t fabricated · ${spec.steelVolume} m³ steel`,
      status: 'pass',
    },
  ]

  return (
    <section id="customization" className="section-pad relative overflow-hidden">
      {/* Background wash */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute right-[-10%] top-[8%] h-[420px] w-[420px] rounded-full bg-electric-500/12 blur-3xl" />
        <div className="absolute left-[-10%] bottom-[20%] h-[420px] w-[420px] rounded-full bg-gold-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Customization"
          title="Engineered to your exact spec, not catalogue cuts."
          accentWord="exact spec"
          subtitle="Every structure we ship is dimensioned, alloyed and certified to the brief — built in our Chennai works, then erected on your site. Set the dials below to see how the design responds in real time."
        />

        {/* ===== Build Studio ===== */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="glass-strong relative mt-14 overflow-hidden rounded-[28px]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* LEFT — Configurator */}
            <div className="border-b border-white/10 p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-gold-400" />
                <span className="eyebrow text-white/65">Build studio</span>
              </div>

              {/* Structure type */}
              <div className="mt-6">
                <div className="text-[12.5px] tracking-wide text-white/65">Structure type</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STRUCTURE_TYPES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setType(s.id)}
                      className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-all duration-300 ${
                        type === s.id
                          ? 'border-gold-400/60 bg-gold-400/10 text-gold-200 shadow-[0_0_24px_-6px_rgba(240,198,116,0.45)]'
                          : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="mt-7 space-y-5">
                <Slider label="Span" value={span} min={5} max={40} step={0.5} unit="m" onChange={setSpan} />
                <Slider
                  label="Height / depth"
                  value={height}
                  min={3}
                  max={25}
                  step={0.5}
                  unit="m"
                  onChange={setHeight}
                />
                <Slider
                  label="Load capacity"
                  value={load}
                  min={1}
                  max={120}
                  step={1}
                  unit="t"
                  onChange={setLoad}
                />
              </div>

              {/* Material */}
              <div className="mt-7">
                <div className="text-[12.5px] tracking-wide text-white/65">Material grade</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {MATERIALS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMaterial(m)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all duration-300 ${
                        material.id === m.id
                          ? 'border-white/30 bg-white/[0.07] text-white'
                          : 'border-white/10 bg-white/[0.02] text-white/65 hover:text-white/90'
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-white/20"
                        style={{ background: m.color }}
                      />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Engineering checks */}
              <div className="mt-7 rounded-2xl border border-white/10 bg-navy-950/45 p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-electric-400" />
                  <span className="eyebrow text-white/65">Live engineering checks</span>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {checks.map((c) => (
                    <li key={c.label} className="flex items-start gap-2.5 text-[12.5px]">
                      {c.status === 'pass' ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/90" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/90" />
                      )}
                      <div>
                        <div className="font-medium text-white/90">{c.label}</div>
                        <div className="text-white/55">{c.detail}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <a
                href="#contact"
                className="btn-primary liquid-glass liquid-glass-pill mt-7 w-full justify-center"
              >
                Request detailed quote
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            {/* RIGHT — Schematic */}
            <div className="relative p-6 sm:p-8 lg:col-span-7">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-gold-400" />
                  <span className="eyebrow text-white/65">Live schematic</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBlueprint((v) => !v)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-all ${
                    blueprint
                      ? 'border-electric-400/60 bg-electric-500/15 text-electric-300'
                      : 'border-white/10 bg-white/[0.03] text-white/65 hover:text-white'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      blueprint ? 'bg-electric-400' : 'bg-white/40'
                    }`}
                  />
                  Blueprint view
                </button>
              </div>

              <div
                className={`relative aspect-[5/3] w-full overflow-hidden rounded-2xl border transition-colors duration-500 ${
                  blueprint
                    ? 'border-electric-400/30 bg-[#0c244a]'
                    : 'border-white/10 bg-navy-950/45'
                }`}
              >
                <ParametricSchematic
                  type={type}
                  span={span}
                  height={height}
                  blueprint={blueprint}
                  materialColor={material.color}
                />

                {/* Corner chips */}
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-navy-950/65 px-3 py-1 backdrop-blur">
                  <span className="relative grid h-2 w-2 place-items-center">
                    <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400/70" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.22em] text-white/80">
                    LIVE PREVIEW
                  </span>
                </div>

                <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-navy-950/65 px-3 py-1 backdrop-blur">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-white/80">
                    {material.label.toUpperCase()}
                  </span>
                </div>

                {/* Bottom readout strip */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-navy-950/65 px-4 py-2.5 backdrop-blur-md">
                  <ReadoutPair label="SPAN" value={`${span.toFixed(1)} m`} />
                  <ReadoutPair label="HEIGHT" value={`${height.toFixed(1)} m`} />
                  <ReadoutPair label="LOAD" value={`${load} t`} />
                  <ReadoutPair label="WEIGHT" value={`${spec.selfWeight} t`} />
                </div>
              </div>

              <p className="mt-4 text-[12px] leading-relaxed text-white/45">
                Schematic is a generative reference — final drawings are issued from a full FEA
                package signed by a chartered engineer.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ===== Process Timeline ===== */}
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

        {/* ===== Capabilities mosaic ===== */}
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
                <h4 className="mt-4 font-display text-base font-semibold text-white">{cap.title}</h4>
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
