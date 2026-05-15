import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin } from 'lucide-react'

/**
 * Full-screen project story view. Opens when a Projects card is clicked.
 * Esc / close button / backdrop dismiss; body scroll locked while open.
 */
export default function ProjectModal({ project, onClose }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => panelRef.current?.focus(), 60)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      clearTimeout(t)
    }
  }, [onClose])

  if (typeof document === 'undefined') return null

  const story =
    project.story && project.story.length ? project.story : [project.blurb]

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="proj-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[120] overflow-y-auto bg-navy-950/95 backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={onClose}
      >
        <motion.div
          key="proj-panel"
          ref={panelRef}
          tabIndex={-1}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          className="mx-auto min-h-screen max-w-5xl px-4 py-20 outline-none sm:px-6 sm:py-24"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="fixed right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-navy-950/70 text-white/80 backdrop-blur transition-colors hover:bg-white/[0.1] hover:text-white sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold-400">
              Selected work
            </span>
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-white/70">
              {project.year}
            </span>
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
            {project.storyTitle || project.title}
          </h2>
          <div className="mt-3 flex items-center gap-2 text-sm text-white/55">
            <MapPin className="h-4 w-4 text-gold-400" />
            <span className="font-mono tracking-wider">{project.location}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] tracking-[0.15em] text-white/65"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Hero image */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10">
            <img
              src={project.images[0]}
              alt={project.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>

          {/* Story */}
          <div className="mt-10 max-w-3xl space-y-5">
            {story.map((para, i) => (
              <p
                key={i}
                className="text-[15px] leading-relaxed text-white/70 sm:text-base"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Gallery */}
          {project.images.length > 1 && (
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.images.slice(1).map((src, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-white/10"
                >
                  <img
                    src={src}
                    alt={`${project.title} — ${i + 2}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
