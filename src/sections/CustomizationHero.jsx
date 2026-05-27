import { motion } from 'framer-motion'
import { Ruler } from 'lucide-react'

const SPECS = [
  { k: 'Tolerance', v: '±0.05 mm' },
  { k: 'Load', v: '250 t SWL' },
  { k: 'Cert', v: 'ISO 9001' },
  { k: 'Lead time', v: '4 to 12 wks' },
]

export default function CustomizationHero() {
  return (
    <section
      id="customization-hero"
      className="relative -mt-24 min-h-[640px] w-full overflow-hidden pb-20 sm:-mt-28 sm:pb-24 md:min-h-[760px] md:pb-32"
    >
      {/* Deep gradient ground */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 10%, rgba(8,12,40,1) 0%, rgba(3,6,26,1) 55%, rgba(2,4,18,1) 100%)',
        }}
      />

      {/* Blueprint grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(120,170,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,255,0.35) 1px, transparent 1px)',
          backgroundSize: '64px 64px, 64px 64px',
          maskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(120,170,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,255,0.6) 1px, transparent 1px)',
          backgroundSize: '8px 8px, 8px 8px',
          maskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 70%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 70%)',
        }}
      />

      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10%] h-[520px] w-[520px] rounded-full bg-electric-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-[-10%] h-[520px] w-[520px] rounded-full bg-gold-500/10 blur-3xl"
      />

      {/* Bottom fade into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            'linear-gradient(180deg, rgba(3,6,26,0) 0%, rgba(3,6,26,0.85) 70%, rgba(3,6,26,1) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 mx-auto flex max-w-7xl flex-col px-5 pt-36 sm:px-6 sm:pt-44 md:pt-48"
      >
        {/* Content block — centred in the page; the dimension frame
            auto-fits this wrapper, so its corners stay symmetric. */}
        <div className="relative mx-auto w-full max-w-4xl text-center">
          {/* CAD dimension frame — automatically hugs the content block.
              Uses CSS borders + absolutely-positioned ticks/labels so it
              tracks layout changes (viewport height, font size, wrapping)
              without needing manual SVG coordinates. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-3 -inset-y-5 sm:-inset-x-5 sm:-inset-y-7 md:-inset-x-12 md:-inset-y-10"
          >
            {/* Dimension frame — straight lines, symmetric corner gaps,
                identical outward ticks at every endpoint. */}
            <svg
              className="absolute inset-0 h-full w-full overflow-visible text-electric-300/55"
              viewBox="-16 -16 1032 632"
              preserveAspectRatio="none"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="square"
                strokeLinejoin="miter"
                vectorEffect="non-scaling-stroke"
              >
                {/* Top horizontal (y=0): 24-unit gap at each corner */}
                <line x1="24" y1="0" x2="976" y2="0" />
                {/* Left vertical (x=0): 24-unit gap at each corner */}
                <line x1="0" y1="24" x2="0" y2="576" />
                {/* Right vertical (x=1000): 24-unit gap at each corner */}
                <line x1="1000" y1="24" x2="1000" y2="576" />

                {/* Outward ticks — 12-unit length, identical at all endpoints */}
                {/* Top-left + top-right */}
                <line x1="24" y1="0" x2="24" y2="-12" />
                <line x1="976" y1="0" x2="976" y2="-12" />
                {/* Left-top + left-bottom */}
                <line x1="0" y1="24" x2="-12" y2="24" />
                <line x1="0" y1="576" x2="-12" y2="576" />
                {/* Right-top + right-bottom */}
                <line x1="1000" y1="24" x2="1012" y2="24" />
                <line x1="1000" y1="576" x2="1012" y2="576" />
              </g>
            </svg>

          </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex items-center justify-center gap-2.5 sm:gap-3"
        >
          <span className="h-px w-8 bg-gold-400/70 sm:w-10" />
          <span className="font-body text-[10px] uppercase tracking-[0.28em] text-white/75 sm:text-[11px] sm:tracking-[0.32em]">
            Customization
          </span>
          <Ruler className="h-3.5 w-3.5 text-gold-400/80" aria-hidden />
          <span className="h-px w-8 bg-gold-400/70 sm:w-10" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.08 }}
          className="mx-auto mt-4 max-w-4xl font-display font-medium leading-[1.04] text-white sm:mt-6"
          style={{
            fontSize: 'clamp(36px, 6.4vw, 78px)',
            letterSpacing: '-0.01em',
          }}
        >
          <span className="text-gold-400">Built</span> to your{' '}
          <span className="italic">
            <span className="text-gold-400">drawing</span>.
          </span>
          <br />
          Down to the last millimetre.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.16 }}
          className="mx-auto mt-5 max-w-xl font-body text-[15px] leading-relaxed text-white/85 sm:mt-6 sm:text-lg"
        >
          Bespoke fabrication and engineering, from a refinery stair tower to
          flight-class structural hardware. Every brief begins with a blank page
          and a chartered engineer.
        </motion.p>

        {/* Spec ticker */}
        <motion.dl
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.24 }}
          className="mx-auto mt-7 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-3 border-t border-white/10 pt-5 text-center sm:mt-8 sm:grid-cols-4 sm:gap-x-8"
        >
          {SPECS.map((s) => (
            <div key={s.k}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                {s.k}
              </dt>
              <dd className="mt-1 font-display text-base font-semibold text-white sm:text-lg">
                {s.v}
              </dd>
            </div>
          ))}
        </motion.dl>
        </div>
      </div>
    </section>
  )
}
