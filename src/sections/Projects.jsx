import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'

const PROJECTS = [
  {
    id: 'p1',
    title: 'Cauvery Refinery — Pipe Rack Erection',
    location: 'Nagapattinam, TN',
    tags: ['Structural', 'On-site'],
    year: '2024',
    bg: 'from-electric-500/40 via-electric-600/20 to-navy-900',
    icon: (
      <svg viewBox="0 0 200 140" className="h-full w-full" fill="none">
        <defs>
          <linearGradient id="p1g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5aa6ff" stopOpacity="0.8" />
            <stop offset="1" stopColor="#f0c674" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* horizontal pipes */}
        {[30, 50, 70, 90].map((y) => (
          <line key={y} x1="10" y1={y} x2="190" y2={y} stroke="url(#p1g)" strokeWidth="3" />
        ))}
        {/* uprights */}
        {[40, 90, 140].map((x) => (
          <line
            key={x}
            x1={x}
            y1="10"
            x2={x}
            y2="120"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="2"
          />
        ))}
        {/* base */}
        <line x1="10" y1="120" x2="190" y2="120" stroke="rgba(240,198,116,0.7)" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'p2',
    title: 'GMR Thermal — Skid Assembly Unit',
    location: 'Tuticorin, TN',
    tags: ['Fabrication', 'Skid'],
    year: '2023',
    bg: 'from-gold-500/30 via-gold-600/20 to-navy-900',
    icon: (
      <svg viewBox="0 0 200 140" className="h-full w-full" fill="none">
        <rect
          x="20"
          y="40"
          width="160"
          height="60"
          rx="4"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeDasharray="2 4"
        />
        <circle cx="60" cy="70" r="14" stroke="#f0c674" strokeWidth="2" />
        <circle cx="60" cy="70" r="6" fill="#f0c674" />
        <circle cx="140" cy="70" r="14" stroke="#5aa6ff" strokeWidth="2" />
        <circle cx="140" cy="70" r="6" fill="#5aa6ff" />
        <line x1="74" y1="70" x2="126" y2="70" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        <line x1="20" y1="110" x2="180" y2="110" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <line x1="40" y1="110" x2="40" y2="120" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <line x1="160" y1="110" x2="160" y2="120" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'p3',
    title: 'CPCL — Heat Exchanger Replacement',
    location: 'Manali, Chennai',
    tags: ['Mechanical', 'Turnkey'],
    year: '2024',
    bg: 'from-electric-400/40 via-gold-400/20 to-navy-900',
    icon: (
      <svg viewBox="0 0 200 140" className="h-full w-full" fill="none">
        <rect
          x="30"
          y="50"
          width="140"
          height="40"
          rx="20"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2"
        />
        <circle cx="50" cy="70" r="6" fill="#f0c674" />
        <circle cx="150" cy="70" r="6" fill="#5aa6ff" />
        {[70, 90, 110, 130].map((x) => (
          <line
            key={x}
            x1={x}
            y1="50"
            x2={x}
            y2="90"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        ))}
        <path
          d="M30 100 C 70 130, 130 130, 170 100"
          stroke="rgba(240,198,116,0.6)"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    id: 'p4',
    title: 'Hyundai Plant — Structural Mezzanine',
    location: 'Sriperumbudur, TN',
    tags: ['Structural', 'Turnkey'],
    year: '2023',
    bg: 'from-electric-500/30 via-electric-400/20 to-navy-900',
    icon: (
      <svg viewBox="0 0 200 140" className="h-full w-full" fill="none">
        <path d="M10 110 L100 30 L190 110 Z" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <path d="M30 110 L100 50 L170 110" stroke="rgba(90,166,255,0.7)" strokeWidth="2" />
        <line x1="60" y1="110" x2="100" y2="70" stroke="rgba(240,198,116,0.6)" strokeWidth="2" />
        <line x1="140" y1="110" x2="100" y2="70" stroke="rgba(240,198,116,0.6)" strokeWidth="2" />
        <line x1="10" y1="125" x2="190" y2="125" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'p5',
    title: 'NTPC — Storage Tank Farm',
    location: 'Vallur, TN',
    tags: ['Tankage', 'Field'],
    year: '2022',
    bg: 'from-gold-400/30 via-electric-500/20 to-navy-900',
    icon: (
      <svg viewBox="0 0 200 140" className="h-full w-full" fill="none">
        {[40, 100, 160].map((cx) => (
          <g key={cx}>
            <ellipse
              cx={cx}
              cy="40"
              rx="22"
              ry="6"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
            />
            <line
              x1={cx - 22}
              y1="40"
              x2={cx - 22}
              y2="110"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
            />
            <line
              x1={cx + 22}
              y1="40"
              x2={cx + 22}
              y2="110"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
            />
            <ellipse
              cx={cx}
              cy="110"
              rx="22"
              ry="6"
              stroke="rgba(240,198,116,0.7)"
              strokeWidth="2"
            />
          </g>
        ))}
        <line x1="0" y1="125" x2="200" y2="125" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'p6',
    title: 'L&T — Cooling Tower Retrofit',
    location: 'Coimbatore, TN',
    tags: ['Mechanical', 'Retrofit'],
    year: '2025',
    bg: 'from-navy-700 via-electric-600/20 to-navy-900',
    icon: (
      <svg viewBox="0 0 200 140" className="h-full w-full" fill="none">
        <path
          d="M50 20 L150 20 L160 120 L40 120 Z"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2"
        />
        <path
          d="M60 40 L140 40"
          stroke="rgba(90,166,255,0.7)"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        <path
          d="M55 60 L145 60"
          stroke="rgba(240,198,116,0.7)"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        <path
          d="M50 80 L150 80"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        <circle cx="100" cy="40" r="4" fill="#5aa6ff" />
      </svg>
    ),
  },
]

export default function Projects() {
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
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/25"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${p.bg} transition-transform duration-700 group-hover:scale-110`}
                />
                <div className="absolute inset-0 bg-grid opacity-40" />
                <div className="absolute inset-0 grid place-items-center p-8 transition-transform duration-700 group-hover:scale-105">
                  <div className="h-full w-full max-h-[160px] max-w-[260px] text-white/85">
                    {p.icon}
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                  <span className="rounded-full border border-white/15 bg-navy-950/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-white/80 backdrop-blur">
                    {p.year}
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-navy-950/70 text-gold-400 backdrop-blur transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-gold-400/60">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* Gradient bottom */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/85 to-transparent" />
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-white/55">
                  <MapPin className="h-3 w-3 text-gold-400" />
                  <span className="font-mono tracking-wider">{p.location}</span>
                </div>
                <h4 className="mt-2 font-display text-lg font-semibold leading-snug text-white">
                  {p.title}
                </h4>
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
    </section>
  )
}
