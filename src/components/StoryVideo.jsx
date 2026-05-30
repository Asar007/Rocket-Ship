import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export default function StoryVideo({
  src = '/our-story.mp4',
  poster = '/our-story-poster.webp',
  eyebrow = 'Our story · on camera',
  title = 'Inside the Madras Swastic shop floor',
  meta = '2:33 · Gaganyaan crew module',
}) {
  const videoRef = useRef(null)
  const [started, setStarted] = useState(false)

  const handlePlay = () => {
    setStarted(true)
    // Defer to next tick so the video element is mounted before play().
    requestAnimationFrame(() => {
      const v = videoRef.current
      if (v) v.play().catch(() => {})
    })
  }

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      className="group relative mt-10 overflow-hidden rounded-3xl border border-white/10 bg-navy-900 shadow-glow-blue sm:mt-14"
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-video">
        {!started && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label="Play our story video"
            className="absolute inset-0 z-10 block h-full w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
          >
            {/* Poster */}
            <img
              src={poster}
              alt="Madras Swastic Engineers team in front of a Gaganyaan crew module"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />

            {/* Cinematic gradient + vignette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(3,6,26,0.55) 0%, rgba(3,6,26,0.05) 35%, rgba(3,6,26,0.15) 60%, rgba(3,6,26,0.92) 100%)',
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 80% at 50% 50%, rgba(3,6,26,0) 50%, rgba(3,6,26,0.55) 100%)',
              }}
            />

            {/* Top-left eyebrow chip */}
            <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-navy-900/60 px-3 py-1.5 backdrop-blur-md sm:left-6 sm:top-6">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400 shadow-[0_0_10px_rgba(240,198,116,0.9)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/85 sm:text-[11px]">
                {eyebrow}
              </span>
            </div>

            {/* Centered play button */}
            <div className="absolute inset-0 grid place-items-center">
              <span className="relative grid h-14 w-14 place-items-center rounded-full bg-gold-400 text-navy-950 shadow-[0_8px_40px_rgba(240,198,116,0.55)] transition-transform duration-500 group-hover:scale-110 sm:h-24 sm:w-24">
                {/* Halo rings */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-gold-300/50"
                />
                <span
                  aria-hidden
                  className="absolute -inset-3 rounded-full border border-gold-400/25 transition-all duration-700 group-hover:-inset-4 group-hover:border-gold-300/40"
                />
                <span
                  aria-hidden
                  className="absolute -inset-6 rounded-full border border-gold-400/10 transition-all duration-700 group-hover:-inset-8"
                />
                <Play
                  className="relative ml-0.5 h-5 w-5 fill-current sm:ml-1 sm:h-8 sm:w-8"
                  strokeWidth={0}
                />
              </span>
            </div>

            {/* Bottom title block */}
            <div className="absolute inset-x-5 bottom-5 z-10 sm:inset-x-8 sm:bottom-8">
              <h3
                className="font-display font-semibold leading-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]"
                style={{ fontSize: 'clamp(1.15rem, 0.9rem + 1.4vw, 2rem)' }}
              >
                {title}
              </h3>
              <div className="mt-2 flex items-center gap-3">
                <span className="h-px w-8 bg-gold-400/70" />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/75 sm:text-[11px]">
                  {meta}
                </span>
              </div>
            </div>
          </button>
        )}

        {started && (
          <video
            ref={videoRef}
            src={src}
            className="absolute inset-0 h-full w-full bg-black object-contain"
            controls
            playsInline
            preload="metadata"
            poster={poster}
          />
        )}
      </div>
    </motion.figure>
  )
}
