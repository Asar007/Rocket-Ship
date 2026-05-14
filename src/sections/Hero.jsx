import { motion } from 'framer-motion'
import { ArrowUpRight, PlayCircle, Rocket } from 'lucide-react'
import { openCallback } from '../components/CallbackDialog.jsx'
import logo from '../assets/logo.png'
import SpaceScene from '../components/SpaceScene.jsx'

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
          {/* Brand eyebrow — small text-only line */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={0}
            className="flex w-fit items-center gap-3"
          >
            <span className="h-px w-8 bg-gold-400/60" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold-400 sm:text-[11px]">
              Madras Swastic Engineers
            </span>
          </motion.div>

          {/* Star logo + headline as a single side-by-side block */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={1}
            className="mt-6 flex flex-col items-start gap-6 sm:mt-8 lg:flex-row lg:items-start lg:gap-10"
          >
            <img
              src={logo}
              alt="Madras Swastic Engineers"
              className="h-28 w-28 shrink-0 object-contain drop-shadow-[0_0_28px_rgba(240,198,116,0.4)] sm:h-36 sm:w-36 lg:mt-2 lg:h-40 lg:w-40"
            />
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[56px]">
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
            </h1>
          </motion.div>

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

        {/* ===== RIGHT — Gaganyaan capsule 3D scene ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
          className="relative flex items-center justify-center lg:col-span-5"
        >
          <div className="relative w-full max-w-[480px]">
            {/* Glass frame holding the interactive 3D scene */}
            <div
              className="glass-strong relative aspect-[4/5] overflow-hidden rounded-[28px] ring-1 ring-white/15 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6),0_18px_40px_-10px_rgba(90,166,255,0.22),0_8px_24px_-8px_rgba(240,198,116,0.18),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.55),inset_1px_0_8px_-6px_rgba(255,255,255,0.2),inset_-1px_0_8px_-6px_rgba(0,0,0,0.45)]"
            >
              {/* The R3F canvas fills the entire glass frame */}
              <div className="absolute inset-0">
                <SpaceScene />
              </div>

              {/* Specular top-left sheen — sells the glass thickness.
                  pointer-events-none so it doesn't block 3D scene interaction. */}
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

              {/* Mission label — top-left chip, kept pointer-events-none */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-navy-950/60 px-3 py-1.5 backdrop-blur"
              >
                <Rocket className="h-3.5 w-3.5 text-electric-400" />
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/80">
                  MISSION · GAGANYAAN
                </span>
              </motion.div>
            </div>

            {/* Soft glow under card */}
            <div className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full bg-electric-500/30 blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
