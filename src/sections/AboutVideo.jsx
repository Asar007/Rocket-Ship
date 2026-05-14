import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Volume2, VolumeX } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'

export default function AboutVideo() {
  const videoRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(true)

  const handlePlay = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = muted
    v.play().catch(() => {
      // Autoplay blocked — fall back to muted play
      v.muted = true
      setMuted(true)
      v.play().catch(() => {})
    })
    setStarted(true)
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    const next = !muted
    v.muted = next
    setMuted(next)
  }

  return (
    <section id="inside" className="section-pad relative">
      {/* soft background washes */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-10 h-[360px] w-[420px] -translate-x-1/2 rounded-full bg-electric-500/12 blur-3xl" />
        <div className="absolute right-[-10%] bottom-10 h-[300px] w-[300px] rounded-full bg-gold-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Gaganyaan · ISRO"
          title="Engineered to carry India to space."
          accentWord="space"
          subtitle="Madras Swastic Engineers is a fabrication partner on the Gaganyaan programme — India's first crewed spaceflight, taking our astronauts to low Earth orbit."
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="glass-strong relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-white/10"
        >
          {/* Video — full width, natural aspect */}
          <video
            ref={videoRef}
            src="https://duzsdzur0y9ok0qx.public.blob.vercel-storage.com/gaganyaan.mp4"
            preload="metadata"
            playsInline
            crossOrigin="anonymous"
            controls={started}
            className="block h-auto w-full bg-black"
            onEnded={() => setStarted(false)}
          />

          {/* Pre-play overlay — clickable, gold play button, gradient veil */}
          {!started && (
            <button
              type="button"
              onClick={handlePlay}
              aria-label="Play the Madras Swastic Engineers Gaganyaan video"
              className="group absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-navy-950/30 via-navy-950/35 to-navy-950/65 transition-colors hover:from-navy-950/25 hover:via-navy-950/30 hover:to-navy-950/55"
            >
              <span className="grid h-20 w-20 place-items-center rounded-full border border-white/30 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-navy-950 shadow-glow-gold transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24">
                <Play className="h-8 w-8 translate-x-[2px] sm:h-10 sm:w-10" strokeWidth={1.8} fill="currentColor" />
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.32em] text-white/85">
                Watch · Gaganyaan
              </span>
            </button>
          )}

          {/* Mute toggle — only meaningful while playing */}
          {started && (
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute video' : 'Mute video'}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-navy-950/65 text-white/85 backdrop-blur transition-colors hover:bg-navy-950/80 hover:text-white"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          )}
        </motion.div>

        {/* Caption strip below the player */}
        <p className="mx-auto mt-5 max-w-2xl text-center text-[12.5px] leading-relaxed text-white/45">
          Fabricated at our Guindy works for the Gaganyaan crew module programme — proud to play a
          part in taking India's first astronauts to space.
        </p>
      </div>
    </section>
  )
}
