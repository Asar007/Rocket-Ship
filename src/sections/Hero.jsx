import { motion } from 'framer-motion'
import { ArrowUpRight, PlayCircle, Compass, Cog, Wrench, Activity } from 'lucide-react'
import { openCallback } from '../components/CallbackDialog.jsx'
import logo from '../assets/logo.png'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.8, ease: [0.2, 0.7, 0.2, 1] },
  }),
}

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 sm:pt-36 lg:pt-40">
      {/* Top hairline + grid wash */}
      <div className="pointer-events-none absolute inset-x-0 top-24 -z-0 mx-auto h-px max-w-7xl hairline-gold" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:pb-28">
        {/* ===== LEFT ===== */}
        <div className="flex flex-col justify-center lg:col-span-7">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={0}
            className="w-fit"
          >
            <img
              src={logo}
              alt="Madras Swastic Engineers"
              className="h-28 w-28 object-contain drop-shadow-[0_0_32px_rgba(240,198,116,0.4)] sm:h-36 sm:w-36"
            />
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={1}
            className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[68px]"
          >
            Engineering{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
                Precision
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 8 C 90 2, 200 2, 298 8"
                  stroke="url(#under)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="under" x1="0" x2="1">
                    <stop offset="0" stopColor="#5aa6ff" stopOpacity="0" />
                    <stop offset="0.5" stopColor="#f0c674" />
                    <stop offset="1" stopColor="#5aa6ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{' '}
            for Modern <br className="hidden sm:block" />
            <span className="text-white/90">Infrastructure.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={2}
            className="mt-7 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
          >
            Madras Swastic Engineers is a turnkey industrial engineering firm delivering structural
            fabrication, plant erection, and precision mechanical solutions for energy, refinery,
            and manufacturing leaders across India.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={3}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a href="#projects" className="btn-primary">
              Explore Projects
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={openCallback}
              className="btn-ghost"
            >
              <PlayCircle className="h-4 w-4 text-gold-400" />
              Contact Us
            </button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={4}
            className="mt-12 grid grid-cols-3 gap-4 sm:max-w-lg"
          >
            {[
              { k: '120+', v: 'Projects' },
              { k: '27 yrs', v: 'On the field' },
              { k: 'ISO 9001', v: 'Certified' },
            ].map((s) => (
              <div key={s.v} className="border-l border-white/10 pl-4">
                <div className="font-display text-xl font-semibold text-white sm:text-2xl">
                  {s.k}
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ===== RIGHT — floating glass visual ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
          className="relative flex items-center justify-center lg:col-span-5"
        >
          <div className="relative w-full max-w-[480px]">
            {/* Floating glass primary */}
            <div
              className="glass-strong relative aspect-[4/5] overflow-hidden rounded-[28px] p-6 ring-1 ring-white/15 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6),0_18px_40px_-10px_rgba(90,166,255,0.22),0_8px_24px_-8px_rgba(240,198,116,0.18),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.55),inset_1px_0_8px_-6px_rgba(255,255,255,0.2),inset_-1px_0_8px_-6px_rgba(0,0,0,0.45)]"
            >
              {/* Inner grid */}
              <div className="absolute inset-0 bg-grid opacity-40" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(90,166,255,0.35),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(240,198,116,0.25),transparent_55%)]" />

              {/* Specular top-left sheen — sells the glass thickness */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.18),transparent_45%)]"
              />
              {/* Bright top-edge hairline */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent"
              />
              {/* Subtle bottom-edge shadow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-black/60 to-transparent"
              />

              {/* Rotating gear stack */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative h-[300px] w-[300px]">
                  {/* Outer ring */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
                  >
                    <svg viewBox="0 0 300 300" className="h-full w-full">
                      <defs>
                        <linearGradient id="ring1" x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0" stopColor="#5aa6ff" stopOpacity="0.5" />
                          <stop offset="1" stopColor="#f0c674" stopOpacity="0.5" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="150"
                        cy="150"
                        r="140"
                        fill="none"
                        stroke="url(#ring1)"
                        strokeWidth="1"
                        strokeDasharray="3 6"
                      />
                      {Array.from({ length: 24 }).map((_, i) => (
                        <line
                          key={i}
                          x1="150"
                          y1="10"
                          x2="150"
                          y2="20"
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="1"
                          transform={`rotate(${i * 15} 150 150)`}
                        />
                      ))}
                    </svg>
                  </motion.div>

                  {/* Middle gear */}
                  <motion.div
                    className="absolute inset-8"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
                  >
                    <svg viewBox="0 0 240 240" className="h-full w-full">
                      <defs>
                        <linearGradient id="gear" x1="0" x2="1">
                          <stop offset="0" stopColor="#5aa6ff" stopOpacity="0.9" />
                          <stop offset="1" stopColor="#2563eb" stopOpacity="0.6" />
                        </linearGradient>
                      </defs>
                      <g fill="none" stroke="url(#gear)" strokeWidth="1.5">
                        <circle cx="120" cy="120" r="80" />
                        <circle cx="120" cy="120" r="92" strokeDasharray="2 4" opacity="0.5" />
                        {Array.from({ length: 12 }).map((_, i) => (
                          <rect
                            key={i}
                            x="116"
                            y="20"
                            width="8"
                            height="14"
                            rx="1.5"
                            fill="url(#gear)"
                            stroke="none"
                            transform={`rotate(${i * 30} 120 120)`}
                          />
                        ))}
                      </g>
                    </svg>
                  </motion.div>

                  {/* Center core */}
                  <div className="absolute inset-[88px] grid place-items-center rounded-full border border-white/15 bg-navy-900/60 backdrop-blur-xl">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
                      className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-navy-950 shadow-glow-gold"
                    >
                      <Cog className="h-7 w-7" strokeWidth={1.8} />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Floating chip — top-left */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-navy-950/60 px-3 py-1.5 backdrop-blur"
              >
                <Activity className="h-3.5 w-3.5 text-electric-400" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/80">
                  TORQUE · 482 Nm
                </span>
              </motion.div>

              {/* Floating chip — bottom-right */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/10 bg-navy-950/60 px-3 py-1.5 backdrop-blur"
              >
                <Compass className="h-3.5 w-3.5 text-gold-400" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/80">
                  TOLERANCE ±0.02
                </span>
              </motion.div>

              {/* Bottom data strip */}
              <div className="absolute inset-x-5 bottom-5 hidden items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur sm:flex">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.25em] text-white/55">
                    SYSTEM
                  </div>
                  <div className="font-display text-sm font-medium text-white">
                    Hydraulic Press · Unit-04
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] tracking-[0.25em] text-white/55">
                    UPTIME
                  </div>
                  <div className="font-display text-sm font-medium text-gold-400">99.4%</div>
                </div>
              </div>
            </div>

            {/* Floating accent card — top-right */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-4 -top-5 hidden w-44 rounded-2xl border border-white/10 bg-navy-950/70 p-3 backdrop-blur-xl sm:block"
            >
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-gold-400" />
                <span className="font-display text-xs font-semibold text-white">
                  Live Build Status
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1">
                {[0.9, 0.6, 0.8, 0.4, 0.95, 0.7, 0.55, 0.85, 0.5].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${20 + h * 30}px` }}
                    className="rounded-sm bg-gradient-to-t from-electric-600/40 to-gold-400/80"
                  />
                ))}
              </div>
            </motion.div>

            {/* Soft glow under card */}
            <div className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full bg-electric-500/30 blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
