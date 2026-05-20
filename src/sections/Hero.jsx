import { Suspense, lazy, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ErrorBoundary from '../components/ErrorBoundary.jsx'
import { isSlowConnection } from '../lib/network.js'
import logo from '../assets/logo.png'

// Lazy so three.js loads in its own async chunk after the Hero text
// paints, instead of blocking the initial bundle.
const SpaceScene = lazy(() => import('../components/SpaceScene.jsx'))

// Static glow used both while the 3D chunk loads and as the graceful
// fallback if WebGL is unavailable / the scene throws.
const SceneGlow = () => (
  <div
    aria-hidden
    className="absolute inset-0 flex items-center justify-center"
  >
    <div className="h-3/5 w-3/5 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(90,166,255,0.18),rgba(240,198,116,0.08)_45%,transparent_72%)] blur-2xl" />
  </div>
)

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.8, ease: [0.2, 0.7, 0.2, 1] },
  }),
}

export default function Hero() {
  // On slow / data-saver connections skip the ~MB three.js scene entirely
  // and show the static glow. Evaluated client-side after mount.
  const [skip3D, setSkip3D] = useState(false)
  useEffect(() => {
    setSkip3D(isSlowConnection())
  }, [])

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
              for Space <br className="hidden sm:block" />
              <span className="text-white/90">&amp; Industry.</span>
            </h1>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={2}
            className="mt-7 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
          >
            Founded in 2009, Madras Swastic Engineers fabricates across the full scale of
            industry, from the smallest precision connection to complete rocket test systems and
            space capsule handling for ISRO. Turnkey engineering for the space, paper, sugar and
            petrochemical sectors across India.
          </motion.p>

          {/* Trust strip */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={4}
            className="mt-12 grid grid-cols-3 gap-4 sm:max-w-lg"
          >
            {[
              { k: '2009', v: 'Established' },
              { k: 'Space-grade', v: 'Engineering' },
              { k: 'Any scale', v: 'Connections to capsules' },
            ].map((s) => (
              <div key={s.v} className="flex flex-col border-l border-white/10 pl-3 sm:pl-4">
                <div className="font-display min-h-[2.6em] text-lg font-semibold leading-tight text-white sm:min-h-0 sm:text-2xl">
                  {s.k}
                </div>
                <div className="mt-1 text-[10px] uppercase leading-snug tracking-[0.16em] text-white/50 sm:text-xs sm:tracking-[0.18em]">
                  {s.v}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ===== RIGHT — Gaganyaan capsule 3D scene (frame-less) =====
            Larger square container + radial mask fades the rectangular
            canvas edges to transparent so the scene reads as a floating
            sphere of content rather than a boxed visual. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay: 0.2 }}
          className="relative flex items-center justify-center lg:col-span-5"
        >
          <div
            aria-hidden
            className="relative aspect-square w-full max-w-[560px]"
            style={{
              maskImage:
                'radial-gradient(ellipse at center, black 58%, transparent 92%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, black 58%, transparent 92%)',
            }}
          >
            {skip3D ? (
              <SceneGlow />
            ) : (
              <ErrorBoundary fallback={<SceneGlow />}>
                <Suspense fallback={<SceneGlow />}>
                  <SpaceScene />
                </Suspense>
              </ErrorBoundary>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
