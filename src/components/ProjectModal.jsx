import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { X, MapPin, ChevronDown } from 'lucide-react'

/* ── Shared header ─────────────────────────────────────────────── */
function StoryHeader({ project }) {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-20 sm:px-8 sm:pt-24">
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
    </div>
  )
}

/* ── 1. Static (fallback / reduced-motion) ────────────────────── */
function StaticStory({ project, story }) {
  return (
    <>
      <StoryHeader project={project} />
      <div className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10">
          <img
            src={project.images[0]}
            alt={project.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
        <div className="mt-10 max-w-3xl space-y-5">
          {story.map((p, i) => (
            <p
              key={i}
              className="text-[15px] leading-relaxed text-white/70 sm:text-base"
            >
              {p}
            </p>
          ))}
        </div>
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
      </div>
    </>
  )
}

/* ── 2. Sticky visual + revealing text ────────────────────────── */
function StickyStory({ project, story, scrollRef }) {
  return (
    <>
      <StoryHeader project={project} />
      <div className="mx-auto max-w-6xl px-5 pb-[15vh] sm:px-8">
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="lg:sticky lg:top-24 lg:h-fit lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <img
                src={project.images[0]}
                alt={project.title}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
          <div>
            {story.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ root: scrollRef, amount: 0.55 }}
                transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                className="flex min-h-[68vh] flex-col justify-center"
              >
                <span className="font-mono text-sm tracking-[0.3em] text-gold-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-4 text-xl leading-relaxed text-white/80 sm:text-2xl">
                  {p}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── 3. Full-screen cinematic steps ───────────────────────────── */
function CinematicSlide({ image, text, index, scrollRef }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    container: scrollRef,
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1.0])
  const textY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.28, 0.72, 1],
    [0, 1, 1, 0],
  )
  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden"
    >
      <motion.img
        src={image}
        alt=""
        style={{ scale }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/35 to-navy-950/75" />
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="absolute inset-0 flex items-end p-8 sm:p-16"
      >
        <div className="max-w-2xl">
          <span className="font-mono text-sm tracking-[0.3em] text-gold-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="mt-3 font-display text-2xl font-semibold leading-snug text-white sm:text-4xl">
            {text}
          </p>
        </div>
      </motion.div>
    </section>
  )
}

function CinematicStory({ project, story, scrollRef }) {
  return (
    <>
      {/* Title slide */}
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <img
          src={project.images[0]}
          alt={project.title}
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/65" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative px-6 text-center"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold-400">
            {project.location} · {project.year}
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight text-white sm:text-6xl">
            {project.storyTitle || project.title}
          </h2>
          <div className="mt-10 flex flex-col items-center gap-2 text-white/50">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
              Scroll
            </span>
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.span>
          </div>
        </motion.div>
      </section>

      {story.map((text, i) => (
        <CinematicSlide
          key={i}
          image={project.images[i % project.images.length]}
          text={text}
          index={i}
          scrollRef={scrollRef}
        />
      ))}
    </>
  )
}

/* ── 4. Ken Burns zoom — sticky underlay + per-screen captions ── */
function KenBurnsStory({ project, story, scrollRef }) {
  const wrapRef = useRef(null)
  const { scrollYProgress } = useScroll({
    container: scrollRef,
    target: wrapRef,
    offset: ['start start', 'end end'],
  })
  // Gentle zoom/pan only — no longer over-zoomed.
  const scale = useTransform(scrollYProgress, [0, 1], [1.0, 1.16])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-4%'])

  return (
    <div ref={wrapRef} className="relative">
      {/* Sticky image underlay (pulled up so caption screens overlay it) */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ marginBottom: '-100vh' }}
      >
        <motion.img
          src={project.images[0]}
          alt={project.title}
          style={{ scale, y }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/60" />
      </div>

      {/* One full screen per caption — guarantees the scroll advances */}
      {story.map((c, i) => (
        <section
          key={i}
          className="relative z-10 flex h-screen items-center justify-center px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: scrollRef, amount: 0.6 }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
            className="max-w-2xl"
          >
            <span className="font-mono text-sm tracking-[0.3em] text-gold-400">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="mt-4 font-display text-2xl font-semibold leading-snug text-white sm:text-4xl">
              {c}
            </p>
          </motion.div>
        </section>
      ))}
    </div>
  )
}

/* ── Modal shell ──────────────────────────────────────────────── */
export default function ProjectModal({ project, onClose }) {
  const reduce = useReducedMotion()
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  if (typeof document === 'undefined') return null

  const story =
    project.story && project.story.length ? project.story : [project.blurb]
  const style = reduce ? 'static' : project.storyStyle || 'static'

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="proj-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[120] bg-navy-950"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        {/* Scroll progress bar */}
        {style !== 'static' && (
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="fixed inset-x-0 top-0 z-[140] h-[3px] origin-left bg-gradient-to-r from-gold-400 to-gold-600"
          />
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="fixed right-4 top-4 z-[140] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-navy-950/70 text-white/80 backdrop-blur transition-colors hover:bg-white/[0.12] hover:text-white sm:right-6 sm:top-6"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          ref={scrollRef}
          className="h-full w-full overflow-y-auto overflow-x-hidden"
        >
          {style === 'sticky' && (
            <StickyStory
              project={project}
              story={story}
              scrollRef={scrollRef}
            />
          )}
          {style === 'cinematic' && (
            <CinematicStory
              project={project}
              story={story}
              scrollRef={scrollRef}
            />
          )}
          {style === 'kenburns' && (
            <KenBurnsStory
              project={project}
              story={story}
              scrollRef={scrollRef}
            />
          )}
          {style === 'static' && (
            <StaticStory project={project} story={story} />
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
