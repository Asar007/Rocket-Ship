import { motion } from 'framer-motion'

export default function AboutHero() {
  return (
    <section
      id="about-hero"
      // Mobile uses a banner-height hero (~64svh, capped at 540px) instead
      // of full viewport. The shop-floor photo is a wide landscape — at
      // full 100svh in portrait it was being object-cover-cropped so
      // aggressively that the frame looked "zoomed in." A shorter
      // container lets more of the composition show without distortion.
      // Tablet+ restores the full-viewport landscape hero.
      className="relative -mt-24 h-[min(64svh,540px)] w-full overflow-hidden sm:-mt-28 md:h-[100svh]"
    >
      {/*
        Image focal point: on portrait/mobile we shift toward the centre of the
        frame so the structure stays in view when the wide pano is cropped.
        On wider screens we drop slightly so the headline sits over open sky.
      */}
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet="/about-hero.webp"
        />
        <img
          src="/about-hero.webp"
          alt="Madras Swastic Engineers shop floor — crew-module structural frame under fabrication"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '50% 40%' }}
          loading="eager"
          decoding="async"
        />
      </picture>

      {/* Legibility scrim — heavier at the bottom on mobile to keep copy clean. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(3,6,26,0.65) 0%, rgba(3,6,26,0.15) 32%, rgba(3,6,26,0.55) 70%, rgba(3,6,26,0.96) 100%)',
        }}
      />

      {/* Corner mask — hides the Gemini watermark in the bottom-right. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-24 w-36 sm:h-48 sm:w-80"
        style={{
          background:
            'radial-gradient(ellipse at bottom right, rgba(3,6,26,0.98) 0%, rgba(3,6,26,0.85) 40%, rgba(3,6,26,0) 80%)',
        }}
      />

      {/* Copy */}
      <div
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-8 sm:px-6 sm:pb-24 lg:pb-32"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex items-center gap-2.5 sm:gap-3"
        >
          <span className="h-px w-8 bg-gold-400/70 sm:w-10" />
          <span className="font-body text-[10px] uppercase tracking-[0.28em] text-white/75 sm:text-[11px] sm:tracking-[0.32em]">
            About Us
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.08 }}
          className="mt-4 max-w-4xl font-display font-medium leading-[1.04] text-white sm:mt-6"
          style={{
            fontSize: 'clamp(38px, 8vw, 96px)',
            letterSpacing: '-0.01em',
          }}
        >
          <span className="text-gold-400">From</span> Chennai.
          <br />
          <span className="italic">
            <span className="text-gold-400">Beyond</span> Earth.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.16 }}
          className="mt-5 max-w-xl font-body text-[15px] leading-relaxed text-white sm:mt-6 sm:text-lg"
        >
          Sixteen years of turnkey industrial fabrication, from paper, sugar
          and petrochemical plants to structural assemblies for India&rsquo;s
          human spaceflight programme.
        </motion.p>
      </div>
    </section>
  )
}
